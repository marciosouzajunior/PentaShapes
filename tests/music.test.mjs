import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { buildFretboard, noteAt, STANDARD_TUNING, SCALES } from '../public/components/music.mjs';

test('standard tuning, open strings, octave and highest supported fret', () => {
  assert.deepEqual(STANDARD_TUNING.map(s => noteAt(s, 0).midi), [64, 59, 55, 50, 45, 40]);
  for (const string of STANDARD_TUNING) {
    assert.equal(noteAt(string, 12).pitchClass, noteAt(string, 0).pitchClass);
    assert.equal(noteAt(string, 24).midi, string.midi + 24);
  }
  assert.equal(noteAt(STANDARD_TUNING[0], 5).name, 'Lá');
  assert.equal(noteAt(STANDARD_TUNING[1], 8).degree, '♭7');
});

test('all 12 roots produce exactly the pentatonic pitch classes over an octave', () => {
  for (let tonic = 0; tonic < 12; tonic++) {
    for (const scaleId of ['minorPentatonic', 'majorPentatonic']) {
      const model = buildFretboard({ tonic, scaleId, startFret: 0, endFret: 11 });
      for (const row of model.rows) {
        const intervals = row.notes.filter(n => n.visible).map(n => n.interval).sort((a, b) => a - b);
        assert.deepEqual(intervals, [...SCALES[scaleId].intervals]);
      }
    }
  }
});

test('lesson positions contain only A, C, E, and reject silently clipped positions', () => {
  const config = { positions: [{ stringId: 'e_high', fret: 5 }, { stringId: 'e_high', fret: 8 }, { stringId: 'b', fret: 5 }] };
  const visible = buildFretboard(config).rows.flatMap(r => r.notes).filter(n => n.visible);
  assert.deepEqual(visible.map(n => [n.letter, n.degree]), [['A', '1'], ['C', '♭3'], ['E', '5']]);
  assert.throws(() => buildFretboard({ ...config, endFret: 7 }), /Casa da posição/);
  assert.throws(() => buildFretboard({ positions: [{ stringId: 'e_high', fret: 6 }] }), /fora da escala/);
});

test('The Lick fits the compact D minor region, including its ninth', () => {
  const positions = [
    { stringId: 'g', fret: 7 },
    { stringId: 'b', fret: 5 },
    { stringId: 'b', fret: 6 },
    { stringId: 'b', fret: 8 },
    { stringId: 'g', fret: 5 },
  ];
  const model = buildFretboard({ tonic: 2, scaleId: 'naturalMinor', startFret: 5, endFret: 8, labelMode: 'letter', positions });
  const visible = model.rows.flatMap(row => row.notes).filter(note => note.visible);
  assert.deepEqual(visible.map(note => note.letter), ['E', 'F', 'G', 'C', 'D']);
  assert.deepEqual(visible.map(note => note.midi), [64, 65, 67, 60, 62]);
});

test('left-handed layout reverses frets, preserving pitch and string identities', () => {
  const right = buildFretboard();
  const left = buildFretboard({ handedness: 'left' });
  assert.deepEqual(left.frets, [8, 7, 6, 5]);
  for (let i = 0; i < right.rows.length; i++) {
    assert.deepEqual(left.rows[i].notes, [...right.rows[i].notes].reverse());
    assert.deepEqual(left.rows[i].string, right.rows[i].string);
  }
});

test('relative scales share notes but change roots and degrees', () => {
  const a = buildFretboard();
  const c = buildFretboard({ tonic: 0, scaleId: 'majorPentatonic' });
  assert.deepEqual(a.rows.map(r => r.notes.filter(n => n.visible).map(n => n.midi)), c.rows.map(r => r.notes.filter(n => n.visible).map(n => n.midi)));
  assert.equal(a.rows[0].notes[0].isRoot, true);
  assert.equal(c.rows[0].notes[0].isRoot, false);
  assert.equal(c.rows[0].notes[3].isRoot, true);
});

test('fresh configuration does not accumulate roots or mutate input data', () => {
  const before = JSON.stringify(STANDARD_TUNING);
  const a = buildFretboard({ scaleId: 'roots' });
  const c = buildFretboard({ scaleId: 'roots', tonic: 0 });
  assert.ok(a.rows.flatMap(r => r.notes).filter(n => n.visible).every(n => n.pitchClass === 9));
  assert.ok(c.rows.flatMap(r => r.notes).filter(n => n.visible).every(n => n.pitchClass === 0));
  assert.equal(JSON.stringify(STANDARD_TUNING), before);
  a.rows[0].string.midi = 0;
  assert.equal(STANDARD_TUNING[0].midi, 64);
});

