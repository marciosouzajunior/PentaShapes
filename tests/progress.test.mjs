import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' });
after(() => vite.close());
const { FOUNDATIONS_L01, lessonKey } = await vite.ssrLoadModule('/src/content-identity.ts');
const { readProgress, saveProgress } = await vite.ssrLoadModule('/src/progress.ts');

function storage() {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, String(value)); },
  };
  return values;
}

test('official and user lesson IDs cannot collide, even with similar local IDs', () => {
  assert.equal(lessonKey(FOUNDATIONS_L01), 'system:fundamentals:l01');
  assert.equal(lessonKey({ source: 'user', ownerId: 'fundamentals', lessonId: 'l01' }), 'user:fundamentals:l01');
  assert.notEqual(lessonKey({ source: 'user', ownerId: 'a', lessonId: 'l01' }), lessonKey({ source: 'user', ownerId: 'b', lessonId: 'l01' }));
});

test('old L01 progress is read and carried into the namespaced store on the next save', () => {
  const values = storage();
  values.set('pentashapes.progress.v1', JSON.stringify({ version: 1, lessonId: 'L01', step: 'practice' }));
  assert.equal(readProgress(FOUNDATIONS_L01)?.step, 'practice');
  assert.equal(saveProgress(FOUNDATIONS_L01, 'complete'), true);
  const next = JSON.parse(values.get('pentashapes.progress.v2'));
  assert.equal(next.schemaVersion, 2);
  assert.equal(next.entries['system:fundamentals:l01'].step, 'complete');
  assert.ok(values.has('pentashapes.progress.v1'));
});

test('saving another author’s lesson leaves official progress untouched', () => {
  const values = storage();
  const personal = { source: 'user', ownerId: 'musician-1', lessonId: 'idea-1' };
  assert.equal(saveProgress(FOUNDATIONS_L01, 'practice'), true);
  assert.equal(saveProgress(personal, 'listen'), true);
  assert.equal(readProgress(FOUNDATIONS_L01)?.step, 'practice');
  assert.equal(readProgress(personal)?.step, 'listen');
  assert.equal(Object.keys(JSON.parse(values.get('pentashapes.progress.v2')).entries).length, 2);
});

test('invalid v2 data is not silently overwritten', () => {
  const values = storage();
  values.set('pentashapes.progress.v2', '{broken');
  assert.equal(saveProgress(FOUNDATIONS_L01, 'listen'), false);
  assert.equal(values.get('pentashapes.progress.v2'), '{broken');
});
