import { midiPitch, type SongLesson, type StudyBlock } from './song-content';
import type { StudyGuide } from './study-model';
import type { SampledInstrument } from './study-samples';

export type TrackManifest = {
  schemaVersion:1; id:string; slug:string; title:string; summary:string;
  ownerId:string; author:{id:string;displayName:string}; origin:'official'|'community';
  purposeIds:string[]; language:string; instrumentIds:string[]; styleIds:string[];
  topicIds:string[]; techniqueIds:string[]; prerequisites:string[];
  musicalWork?:{title:string;artistName:string};
  publication:{status:'published'|'draft';visibility:'public'|'unlisted';revision:number};
};
export type TrackContent = { manifest:TrackManifest; bpm:number; lessons:SongLesson[]; blocks:StudyBlock[]; guide:StudyGuide; sources:string[]; mapLegend?:string; referenceInstruments?:readonly [SampledInstrument,...SampledInstrument[]] };

/** The same checks apply to authored exercises and adapted repertoire. */
export function validateTrack(track:TrackContent):void {
  const fail=(message:string):never=>{throw new Error(`${track.manifest.id}: ${message}`);};
  if(track.manifest.schemaVersion!==1||!track.manifest.id||!track.manifest.slug||!track.manifest.title)fail('Identidade da trilha inválida.');
  if(!Number.isFinite(track.bpm)||track.bpm<40||track.bpm>160)fail('Pulso inválido.');
  if(new Set(track.blocks.map(b=>b.id)).size!==track.blocks.length||new Set(track.lessons.map(l=>l.id)).size!==track.lessons.length)fail('IDs repetidos.');
  for(const block of track.blocks){
    const duration=block.endBeat-block.startBeat;
    if(!Number.isFinite(duration)||duration<=0||block.startFret<0||block.endFret>24||block.startFret>block.endFret)fail('Região ou duração inválida.');
    const positions=[...block.notes,...(block.map?.positions??[]),...(block.map?.chordPositions??[]),...(block.map?.reference?[block.map.reference.root]:[])];
    for(const position of positions){
      if(midiPitch(position)!==position.midi||position.fret<block.startFret||position.fret>block.endFret)fail(`Posição inválida em ${block.id}.`);
    }
    for(const note of [...block.notes,...block.backing??[]]){
      if(!Number.isFinite(note.beat)||!Number.isFinite(note.duration)||note.beat<0||note.duration<=0||note.beat+note.duration>duration||!Number.isInteger(note.midi)||note.midi<0||note.midi>127)fail(`Evento inválido em ${block.id}.`);
    }
    if(block.map&&(!Number.isInteger(block.map.tonic)||block.map.tonic<0||block.map.tonic>11))fail('Tônica inválida.');
    if(block.map){
      const map=block.map,key=(p:{stringId:string;fret:number})=>`${p.stringId}:${p.fret}`;
      if(map.chordPositions?.some(p=>!map.positions.some(m=>key(m)===key(p))||!map.chordTones.includes(p.midi%12)))fail('Forma do acorde fora do mapa ou das notas declaradas.');
      if(map.reference&&map.reference.root.midi%12!==map.tonic)fail('Fundamental da referência inválida.');
    }
    if(block.cues?.some(c=>!Number.isFinite(c.beat)||c.beat<0||c.beat>=duration))fail('Indicação fora do trecho.');
  }
  for(const lesson of track.lessons){
    if([...lesson.blocks,...lesson.referenceBlocks??[]].some(id=>!track.blocks.some(b=>b.id===id)))fail('Trecho ausente.');
    if(lesson.referenceBlocks?.some(id=>lesson.blocks.includes(id)))fail('Referência visual não deve participar da reprodução.');
    if(!track.guide.lessons.some(book=>book.lessonId===lesson.id))fail('Leitura ausente.');
    if(lesson.ref.source==='system'&&lesson.ref.trackId!==track.manifest.id)fail('Progresso aponta para outra trilha.');
    const cards=new Map<string,StudyBlock>();
    for(const id of lesson.blocks){
      const block=track.blocks.find(b=>b.id===id)!;const key=block.cardId??block.id,previous=cards.get(key);
      if(previous&&(JSON.stringify(previous.map)!==JSON.stringify(block.map)||previous.title!==block.title||previous.startFret!==block.startFret||previous.endFret!==block.endFret||previous.endBeat-previous.startBeat!==block.endBeat-block.startBeat))fail('Um card precisa manter mapa, região e duração nas repetições.');
      cards.set(key,block);
    }
  }
}
