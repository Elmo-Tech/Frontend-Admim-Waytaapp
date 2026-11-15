import {
  createExclusiveTask,
  createRequestSequence,
} from '../src/lib/utils/async-control';
import { clientErrorMetadata } from '../src/lib/utils/client-errors';
it('blocks concurrent mutations and allows retry after failure', async () => {
  const gate = createExclusiveTask();
  let release!: () => void;
  let writes = 0;
  const first = gate.run(async () => {
    await new Promise<void>((r) => {
      release = r;
    });
    writes++;
  });
  await gate.run(async () => {
    writes++;
  });
  expect(writes).toBe(0);
  release();
  await first;
  expect(writes).toBe(1);
  await expect(
    gate.run(async () => {
      throw new Error('offline');
    }),
  ).rejects.toThrow('offline');
  expect(await gate.run(async () => 'retry')).toBe('retry');
});
it('invalidates old reads and only includes safe error metadata', () => {
  const reads = createRequestSequence(),
    old = reads.next(),
    current = reads.next();
  expect(old()).toBe(false);
  expect(current()).toBe(true);
  reads.invalidate();
  expect(current()).toBe(false);
  expect(
    clientErrorMetadata(
      Object.assign(new Error('private'), { digest: 'id' }),
      'boundary',
    ),
  ).toEqual({ source: 'boundary', name: 'Error', digest: 'id' });
});
