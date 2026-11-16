import { ui, type Locale } from './locale';
type PracticeCue={beat:number;label:string;group?:string};
export const phaseText={along:'Play along',answer:'Your response',chord:'Chord',scale:'Scale',motif:'Motif'} as const;
export type PhaseKind=keyof typeof phaseText;
export function phaseKind(label:string):PhaseKind|undefined {
  return (Object.keys(phaseText) as PhaseKind[]).find(kind=>phaseText[kind]===label||ui('pt-BR',phaseText[kind])===label);
}
export function phaseCueAt(cues:{beat:number;label:string;kind?:PhaseKind}[]|undefined,beat:number){
  const cue=cues?.slice().reverse().find(cue=>cue.beat<=beat);
  return cue?{...cue,kind:cue.kind??phaseKind(cue.label)}:undefined;
}
type RoundCue=PracticeCue&{phase:'listen'|'answer'|'along'};

export function missionPracticeBeats(planBeats:number,practiceMode:'along'|undefined,exampleBeats?:number,practiceBeats?:number):number{
  return practiceBeats??(practiceMode==='along'?planBeats:exampleBeats??planBeats);
}

export function missionRound(exampleBeats:number,cues?:PracticeCue[],locale:Locale='en'):{beats:number;responseBeat:number|null;measures:RoundCue[]}{
  if(cues)return {beats:exampleBeats,responseBeat:null,measures:cues.map(cue=>({...cue,phase:'along'}))};
  const measureCount=Math.ceil(exampleBeats/4);
  const responseBeat=measureCount*4;
  const beats=responseBeat*2;
  const measures=Array.from({length:measureCount*2},(_,i):RoundCue=>({beat:i*4,label:ui(locale,i<measureCount?'Listen':'turn.play'),phase:i<measureCount?'listen':'answer'}));
  return {beats,responseBeat,measures};
}

/** Returns the current internal practice phase without adding cells to the route grid. */
export function phaseLabelAt(cues:{beat:number;label:string}[]|undefined,beat:number):string|undefined{
  if(!cues?.length||beat<0)return undefined;
  for(let index=cues.length-1;index>=0;index--)if(cues[index]!.beat<=beat)return cues[index]!.label;
  return undefined;
}

/** Reveal the next board during the final beat without advancing the musical block early. */
export function boardTransitionProgress(localBeat:number,duration:number,transitionBeats=1):number{
  if(duration<=0||transitionBeats<=0)return 0;
  const start=Math.max(0,duration-transitionBeats);
  return Math.max(0,Math.min(1,(localBeat-start)/Math.min(duration,transitionBeats)));
}

/** Keep the count-in before zero; wrap only the repeating round. */
export function beatInMission(beat:number,roundBeats:number,repeating:boolean):number{
  return repeating&&beat>=roundBeats?beat%roundBeats:beat;
}
