import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' });
after(() => vite.close());
const { FOUNDATIONS_L01, lessonKey } = await vite.ssrLoadModule('/src/content-identity.ts');
const { readProgress, saveProgress, readActiveLessonKey, readCompletion, readNextIncompleteLessonKey } = await vite.ssrLoadModule('/src/progress.ts');
const { lessons } = await vite.ssrLoadModule('/src/lesson-content.ts');

function storage() {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, String(value)); },
  };
  return values;
}

test('resume finds the first unfinished lesson, even when the last visited lesson is later', () => {
  storage();
  const refs = lessons.map(lesson => lesson.ref);
  assert.equal(readNextIncompleteLessonKey(refs), null);
  saveProgress(refs[0], 'complete');
  saveProgress(refs[1], 'complete');
  saveProgress(refs[5], 'practice');
  assert.equal(readNextIncompleteLessonKey(refs), lessonKey(refs[2]));
  saveProgress(refs[0], 'practice');
  assert.equal(readNextIncompleteLessonKey(refs), lessonKey(refs[0]));
  refs.forEach(ref => saveProgress(ref, 'complete'));
  assert.equal(readNextIncompleteLessonKey(refs), null);
});

test('resume stays in the active module and safely handles unavailable progress', () => {
  const values = storage();
  const refs = lessons.map(lesson => lesson.ref);
  const other = [
    { source: 'system', trackId: 'blues', lessonId: 'l01' },
    { source: 'system', trackId: 'blues', lessonId: 'l02' },
  ];
  const catalog = [...refs, ...other];
  saveProgress(other[0], 'complete');
  assert.equal(readNextIncompleteLessonKey(catalog), lessonKey(other[1]));
  saveProgress(refs[2], 'listen');
  assert.equal(readNextIncompleteLessonKey(catalog), lessonKey(refs[0]));
  values.set('pentashapes.progress.v2', '{broken');
  assert.equal(readNextIncompleteLessonKey(catalog), null);
});

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

test('new official lessons have independent progress and update the resume destination', () => {
  storage();
  const second = { ...FOUNDATIONS_L01, lessonId: 'l02' };
  const third = { ...FOUNDATIONS_L01, lessonId: 'l03' };
  saveProgress(FOUNDATIONS_L01, 'complete');
  saveProgress(second, 'practice');
  saveProgress(third, 'listen');
  assert.equal(readProgress(FOUNDATIONS_L01).step, 'complete');
  assert.equal(readProgress(second).step, 'practice');
  assert.equal(readProgress(third).step, 'listen');
  assert.equal(readActiveLessonKey(), lessonKey(third));
});

test('completion counts only finished lessons in the selected track and follows unchecked lessons', () => {
  storage();
  const refs = lessons.map(lesson => lesson.ref);
  assert.deepEqual(readCompletion(refs), { completed: 0, total: 12, percent: 0 });
  refs.slice(0, 3).forEach(ref => saveProgress(ref, 'complete'));
  saveProgress(refs[3], 'practice');
  saveProgress(refs[4], 'listen');
  saveProgress({ source: 'user', ownerId: 'musician-1', lessonId: 'l01' }, 'complete');
  assert.deepEqual(readCompletion(refs), { completed: 3, total: 12, percent: 25 });
  saveProgress(refs[0], 'practice');
  assert.deepEqual(readCompletion(refs), { completed: 2, total: 12, percent: 17 });
  refs.forEach(ref => saveProgress(ref, 'complete'));
  assert.deepEqual(readCompletion(refs), { completed: 12, total: 12, percent: 100 });
});

test('completion supports legacy progress and safely handles empty or unreadable storage', () => {
  const values = storage();
  values.set('pentashapes.progress.v1', JSON.stringify({ version: 1, lessonId: 'L01', step: 'complete' }));
  assert.deepEqual(readCompletion([FOUNDATIONS_L01, FOUNDATIONS_L01]), { completed: 1, total: 1, percent: 100 });
  assert.deepEqual(readCompletion([]), { completed: 0, total: 0, percent: 0 });
  values.set('pentashapes.progress.v2', '{broken');
  assert.deepEqual(readCompletion([FOUNDATIONS_L01]), { completed: 0, total: 1, percent: 0 });
  assert.equal(values.get('pentashapes.progress.v2'), '{broken');
});
