import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { buildFretboard } from '../public/components/music.mjs';
import abcjs from 'abcjs';
const vite = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
after(() => vite.close());
const { lessons, getLesson } = await vite.ssrLoadModule('/src/lesson-content.ts');
const { DEFAULT_LESSON_BARS, MAX_LESSON_BARS, planHarmony, planPhrase } = await vite.ssrLoadModule('/src/lesson-playback.ts');

test('long sessions repeat complete phrases and retain silent response windows', () => {
  for (const lesson of lessons) {
    const cycleBars = (lesson.responseAfterBeats ? lesson.responseAfterBeats * 2 : lesson.phrase.beats) / 4;
    assert.equal(DEFAULT_LESSON_BARS % cycleBars, 0);
    const example = planPhrase(lesson, 'example', MAX_LESSON_BARS);
    assert.equal(example.length, MAX_LESSON_BARS * 4 / lesson.phrase.beats * lesson.phrase.notes.length);
    assert.ok(example.every(n => n.beat + n.duration <= MAX_LESSON_BARS * 4));
  }
  const response = planPhrase(getLesson('l03'), 'practice', MAX_LESSON_BARS);
  assert.equal(response.length, MAX_LESSON_BARS / 4 * 5);
  assert.ok(response.every(n => n.beat % 16 + n.duration <= 8));
  assert.throws(() => planPhrase(getLesson('l01'), 'example', MAX_LESSON_BARS + 1), /Compassos/);
});

test('lesson maps and phrases agree on actual pitches and retain stable official IDs', () => {
  assert.ok(lessons.every(l => l.ref.trackId === 'fundamentals'));
  assert.deepEqual(planPhrase(getLesson('l02'), 'example', 2).map(n => n.midi), [69, 72, 69]);
  assert.deepEqual(planPhrase(getLesson('l03'), 'example', 2).map(n => n.midi), [69, 72, 64, 72, 69]);
  for (const lesson of lessons) for (const mode of ['example', 'practice']) assert.doesNotThrow(() => planPhrase(lesson, mode, 4));
});
test('L04 introduces D and G without marking them as chord tones; L05 keeps the map', () => {
  const lesson = getLesson('l04');
  const notes = buildFretboard(lesson.maps.practice).rows.flatMap(row => row.notes).filter(note => note.visible);
  assert.deepEqual(notes.map(note => note.midi).sort((a,b) => a-b), [62, 64, 67, 69, 72]);
  assert.ok(notes.filter(note => note.midi === 62 || note.midi === 67).every(note => !note.roles.includes('chord')));
  assert.deepEqual(getLesson('l05').maps, lesson.maps);
  assert.deepEqual(planPhrase(lesson, 'practice', 4), []);
  const response = planPhrase(getLesson('l05'), 'practice', 16);
  assert.equal(response.length, 16);
  assert.ok(response.every(note => note.beat % 32 + note.duration <= 16));
});

test('L06 keeps five pitch classes across all strings and repeats the motif an octave lower', () => {
  const lesson = getLesson('l06');
  const notes = buildFretboard(lesson.maps.practice).rows.flatMap(row => row.notes).filter(note => note.visible);
  assert.equal(notes.length, 12);
  assert.equal(new Set(notes.map(note => note.stringId)).size, 6);
  assert.deepEqual([...new Set(notes.map(note => note.pitchClass))].sort((a,b) => a-b), [0, 2, 4, 7, 9]);
  assert.deepEqual(notes.filter(note => note.isRoot).map(note => note.midi).sort((a,b) => a-b), [45, 57, 69]);
  for (const note of notes) {
    assert.equal(note.roles.includes('chord'), [0, 4, 9].includes(note.pitchClass));
    assert.equal(note.roles.includes('target'), note.isRoot);
  }
  const phrase = planPhrase(lesson, 'example', 4);
  assert.deepEqual(phrase.slice(4).map(note => note.midi), phrase.slice(0,4).map(note => note.midi - 12));
  assert.deepEqual(phrase.slice(4).map(note => [note.beat - 8, note.duration]), phrase.slice(0,4).map(note => [note.beat, note.duration]));
  assert.deepEqual(planPhrase(lesson, 'practice', 4), []);
  for (const group of lesson.practiceGroups) {
    const map = { ...lesson.maps.practice, positions: lesson.maps.practice.positions.filter(p => group.stringIds.includes(p.stringId)), roles: lesson.maps.practice.roles.filter(p => group.stringIds.includes(p.stringId)) };
    const selected = buildFretboard(map).rows.flatMap(row => row.notes).filter(note => note.visible);
    assert.equal(selected.length, 6);
    assert.ok(selected.every(note => group.stringIds.includes(note.stringId)));
    assert.ok(selected.some(note => note.isRoot));
  }
});

