import {studyNote} from './study-model';
import './piano-diagram.css';

export type PianoDiagramOptions={
  from:number;to:number;startMidi?:number;endMidi?:number;
  spelling?:'sharp'|'flat';label?:string;selectedNotes?:number[];
};
export type PianoKey={midi:number;black:boolean;x:number;width:number;role:'start'|'end'|'path'|'selected'|'context'};
const blackNotes=new Set([1,3,6,8,10]);
const escape=(value:string)=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const letters=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const flats=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];

/** MIDI heights keep repeated note names in different octaves distinct. */
export function pianoLayout(options:PianoDiagramOptions):{keys:PianoKey[];width:number}{
  const low=Math.min(options.from,options.to),high=Math.max(options.from,options.to);
  let start=options.startMidi??Math.floor(low/12)*12;
  let end=options.endMidi??Math.floor(high/12)*12+11;
  if(![options.from,options.to,start,end].every(midi=>Number.isInteger(midi)&&midi>=0&&midi<=127)||start>low||end<high)throw new RangeError('Invalid piano range');
  if(blackNotes.has(start%12))start--;
  if(blackNotes.has(end%12))end++;
  const selected=options.selectedNotes?new Set(options.selectedNotes):null;
  if(selected&&[...selected].some(midi=>!Number.isInteger(midi)||midi<start||midi>end))throw new RangeError('Selected note outside piano range');
  let whites=0;
  const keys:PianoKey[]=[];
  for(let midi=start;midi<=end;midi++){
    const black=blackNotes.has(midi%12);
    const role=selected&&!selected.has(midi)?'context':midi===options.from?'start':midi===options.to?'end':selected?'selected':midi>low&&midi<high?'path':'context';
    keys.push({midi,black,x:black?whites*48-15:whites*48,width:black?30:48,role});
    if(!black)whites++;
  }
  return {keys,width:whites*48};
}

/** Static, accessible diagram: no audio, focus targets or exercise controls. */
export function pianoDiagram(options:PianoDiagramOptions):string{
  const {keys,width}=pianoLayout(options),spelling=options.spelling??'sharp';
  const noteNames=spelling==='flat'?flats:letters;
  const distance=Math.abs(options.to-options.from);
  const label=options.label??(options.selectedNotes?`Notas destacadas: ${options.selectedNotes.map(midi=>studyNote(midi,spelling)).join(', ')}.`:`${studyNote(options.from,spelling)} → ${studyNote(options.to,spelling)}: ${distance} ${distance===1?'semitom':'semitons'}.`);
  const description=keys.map(key=>`${studyNote(key.midi,spelling)}, oitava ${Math.floor(key.midi/12)-1}${options.selectedNotes?(key.role!=='context'?', destacada':''):key.role==='start'?', partida':key.role==='end'?', chegada':''}`).join('; ');
  const keyMarkup=(key:PianoKey)=>{
    const height=key.black?90:144;
    const right=key.x+key.width,bottom=height+1;
    const shape=`<path d="M${key.x} 1H${right}V${bottom-2}Q${right} ${bottom} ${right-2} ${bottom}H${key.x+2}Q${key.x} ${bottom} ${key.x} ${bottom-2}Z"/>`;
    return `<g class="piano-key ${key.black?'piano-black':'piano-white'} piano-${key.role}" data-midi="${key.midi}">${shape}<text x="${key.x+key.width/2}" y="${height-15}">${noteNames[key.midi%12]}</text></g>`;
  };
  return `<div class="piano-diagram"><svg viewBox="0 0 ${width} 147" style="--piano-min-width:${width>384?480:280}px" role="img" aria-label="${escape(label+' '+description)}">${keys.filter(key=>!key.black).map(keyMarkup).join('')}${keys.filter(key=>key.black).map(keyMarkup).join('')}</svg></div>`;
}
