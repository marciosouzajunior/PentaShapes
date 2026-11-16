import type { BackingNote } from './song-content';

/** Short electric-keyboard chords; rhythmic marking belongs to the optional metronome. */
export function softPopBacking(tonic:number,beats:number):BackingNote[]{
  const root=24+tonic;
  const events:BackingNote[]=[];
  const add=(instrument:NonNullable<BackingNote['instrument']>,midi:number,beat:number,duration:number,velocity:number)=>{
    if(beat<beats)events.push({instrument,midi,beat,duration:Math.min(duration,beats-beat),velocity});
  };
  for(let bar=0;bar*4<beats;bar++){
    const start=bar*4;
    // The keyboard includes the root; there is no separate bass part.
    if(bar%2===0)[24,27,31,34].forEach((interval,i)=>add('electric-piano',root+interval,start,2.5,.58-i*.035));
  }
  return events.sort((a,b)=>a.beat-b.beat);
}
