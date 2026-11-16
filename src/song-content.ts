import type { LessonRef } from './content-identity';
import type { PhaseKind } from './song-missions';
import data from './data/purple-haze.json';

export const songStrings = [
  { id: 'e_high', label: '1ª · E', midi: 64 },
  { id: 'b', label: '2ª · B', midi: 59 },
  { id: 'g', label: '3ª · G', midi: 55 },
  { id: 'd', label: '4ª · D', midi: 50 },
  { id: 'a', label: '5ª · A', midi: 45 },
  { id: 'e_low', label: '6ª · E', midi: 40 },
] as const;
export type SongNote = { stringId: string; fret: number; midi: number; beat: number; duration: number; sourceTicks: number;technique?:{kind:string;semitones?:number};pitchCurve?:{beat:number;midi:number}[] };
export type BackingNote = { midi:number; beat:number; duration:number; instrument?:'clean-guitar'|'piano'|'finger-bass'|'drum-kit'|'electric-piano'; velocity?:number };
export type StudyMap = {tonic:number; positions:SongPosition[]; chordTones:number[]; scaleId:string; spelling?:'sharp'|'flat'; degreeLabels?:Partial<Record<number,string>>; chordPositions?:SongPosition[]; reference?:{name:string;root:SongPosition}};
export type StudyBlock = { id: string; cardId?:string; title: string; startBeat: number; endBeat: number; startFret: number; endFret: number; notes: SongNote[]; backing?:BackingNote[]; backingGain?:number; map?:StudyMap; responseBeat?:number; cues?:{beat:number;label:string;group?:string}[]; phaseCues?:{beat:number;label:string;kind?:PhaseKind}[] };
export type SongPosition = {stringId:string;fret:number;midi:number};
export type SongMission = {
  playInstruction?:string;
  practiceLabel:string;
  practiceMode?:'along';
  /** A short audition can precede a much longer practice round. */
  exampleBeats?:number;
  /** Duration of the repeating practice round when it differs from the short audition. */
  practiceBeats?:number;
  hidePreparationExample?:boolean;
  metronomeByDefault?:boolean;
  hideTurnLabel?:boolean;
  hideBoardTitle?:boolean;
  scene:{title:string;text:string;followup?:string;prompt?:string;illustration?:{src:string;alt:string;size?:{width:number;height:number}}};
};
export type SongLesson = { id: string; ref: LessonRef; href: string; title: string; navTitle:string; instruction: string; explanation?: string[]; blocks: string[]; referenceBlocks?:string[]; repeatByDefault?:boolean; accompaniment?: boolean; singleCardTitle?: string; exploration?:SongPosition[]; additionalPositions?:SongPosition[]; mapTitle?:string; mapStyle?:'plain-degrees'; mission?:SongMission };
export const soloExplorationPositions:SongPosition[]=[
  {stringId:'e_low',fret:12,midi:52},{stringId:'e_low',fret:15,midi:55},
  {stringId:'a',fret:12,midi:57},{stringId:'a',fret:14,midi:59},
  {stringId:'d',fret:12,midi:62},{stringId:'d',fret:14,midi:64},
  {stringId:'g',fret:12,midi:67},{stringId:'g',fret:14,midi:69},
  {stringId:'b',fret:12,midi:71},{stringId:'b',fret:15,midi:74},
  {stringId:'e_high',fret:12,midi:76},{stringId:'e_high',fret:15,midi:79},
];
export const pilotSong = data;
export const studyBlocks: StudyBlock[] = data.blocks;
export const songLessons: SongLesson[] = [
  { id:'s01', title:'Ouça a abertura', navTitle:'Ouça a abertura', blocks:['intro-a','intro-b'], singleCardTitle:'A abertura em oitavas',
    instruction:'Alterne o B♭ grave e o agudo: a mesma nota em alturas diferentes. Perceba também o contraste desses sons com E, o ponto de apoio da música.',
    explanation:["Purple Haze tem o E como ponto de apoio: pense nele como o lugar para onde a música volta. O B♭ soa tenso contra esse E. Essa combinação ajuda a criar o som inquieto da abertura. O tom dá uma referência para ouvir as notas; as escolhas também criam contraste.","Os dois pontos do braço são o mesmo B♭, um grave e outro agudo. Essa distância recebe o nome de oitava. Ao alterná-los, você muda a altura sem mudar a identidade da nota. Encontre o B♭ grave na 6ª corda, casa 6, e o agudo na 4ª corda, casa 8.","A distância entre E e B♭ chama-se trítono. São seis semitons: cada semitom é um pequeno passo, como passar de uma casa para a seguinte na mesma corda. Em relação ao E, o B♭ é a quinta abaixada (♭5): a quinta de E é B, e B♭ fica um passo abaixo dela.","Comece pelo ouvido. Toque um E na 6ª corda solta e depois o B♭ na casa 6. Perceba o contraste. Em seguida, alterne os dois B♭ do mapa, devagar. Nesta lição, o áudio toca a parte da guitarra; na gravação, o baixo também sustenta a referência em E."] },
  { id:'s02', title:'Entenda o riff', navTitle:'Entenda o riff', blocks:["riff-a","riff-b"],
    instruction:'Ouça a subida B–D–G e a chegada em A, antes da resposta grave. Vamos perceber como essas notas se relacionam com E.',
    explanation:[
      'Um riff é uma frase curta que volta várias vezes e ajuda a reconhecer a música. Neste recorte, B–D–G sobe e chega a um A mais grave, que dura antes da resposta. Depois ouvimos G, D, E grave e a chegada em outro E. Ouça como a frase muda de altura e volta ao ponto de apoio da música.',
      'Por que essas notas combinam? E, G, A, B e D formam a pentatônica menor de E: uma coleção de cinco notas muito usada no blues e no rock. As notas deste riff pertencem a essa coleção. O nome dá uma referência para explorar o som, mas não obriga uma música a usar somente essas notas.',
      'O B tem uma relação de quinta com o E. Experimente tocar um E e depois um B: ouça como os dois se apoiam. O G é a terça menor de E, uma das notas que dão a cor menor a essa coleção. Para encontrar D, parta de um E e recue duas casas na mesma corda: D fica um tom abaixo. Em relação ao E, essa nota é a sétima menor (♭7).',
      'A primeira parte fica principalmente entre as casas 5 e 9. Essa posição aproxima as notas e facilita tocar a frase sem procurar cada altura em uma região diferente. A resposta usa notas mais graves e um E na 6ª corda solta. Uma mesma nota pode existir em vários lugares do braço; aqui, a posição ajuda a organizar o movimento.',
      'Comece com B–D–G–A. Toque devagar e deixe o A durar. Depois acrescente a resposta. A seta de slide indica deslizar pela mesma corda sem perder o contato; ↗¼ indica um bend leve, esticando a corda para elevar o som um quarto de tom. O exemplo foi revisto pela tablatura; o timbre e o vibrato da gravação não são reproduzidos.'
    ] },
  { id:'s02-variation', title:'Uma variação do riff', navTitle:'Variação do riff', blocks:['riff-variation'],
    instruction:'Ouça G e A ganharem movimento. O bend leva o A em direção a B; depois, a frase volta ao G.' },
  { id:'s05', title:'Acompanhe com acordes', navTitle:'Acordes da base', blocks:[], accompaniment:true,
    instruction:'Toque E7♯9 por quatro tempos, G por dois e A por dois. Vamos conhecer as notas desses acordes e ouvir como a base do verso volta ao E.',
    explanation:[
      'Um acorde reúne notas que soam juntas. Nesta base, seguimos E7♯9, G e A: um acorde de E com uma cor especial, G maior e A maior. Toque o E durante quatro tempos, o G durante dois e o A durante dois; depois volte ao E. Play toca esse caminho, e clicar em um card toca somente aquele acorde.',
      'No primeiro desenho, tocamos E, G♯, D e G. G♯ e G são notas diferentes, separadas por um semitom, mas aparecem em alturas diferentes nesse acorde. Ouça cada ponto e depois as notas juntas. Esse encontro ajuda a criar o som áspero associado ao acorde de Hendrix. Toque apenas as quatro cordas do meio nesse desenho.',
      'O G maior reúne G, B e D. Você já encontrou essas notas no riff; agora elas soam juntas como uma base. O A maior reúne A, C♯ e E. O C♯ também aparece no motivo do solo que vem a seguir. Perceber essas notas em comum ajuda a ligar as frases ao acompanhamento.',
      'O tom de E dá um ponto de apoio, mas não exige que todos os acordes sejam de E ou usem somente notas da escala menor. G e A trazem outros grupos de notas antes da volta ao E. Toque a sequência e deixe o último E durar: ouça o efeito desse retorno, sem precisar decorar os nomes das relações.',
      'Para entender o nome E7♯9, separe as ideias. G♯ é a terça maior de E, uma das notas que formam sua cor maior. D é a sétima menor. F♯ seria a segunda de E e, uma oitava acima, sua nona normal. O símbolo ♯9 pede essa nona um semitom mais alta: no instrumento, tocamos G. Por isso o braço mostra G♯ na 4ª corda, casa 6, e G na 2ª corda, casa 8. São dois sons distintos; não há um F♯ escondido no desenho.',
      'Comece pelas trocas, com um toque para baixo em cada tempo. No G, toque as seis cordas; no A, deixe a 6ª corda em silêncio. Esta é uma base simplificada do verso: a gravação tem outros acentos e variações, e estes três acordes não acompanham todas as partes do solo. Primeiro encontre o caminho entre eles; depois compare com a parte cantada da música.'
    ] },
  { id:'s03', title:'Explore um motivo do solo', navTitle:'Motivo do solo', blocks:["solo-a","solo-b"],
    instruction:'Ouça a ideia C♯–E–B e compare com a parte mais aguda. Vamos explorar a cor do C♯ em relação a E e distinguir mudar de posição de mudar a altura da nota.',
    explanation:[
      'Um motivo é uma pequena ideia musical que pode ser repetida ou transformada. Neste trecho que prepara a entrada do solo, C♯, E e B formam uma ideia curta; o B recebe um bend leve. A parte seguinte traz E e dois G em alturas diferentes, com outro bend no G agudo. Antes de juntar tudo, ouça cada parte separadamente.',
      'O E continua sendo nossa referência. O B é sua quinta, uma relação que você já ouviu no riff. Aqui, tocamos C♯ na 4ª corda, casa 11, e depois E na 3ª corda, casa 9: o som sobe uma terça menor. Para comparar, toque C na 4ª corda, casa 10, e chegue ao mesmo E; essa subida é uma terça maior. C é apenas uma comparação, enquanto C♯ faz parte do motivo e traz uma cor fora da pentatônica menor de E.',
      'O G, por sua vez, é a terça menor de E. O trecho coloca essa cor ao lado do C♯. Isso mostra que explorar uma música em E não significa ficar preso a uma única coleção de notas. As alturas podem trazer cores diferentes sem que o E deixe de ser nossa referência para ouvir o trecho.',
      'Na primeira parte, o E está na 3ª corda, casa 9. Na seguinte, outro E, da mesma altura, aparece na 4ª corda, casa 14. A troca de posição aproxima esse E das notas agudas que vêm depois. Já o G da 1ª corda, casa 15, é uma oitava acima do G da 3ª corda, casa 12: a mesma nota, em outra altura.',
      'Pratique primeiro a ideia curta. ↗¼ indica um bend leve: estique a corda para subir um quarto de tom, menos que a distância até a próxima casa. Ouça a pequena mudança no B e, no segundo card, no G agudo. A chegada por slide e os bends estão no áudio de estudo; o vibrato e o timbre da gravação ficam para sua exploração no instrumento.'
    ] },
  { id:'s04', title:'Explore seu próprio caminho', navTitle:'Explore as notas', blocks:['solo-explore'], exploration:soloExplorationPositions, additionalPositions:[{stringId:'e_high',fret:14,midi:78},{stringId:'b',fret:14,midi:73}], mapTitle:'Pentatônica menor de E',
    instruction:'Encontre a frase no shape da pentatônica menor de E e use os E destacados como referência. F♯ e C♯, em tracejado, são notas adicionais para experimentar na sua resposta.' },
].map(lesson => ({ ...lesson, href:`/track/purple-haze-por-dentro/${lesson.id}/`, ref:{ source:'system',trackId:'hendrix-purple-haze',lessonId:lesson.accompaniment?'s05-acordes':lesson.exploration?'s04-exploracao':lesson.id==='s02-variation'?'s02-variacao':lesson.id } }));

