import { tracks as portugueseTracks, routeTracks, archivedTracks } from './legacy-track-content';
import { validateTrack, type TrackContent } from './track-model';
import type { StudyVisual } from './study-model';
import { foundationEnglish, purpleEnglish, type EnglishTrack } from './english-content';
import { localePath, ui, type Locale } from './locale';
import { phaseKind, phaseText } from './song-missions';
import octaveEnglish from './assets/mission-octave-sketch-en.svg';
import riffEnglish from './assets/mission-riff-sketch-en.svg';
import answerEnglish from './assets/mission-answer-sketch-en.svg';

const visualCopy:Record<string,string>={
  'Fundamental na 6ª corda':'Root on the sixth string','Movimento a partir de Am':'Movement from Am',
  'Acorde':'Chord','Acordes':'Chords','Forma':'Shape',
  'A · casa 5':'A · fret 5','G · casa 3':'G · fret 3','B · casa 7':'B · fret 7',
  'Referência':'Reference','Duas casas para trás':'Back two frets','Duas casas adiante':'Up two frets',
  'Gm · a mesma forma duas casas para trás':'Gm · the same shape two frets lower',
  'Contorno contínuo: notas usadas no lick. ↗1t: bend de D até E.':'Solid outlines: notes used in the lick. ↗1t: a whole-step bend from D to E.',
  'Ative ou desative cada escala para comparar os shapes e revelar as posições compartilhadas.':'Turn each scale on or off to compare the shapes and reveal shared positions.',
  '[[chord:Am]] e [[chord:Gm]]':'[[chord:Am]] and [[chord:Gm]]',
  '[[chord:Dm]] e [[chord:Cm]]':'[[chord:Dm]] and [[chord:Cm]]',
  'Forma de [[chord:Em]]':'[[chord:Em]] shape','Forma de [[chord:Am]]':'[[chord:Am]] shape',
  'B♭ grave e B♭ agudo · uma oitava de distância':'Low B♭ and high B♭ · one octave apart',
  'Pentatônica menor de E · casas 7 a 10':'E minor pentatonic · frets 7 to 10',
  'A → B no bend · o dedo permanece na mesma casa':'A → B bend · the finger stays at the same fret',
  '[[chord:E7♯9]] · D ([[degree:7]]) e G ([[degree:♯9]])':'[[chord:E7♯9]] · D ([[degree:7]]) and G ([[degree:♯9]])',
  'C♯–E–B → E–G–G agudo · bends leves no B e no G agudo':'C♯–E–B → E–G–high G · small bends on B and high G',
  'Pentatônica menor de E · F♯ e C♯ como notas adicionais':'E minor pentatonic · F♯ and C♯ as extra notes',
  'B♭ em duas oitavas':'B♭ in two octaves','A resposta da abertura':'The opening response',
  'Subir e repousar':'Rise and settle','Voltar ao E':'Return to E',
  'G, A e a chegada do bend':'G, A and the bend target','Um motivo em outra região':'A motif in another region',
  'Subir uma oitava':'Up an octave','Uma frase para transformar':'A phrase to transform',
};
function translated(value:string):string {
  if(!value||/^[A-G][m♯♭0-9]*$/.test(value))return value;
  const shape=value.match(/^([A-G]m) · forma de (Em|Am|E menor|A menor)$/);
  if(shape)return `${shape[1]} · ${shape[2]==='E menor'?'Em':shape[2]==='A menor'?'Am':shape[2]} shape`;
  const result=visualCopy[value];
  if(result===undefined)throw new Error(`Missing English visual text: ${value}`);
  return result;
}
function visualInEnglish(visual:StudyVisual):StudyVisual {
  const result={...visual};
  if('caption' in result&&result.caption!==undefined)result.caption=translated(result.caption);
  if(result.kind==='table'){
    result.columns=result.columns.map(translated);result.rows=result.rows.map(row=>row.map(translated));
  }
  if(result.kind==='image')result.alt=translated(result.alt);
  return result;
}

/** Localise authored presentation while sharing the same musical events and positions. */
export function englishTrack(source:TrackContent,copy:EnglishTrack):TrackContent {
  const id=`${source.manifest.id}-en`;
  if(Object.keys(copy.missions).length!==source.lessons.length)throw new Error(`English mission count: ${id}`);
  const lessons=source.lessons.map(lesson=>{
    const text=copy.missions[lesson.id];
    if(!text||!lesson.mission)throw new Error(`Missing English mission: ${lesson.id}`);
    const illustration=lesson.mission.scene.illustration;
    const translatedAsset:Record<string,string>={s01:octaveEnglish,s02:riffEnglish,s04:answerEnglish};
    return {...lesson,title:text.title,navTitle:text.title,instruction:text.instruction,
      explanation:undefined,singleCardTitle:undefined,mapTitle:lesson.mapTitle?'E minor pentatonic':undefined,
      ref:{source:'system' as const,trackId:id,lessonId:lesson.ref.lessonId},
      href:localePath(lesson.href,'en'),
      mission:{...lesson.mission,practiceLabel:text.practiceLabel,playInstruction:lesson.mission.playInstruction?text.instruction:undefined,
        scene:{title:text.sceneTitle,text:text.text,prompt:text.prompt,followup:text.followup,
          illustration:illustration?{...illustration,src:translatedAsset[lesson.id]??illustration.src,alt:text.alt}:undefined}},
    };
  });
  const result:TrackContent={...source,
    manifest:{...source.manifest,id,language:'en',title:copy.title,summary:copy.summary,prerequisites:copy.prerequisites},
    lessons,
    blocks:source.blocks.map(block=>({...block,title:translated(block.title),
      map:block.map?{...block.map,reference:block.map.reference?{...block.map.reference,name:translated(block.map.reference.name)}:undefined}:undefined,
      cues:block.cues?.map(cue=>({...cue,label:cue.label==='Ouça'?'Listen':cue.label==='Toque'?'Play':translated(cue.label),group:cue.group?translated(cue.group):undefined})),
      phaseCues:block.phaseCues?.map(cue=>{
        const kind=cue.kind??phaseKind(cue.label);
        if(!kind)throw new Error(`Unknown phase: ${cue.label}`);
        return {...cue,kind,label:ui('en',phaseText[kind])};
      }),
    })),
    guide:{id,title:copy.guideTitle,lessons:source.guide.lessons.map(book=>{
      const text=copy.missions[book.lessonId]!;
      if(text.pages.length!==book.pages.length)throw new Error(`English page count: ${book.lessonId}`);
      return {lessonId:book.lessonId,title:text.title,introduction:text.text,pages:book.pages.map((page,i)=>{
        const pageCopy=text.pages[i]!;
        return {...page,title:'',question:'',answer:'',insight:undefined,...pageCopy,
          visual:visualInEnglish(page.visual),
          additionalVisuals:page.additionalVisuals?.map(item=>({...item,visual:visualInEnglish(item.visual)})),
        };
      })};
    })},
  };
  validateTrack(result);return result;
}
export { portugueseTracks, archivedTracks };
// Compatibility adapter for the two tracks authored before English became the default.
const migratedEnglishTracks=portugueseTracks.map(track=>englishTrack(track,track.manifest.musicalWork?purpleEnglish:foundationEnglish));
// Register new native English TrackContent imports here; they need no Portuguese source.
export const englishTracks:TrackContent[]=[...migratedEnglishTracks];
export const allRouteTracks=[...routeTracks,...englishTracks];
export function tracksForLocale(locale:Locale='en'):TrackContent[]{return locale==='en'?englishTracks:portugueseTracks;}