test('L07 connects neighboring positions without changing the scale or the tonic pitch', () => {
  const lesson = getLesson('l07');
  const notes = buildFretboard(lesson.maps.practice).rows.flatMap(row => row.notes).filter(note => note.visible);
  assert.equal(notes.length, 6);
  assert.deepEqual([...new Set(notes.map(note => note.pitchClass))].sort((a,b) => a-b), [0, 2, 4, 7, 9]);
  assert.deepEqual(notes.filter(note => note.isRoot).map(note => note.midi), [69, 69]);
  const phrase = planPhrase(lesson, 'example', 4);
  assert.equal(phrase[2].midi, 74);
  assert.deepEqual(phrase[2].position, { stringId: 'e_high', fret: 10 });
  assert.deepEqual(phrase.at(-1).position, { stringId: 'b', fret: 10 });
  assert.equal(phrase.at(-1).midi, phrase[0].midi);
  assert.deepEqual(planPhrase(lesson, 'practice', 4), []);
  assert.ok(notes.filter(note => note.fret === 8).some(note => note.stringId === 'e_high' && note.degree === '♭3'));
  assert.ok(notes.filter(note => note.fret === 8).some(note => note.stringId === 'b' && note.degree === '♭7'));
});

test('L08 transposes L03 by two semitones with corresponding chord, degrees and response', () => {
  const original = getLesson('l03');
  const lesson = getLesson('l08');
  const before = planPhrase(original, 'example', 2);
  const after = planPhrase(lesson, 'example', 2);
  assert.deepEqual(after.map(note => note.midi), before.map(note => note.midi - 2));
  assert.deepEqual(after.map(note => [note.beat, note.duration]), before.map(note => [note.beat, note.duration]));
  assert.deepEqual(after.map(note => note.position), before.map(note => ({ ...note.position, fret: note.position.fret - 2 })));
  assert.deepEqual(lesson.chord.midi, original.chord.midi.map(midi => midi - 2));
  const notes = buildFretboard(lesson.maps.practice).rows.flatMap(row => row.notes).filter(note => note.visible);
  assert.deepEqual([...new Set(notes.map(note => note.pitchClass))].sort((a,b) => a-b), [0, 2, 5, 7, 10]);
  assert.equal(notes.find(note => note.pitchClass === 10).letter, 'B♭');
  assert.equal(notes.find(note => note.pitchClass === 10).name, 'Si♭');
  assert.equal(notes.find(note => note.pitchClass === 10).degree, '♭3');
  for (const note of notes) assert.equal(note.roles.includes('chord'), [7, 10, 2].includes(note.pitchClass));
  assert.equal(notes.find(note => note.isRoot).midi, 67);
  assert.ok(planPhrase(lesson, 'practice', 8).every(note => note.beat % 16 + note.duration <= 8));
  assert.match(lesson.responseInstruction, /Sol/);
  assert.throws(() => buildFretboard({ spelling: 'unknown' }), /Grafia/);
});