export function midiPitch(note: Pick<SongNote,'stringId'|'fret'>): number {
  const string = songStrings.find(string => string.id === note.stringId);
  if (!string || !Number.isInteger(note.fret) || note.fret < 0 || note.fret > 24) throw new RangeError('Posição inválida.');
  return string.midi + note.fret;
}
/** Possibilities belong to the map, never to the scheduled phrase. */
export function lessonMapPositions(lesson:SongLesson,block:StudyBlock){
  const key=(position:SongPosition)=>`${position.stringId}:${position.fret}`;
  const phrase=[...new Map(block.notes.map(({stringId,fret,midi})=>{const position={stringId,fret,midi};return [key(position),position] as const;})).values()];
  const played=new Set(phrase.map(key));
  const possibilities=(lesson.exploration??[]).filter(position=>!played.has(key(position)));
  return {phrase,possibilities,additional:lesson.additionalPositions??[]};
}
const names = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const flatNames = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
const degrees = ['1','♭2','2','♭3','3','4','♭5','5','♭6','6','♭7','7'];
export function noteLabel(midi: number, mode = 'name', spelling = 'sharp'): string {
  return mode === 'degree' ? degrees[(midi-4+120)%12]! : (spelling === 'flat' ? flatNames : names)[midi%12]!;
}
export function assembleBlocks(ids: string[], blocks: StudyBlock[] = studyBlocks) {
  if (!ids.length || new Set(ids).size !== ids.length) throw new RangeError('Escolha blocos diferentes.');
  let beats=0;
  const entries=ids.map(id => {
    const block=blocks.find(block => block.id===id);
    if(!block) throw new RangeError('Bloco desconhecido.');
    const entry={block,offset:beats};
    beats+=block.endBeat-block.startBeat;
    return entry;
  });
  return { entries, beats, notes:entries.flatMap(({block,offset}) => block.notes.map(note => ({...note,beat:offset+note.beat}))) };
}
export function blockIndexAt(plan: ReturnType<typeof assembleBlocks>, beat: number): number {
  let index=0; for(let i=0;i<plan.entries.length;i++) if(beat>=plan.entries[i]!.offset) index=i; return index;
}

