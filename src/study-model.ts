import type { Locale } from './locale';
export type StudyPosition = { stringId:string; fret:number; midi:number };
export type StudyBend = {stringId:string;fret:number;targetMidi:number};
export type StudyVisual =
  | { kind:'table'; columns:string[]; rows:string[][]; caption:string }
  | { kind:'image'; src:string; alt:string; caption:string }
  | { kind:'interval'; root:number; distances:number[]; initial:number; spelling?:'sharp'|'flat'; showName?:boolean; caption?:string }
  | { kind:'degrees' }
  | { kind:'collection'; notes:number[]; degrees:string[]; caption:string }
  | { kind:'path'; notes:number[]; caption:string; spelling?:'sharp'|'flat'; compact?:boolean;showCaption?:boolean }
  | { kind:'alternation'; notes:[number,number]; caption:string; spelling?:'sharp'|'flat';intervalLabel?:string;showCaption?:boolean }
  | { kind:'positions'; positions:StudyPosition[]; startFret:number; endFret:number; spelling?:'sharp'|'flat'; caption:string;rootMidi?:number;showDirection?:boolean;context?:'chord'|'comparison';bend?:StudyBend;bends?:StudyBend[];annotations?:{stringId:string;fret:number;label:string}[];additionalPositions?:StudyPosition[] }
  | { kind:'fretboard-intervals'; root:StudyPosition;targets:StudyPosition[];startFret:number;endFret:number;context?:'comparison';towardRoot?:boolean }
  | { kind:'scale'; positions:StudyPosition[]; startFret:number; endFret:number; root:number; caption:string; spelling?:'sharp'|'flat'; phrasePositions?:StudyPosition[];additionalPositions?:StudyPosition[];chordPositions?:StudyPosition[];chordTones?:number[];degreeAnnotations?:boolean }
  | { kind:'scale-overlay'; layers:[{label:string;root:number;positions:StudyPosition[]},{label:string;root:number;positions:StudyPosition[]}];startFret:number;endFret:number;caption:string;spelling?:'sharp'|'flat';initialLayer?:'first'|'second'|'both' }
  | { kind:'chord'; notes:number[]; roles:string[]; caption:string };
export type StudyPage = {
  title:string; paragraphs:string[]; visual:StudyVisual;
  hideTitle?:boolean;
  /** Insert the visual after this many paragraphs; otherwise it follows the prose. */
  visualAfterParagraph?:number;
  additionalVisuals?:{afterParagraph:number;visual:StudyVisual}[];
  insight?:{afterParagraph:number;afterPractice?:boolean;title:string;text:string;link?:{label:string;href:string}};
  highlightPractice?:boolean;
  practice:string; question:string; answer:string;
};
export type StudyBook = { lessonId:string; title:string; introduction:string; pages:StudyPage[] };
export type StudyGuide = { id?:string;title:string; lessons:StudyBook[] };
const names=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const flats=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
export function studyDegree(midi:number,root:number):string{
  return ['1','♭2','2','♭3','3','4','♭5','5','♭6','6','♭7','7'][((midi-root)%12+12)%12]!;
}
export function studyNote(midi:number,spelling:'sharp'|'flat'='sharp',_locale:Locale='en'):string{
  return (spelling==='flat'?flats:names)[((midi%12)+12)%12]!;
}
export function intervalName(semitones:number,locale:Locale='en'):string{
  if(locale==='en')return ({0:'same pitch',1:'minor second',2:'major second',3:'minor third',4:'major third',5:'perfect fourth',6:'tritone · lowered fifth',7:'perfect fifth',8:'minor sixth',9:'major sixth',10:'minor seventh',11:'major seventh',12:'octave',14:'major ninth',15:'augmented ninth in this chord'} as Record<number,string>)[semitones]??`${semitones} semitones`;
  const intervals:Record<number,string>={0:'mesma altura',1:'segunda menor',2:'segunda maior',3:'terça menor',4:'terça maior',5:'quarta justa',6:'trítono · quinta abaixada',7:'quinta justa',8:'sexta menor',9:'sexta maior',10:'sétima menor',11:'sétima maior',12:'oitava',14:'nona maior',15:'nona aumentada neste acorde'};
  return intervals[semitones]??`${semitones} semitons`;
}
export function referenceRelation(reference:'e'|'a'){
  return reference==='e'
    ? {root:40,target:47,degree:'5',name:'quinta',distance:7}
    : {root:45,target:47,degree:'2',name:'segunda',distance:2};
}
export function soundOfVisual(visual:StudyVisual):number[]{
  if(visual.kind==='image'||visual.kind==='table')return [];
  if(visual.kind==='interval')return [visual.root,visual.root+visual.initial];
  if(visual.kind==='degrees')return [40,47];
  if(visual.kind==='scale'||visual.kind==='positions')return [...visual.positions,...visual.additionalPositions??[]].map(position=>position.midi);
  if(visual.kind==='scale-overlay')return [...new Map(visual.layers.flatMap(layer=>layer.positions).map(position=>[`${position.stringId}:${position.fret}`,position.midi])).values()];
  if(visual.kind==='fretboard-intervals')return [visual.root.midi,...visual.targets.map(position=>position.midi)];
  return visual.notes;
}