test('partial and alternative tunings, empty lesson and boundaries', () => {
  assert.equal(buildFretboard({ tuning: STANDARD_TUNING.slice(0, 3) }).rows.length, 3);
  const dropD = STANDARD_TUNING.map(s => s.id === 'e_low' ? { ...s, midi: 38 } : s);
  assert.equal(noteAt(dropD[5], 0).letter, 'D');
  assert.equal(buildFretboard({ startFret: 24, endFret: 24 }).frets.length, 1);
  assert.equal(buildFretboard({ positions: [] }).rows.flatMap(r => r.notes).filter(n => n.visible).length, 0);
});

test('invalid configuration is rejected rather than partially rendered', () => {
  for (const config of [
    { tonic: -1 }, { tonic: 12 }, { tonic: NaN }, { startFret: -1 }, { startFret: 5.5 },
    { endFret: 25 }, { startFret: 8, endFret: 5 }, { scaleId: '' }, { scaleId: 'constructor' },
    { labelMode: 'html' }, { handedness: 'other' }, { tuning: [] },
    { tuning: [STANDARD_TUNING[0], STANDARD_TUNING[0]] },
    { positions: [{ stringId: 'missing', fret: 5 }] },
  ]) assert.throws(() => buildFretboard(config));
});

test('new note engine agrees with all 301 audited legacy interval entries', () => {
  const source = fs.readFileSync(new URL('../legacy/js/scales.js', import.meta.url), 'utf8');
  const scales = vm.runInNewContext(`${source}\nscales`, {}, { timeout: 1000 });
  const intervals = { '1': 0, '8': 0, '♭2': 1, '2': 2, '∆2': 2, '♭3': 3, '3': 4, '∆3': 4, '4': 5, p4: 5, '♭5': 6, '5': 7, p5: 7, '♭6': 8, '6': 9, '∆6': 9, '♭7': 10, '7': 11, '∆7': 11 };
  let checked = 0;
  for (const scale of Object.values(scales)) for (const [anchor, shapes] of Object.entries(scale)) {
    if (anchor === 'shape_labels') continue;
    const tonic = noteAt(STANDARD_TUNING.find(s => s.id === anchor), 8).pitchClass;
    for (const shape of Object.values(shapes)) for (const item of shape) {
      const note = noteAt(STANDARD_TUNING.find(s => s.id === item.string), 8 + item.offset, tonic);
      assert.equal(note.interval, intervals[item.label]);
      checked++;
    }
  }
  assert.equal(checked, 301);
});

test('natural map matches the reference: 48 notes, two emphasized strings and 12 semitone links', () => {
  const model = buildFretboard({ viewMode: 'natural', startFret: 0, endFret: 12, labelMode: 'letter', focusStrings: ['a', 'e_low'], showSemitoneLinks: true });
  const notes = model.rows.flatMap(row => row.notes);
  const visible = notes.filter(note => note.visible);
  assert.equal(visible.length, 48);
  assert.deepEqual([...new Set(visible.map(n => n.pitchClass))].sort((a, b) => a - b), [0, 2, 4, 5, 7, 9, 11]);
  assert.equal(visible.filter(note => note.emphasized).length, 16);
  assert.equal(notes.filter(note => note.linkNext).length, 12);
  assert.ok(visible.every(note => note.degree === null && !note.isRoot));
});

test('semitone links preserve the same pairs when mirrored, and do not bridge a cropped edge', () => {
  const options = { viewMode: 'natural', startFret: 0, endFret: 12, labelMode: 'letter', showSemitoneLinks: true };
  const pairs = model => model.rows.flatMap(row => row.notes.flatMap((n, i) => n.linkNext ? [`${n.stringId}:${[n.fret, row.notes[i + 1].fret].sort((a, b) => a - b).join('-')}`] : [])).sort();
  assert.deepEqual(pairs(buildFretboard(options)), pairs(buildFretboard({ ...options, handedness: 'left' })));
  const cropped = buildFretboard({ ...options, startFret: 8, endFret: 8 });
  assert.equal(pairs(cropped).length, 0);
  const single = buildFretboard({ ...options, positions: [{ stringId: 'e_high', fret: 0 }] });
  assert.equal(pairs(single).length, 0);
});

test('natural map cannot imply a tonal degree or accept an accidental', () => {
  assert.throws(() => buildFretboard({ viewMode: 'natural', labelMode: 'degree' }), /não define graus/);
  assert.throws(() => buildFretboard({ focusStrings: ['unknown'] }), /destaque/);
  assert.throws(() => buildFretboard({ viewMode: 'natural', positions: [{ stringId: 'e_high', fret: 6 }] }), /fora da escala ou do mapa/);
});
