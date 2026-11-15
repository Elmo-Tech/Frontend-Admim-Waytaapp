import { createServer } from 'node:http';
import { setTimeout } from 'node:timers/promises';
const date = '2026-11-12T10:00:00.000Z';
const features = [
  'WHATSAPP_ORDERING',
  'ORDER_TRACKING',
  'SMART_SUGGESTIONS',
  'MENU_TEMPLATES',
  'DASHBOARD_ORDERING',
  'KITCHEN',
  'TABLE_ORDERING',
  'MENU_IMPORT',
  'OFFERS',
];
const admin = {
  id: 'admin-1',
  email: 'admin@example.test',
  displayName: 'Console Admin',
};
const pkg = {
  id: 'package-1',
  name: 'باقة تجريبية',
  description: null,
  nameAr: 'باقة تجريبية',
  nameEn: 'Pilot package',
  descriptionAr: 'وصف الباقة',
  descriptionEn: 'Package description',
  status: 'ACTIVE',
  prices: {
    egpMonthly: '100.00',
    egpYearly: '1000.00',
    usdMonthly: '10.00',
    usdYearly: '100.00',
  },
  offer: null,
  templates: { all: true, allStandard: false, selected: [] },
  features,
  restaurantCount: 1,
  createdAt: date,
  updatedAt: date,
};
const restaurant = {
  id: 'restaurant-1',
  publicId: 'public-1',
  name: 'مطعم الاختبار — Pilot',
  status: 'ACTIVE',
  defaultLocale: 'ar',
  currencyCode: 'EGP',
  createdAt: date,
  ownerContact: {
    fullName: 'مسؤول المطعم',
    phone: '+201000000000',
    facebookUrl: null,
  },
  counts: { branches: 1, products: 4, staff: 2, orders30d: 6 },
  package: { id: pkg.id, name: pkg.name },
  disabledFeatures: [],
  subscription: null,
};
const audit = {
  id: 'audit-1',
  action: 'restaurant.created',
  adminEmail: admin.email,
  restaurantId: restaurant.id,
  restaurantName: restaurant.name,
  details: { ownerEmail: 'owner@example.test', package: pkg.name },
  createdAt: date,
};
const contract = {
  number: 'WAYTA-2026-0001',
  issuedAt: date,
  subscriptionId: 'subscription-1',
  isDraft: true,
  documentText: null,
  documentLocale: null,
  revision: 0,
  assets: { seal: null, signature: null },
  terms: {
    number: 'WAYTA-2026-0001',
    restaurant: {
      name: restaurant.name,
      countryCode: 'EG',
      ownerEmails: ['owner@example.test'],
      ownerContact: restaurant.ownerContact,
      menuUrl: 'https://pilot.example.test',
    },
    package: { name: pkg.name, features: ['MENU_TEMPLATES'] },
    period: 'YEARLY',
    startsAt: '2026-11-12',
    endsAt: '2027-11-12',
    pricing: {
      currencyCode: 'EGP',
      listPrice: '1000.00',
      finalPrice: '900.00',
      offer: { label: 'Pilot', percent: '10', amount: '100.00' },
      discount: null,
    },
    graceDays: 7,
    notes: null,
    issuedBy: admin.email,
  },
};
export const state = { mode: 'ok', failSave: false, saves: 0 };
export const mutations = [],
  failures = [];
