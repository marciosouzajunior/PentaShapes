import test from 'node:test';
import assert from 'node:assert/strict';
import { classify, inspect } from '../scripts/audit-offer.mjs';

test('music data, generated images and CC0 recordings are not treated as executable code', () => {
  assert.equal(classify('src/data/purple-haze.json')[1], 'EXCLUIR');
  assert.equal(classify('src/pentatonic-part-one.ts')[1], 'SEPARAR E REVISAR');
  assert.equal(classify('src/assets/track-purple-haze.webp')[1], 'EXCLUIR');
  assert.equal(classify('src/assets/track-minor-pentatonic-part-2.webp')[1], 'EXCLUIR');
  assert.equal(classify('src/static/audio/clean-guitar/A2.wav')[1], 'EXCLUIR');
  assert.equal(classify('src/progress.ts')[1], 'CANDIDATO');
});

test('scanner reports types and counts without reproducing matched credentials', () => {
  const synthetic = 'https://example:synthetic-password@example.test';
  const findings = inspect(Buffer.from(synthetic));
  assert.ok(findings.some(finding => finding.kind === 'credential-url'));
  assert.ok(!JSON.stringify(findings).includes('synthetic-password'));
  assert.ok(!JSON.stringify(findings).includes('example.test'));
  assert.deepEqual(inspect(Buffer.from('const bpm = 80;')), []);
});
