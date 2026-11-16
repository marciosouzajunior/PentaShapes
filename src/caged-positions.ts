import { midiPitch, type SongPosition, type StudyMap } from './song-content';

export const position=(stringId:string,fret:number):SongPosition=>({stringId,fret,midi:midiPitch({stringId,fret})});
const strings=['e_low','a','d','g','b','e_high'];
const shape=(frets:number[][])=>strings.flatMap((s,i)=>frets[i]!.map(f=>position(s,f)));
const grip=(frets:(number|null)[])=>strings.flatMap((s,i)=>frets[i]===null?[]:[position(s,frets[i]!)]);
export type ChordRegion={id:string;chord:string;form:string;tonic:number;startFret:number;endFret:number;root:SongPosition;chordPositions:SongPosition[];chordTones:number[];positions:SongPosition[];phrase:SongPosition[]};

/** Authored reference voicings, not a transcription of the teachers' grips or box numbers. */
export const amRegions:ChordRegion[]=[
  {id:'g',chord:'Am7',form:'Sol menor',tonic:9,startFret:2,endFret:5,root:position('e_low',5),chordPositions:grip([5,null,5,5,5,5]),chordTones:[9,0,4,7],positions:shape([[3,5],[3,5],[2,5],[2,5],[3,5],[3,5]]),phrase:[position('g',5),position('b',5),position('e_high',5)]},
  {id:'e',chord:'Am',form:'Mi menor',tonic:9,startFret:5,endFret:8,root:position('e_low',5),chordPositions:grip([5,7,7,5,5,5]),chordTones:[9,0,4],positions:shape([[5,8],[5,7],[5,7],[5,7],[5,8],[5,8]]),phrase:[position('g',5),position('b',5),position('e_high',5)]},
  {id:'d',chord:'Am',form:'Ré menor',tonic:9,startFret:7,endFret:10,root:position('d',7),chordPositions:grip([null,null,7,9,10,8]),chordTones:[9,0,4],positions:shape([[8,10],[7,10],[7,10],[7,9],[8,10],[8,10]]),phrase:[position('d',10),position('g',9),position('b',10)]},
  {id:'c',chord:'Am',form:'Dó menor',tonic:9,startFret:9,endFret:13,root:position('a',12),chordPositions:grip([null,12,10,9,10,12]),chordTones:[9,0,4],positions:shape([[10,12],[10,12],[10,12],[9,12],[10,13],[10,12]]),phrase:[position('d',10),position('g',9),position('b',10)]},
  {id:'a',chord:'Am',form:'Lá menor',tonic:9,startFret:12,endFret:15,root:position('a',12),chordPositions:grip([null,12,14,14,13,12]),chordTones:[9,0,4],positions:shape([[12,15],[12,15],[12,14],[12,14],[13,15],[12,15]]),phrase:[position('d',14),position('b',13),position('g',14)]},
];
export const amRegion=amRegions[1]!;
export const amNeighborRegion=amRegions[2]!;
export function transposeRegion(region:ChordRegion,semitones:number,id:string,chord:string):ChordRegion{
  const move=(p:SongPosition)=>position(p.stringId,p.fret+semitones);
  return {...region,id,chord,tonic:(region.tonic+semitones+12)%12,startFret:region.startFret+semitones,endFret:region.endFret+semitones,root:move(region.root),chordPositions:region.chordPositions.map(move),chordTones:region.chordTones.map(pc=>(pc+semitones+12)%12),positions:region.positions.map(move),phrase:region.phrase.map(move)};
}
export const bmRegion=transposeRegion(amRegion,2,'bm-e','Bm');
// Dm in the A-minor form, five frets below the Am reference of that form.
export const dmRegion=transposeRegion(amRegions[4]!,-7,'dm-a','Dm');
export function regionMap(region:ChordRegion,chordOnly=false):StudyMap{
  return {tonic:region.tonic,scaleId:'minorPentatonic',positions:chordOnly?region.chordPositions:region.positions,chordTones:region.chordTones,chordPositions:region.chordPositions,reference:{name:`${region.chord} · forma de ${region.form}`,root:region.root}};
}
