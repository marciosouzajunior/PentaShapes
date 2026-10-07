/** Pure musical data. String IDs follow the instrument, never its screen orientation. */
export const STANDARD_TUNING = Object.freeze([
  { id: 'e_high', number: 1, midi: 64, name: 'Mi agudo' },
  { id: 'b', number: 2, midi: 59, name: 'Si' },
  { id: 'g', number: 3, midi: 55, name: 'Sol' },
  { id: 'd', number: 4, midi: 50, name: 'Ré' },
  { id: 'a', number: 5, midi: 45, name: 'Lá' },
  { id: 'e_low', number: 6, midi: 40, name: 'Mi grave' },
].map(Object.freeze));

export const SCALES = Object.freeze({
  minorPentatonic: Object.freeze({ name: 'Pentatônica menor', intervals: Object.freeze([0, 3, 5, 7, 10]) }),
  majorPentatonic: Object.freeze({ name: 'Pentatônica maior', intervals: Object.freeze([0, 2, 4, 7, 9]) }),
  naturalMinor: Object.freeze({ name: 'Menor natural', intervals: Object.freeze([0, 2, 3, 5, 7, 8, 10]) }),
  roots: Object.freeze({ name: 'Tônicas', intervals: Object.freeze([0]) }),
});

const NAMES = ['Dó', 'Dó♯', 'Ré', 'Ré♯', 'Mi', 'Fá', 'Fá♯', 'Sol', 'Sol♯', 'Lá', 'Lá♯', 'Si'];
const LETTERS = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const DEGREES = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'];
export const mod12 = value => ((value % 12) + 12) % 12;
export const positionKey = ({ stringId, fret }) => `${stringId}:${fret}`;

function integer(value, min, max, label) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${label} deve ser um inteiro entre ${min} e ${max}.`);
  }
}

export function noteAt(string, fret, tonic = 9) {
  integer(string.midi, 0, 103, 'Afinação MIDI');
  integer(fret, 0, 24, 'Casa');
  integer(tonic, 0, 11, 'Tônica');
  const midi = string.midi + fret;
  const pitchClass = mod12(midi);
  const interval = mod12(pitchClass - tonic);
  return {
    stringId: string.id, stringNumber: string.number, fret, midi, pitchClass,
    name: NAMES[pitchClass], letter: LETTERS[pitchClass],
    degree: DEGREES[interval], interval, isRoot: interval === 0,
  };
}

/** Validate the entire next configuration before rendering it. No DOM state is read. */
export function buildFretboard({
  tonic = 9, scaleId = 'minorPentatonic', startFret = 5, endFret = 8,
  tuning = STANDARD_TUNING, positions = null, handedness = 'right', labelMode = 'name',
  viewMode = 'scale', focusStrings = [], showSemitoneLinks = false,
} = {}) {
  integer(tonic, 0, 11, 'Tônica');
  integer(startFret, 0, 24, 'Casa inicial');
  integer(endFret, startFret, 24, 'Casa final');
  if (!Object.hasOwn(SCALES, scaleId)) throw new TypeError('Escala desconhecida.');
  if (!['left', 'right'].includes(handedness)) throw new TypeError('Orientação inválida.');
  if (!['name', 'letter', 'degree'].includes(labelMode)) throw new TypeError('Rótulo inválido.');
  if (!['scale', 'natural'].includes(viewMode)) throw new TypeError('Visualização inválida.');
  if (viewMode === 'natural' && labelMode === 'degree') throw new TypeError('O mapa de notas naturais não define graus de uma tonalidade.');
  if (typeof showSemitoneLinks !== 'boolean') throw new TypeError('Destaque de semitons inválido.');
  if (!Array.isArray(tuning) || !tuning.length || tuning.length > 12) throw new TypeError('Afinação inválida.');
  const ids = new Set();
  const numbers = new Set();
  for (const string of tuning) {
    if (!string || typeof string.id !== 'string' || !/^[a-z][a-z0-9_]*$/.test(string.id) || ids.has(string.id)) {
      throw new TypeError('Cordas precisam de IDs válidos e únicos.');
    }
    integer(string.number, 1, 12, 'Número da corda');
    integer(string.midi, 0, 103, 'Afinação MIDI');
    if (numbers.has(string.number) || typeof string.name !== 'string') throw new TypeError('Identificação da corda inválida.');
    ids.add(string.id);
    numbers.add(string.number);
  }
  if (!Array.isArray(focusStrings) || focusStrings.some(id => !ids.has(id))) throw new TypeError('Corda de destaque desconhecida.');
  const naturalPitches = [0, 2, 4, 5, 7, 9, 11];
  const isIncluded = note => viewMode === 'natural' ? naturalPitches.includes(note.pitchClass) : SCALES[scaleId].intervals.includes(note.interval);
  let allowed = null;
  if (positions !== null) {
    if (!Array.isArray(positions)) throw new TypeError('Posições devem ser uma lista ou null.');
    allowed = new Set();
    for (const pos of positions) {
      if (!pos || !ids.has(pos.stringId)) throw new TypeError('Posição com corda desconhecida.');
      integer(pos.fret, startFret, endFret, 'Casa da posição');
      const note = noteAt(tuning.find(string => string.id === pos.stringId), pos.fret, tonic);
      if (!isIncluded(note)) throw new TypeError('Posição fora da escala ou do mapa declarado.');
      allowed.add(positionKey(pos));
    }
  }
  const frets = Array.from({ length: endFret - startFret + 1 }, (_, i) => startFret + i);
  if (handedness === 'left') frets.reverse();
  const rows = tuning.map(string => ({
    string: { ...string },
    notes: frets.map(fret => {
      const note = noteAt(string, fret, tonic);
      return {
        ...note,
        isRoot: viewMode === 'scale' && note.isRoot,
        degree: viewMode === 'scale' ? note.degree : null,
        emphasized: focusStrings.includes(string.id),
        visible: isIncluded(note) && (allowed === null || allowed.has(positionKey(note))),
      };
    }),
  }));
  // Mark links in visual order, including left-handed layouts. Never bridge a hidden note or a crop edge.
  for (const row of rows) row.notes.forEach((note, index) => {
    const next = row.notes[index + 1];
    const pitches = next ? [note.pitchClass, next.pitchClass].sort((a, b) => a - b).join(',') : '';
    note.linkNext = showSemitoneLinks && note.visible && Boolean(next?.visible)
      && Math.abs(note.fret - next.fret) === 1 && ['0,11', '4,5'].includes(pitches);
  });
  return { rows, frets, tonic, labelMode, handedness, startFret, endFret, scaleId, viewMode };
}
