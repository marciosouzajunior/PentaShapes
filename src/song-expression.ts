import type {SongNote} from './song-content';

export function pitchAt(note:SongNote,elapsed:number):number{
  const points=note.pitchCurve;
  if(!points?.length)return note.midi;
  if(elapsed<=points[0]!.beat)return points[0]!.midi;
  for(let i=1;i<points.length;i++){
    const before=points[i-1]!,after=points[i]!;
    if(elapsed<=after.beat)return before.midi+(after.midi-before.midi)*(elapsed-before.beat)/(after.beat-before.beat);
  }
  return points.at(-1)!.midi;
}

/** Rebase the expression when playback resumes inside a note or ends at a card boundary. */
export function pitchAutomation(note:SongNote,elapsed:number,duration:number,secondsPerBeat:number):{offset:number;midi:number}[]{
  if(!note.pitchCurve?.length)return [];
  return [{offset:0,midi:pitchAt(note,elapsed)},...note.pitchCurve.filter(point=>point.beat>elapsed&&point.beat<elapsed+duration).map(point=>({offset:(point.beat-elapsed)*secondsPerBeat,midi:point.midi})),{offset:duration*secondsPerBeat,midi:pitchAt(note,elapsed+duration)}];
}
