import { FOUNDATIONS_L01, type LessonRef } from './content-identity';
import { buildFretboard } from '../public/components/music.mjs';
export type Position = { stringId: string; fret: number };
export type LessonChord = { label: string; root: number; midi: number[] };
export type LessonMap = {
  tonic: number; scaleId: string; startFret: number; endFret: number;
  spelling?: 'sharp' | 'flat';
  positions: Position[] | null;
  roles: Array<Position & { roles: Array<'chord' | 'target' | 'context'> }>;
};
export type LessonContent = {
  id: 'l01' | 'l02' | 'l03' | 'l04' | 'l05' | 'l06' | 'l07' | 'l08' | 'l09' | 'l10' | 'l11' | 'l12'; ref: LessonRef; revision: number;
  number: string; title: string; href: string;
  instruction: string; practiceInstruction: string; exampleInstruction: string; reflection: string;
  degreeExplanation: string;
  check: { question: string; choices: string[]; answer: number; explanation: string; practice: string };
  score: string; wideScore?: string; scoreDescription: string;
  chord: LessonChord;
  harmony?: Array<{ beat: number; chord: LessonChord; map: LessonMap }>;
  maps: { example: LessonMap; practice: LessonMap };
  phrase: { beats: number; notes: Array<{ position: Position; beat: number; duration: number }> };
  responseAfterBeats?: number;
  responseInstruction?: string;
  practiceGroups?: Array<{ id: string; label: string; stringIds: string[] }>;
};
const a = { stringId: 'e_high', fret: 5 };
const c = { stringId: 'e_high', fret: 8 };
const e = { stringId: 'b', fret: 5 };
const g = { stringId: 'b', fret: 8 };
const d = { stringId: 'g', fret: 7 };
const aMiddle = { stringId: 'd', fret: 7 };
const cMiddle = { stringId: 'g', fret: 5 };
const eMiddle = { stringId: 'a', fret: 7 };
const dNeighbor = { stringId: 'e_high', fret: 10 };
const aNeighbor = { stringId: 'b', fret: 10 };
const fullBoxPositions: Position[] = [a, c, e, g, cMiddle, d, { stringId: 'd', fret: 5 }, aMiddle, { stringId: 'a', fret: 5 }, eMiddle, { stringId: 'e_low', fret: 5 }, { stringId: 'e_low', fret: 8 }];
function map(positions: Position[], endFret = 8, options: { tonic?: number; startFret?: number; scaleId?: string; chordMidi?: number[]; spelling?: 'sharp' | 'flat' } = {}): LessonMap {
  const configuration: LessonMap = { tonic: options.tonic ?? 9, scaleId: options.scaleId ?? 'minorPentatonic', startFret: options.startFret ?? 5, endFret, positions, roles: [], ...(options.spelling ? { spelling: options.spelling } : {}) };
  configuration.roles = buildFretboard(configuration).rows.flatMap(row => row.notes)
    .filter(note => note.visible && (options.chordMidi ?? chord.midi).some(midi => midi % 12 === note.pitchClass))
    .map(note => ({ stringId: note.stringId, fret: note.fret, roles: note.isRoot ? ['chord', 'target'] : ['chord'] }));
  return configuration;
}
const chord = { label: 'Am', root: 9, midi: [57, 60, 64] };
const fullBox: LessonMap = map(fullBoxPositions);
const bridgeMap = map([a, c, dNeighbor, e, g, aNeighbor], 10);
const downTwoFrets = (position: Position): Position => ({ ...position, fret: position.fret - 2 });
const gTonic = downTwoFrets(a);
const bb = downTwoFrets(c);
const dGm = downTwoFrets(e);
const gmPositions = [gTonic, bb, dGm, downTwoFrets(g), downTwoFrets(d)];
const gmChord = { label: 'Gm', root: 7, midi: [55, 58, 62] };
const gmMap = map(gmPositions, 6, { tonic: 7, startFret: 3, chordMidi: gmChord.midi, spelling: 'flat' });
const am7Chord = { label: 'Am7', root: 9, midi: [57, 60, 64, 67] };
function seventhMap(chordMidi: number[]): LessonMap {
  const configuration = map([a, c, e, g], 8, { chordMidi });
  configuration.roles = configuration.roles.map(position => ({ ...position, roles: position.roles.filter(role => role !== 'target') }));
  const target = configuration.roles.find(position => position.stringId === g.stringId && position.fret === g.fret);
  if (target) target.roles.push('target');
  else configuration.roles.push({ ...g, roles: ['target'] });
  return configuration;
}
const amTargetMap = seventhMap(chord.midi);
const am7TargetMap = seventhMap(am7Chord.midi);
const f = { stringId: 'b', fret: 6 };
const dm7Chord = { label: 'Dm7', root: 2, midi: [50, 53, 57, 60] };
const cChord = { label: 'C', root: 0, midi: [60, 64, 67] };
function withTargets(configuration: LessonMap, targets: Position[]): LessonMap {
  const roles: LessonMap['roles'] = configuration.roles.map(position => ({ ...position, roles: position.roles.filter(role => role !== 'target') }));
  for (const target of targets) {
    const existing = roles.find(position => position.stringId === target.stringId && position.fret === target.fret);
    if (existing) existing.roles.push('target');
    else roles.push({ ...target, roles: ['target'] });
  }
  return { ...configuration, roles };
}
function twoChordMaps(positions: Position[], endFret = 8) {
  const am = withTargets(map(positions, endFret, { chordMidi: am7Chord.midi }), [a, c]);
  const dm = withTargets(map(positions, endFret, { chordMidi: dm7Chord.midi }), [a, c]);
  dm.roles.push({ ...f, roles: ['context', 'chord', 'target'] });
  return { am, dm };
}
const sharedMaps = twoChordMaps([a, c, e, g, d]);
const relativeAmMap = map([a, c, e, g, d], 8, { chordMidi: am7Chord.midi });
const relativeCMap = map([a, c, e, g, d], 8, { tonic: 0, scaleId: 'majorPentatonic', chordMidi: cChord.midi });
const jamMaps = twoChordMaps([a, c, e, g, d, dNeighbor, aNeighbor], 10);
type PhraseNote = LessonContent['phrase']['notes'][number];
const jamSections: Array<{ body: string; notes: PhraseNote[] }> = [
  { body: 'A z c E | A2 z2 |', notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 2, duration: 1 }, { position: e, beat: 3, duration: 1 }, { position: a, beat: 4, duration: 2 }] },
  { body: 'A z c2 | z2 A2 |', notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 2, duration: 2 }, { position: a, beat: 6, duration: 2 }] },
  { body: 'A z c d | c2 A2 |', notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 2, duration: 1 }, { position: dNeighbor, beat: 3, duration: 1 }, { position: c, beat: 4, duration: 2 }, { position: aNeighbor, beat: 6, duration: 2 }] },
  { body: 'c z F A | A2 z2 |', notes: [{ position: c, beat: 0, duration: 1 }, { position: f, beat: 2, duration: 1 }, { position: aNeighbor, beat: 3, duration: 1 }, { position: aNeighbor, beat: 4, duration: 2 }] },
  { body: 'E G A2 | z2 A2 |', notes: [{ position: e, beat: 0, duration: 1 }, { position: g, beat: 1, duration: 1 }, { position: aNeighbor, beat: 2, duration: 2 }, { position: aNeighbor, beat: 6, duration: 2 }] },
  { body: 'A c D z | c2 z2 |', notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 1, duration: 1 }, { position: d, beat: 2, duration: 1 }, { position: c, beat: 4, duration: 2 }] },
  { body: 'A c E z | A2 z2 |', notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 1, duration: 1 }, { position: e, beat: 2, duration: 1 }, { position: a, beat: 4, duration: 2 }] },
  { body: 'c z A2 | A2 z2 |', notes: [{ position: c, beat: 0, duration: 1 }, { position: aNeighbor, beat: 2, duration: 2 }, { position: a, beat: 4, duration: 2 }] },
];
const identity = (lessonId: string): LessonRef => ({ ...FOUNDATIONS_L01, lessonId });
const score = (body: string, key = 'Am') => `X:1\nM:4/4\nL:1/4\n%%jazzchords\nK:${key} clef=treble\n${body}`;
export const lessons: LessonContent[] = [
  {
    id: 'l01', ref: identity('l01'), revision: 1, number: 'L01', title: 'Encontre o repouso', href: '/lesson/',
    instruction: 'Toque o A na 1ª corda, casa 5, sobre Am. Deixe a nota soar, faça uma pausa e perceba o efeito de voltar a ela.',
    degreeExplanation: 'O grau mostra a relação de uma nota com a tônica, nossa referência. Aqui, A é a tônica: grau [[degree:1]]. Ouça como é voltar a ela depois de uma pausa.',
    practiceInstruction: 'Toque o A e deixe espaço antes de voltar a ele.',
    exampleInstruction: 'Escute o A no primeiro tempo de cada compasso.',
    reflection: 'Consegui voltar ao A e deixar uma pausa. A execução é avaliada por você.',
    check: { question: 'Qual nota usamos como repouso sobre Am?', choices: ['A', 'C', 'E'], answer: 0, explanation: 'O A é a tônica: nesta lição, voltamos a ele para ouvir a sensação de repouso.', practice: 'Consegui deixar uma pausa antes de voltar ao A.' },
    score: score('"Am"A2 z2 |'), scoreDescription: 'A por dois tempos, seguido de dois tempos de pausa.',
    chord, maps: { example: map([a]), practice: map([a]) },
    phrase: { beats: 4, notes: [{ position: a, beat: 0, duration: 2 }] },
  },
  {
    id: 'l02', ref: identity('l02'), revision: 1, number: 'L02', title: 'Duas notas, muitos ritmos', href: '/lesson/l02/',
    instruction: 'Use A (1ª corda, casa 5) e C (1ª corda, casa 8). Imite o exemplo, mude o ritmo e termine em A.',
    degreeExplanation: 'Em relação ao A, A é o grau [[degree:1]] e C é a terça menor, [[degree:♭3]]. O ♭ compara esse grau com a escala maior de A: não significa que a nota se chama C bemol. Compare o som de terminar em C com o de voltar ao A.',
    practiceInstruction: 'Crie uma frase com A e C. Inclua uma pausa e volte ao A.',
    exampleInstruction: 'Escute A, pausa, C e A. O motivo se repete a cada dois compassos.',
    reflection: 'Usei as duas notas, deixei uma pausa e terminei em A. A execução é avaliada por você.',
    check: { question: 'Quais são as duas notas desta lição?', choices: ['A e E', 'A e C', 'C e E'], answer: 1, explanation: 'Usamos A e C para experimentar ritmos diferentes, voltando ao A no final.', practice: 'Consegui variar o ritmo e terminar em A.' },
    score: score('"Am"A z c2 | A2 z2 |'), scoreDescription: 'A, pausa, C sustentado; depois A e pausa.',
    chord, maps: { example: map([a, c]), practice: map([a, c]) },
    phrase: { beats: 8, notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 2, duration: 2 }, { position: a, beat: 4, duration: 2 }] },
  },
  {
    id: 'l03', ref: identity('l03'), revision: 1, number: 'L03', title: 'Pergunta e resposta', href: '/lesson/l03/',
    instruction: 'Acrescente E (2ª corda, casa 5). Escute uma pergunta de dois compassos e crie uma resposta de dois compassos com A, C e E, terminando em A.',
    degreeExplanation: 'A, C e E são os graus [[degree:1]], [[degree:♭3]] e [[degree:5]] em relação ao A. Eles formam o acorde de Am: tônica, terça menor e quinta. O ♭ em [[degree:♭3]] indica a comparação com a terça da escala maior; a nota aqui é C. Experimente ouvir finais em cada uma das três notas.',
    practiceInstruction: 'Escute a pergunta por dois compassos; responda nos dois seguintes. Termine em A e deixe espaço.',
    exampleInstruction: 'Escute a pergunta com A, C e E. Depois experimente sua própria resposta.',
    reflection: 'Criei uma resposta com espaço e chegada ao A. A execução é avaliada por você.',
    check: { question: 'Qual nota acrescentamos ao A e ao C?', choices: ['D', 'G', 'E'], answer: 2, explanation: 'Acrescentamos E, na 2ª corda, casa 5. A, C e E são as três notas de Am.', practice: 'Consegui criar uma resposta nos dois compassos livres e terminar em A.' },
    score: score('"Am"A z c E | c z A2 |'), scoreDescription: 'Pergunta: A, pausa, C, E; C, pausa, A sustentado. Resposta livre nos dois compassos seguintes.',
    chord, maps: { example: map([a, c, e]), practice: map([a, c, e]) },
    phrase: { beats: 8, notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 2, duration: 1 }, { position: e, beat: 3, duration: 1 }, { position: c, beat: 4, duration: 1 }, { position: a, beat: 6, duration: 2 }] },
    responseAfterBeats: 8,
    responseInstruction: 'Responda e termine em A.',
  },
  {
    id: 'l04', ref: identity('l04'), revision: 1, number: 'L04', title: 'Complete o pequeno mapa', href: '/lesson/l04/',
    instruction: 'Acrescente G (2ª corda, casa 8) e D (3ª corda, casa 7). Com A, C e E, você tem as cinco notas da pentatônica menor de A. Use uma das notas novas numa frase curta e volte ao A.',
    degreeExplanation: 'A pentatônica menor tem os graus [[degree:1]]–[[degree:♭3]]–[[degree:4]]–[[degree:5]]–[[degree:♭7]]. Em A: A = [[degree:1]], C = [[degree:♭3]], D = [[degree:4]], E = [[degree:5]] e G = [[degree:♭7]]. D e G ampliam o vocabulário; [[degree:1]], [[degree:♭3]] e [[degree:5]] continuam formando Am. O ♭ compara o grau com a escala maior da mesma tônica: C e G não passam a se chamar C bemol e G bemol.',
    practiceInstruction: 'Experimente D ou G em uma frase. Deixe uma pausa e volte ao A; não precisa usar todas as notas.',
    exampleInstruction: 'Escute como D e G ampliam a frase, que termina em A.',
    reflection: 'Experimentei uma nota nova, deixei espaço e voltei ao A. A execução é avaliada por você.',
    check: { question: 'Quais notas completam a pentatônica com A, C e E?', choices: ['D e G', 'F e B', 'D e F'], answer: 0, explanation: 'D e G completam A–C–D–E–G. As notas de Am continuam sendo A, C e E.', practice: 'Consegui usar D ou G e voltar ao A.' },
    score: score('"Am"A c G E | D z A2 |'), scoreDescription: 'A, C, G, E; D, pausa e A por dois tempos.',
    chord, maps: { example: map([a, c, e, g, d]), practice: map([a, c, e, g, d]) },
    phrase: { beats: 8, notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 1, duration: 1 }, { position: g, beat: 2, duration: 1 }, { position: e, beat: 3, duration: 1 }, { position: d, beat: 4, duration: 1 }, { position: a, beat: 6, duration: 2 }] },
  },
  {
    id: 'l05', ref: identity('l05'), revision: 1, number: 'L05', title: 'Repita e transforme', href: '/lesson/l05/',
    instruction: 'Um motivo é uma pequena ideia musical que você reconhece quando ela volta. Escute o motivo e sua variação. Depois crie o seu, repita e mude apenas o ritmo, mantendo as notas e a chegada ao A.',
    degreeExplanation: 'O motivo do exemplo usa [[degree:1]]–[[degree:♭3]]–[[degree:5]]–[[degree:1]]: A–C–E–A. A variação mantém esses graus e muda o ritmo. Os graus descrevem a relação das notas com o A, não sua duração ou o número da casa.',
    practiceInstruction: 'Escute quatro compassos. Nos quatro seguintes, toque seu motivo e repita mudando apenas o ritmo. Termine em A.',
    exampleInstruction: 'Escute a mesma sequência de notas duas vezes: na segunda, o C dura mais e o E entra depois.',
    reflection: 'Repeti uma ideia e mudei seu ritmo sem perder a chegada ao A. A execução é avaliada por você.',
    check: { question: 'O que muda na segunda versão do exemplo?', choices: ['O tom da música', 'O ritmo, mantendo a sequência de notas', 'As notas disponíveis no braço'], answer: 1, explanation: 'A sequência A–C–E–A permanece. O C dura mais e o E entra depois: variamos o ritmo de uma ideia conhecida.', practice: 'Consegui repetir um motivo e variar seu ritmo.' },
    score: score('"Am"A c E z | A2 z2 |\n"Am"A c2 E | A2 z2 |'), scoreDescription: 'Motivo: A, C, E, pausa; A sustentado e pausa. Variação: A, C por dois tempos, E; A sustentado e pausa.',
    chord, maps: { example: map([a, c, e, g, d]), practice: map([a, c, e, g, d]) },
    phrase: { beats: 16, notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 1, duration: 1 }, { position: e, beat: 2, duration: 1 }, { position: a, beat: 4, duration: 2 }, { position: a, beat: 8, duration: 1 }, { position: c, beat: 9, duration: 2 }, { position: e, beat: 11, duration: 1 }, { position: a, beat: 12, duration: 2 }] },
    responseAfterBeats: 16,
    responseInstruction: 'Repita seu motivo e varie o ritmo.',
  },
  {
    id: 'l06', ref: identity('l06'), revision: 1, number: 'L06', title: 'Um box inteiro', href: '/lesson/l06/',
    instruction: 'Um box é uma posição da escala. Agora explore a pentatônica de Am nas seis cordas, entre as casas 5 e 8. Ouça o mesmo motivo em dois registros. Na prática, escolha um grupo de cordas, crie uma frase curta e procure um A para terminar.',
    degreeExplanation: 'O box inteiro continua usando [[degree:1]]–[[degree:♭3]]–[[degree:4]]–[[degree:5]]–[[degree:♭7]]. Há mais posições, mas as classes de notas são as mesmas: A, C, D, E e G. As notas A da 6ª corda/casa 5, 4ª corda/casa 7 e 1ª corda/casa 5 são o grau [[degree:1]] em oitavas diferentes. Acorde e escala continuam sendo Am e sua pentatônica menor.',
    practiceInstruction: 'Explore um grupo de cordas por vez. Repita uma frase com pausa e termine no A disponível nesse grupo. Depois tente outro registro.',
    exampleInstruction: 'Escute A–C–E–A nas cordas agudas e, depois, uma oitava abaixo, mantendo o ritmo.',
    reflection: 'Encontrei um A em outro registro e mantive uma ideia musical com pausa. A execução é avaliada por você.',
    check: { question: 'O que muda ao levar esse motivo uma oitava abaixo?', choices: ['A escala passa a ter mais de cinco notas diferentes', 'O registro; as notas e os graus permanecem', 'A tônica deixa de ser A'], answer: 1, explanation: 'O motivo soa mais grave, mas mantém A–C–E–A e os graus [[degree:1]]–[[degree:♭3]]–[[degree:5]]–[[degree:1]]. Mudar de registro não é mudar de tom.', practice: 'Consegui levar uma ideia a outro registro.' },
    score: score('"Am"A c E z | A2 z2 |\n"Am"A, C E, z | A,2 z2 |'), scoreDescription: 'A, C, E, pausa; A por dois tempos e pausa. O mesmo motivo se repete uma oitava abaixo, com o mesmo ritmo.',
    chord, maps: { example: fullBox, practice: fullBox },
    phrase: { beats: 16, notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 1, duration: 1 }, { position: e, beat: 2, duration: 1 }, { position: a, beat: 4, duration: 2 }, { position: aMiddle, beat: 8, duration: 1 }, { position: cMiddle, beat: 9, duration: 1 }, { position: eMiddle, beat: 10, duration: 1 }, { position: aMiddle, beat: 12, duration: 2 }] },
    practiceGroups: [{ id: 'high', label: '1ª–3ª cordas', stringIds: ['e_high', 'b', 'g'] }, { id: 'middle', label: '3ª–5ª cordas', stringIds: ['g', 'd', 'a'] }, { id: 'low', label: '4ª–6ª cordas', stringIds: ['d', 'a', 'e_low'] }],
  },
  {
    id: 'l07', ref: identity('l07'), revision: 1, number: 'L07', title: 'Uma ponte no braço', href: '/lesson/l07/',
    instruction: 'C (1ª corda, casa 8) e G (2ª corda, casa 8) ligam o recorte conhecido às casas 8–10. A partir deles, alcance D (1ª corda, casa 10) e A (2ª corda, casa 10). Mova a mão para acompanhar a frase, sem tentar alcançar tudo de uma vez.',
    degreeExplanation: 'A escala continua sendo a pentatônica menor de A: [[degree:1]]–[[degree:♭3]]–[[degree:4]]–[[degree:5]]–[[degree:♭7]]. C é [[degree:♭3]] e G é [[degree:♭7]] nos dois recortes; eles servem como pontos de passagem. D na casa 10 é o grau [[degree:4]]. A na 2ª corda/casa 10 e na 1ª corda/casa 5 têm a mesma altura e o mesmo grau [[degree:1]], em posições diferentes. Conectar regiões não é trocar de escala ou de tom.',
    practiceInstruction: 'Faça uma frase passando por C ou G na casa 8. Explore a casa 10, deixe uma pausa e termine em um das notas A. Mova a mão com calma.',
    exampleInstruction: 'A primeira frase passa por C e alcança D. A segunda passa por G e termina no A da 2ª corda, casa 10.',
    reflection: 'Conectei os recortes usando C ou G e terminei em A. A execução é avaliada por você.',
    check: { question: 'Ao passar para as casas 8–10 nesta lição, o que acontece com a escala?', choices: ['Ela muda para D menor', 'Continua sendo a pentatônica menor de A', 'Ganha novas classes de notas'], answer: 1, explanation: 'Mudamos as posições disponíveis, mas continuamos usando A, C, D, E e G sobre Am. Mudar de região não é mudar de tom.', practice: 'Consegui conectar os recortes e voltar ao A.' },
    score: score('"Am"A c d c | A2 z2 |\n"Am"E G A2 | z2 A2 |'), scoreDescription: 'A, C, D, C; A e pausa. E, G, A sustentado na 2ª corda/casa 10; pausa e repetição desse A.',
    chord, maps: { example: bridgeMap, practice: bridgeMap },
    phrase: { beats: 16, notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 1, duration: 1 }, { position: dNeighbor, beat: 2, duration: 1 }, { position: c, beat: 3, duration: 1 }, { position: a, beat: 4, duration: 2 }, { position: e, beat: 8, duration: 1 }, { position: g, beat: 9, duration: 1 }, { position: aNeighbor, beat: 10, duration: 2 }, { position: aNeighbor, beat: 14, duration: 2 }] },
  },
  {
    id: 'l08', ref: identity('l08'), revision: 1, number: 'L08', title: 'Leve sua frase a outro tom', href: '/lesson/l08/',
    instruction: 'Leve o recorte de Am duas casas em direção à pestana: das casas 5–8 para 3–6. A vira G, C vira B bemol e E vira D. O motivo da L03 mantém o ritmo e os graus; agora toque sobre Gm e termine em G.',
    degreeExplanation: 'Transpor muda as alturas e a tônica, mantendo as relações. A–C–E vira G–B♭–D: [[degree:1]]–[[degree:♭3]]–[[degree:5]] nos dois tons. A pentatônica de Gm é G–B♭–C–D–F, com graus [[degree:1]]–[[degree:♭3]]–[[degree:4]]–[[degree:5]]–[[degree:♭7]]. Aqui, B♭ é o nome da nota e [[degree:♭3]] é sua relação com G. O acorde Gm contém G, B♭ e D.',
    practiceInstruction: 'Escute dois compassos; responda nos dois seguintes sobre Gm. Preserve uma ideia rítmica e termine em G, na 1ª corda, casa 3.',
    exampleInstruction: 'Reconheça o motivo da L03: o ritmo continua igual, mas agora ele soa dois semitons abaixo, sobre Gm.',
    reflection: 'Mantive uma ideia rítmica em Gm e voltei ao G. A execução é avaliada por você.',
    check: { question: 'Ao transpor o motivo de Am para Gm, o que permanece?', choices: ['Os nomes e as alturas de todas as notas', 'A tônica A', 'O ritmo e os graus [[degree:1]]–[[degree:♭3]]–[[degree:5]]'], answer: 2, explanation: 'A–C–E vira G–B♭–D. As notas descem dois semitons, mas o motivo mantém seu ritmo e as relações com a nova tônica.', practice: 'Consegui manter o ritmo e terminar em G.' },
    score: score('"Gm"G z B D | B z G2 |', 'Gm'), scoreDescription: 'G, pausa, B bemol, D; B bemol, pausa e G por dois tempos. Mesmo ritmo do motivo de L03, dois semitons abaixo.',
    chord: gmChord, maps: { example: gmMap, practice: gmMap },
    phrase: { beats: 8, notes: [{ position: gTonic, beat: 0, duration: 1 }, { position: bb, beat: 2, duration: 1 }, { position: dGm, beat: 3, duration: 1 }, { position: bb, beat: 4, duration: 1 }, { position: gTonic, beat: 6, duration: 2 }] },
    responseAfterBeats: 8,
    responseInstruction: 'Responda e termine em G.',
  },
  {
    id: 'l09', ref: identity('l09'), revision: 1, number: 'L09', title: 'Uma cor a mais no acorde', href: '/lesson/l09/',
    instruction: 'Am tem A, C e E. Am7 acrescenta G. Escute a mesma frase terminando em G: primeiro sobre Am, depois sobre Am7. Na prática, repita uma ideia nos dois acompanhamentos e compare o efeito dessa chegada.',
    degreeExplanation: 'Em relação ao A, G é [[degree:♭7]]: a sétima menor. Am usa [[degree:1]]–[[degree:♭3]]–[[degree:5]]; Am7 usa [[degree:1]]–[[degree:♭3]]–[[degree:5]]–[[degree:♭7]]. O G já estava na pentatônica: não aprendemos uma nota nova, mudamos o acorde. A tônica continua sendo A, mesmo quando o alvo da frase é G. O [[degree:7]] de Am7 indica a sétima menor acrescentada à tríade menor.',
    practiceInstruction: 'Toque uma frase curta terminando em G, na 2ª corda, casa 8. Repita sobre Am e Am7, dois compassos de cada, e escute a diferença. Deixe uma pausa.',
    exampleInstruction: 'Escute a mesma chegada ao G: dois compassos sobre Am, depois dois sobre Am7.',
    reflection: 'Repeti uma frase sobre Am e Am7 e comparei a chegada ao G. A execução é avaliada por você.',
    check: { question: 'Qual nota é acrescentada a Am para formar Am7?', choices: ['F', 'G', 'B'], answer: 1, explanation: 'G é a sétima menor, [[degree:♭7]], em relação ao A. Am7 contém A, C, E e G; a tônica permanece A.', practice: 'Consegui ouvir a chegada ao G nos dois acordes.' },
    score: score('"Am"A z G2 | z4 |\n"Am7"A z G2 | z4 |'), scoreDescription: 'A, pausa, G por dois tempos e um compasso de pausa sobre Am; a mesma frase se repete sobre Am7.',
    chord, maps: { example: amTargetMap, practice: amTargetMap },
    harmony: [{ beat: 0, chord, map: amTargetMap }, { beat: 8, chord: am7Chord, map: am7TargetMap }],
    phrase: { beats: 16, notes: [{ position: a, beat: 0, duration: 1 }, { position: g, beat: 2, duration: 2 }, { position: a, beat: 8, duration: 1 }, { position: g, beat: 10, duration: 2 }] },
  },
  {
    id: 'l10', ref: identity('l10'), revision: 1, number: 'L10', title: 'Acompanhe dois acordes', href: '/lesson/l10/',
    instruction: 'Am7 e Dm7 alternam a cada dois compassos. A e C pertencem aos dois acordes: use essas notas para atravessar a mudança. Depois experimente F (2ª corda, casa 6) somente sobre Dm7, como uma nova chegada.',
    degreeExplanation: 'Am7 tem A, C, E e G; Dm7 tem D, F, A e C. A e C são notas comuns. O centro do mapa permanece A: seus graus não mudam com cada acorde. F é [[degree:♭6]] em relação a A e [[degree:♭3]] em relação a D, a terça menor de Dm7. Ele está fora da pentatônica de Am e aparece como nota contextual, não como parte da escala.',
    practiceInstruction: 'Crie uma frase e chegue a A ou C na mudança de acorde. Se quiser, experimente F quando entrar Dm7. Inclua pausas; F não é obrigatório.',
    exampleInstruction: 'A frase passa por A e C nos dois acordes; F aparece apenas no trecho de Dm7.',
    reflection: 'Percebi a troca e usei A ou C para conectar as frases. A execução é avaliada por você.',
    check: { question: 'Quais notas pertencem tanto a Am7 quanto a Dm7?', choices: ['E e G', 'A e C', 'F e B'], answer: 1, explanation: 'A e C são notas comuns aos dois acordes. F pertence a Dm7 e está fora da pentatônica menor de A.', practice: 'Consegui acompanhar a mudança usando uma nota comum.' },
    score: score('"Am7"A z c2 | E z A2 |\n"Dm7"A z c2 | F z A2 |'), scoreDescription: 'A, pausa, C sustentado; E, pausa, A sobre Am7. A, pausa, C sustentado; F, pausa, A sobre Dm7.',
    chord: am7Chord, maps: { example: sharedMaps.am, practice: sharedMaps.am },
    harmony: [{ beat: 0, chord: am7Chord, map: sharedMaps.am }, { beat: 8, chord: dm7Chord, map: sharedMaps.dm }],
    phrase: { beats: 16, notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 2, duration: 2 }, { position: e, beat: 4, duration: 1 }, { position: a, beat: 6, duration: 2 }, { position: a, beat: 8, duration: 1 }, { position: c, beat: 10, duration: 2 }, { position: f, beat: 12, duration: 1 }, { position: a, beat: 14, duration: 2 }] },
  },
  {
    id: 'l11', ref: identity('l11'), revision: 1, number: 'L11', title: 'Mesmas notas, outro centro', href: '/lesson/l11/',
    instruction: 'As pentatônicas de A menor e C maior compartilham as mesmas notas. Ouça dois compassos sobre Am7, terminando em A, e dois sobre C, terminando em C. Na prática, mantenha o pequeno mapa e mude a chegada conforme o acompanhamento.',
    degreeExplanation: 'As notas A, C, D, E e G formam duas escalas relativas. Com A como centro, os graus são [[degree:1]]–[[degree:♭3]]–[[degree:4]]–[[degree:5]]–[[degree:♭7]]. Com C como centro: C = [[degree:1]], D = [[degree:2]], E = [[degree:3]], G = [[degree:5]] e A = [[degree:6]]. As posições e alturas permanecem; acompanhamento, referência e final da frase ajudam a ouvir o novo centro. Começar uma sequência em C, sozinho, não garante essa mudança.',
    practiceInstruction: 'Sobre Am7, faça uma frase chegando ao A. Sobre C, chegue ao C. Use as mesmas notas, deixe espaço e ouça a diferença entre os dois trechos.',
    exampleInstruction: 'Observe o aro mudar de A para C com o acompanhamento. O mapa mantém as mesmas posições.',
    reflection: 'Usei as mesmas notas e escolhi uma chegada para cada centro. A execução é avaliada por você.',
    check: { question: 'O que muda entre essas duas pentatônicas relativas?', choices: ['Todas as posições do braço', 'O centro e os graus das notas', 'O número de notas da escala'], answer: 1, explanation: 'As alturas são compartilhadas. A ou C como referência muda os graus e a intenção da frase, apoiada pelo acompanhamento.', practice: 'Consegui ouvir A e C como referências nos dois trechos.' },
    score: score('"Am7"A z c E | A2 z2 |\n"C"c z A E | c2 z2 |', 'C'), scoreDescription: 'A, pausa, C, E; A sustentado sobre Am7. C, pausa, A, E; C sustentado sobre C.',
    chord: am7Chord, maps: { example: relativeAmMap, practice: relativeAmMap },
    harmony: [{ beat: 0, chord: am7Chord, map: relativeAmMap }, { beat: 8, chord: cChord, map: relativeCMap }],
    phrase: { beats: 16, notes: [{ position: a, beat: 0, duration: 1 }, { position: c, beat: 2, duration: 1 }, { position: e, beat: 3, duration: 1 }, { position: a, beat: 4, duration: 2 }, { position: c, beat: 8, duration: 1 }, { position: a, beat: 10, duration: 1 }, { position: e, beat: 11, duration: 1 }, { position: c, beat: 12, duration: 2 }] },
  },
  {
    id: 'l12', ref: identity('l12'), revision: 1, number: 'L12', title: 'Mini jam e retomada', href: '/lesson/l12/',
    instruction: 'Reúna o que praticou: motivo, pausa, chegada e conexão de posições. Sobre Am7 e Dm7, dois compassos de cada, escolha uma ideia pequena e repita com uma variação. Use A ou C como chegada; F sobre Dm7 e a conexão com a casa 10 são opções.',
    degreeExplanation: 'O mapa mantém a pentatônica de Am: [[degree:1]]–[[degree:♭3]]–[[degree:4]]–[[degree:5]]–[[degree:♭7]]. A e C conectam Am7 e Dm7 por serem notas comuns. F só aparece sobre Dm7 como nota contextual: [[degree:♭6]] em relação ao centro A e terça menor do acorde Dm7. Não é preciso usar todas as notas ou todas as posições para criar uma frase.',
    practiceInstruction: 'Crie sua mini jam em blocos de 16 compassos. Repita uma ideia, varie uma parte e deixe pausas. Se um trecho ficar difícil, pare, reduza o BPM e repita.',
    exampleInstruction: 'Ouça 16 compassos com motivos, pausas e conexões. O exemplo usa F uma vez sobre Dm7; na sua jam ele é opcional.',
    reflection: 'Repeti uma ideia, deixei pausas e escolhi chegadas acompanhando os acordes. Posso repetir o trecho que quero desenvolver. A execução é avaliada por você.',
    check: { question: 'Qual estratégia ajuda a construir uma mini jam?', choices: ['Usar todas as notas sem pausas', 'Tocar mais rápido a cada compasso', 'Repetir uma ideia, variar e escolher chegadas'], answer: 2, explanation: 'Uma ideia reconhecível, com variação, espaço e chegada, já forma um improviso. Não é preciso usar o mapa inteiro.', practice: 'Consegui construir uma jam com motivo, pausa e chegada.' },
    score: score(jamSections.map((section, index) => `"${index % 2 === 0 ? 'Am7' : 'Dm7'}"${section.body}`).join('\n')),
    wideScore: score(jamSections.map((section, index) => `"${index % 2 === 0 ? 'Am7' : 'Dm7'}"${section.body}${index % 2 === 1 ? '\n' : ' '}`).join('')),
    scoreDescription: 'Mini jam autoral de 16 compassos, alternando Am7 e Dm7 a cada dois compassos, com motivos, pausas, conexão de posições e um F sobre Dm7.',
    chord: am7Chord, maps: { example: jamMaps.am, practice: jamMaps.am },
    harmony: jamSections.map((_, index) => ({ beat: index * 8, chord: index % 2 === 0 ? am7Chord : dm7Chord, map: index % 2 === 0 ? jamMaps.am : jamMaps.dm })),
    phrase: { beats: 64, notes: jamSections.flatMap((section, index) => section.notes.map(note => ({ ...note, beat: note.beat + index * 8 }))) },
  },
];
export function getLesson(id: LessonContent['id']): LessonContent {
  const lesson = lessons.find(item => item.id === id);
  if (!lesson) throw new Error('Lição desconhecida.');
  return lesson;
}
