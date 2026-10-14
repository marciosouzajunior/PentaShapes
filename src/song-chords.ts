import { assembleBlocks, type StudyBlock } from './song-content';

export type BaseChord = 'e' | 'g' | 'a';
const strings=['e_low','a','d','g','b','e_high'];
const tuning=[40,45,50,55,59,64];
export const chordSource={
  url:'https://www.guitarclub.io/blog/purple-haze-jimi-hendrix-guitar-lesson-chords-solo',
  scope:'Verse harmony: E7#9 for four beats, G and A for two beats each. Open G/A voicings and even strums are a study simplification, not the MIDI or the original performance.',
};
export function accompanimentChord(id:BaseChord):StudyBlock{
  const frets=id==='e'?[null,7,6,7,8,null]:id==='g'?[3,2,0,0,0,3]:[null,0,2,2,2,0];
  const beats=id==='e'?4:2;
  const title=id==='e'?'E7♯9 · Mi com sétima e nona aumentada':id==='g'?'G · Sol maior':'A · Lá maior';
  const positions=frets.flatMap((fret,i)=>fret===null?[]:[{stringId:strings[i]!,fret,midi:tuning[i]!+fret}]);
  return {id:'chord-'+id,title,startBeat:0,endBeat:beats,startFret:id==='e'?5:0,endFret:id==='e'?8:4,
    notes:Array.from({length:beats},(_,beat)=>positions.map(position=>({...position,beat,duration:.8,sourceTicks:-1}))).flat()};
}
export function chordStringsHint(id:BaseChord):string{
  return id==='e'?'Toque somente as quatro cordas do meio.':id==='a'?'Deixe a 6ª corda em silêncio.':'Toque as seis cordas juntas.';
}

export function accompanimentPlan(){
  const blocks=(['e','g','a'] as const).map(id=>accompanimentChord(id));
  return assembleBlocks(blocks.map(block=>block.id),blocks);
}
