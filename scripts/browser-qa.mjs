import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || 'playwright'
);
const evidence = new URL('../test-results/browser/', import.meta.url);
await mkdir(evidence, { recursive: true });
const launchOptions = {
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {}),
};
let child,
  browser,
  logs = '',
  completed = false;
const results = [];
async function isolatedContext(options) {
  const context = await browser.newContext(options);
  const allowed = new Set([origin, 'http://127.0.0.1:14380']);
  await context.route('**/*', (route) => {
    const target = new URL(route.request().url());
    return allowed.has(target.origin) ||
      ['data:', 'blob:'].includes(target.protocol)
      ? route.continue()
      : route.abort('blockedbyclient');
  });
  return context;
}

async function ready(url) {
  for (let i = 0; i < 120; i++) {
    if (child.exitCode !== null) throw new Error('Frontend exited: ' + logs);
    try {
      const r = await fetch(url);
      if (r.status < 500) return;
    } catch {}
    await delay(250);
  }
  throw new Error('Frontend did not start: ' + logs);
}
async function verifyPage(page, label, { overflow = true } = {}) {
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page
      .locator('body')
      .innerText()
      .then((t) => t.trim().length > 0),
    true,
    label + ' has content',
  );
  if (overflow)
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      label + ' has no horizontal overflow',
    );
  await page.screenshot({
    path: new URL(label + '.png', evidence).pathname,
    fullPage: true,
    animations: 'disabled',
  });
}
import {
  api,
  state,
  mutations,
  failures,
} from '../tests/browser/fixture-api.mjs';
const origin = 'http://127.0.0.1:14382';
try {
  await new Promise((resolve, reject) => {
    api.once('error', reject);
    api.listen(14380, '127.0.0.1', resolve);
  });
  child = spawn(
    process.execPath,
    [
      'node_modules/next/dist/bin/next',
      'start',
      '--port',
      '14382',
      '--hostname',
      '127.0.0.1',
    ],
    {
      env: { ...process.env, API_INTERNAL_URL: 'http://127.0.0.1:14380' },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  child.stdout.on('data', (d) => (logs += d));
  child.stderr.on('data', (d) => (logs += d));
  await ready(origin + '/login');
  browser = await chromium.launch(launchOptions);
  const routes = [
    '/',
    '/login',
    '/restaurants',
    '/restaurants/new',
    '/restaurants/restaurant-1',
    '/packages',
    '/packages/new',
    '/packages/package-1',
    '/requests',
    '/leads',
    '/demos',
    '/team',
    '/settings',
    '/activity',
    '/contracts/subscription-1?lang=en',
  ];
  const cases = routes.map((route) => ({ route, locale: 'en', width: 1440 }));
  for (const route of [
    '/',
    '/login',
    '/restaurants/restaurant-1',
    '/packages/new',
    '/requests',
    '/contracts/subscription-1?lang=ar',
  ])
    cases.push({ route, locale: 'ar', width: 390 });
  for (const [i, s] of cases.entries()) {
    state.mode = s.route === '/login' ? 'unauthenticated' : 'ok';
    const context = await isolatedContext({
      viewport: { width: s.width, height: 900 },
      reducedMotion: 'reduce',
      colorScheme: s.locale === 'ar' ? 'dark' : 'light',
    });
    await context.addCookies([
      { name: 'platform_ui_locale', value: s.locale, url: origin },
    ]);
    const page = await context.newPage(),
      errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(origin + s.route, { waitUntil: 'networkidle' });
    await verifyPage(page, 'route-' + i, {
      overflow: !s.route.startsWith('/contracts/'),
    });
    assert.equal(
      await page.locator('html').getAttribute('dir'),
      s.locale === 'ar' ? 'rtl' : 'ltr',
    );
    assert.deepEqual(errors, []);
    results.push({ scenario: s.route, locale: s.locale, status: 'PASS' });
    await context.close();
  }
  state.mode = 'ok';
  const context = await isolatedContext({
      viewport: { width: 1440, height: 1000 },
    }),
    page = await context.newPage();
  await context.addCookies([
    { name: 'platform_ui_locale', value: 'en', url: origin },
  ]);
  await page.goto(origin + '/packages/new', { waitUntil: 'networkidle' });
  await page.locator('button[type="submit"]').click();
  await page.waitForFunction(
    () => document.activeElement?.id === 'package-name-ar',
  );
  assert.equal(state.saves, 0);
  await page.locator('#package-name-ar').fill('باقة جديدة');
  await page.locator('#package-name-en').fill('New package');
  await page.locator('#package-egpMonthly').fill('1,234.50');
  state.failSave = true;
  await page.locator('button[type="submit"]').evaluate((button) => {
    button.click();
    button.click();
  });
  await page.locator('[role="alert"]').waitFor();
  assert.equal(state.saves, 1);
  assert.equal(
    await page.locator('#package-name-en').inputValue(),
    'New package',
  );
  assert.equal(
    await page.locator('#package-egpMonthly').inputValue(),
    '1,234.50',
  );
  state.failSave = false;
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(origin + '/packages');
  assert.equal(state.saves, 2);
  const saved = mutations.filter(
    (m) => m.path === '/packages' && m.method === 'POST',
  );
  assert.deepEqual(saved[0].body, saved[1].body);
  assert.equal(saved[1].body.prices.egpMonthly, '1234.50');
  results.push({
    scenario:
      'invalid field focus, duplicate prevention, failed-save preservation, retry and exact money payload',
    status: 'PASS',
  });
  await page.goto(origin + '/contracts/subscription-1?lang=en', {
    waitUntil: 'networkidle',
  });
  await page.locator('label input').first().fill('Edited agreement title');
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  await page.getByText('Draft saved.', { exact: true }).waitFor();
  results.push({ scenario: 'contract draft editing and save', status: 'PASS' });
  await context.close();
  for (const mode of ['unauthenticated', 'unreachable']) {
    state.mode = mode;
    const response = await fetch(origin + '/');
    const text = await response.text();
    if (mode === 'unauthenticated')
      assert.equal(new URL(response.url).pathname, '/login');
    else {
      assert.equal(new URL(response.url).pathname, '/');
      assert.match(text, /API|unreachable/);
    }
    results.push({ scenario: 'session ' + mode, status: 'PASS' });
  }
  assert.deepEqual(failures, []);
  completed = true;
} finally {
  await browser?.close();
  child?.kill('SIGTERM');
  api.closeAllConnections();
  await new Promise((resolve) => api.close(resolve));
  await writeFile(new URL('server.log', evidence), logs);
  await writeFile(
    new URL('results.json', evidence),
    JSON.stringify(
      { status: completed ? 'PASS' : 'FAIL', scenarios: results },
      null,
      2,
    ),
  );
}
console.log('PASS', results.length, 'frontend browser scenarios');
