import { pilotSong, songLessons, studyBlocks, type SongMission } from './song-content';
import { accompanimentChord, chordSource } from './song-chords';
import { missionBookCopy, studyGuide } from './study-books';
import { minorTrack } from './minor-pentatonic';
import { minorPartOneTrack } from './pentatonic-part-one';
import { validateTrack, type TrackContent } from './track-model';
import octaveSketch from './assets/mission-octave-sketch.svg';
import riffSketch from './assets/mission-riff-sketch.svg';
import bendSketch from './assets/mission-bend-sketch.svg';
import chordsSketch from './assets/mission-chords-sketch.svg';
import soloSketch from './assets/mission-solo-sketch.svg';
import answerSketch from './assets/mission-answer-sketch.svg';

const purpleSource:TrackContent={
  manifest:{schemaVersion:1,id:'hendrix-purple-haze',slug:'purple-haze-por-dentro',title:'Purple Haze por dentro',summary:'Aprenda riffs e motivos de Purple Haze, acompanhe a base com acordes e explore caminhos para criar seu próprio solo.',ownerId:'pentashapes',author:{id:'pentashapes',displayName:'PentaShapes'},origin:'official',purposeIds:['repertoire'],language:'pt-BR',instrumentIds:['guitar'],styleIds:['rock'],topicIds:['phrasing'],techniqueIds:['bend','slide'],prerequisites:[],musicalWork:{title:'Purple Haze',artistName:'Jimi Hendrix'},publication:{status:'published',visibility:'public',revision:1}},
  bpm:80,lessons:songLessons,blocks:studyBlocks,guide:studyGuide,sources:[pilotSong.sourceFile],
};
const missionTrackId='hendrix-purple-haze-missions';
const missionSlug='purple-haze';
const missionCopy:Record<string,SongMission&{title:string}>={
  s01:{
    title:'Uma oitava distante',
    practiceLabel:'Praticar a abertura',
    hideBoardTitle:true,
    scene:{
      title:'Um som chama, outro responde',
      text:'Na abertura de Purple Haze, a guitarra alterna entre um som grave e outro agudo. Ouça os dois em sequência e repare no que muda de um para o outro.',
      prompt:'Por que esses dois sons parecem tão parecidos?',
      illustration:{src:octaveSketch,alt:'Uma seta curva pontilhada aponta da nota grave para a aguda.'},
    },
  },
  s02:{
    title:'O riff que responde',
    practiceLabel:'Praticar o riff',
    hideBoardTitle:true,
    scene:{
      title:'As primeiras notas do riff',
      text:'O riff começa com [[note:B]], [[note:D]] e [[note:G]] em subida, depois pousa num [[note:A]] que fica soando. Ouça o que acontece a seguir. A guitarra responde na região grave e volta ao [[note:E]]. Repare como a subida e a resposta têm movimentos diferentes, embora usem notas da mesma escala.',
      illustration:{src:riffSketch,alt:'O desenho sobe de B a D e G, desce para um A sustentado e segue para a resposta grave.',size:{width:230,height:92}},
    },
  },
  's02-variation':{
    title:'O A que sobe',
    practiceLabel:'Praticar a variação',
    hideBoardTitle:true,
    scene:{
      title:'O dedo fica, o som sobe',
      text:'Depois do riff, [[note:G]] e [[note:A]] voltam numa frase curta. Na segunda vez que o [[note:A]] aparece, o som sobe até [[note:B]] antes de a frase voltar ao [[note:G]]. Ouça a diferença entre o primeiro [[note:A]] e o segundo.',
      illustration:{src:bendSketch,alt:'G, A e outro A que sobe até B, antes de voltar a G.',size:{width:230,height:84}},
    },
  },
  s05:{
    title:'Três acordes, de volta ao E',
    practiceLabel:'Tocar com a base',
    practiceMode:'along',
    scene:{
      title:'O caminho de volta ao E',
      text:'Na base do verso, o acorde de [[chord:E]] ocupa quatro tempos. [[chord:G]] e [[chord:A]] passam mais rápido, com dois tempos cada. Ouça a sequência e conte junto para sentir quando chega a hora de voltar ao [[chord:E]].',
      illustration:{src:chordsSketch,alt:'E7♯9 ocupa quatro tempos. G e A ocupam dois tempos cada.',size:{width:230,height:84}},
    },
  },
  s03:{
    title:'O E em outro lugar',
    practiceLabel:'Praticar o motivo do solo',
    hideBoardTitle:true,
    scene:{
      title:'A mão muda de lugar',
      text:'Na entrada do solo, uma frase sobe de [[note:C♯]] a [[note:E]] e [[note:B]]. A próxima começa no mesmo [[note:E]], tocado em outra corda, e segue até um [[note:G]] agudo. Ouça os dois [[note:E]] e repare como essa nota liga as duas partes.',
      illustration:{src:soloSketch,alt:'C♯, E e B sobem na primeira frase. Na segunda, o E reaparece na mesma altura, antes de dois G em alturas diferentes.',size:{width:230,height:84}},
    },
  },
  s04:{
    title:'Uma resposta sua',
    practiceLabel:'Criar uma resposta',
    hideBoardTitle:true,
    scene:{
      title:'O que vem depois da frase?',
      text:'O trecho sobe de [[note:E]] a [[note:G]] e [[note:A]], depois volta ao [[note:E]] e deixa o [[note:G]] soar. Ouça esse contorno e imagine o que poderia vir depois. Você pode repetir o começo e mudar só a última nota.',
      illustration:{src:answerSketch,alt:'A frase sobe, desce e sobe de novo. Depois da seta, um traço pontilhado sugere o caminho de uma resposta própria.',size:{width:230,height:84}},
    },
  },
};
const chordBlocks=([
  {id:'e',label:'E7♯9',tonic:4},{id:'g',label:'G',tonic:7},{id:'a',label:'A',tonic:9},
] as const).map(({id,label,tonic})=>{
  const block=accompanimentChord(id);
  const positions=block.notes.filter(note=>note.beat===0).map(({stringId,fret,midi})=>({stringId,fret,midi}));
  const chordTones=[...new Set(positions.map(note=>note.midi%12))];
  const degreeLabels=id==='e'?{3:'♯9',10:'7'}:undefined;
  return {...block,title:label,cues:[{beat:0,label}],map:{tonic,scaleId:'chromatic',positions,chordTones,degreeLabels}};
});
const missionLessons=songLessons.map(lesson=>{
  const {title,...mission}=missionCopy[lesson.id]!;
  return {
    ...lesson,title,navTitle:title,
    href:`/track/${missionSlug}/${lesson.id}/`,
    ref:{source:'system' as const,trackId:missionTrackId,lessonId:lesson.ref.lessonId},
    blocks:lesson.accompaniment?chordBlocks.map(block=>block.id):lesson.blocks,
    instruction:mission.scene.text,
    mission,
  };
});
export const purpleTrack:TrackContent={
  ...purpleSource,
  referenceInstruments:['clean-guitar','piano'],
  manifest:{...purpleSource.manifest,id:missionTrackId,slug:missionSlug,title:'Purple Haze',summary:'Da abertura em oitavas aos acordes e ao solo. Ouça os trechos, pratique com a base e crie sua própria resposta.',publication:{status:'published',visibility:'public',revision:1}},
  lessons:missionLessons,
  blocks:[...studyBlocks.filter(block=>missionLessons.some(lesson=>lesson.blocks.includes(block.id))),...chordBlocks],
  sources:[...purpleSource.sources,chordSource.url],
  guide:{
    ...studyGuide,
    id:missionTrackId,
    lessons:missionLessons.map(lesson=>{
      const book=studyGuide.lessons.find(book=>book.lessonId===lesson.id)!;
      const copy=missionBookCopy[lesson.id];
      return {
        ...book,
        title:lesson.title,
        introduction:lesson.mission.scene.text,
        pages:book.pages.map((page,i)=>({...page,...copy?.[i]})),
      };
    }),
  },
};
export const tracks=[minorPartOneTrack,purpleTrack];
/** Previous exercises remain addressable without competing with the new catalog entry. */
export const archivedTracks=[minorTrack];
export const routeTracks=[...tracks,...archivedTracks];
for(const track of routeTracks)validateTrack(track);