/** A response can return to an existing static card without duplicating its diagram. */
export function studyCards(plan:ReturnType<typeof assembleBlocks>,references:StudyBlock[]=[]){
  const entries:(typeof plan.entries[number]&{entryIndex:number|null})[]=references.map(block=>({block,offset:0,entryIndex:null})),indices:number[]=[];
  const keys=new Map<string,number>();
  plan.entries.forEach((entry,entryIndex)=>{
    const key=entry.block.cardId??entry.block.id;
    let index=keys.get(key);
    if(index===undefined){index=entries.length;keys.set(key,index);entries.push({...entry,entryIndex});}
    indices.push(index);
  });
  return {entries,indices};
}

export function studyMapRoles(map:StudyMap){
  return map.positions.flatMap(position=>{
    const inGrip=map.chordPositions?.some(p=>p.stringId===position.stringId&&p.fret===position.fret);
    const inChord=map.chordTones.includes(position.midi%12);
    if(!inChord)return [];
    return [{...position,roles:[map.chordPositions?(inGrip?'chord':'target'):'chord']}];
  });
}

export function assembleLessonBlocks(lesson: SongLesson, blocks:StudyBlock[]=studyBlocks) {
  if(lesson.accompaniment&&!lesson.blocks.length)throw new RangeError('Use os acordes da base para esta lição.');
  const plan=assembleBlocks(lesson.blocks,blocks);
  if(!lesson.singleCardTitle)return plan;
  const notes=plan.notes;
  const first=plan.entries[0]!.block;
  const block:StudyBlock={
    id:`${first.id}-complete`,title:lesson.singleCardTitle,
    startBeat:first.startBeat,endBeat:first.startBeat+plan.beats,
    startFret:Math.min(...plan.entries.map(entry=>entry.block.startFret)),
    endFret:Math.max(...plan.entries.map(entry=>entry.block.endFret)),notes,
  };
  return {entries:[{block,offset:0}],beats:plan.beats,notes};
}