export const api = createServer(async (request, response) => {
  response.setHeader(
    'Access-Control-Allow-Origin',
    request.headers.origin || 'http://127.0.0.1:14382',
  );
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  );
  if (request.method === 'OPTIONS') {
    response.writeHead(204).end();
    return;
  }
  const url = new URL(request.url, 'http://127.0.0.1:14380');
  const route = url.pathname.replace('/api/v1/platform', '');
  let body = '';
  for await (const chunk of request) body += chunk;
  const data = body ? JSON.parse(body) : null;
  if (request.method !== 'GET')
    mutations.push({ path: route, method: request.method, body: data });
  const send = (value, status = 200) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end(
      JSON.stringify(
        status >= 400
          ? { error: { code: 'TEST_REFUSAL', message: 'Test refusal' } }
          : { data: value },
      ),
    );
  };
  if (route === '/auth/me') {
    send(
      admin,
      state.mode === 'unauthenticated'
        ? 401
        : state.mode === 'unreachable'
          ? 500
          : 200,
    );
    return;
  }
  if (route === '/overview') {
    send({
      restaurants: { total: 1, active: 1, suspended: 0, inactive: 0 },
      last30Days: { newRestaurants: 1, orders: 6 },
      totals: { branches: 1, products: 4, orders: 6 },
      restrictedRestaurants: 0,
      openRequests: 1,
      openLeads: 1,
      billing: {
        ending: [],
        unpaid: [],
        unpaidCount: 0,
        outstanding: [],
        received30d: [{ currencyCode: 'EGP', amount: '900.00' }],
      },
      recentRestaurants: [restaurant],
      recentActivity: [audit],
    });
    return;
  }
  if (route === '/restaurants') {
    send(
      request.method === 'POST'
        ? {
            id: restaurant.id,
            publicId: restaurant.publicId,
            name: restaurant.name,
            ownerEmail: 'owner@example.test',
          }
        : { items: [restaurant], page: 1, pageSize: 20, total: 1 },
    );
    return;
  }
  if (route === '/restaurants/restaurant-1') {
    send({
      ...restaurant,
      menuLink: {
        slug: 'pilot',
        formerSlugs: [],
        url: 'https://pilot.example.test',
      },
      exclusiveDesign: null,
      acquisition: null,
      settings: {
        pickupEnabled: true,
        deliveryEnabled: false,
        tableOrderingEnabled: true,
        whatsappOrderingEnabled: true,
        menuTemplate: 'CLASSIC',
        suggestionsMode: 'OFF',
      },
      owners: [{ email: 'owner@example.test', status: 'ACTIVE' }],
      features: features.map((key) => ({
        key,
        enabled: true,
        overridden: false,
        source: 'package',
        baseEnabled: true,
      })),
      totals: { orders: 6, activeBranches: 1, tables: 3 },
    });
    return;
  }
  if (route === '/restaurants/restaurant-1/billing') {
    send({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        status: restaurant.status,
        countryCode: 'EG',
        billingCurrency: 'EGP',
      },
      graceDays: 7,
      trial: { enabled: true, defaultDays: 15, defaultPackageId: pkg.id },
      currentId: null,
      subscriptions: [],
    });
    return;
  }
  if (route === '/packages' && request.method === 'POST') {
    state.saves++;
    await setTimeout(200);
    if (state.failSave) {
      send(null, 503);
      return;
    }
  }
  if (route === '/packages') {
    send(request.method === 'POST' ? pkg : [pkg]);
    return;
  }
  if (route === '/packages/package-1') {
    send({ ...pkg, restaurants: [restaurant] });
    return;
  }
  if (route === '/audit') {
    send([audit]);
    return;
  }
  if (route === '/admins') {
    send([{ ...admin, status: 'ACTIVE', lastLoginAt: date, createdAt: date }]);
    return;
  }
  if (route === '/demos') {
    send([
      {
        id: 'demo-1',
        publicId: 'demo-public-1',
        label: 'عرض تجريبي',
        kind: 'cafe',
        status: 'ACTIVE',
        createdAt: date,
        expiresAt: '2026-11-13T10:00:00Z',
        removedAt: '2026-11-13T11:00:00Z',
        opened: true,
        lastOpenedAt: date,
        openCount: 2,
        package: { id: pkg.id, name: pkg.name, nameEn: pkg.nameEn },
      },
    ]);
    return;
  }
  if (route.startsWith('/leads')) {
    send([
      {
        id: 'lead-1',
        kind: 'TRIAL',
        packageName: pkg.name,
        name: 'Pilot contact',
        email: 'contact@example.test',
        phone: '+201000000000',
        restaurantName: restaurant.name,
        message: 'Request a trial',
        locale: 'en',
        status: 'NEW',
        note: null,
        handledByEmail: null,
        handledAt: null,
        createdAt: date,
      },
    ]);
    return;
  }
  if (route === '/subscription-requests') {
    send([
      {
        id: 'request-1',
        kind: 'UPGRADE',
        packageName: pkg.name,
        message: 'Upgrade request',
        status: 'NEW',
        note: null,
        requestedByEmail: 'owner@example.test',
        handledByEmail: null,
        handledAt: null,
        createdAt: date,
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          status: restaurant.status,
          packageName: pkg.name,
        },
      },
    ]);
    return;
  }
  if (route === '/settings/public') {
    send({ poweredByUrl: 'https://waytaapp.com', updatedAt: date });
    return;
  }
  if (route === '/settings/trial') {
    send({
      enabled: true,
      defaultDays: 15,
      defaultPackage: { id: pkg.id, name: pkg.name },
      updatedAt: date,
    });
    return;
  }
  if (route === '/settings/ai') {
    send({
      settings: {
        engine: 'N8N',
        model: 'gemini-test-model',
        fallbackModel: null,
        encryptionConfigured: true,
        activeKeyCount: 0,
        updatedAt: date,
      },
      keys: [],
    });
    return;
  }
  if (route === '/subscriptions/subscription-1/contract') {
    send({ ...contract, ...globalThis.contractVariant });
    return;
  }
  if (route.startsWith('/subscriptions/subscription-1/contract/')) {
    send({});
    return;
  }
  failures.push(`${request.method} ${route}`);
  send(null, 404);
});