test('L09 repeats Am and Am7 while the same G changes chord role and remains the target', () => {
  const lesson = getLesson('l09');
  const changes = planHarmony(lesson, 8);
  assert.deepEqual(changes.map(change => [change.beat, change.duration, change.chord.label]), [[0, 8, 'Am'], [8, 8, 'Am7'], [16, 8, 'Am'], [24, 8, 'Am7']]);
  assert.deepEqual(changes[1].chord.midi, [...changes[0].chord.midi, 67]);
  for (const change of changes) {
    const notes = buildFretboard(change.map).rows.flatMap(row => row.notes).filter(note => note.visible);
    const g = notes.find(note => note.midi === 67);
    assert.equal(g.degree, '♭7');
    assert.equal(g.isRoot, false);
    assert.ok(g.roles.includes('target'));
    assert.equal(g.roles.includes('chord'), change.chord.label === 'Am7');
    assert.equal(notes.find(note => note.isRoot).midi, 69);
  }
  const phrase = planPhrase(lesson, 'example', 4);
  assert.deepEqual(phrase.slice(2).map(note => [note.midi, note.beat - 8, note.duration]), phrase.slice(0,2).map(note => [note.midi, note.beat, note.duration]));
  assert.deepEqual(planPhrase(lesson, 'practice', 4), []);
  assert.deepEqual(planHarmony(lesson, 1).map(change => change.duration), [4]);
  assert.throws(() => planHarmony({ ...lesson, harmony: [{ ...lesson.harmony[0], beat: 4 }] }, 4), /primeiro/);
  assert.throws(() => planHarmony({ ...lesson, harmony: [lesson.harmony[0], { ...lesson.harmony[1], beat: 3 }] }, 4), /Mudança/);
});

test('L10 shows contextual F only over Dm7, preserving A/C and the center of A', () => {
  const lesson = getLesson('l10');
  const changes = planHarmony(lesson, 4);
  const notes = changes.map(change => buildFretboard(change.map).rows.flatMap(row => row.notes).filter(note => note.visible));
  assert.ok(notes[0].every(note => note.pitchClass !== 5));
  const f = notes[1].find(note => note.pitchClass === 5);
  assert.deepEqual(f.roles, ['context', 'chord', 'target']);
  assert.equal(f.degree, '♭6');
  assert.equal(changes[1].chord.root, 2);
  assert.equal(changes[1].map.tonic, 9);
  for (const group of notes) for (const pitchClass of [0, 9]) assert.ok(group.find(note => note.pitchClass === pitchClass).roles.includes('chord'));
  const phrase = planPhrase(lesson, 'example', 4);
  assert.deepEqual(phrase.filter(note => note.midi === 65).map(note => note.beat), [12]);
  const wrong = { ...lesson, phrase: { ...lesson.phrase, notes: [{ position: { stringId: 'b', fret: 6 }, beat: 0, duration: 1 }] } };
  assert.throws(() => planPhrase(wrong, 'example', 4), /fora do mapa/);
  assert.deepEqual(planPhrase(lesson, 'practice', 4), []);
});

test('L11 preserves physical notes while changing the tonic, degrees and chord targets', () => {
  const lesson = getLesson('l11');
  const changes = planHarmony(lesson, 4);
  const notes = changes.map(change => buildFretboard(change.map).rows.flatMap(row => row.notes).filter(note => note.visible));
  assert.deepEqual(notes[0].map(note => [note.stringId, note.fret, note.midi]), notes[1].map(note => [note.stringId, note.fret, note.midi]));
  assert.equal(notes[0].find(note => note.isRoot).pitchClass, 9);
  assert.equal(notes[1].find(note => note.isRoot).pitchClass, 0);
  assert.equal(notes[0].find(note => note.pitchClass === 0).degree, '♭3');
  assert.equal(notes[1].find(note => note.pitchClass === 9).degree, '6');
  assert.equal(notes[1].find(note => note.pitchClass === 4).degree, '3');
  const phrase = planPhrase(lesson, 'example', 4);
  assert.equal(phrase[3].midi, 69);
  assert.equal(phrase.at(-1).midi, 72);
  assert.deepEqual(planPhrase(lesson, 'practice', 4), []);
});

