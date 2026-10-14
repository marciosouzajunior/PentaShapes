export type StudyPosition = { stringId:string; fret:number; midi:number };
export type StudyVisual =
  | { kind:'interval'; root:number; distances:number[]; initial:number; spelling?:'sharp'|'flat'; showName?:boolean; caption?:string }
  | { kind:'degrees' }
  | { kind:'collection'; notes:number[]; degrees:string[]; caption:string }
  | { kind:'path'; notes:number[]; caption:string; spelling?:'sharp'|'flat'; compact?:boolean;showCaption?:boolean }
  | { kind:'alternation'; notes:[number,number]; caption:string; spelling?:'sharp'|'flat';intervalLabel?:string;showCaption?:boolean }
  | { kind:'positions'; positions:StudyPosition[]; startFret:number; endFret:number; spelling?:'sharp'|'flat'; caption:string;rootMidi?:number;showDirection?:boolean;context?:'chord'|'comparison' }
  | { kind:'fretboard-intervals'; root:StudyPosition;targets:StudyPosition[];startFret:number;endFret:number;context?:'comparison';towardRoot?:boolean }
  | { kind:'scale'; positions:StudyPosition[]; startFret:number; endFret:number; root:number; caption:string }
  | { kind:'chord'; notes:number[]; roles:string[]; caption:string };
export type StudyPage = {
  title:string; paragraphs:string[]; visual:StudyVisual;
  practice:string; question:string; answer:string;
};
export type StudyBook = { lessonId:string; title:string; introduction:string; pages:StudyPage[] };
export type StudyGuide = { id?:string;title:string; lessons:StudyBook[] };
const names=['Dó','Dó♯','Ré','Ré♯','Mi','Fá','Fá♯','Sol','Sol♯','Lá','Lá♯','Si'];
const flats=['Dó','Ré♭','Ré','Mi♭','Mi','Fá','Sol♭','Sol','Lá♭','Lá','Si♭','Si'];
export function studyNote(midi:number,spelling:'sharp'|'flat'='sharp'):string{
  return (spelling==='flat'?flats:names)[((midi%12)+12)%12]!;
}
export function intervalName(semitones:number):string{
  const intervals:Record<number,string>={0:'mesma altura',1:'segunda menor',2:'segunda maior',3:'terça menor',4:'terça maior',5:'quarta justa',6:'trítono · quinta abaixada',7:'quinta justa',8:'sexta menor',9:'sexta maior',10:'sétima menor',11:'sétima maior',12:'oitava',14:'nona maior',15:'nona aumentada neste acorde'};
  return intervals[semitones]??`${semitones} semitons`;
}
export function referenceRelation(reference:'e'|'a'){
  return reference==='e'
    ? {root:40,target:47,degree:'5',name:'quinta',distance:7}
    : {root:45,target:47,degree:'2',name:'segunda',distance:2};
}
export function soundOfVisual(visual:StudyVisual):number[]{
  if(visual.kind==='interval')return [visual.root,visual.root+visual.initial];
  if(visual.kind==='degrees')return [40,47];
  if(visual.kind==='positions'||visual.kind==='scale')return visual.positions.map(position=>position.midi);
  if(visual.kind==='fretboard-intervals')return [visual.root.midi,...visual.targets.map(position=>position.midi)];
  return visual.notes;
}
