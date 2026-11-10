type PracticeCue={beat:number;label:string};
type RoundCue=PracticeCue&{phase:'listen'|'answer'|'along'};

export function missionRound(exampleBeats:number,cues?:PracticeCue[]):{beats:number;responseBeat:number|null;measures:RoundCue[]}{
  if(cues)return {beats:exampleBeats,responseBeat:null,measures:cues.map(cue=>({...cue,phase:'along'}))};
  const measureCount=Math.ceil(exampleBeats/4);
  const responseBeat=measureCount*4;
  const beats=responseBeat*2;
  const measures=Array.from({length:measureCount*2},(_,i):RoundCue=>({beat:i*4,label:i<measureCount?'Ouça':'Toque',phase:i<measureCount?'listen':'answer'}));
  return {beats,responseBeat,measures};
}

/** Keep the count-in before zero; wrap only the repeating round. */
export function beatInMission(beat:number,roundBeats:number,repeating:boolean):number{
  return repeating&&beat>=roundBeats?beat%roundBeats:beat;
}