test('L12 closes the 12-lesson catalog with complete 16-bar jams and optional contextual F', () => {
  assert.equal(lessons.length, 12);
  assert.equal(new Set(lessons.map(lesson => lesson.href)).size, 12);
  assert.equal(new Set(lessons.map(lesson => lesson.ref.lessonId)).size, 12);
  const lesson = getLesson('l12');
  const changes = planHarmony(lesson, 16);
  assert.equal(changes.length, 8);
  assert.ok(changes.every((change, index) => change.beat === index * 8 && change.duration === 8 && change.chord.label === (index % 2 ? 'Dm7' : 'Am7')));
  const phrase = planPhrase(lesson, 'example', 16);
  assert.deepEqual(phrase.filter(note => note.midi === 65).map(note => note.beat), [26]);
  assert.ok(phrase.some(note => note.position.fret === 10));
  assert.equal(phrase.at(-1).midi, 69);
  assert.ok(phrase.at(-1).beat + phrase.at(-1).duration <= 64);
  assert.deepEqual(planPhrase(lesson, 'practice', 16), []);
});

test('written score and scheduled melody agree on pitches, rests and durations', () => {
  for (const lesson of lessons) for (const score of [lesson.score, ...(lesson.wideScore ? [lesson.wideScore] : [])]) {
    const tune = abcjs.parseOnly(score)[0];
    tune.setUpAudio();
    const elements = tune.lines.flatMap(line => line.staff?.flatMap(staff => staff.voices[0]) ?? []);
    let beat = 0;
    const written = [];
    for (const element of elements) {
      if (element.el_type !== 'note') continue;
      if (element.pitches) {
        written.push({ midi: element.midiPitches[0].pitch, beat, duration: element.duration * 4 });
      }
      beat += element.duration * 4;
    }
    assert.equal(beat, lesson.phrase.beats, lesson.id);
    assert.deepEqual(planPhrase(lesson, 'example', beat / 4).map(({midi, beat, duration}) => ({midi, beat, duration})), written, lesson.id);
  }
});

test('free practice has no simulated melody; L03 leaves two bars for the answer', () => {
  assert.deepEqual(planPhrase(getLesson('l01'), 'practice', 4), []);
  assert.deepEqual(planPhrase(getLesson('l02'), 'practice', 4), []);
  const notes = planPhrase(getLesson('l03'), 'practice', 8);
  assert.ok(notes.every(n => n.beat % 16 < 8 && n.beat % 16 + n.duration <= 8));
  assert.equal(notes.length, 10);
});
test('score cues distinguish repeated pitches and restart after each phrase and response', () => {
  const example = planPhrase(getLesson('l02'), 'example', 4);
  assert.deepEqual(example.map(n => [n.beat, n.scoreNoteIndex]), [[0, 0], [2, 1], [4, 2], [8, 0], [10, 1], [12, 2]]);
  const response = planPhrase(getLesson('l03'), 'practice', 8);
  assert.deepEqual(response.map(n => n.scoreNoteIndex), [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
  assert.equal(response[5].beat, 16);
});

test('changing tonic in a fixed region recalculates pitches, roots and overlapping roles', () => {
  const config = { startFret: 5, endFret: 8, tonic: 9, roles: [{stringId:'e_high',fret:5,roles:['chord','target']}] };
  const am = buildFretboard(config);
  const a = am.rows[0].notes[0];
  assert.equal(a.isRoot, true);
  assert.deepEqual(a.roles, ['chord','target']);
  const dm = buildFretboard({...config,tonic:2,roles:[]});
  assert.deepEqual(dm.frets, am.frets);
  assert.equal(dm.rows[0].notes[0].isRoot, false);
  assert.deepEqual(dm.rows[0].notes[0].roles, []);
  assert.notDeepEqual(dm.rows.flatMap(r=>r.notes).filter(n=>n.visible).map(n=>[n.stringId,n.fret]), am.rows.flatMap(r=>r.notes).filter(n=>n.visible).map(n=>[n.stringId,n.fret]));
});
test('context notes outside a scale require an explicit role, and invalid roles fail', () => {
  assert.throws(()=>buildFretboard({roles:[{stringId:'b',fret:6,roles:['chord']}]}), /contextual/);
  const model = buildFretboard({positions:[],roles:[{stringId:'b',fret:6,roles:['context','chord']}]});
  const note = model.rows[1].notes[1];
  assert.equal(note.visible,true);
  assert.deepEqual(note.roles,['context','chord']);
  assert.throws(()=>buildFretboard({roles:[{stringId:'b',fret:6,roles:['unknown']}]}), /desconhecido/);
});
