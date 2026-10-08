import { buildFretboard } from '../public/components/music.mjs';
import type { LessonContent } from './lesson-content';

export const DEFAULT_LESSON_BARS = 32;
export const MAX_LESSON_BARS = 128;

/** Chord and map changes repeat with the written phrase, including silent practice. */
export function planHarmony(lesson: LessonContent, bars: number) {
  if (!Number.isInteger(bars) || bars < 1 || bars > MAX_LESSON_BARS) throw new RangeError('Compassos inválidos.');
  if (!Number.isInteger(lesson.phrase.beats) || lesson.phrase.beats < 4 || lesson.phrase.beats % 4 !== 0) throw new RangeError('Duração da harmonia inválida.');
  const steps = lesson.harmony ?? [{ beat: 0, chord: lesson.chord, map: lesson.maps.example }];
  if (!steps.length || steps[0]?.beat !== 0) throw new RangeError('A harmonia deve começar no primeiro tempo.');
  for (const [index, step] of steps.entries()) {
    if (!Number.isInteger(step.beat) || step.beat < 0 || step.beat >= lesson.phrase.beats || step.beat % 4 !== 0 || index > 0 && step.beat <= steps[index - 1]!.beat) throw new RangeError('Mudança de acorde inválida.');
    if (!step.chord.midi.length || step.chord.midi.some(midi => !Number.isInteger(midi) || midi < 0 || midi > 127)) throw new RangeError('Altura do acorde inválida.');
    buildFretboard(step.map);
  }
  const events: Array<(typeof steps)[number] & { duration: number }> = [];
  for (let offset = 0; offset < bars * 4; offset += lesson.phrase.beats) {
    for (const [index, step] of steps.entries()) {
      const beat = offset + step.beat;
      if (beat >= bars * 4) continue;
      const end = offset + (steps[index + 1]?.beat ?? lesson.phrase.beats);
      events.push({ ...step, beat, duration: Math.min(end, bars * 4) - beat });
    }
  }
  return events;
}

/** Pure score plan shared by sound and visual cues. No timers or DOM state. */
export function planPhrase(lesson: LessonContent, mode: 'example' | 'practice', bars: number) {
  if (!Number.isInteger(bars) || bars < 1 || bars > MAX_LESSON_BARS) throw new RangeError('Compassos inválidos.');
  if (lesson.harmony) planHarmony(lesson, bars);
  const maps = (lesson.harmony ?? [{ beat: 0, map: lesson.maps[mode] }]).map(change => ({ beat: change.beat, notes: buildFretboard(change.map).rows.flatMap(row => row.notes).filter(note => note.visible) }));
  const cycle = mode === 'practice' && lesson.responseAfterBeats ? lesson.responseAfterBeats * 2 : lesson.phrase.beats;
  if (!Number.isInteger(cycle) || cycle < 1) throw new RangeError('Duração da frase inválida.');
  const events: Array<{ position: { stringId: string; fret: number }; beat: number; duration: number; midi: number; scoreNoteIndex: number }> = [];
  const phrase = lesson.phrase.notes.map((note, scoreNoteIndex) => {
    if (note.beat < 0 || note.duration <= 0 || note.beat + note.duration > lesson.phrase.beats) throw new RangeError('Nota fora da frase.');
    let active = maps[0]!;
    for (const change of maps) if (change.beat <= note.beat) active = change;
    const position = active.notes.find(item => item.stringId === note.position.stringId && item.fret === note.position.fret);
    if (!position) throw new TypeError('Nota da frase fora do mapa da etapa.');
    return { ...note, scoreNoteIndex, midi: position.midi };
  });
  if (mode === 'practice' && !lesson.responseAfterBeats) return events;
  for (let offset = 0; offset < bars * 4; offset += cycle) {
    for (const note of phrase) {
      const beat = offset + note.beat;
      if (beat >= bars * 4) continue;
      events.push({ ...note, beat, duration: Math.min(note.duration, bars * 4 - beat) });
    }
  }
  return events;
}
