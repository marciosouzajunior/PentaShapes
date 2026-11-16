import { assembleLessonBlocks, blockIndexAt, lessonMapPositions, studyCards, studyMapRoles, type SongLesson, type StudyBlock } from './song-content';
import { readProgress, saveProgress } from './progress';
import './song.css';
import './song-missions.css';
import { renderBrand } from './brand';
import { accompanimentPlan, strumChordNotes } from './song-chords';
import type { TrackContent } from './track-model';
import { purpleTrack } from './tracks';
const escape=(text:string)=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
import { mountStudyReader, studyTextMarkup, studyTopicMarkup } from './study-reader';
import {pitchAutomation} from './song-expression';
import {playStudyGuitar} from './song-audio';
import {loadStudySampleVoice,type SampledInstrument,type StudySampleVoice} from './study-samples';
import {readPracticeSettings,savePracticeSettings} from './practice-settings';
import {preserveBreadcrumbScroll} from './breadcrumb-scroll';
import {studyDegree} from './study-model';
import {beatInMission,boardTransitionProgress,missionPracticeBeats,missionRound,phaseLabelAt} from './song-missions';
import {createStudyRoom} from './study-room';

type Board = HTMLElement & { configuration: object; highlightedPositions: {stringId:string;fret:number}[] };
export function renderSongLesson(app: HTMLDivElement, lesson: SongLesson, track:TrackContent=purpleTrack): void {
  const songLessons=track.lessons, studyGuide=track.guide;
  const revision=track.manifest.publication.revision;
  const prior=readProgress(lesson.ref), saved=prior||saveProgress(lesson.ref,'listen',revision);
  const nextLesson=songLessons[songLessons.indexOf(lesson)+1];
  const studyBook=studyGuide.lessons.find(book=>book.lessonId===lesson.id);
  const mission=lesson.mission;
  const sampledInstruments=track.referenceInstruments;
  const timbreMarkup=sampledInstruments?.includes('clean-guitar')&&sampledInstruments.includes('piano')
    ? '<label class="lesson-complete"><input id="song-piano" type="checkbox"> Timbre de piano</label>'
    : '';
  const melodyControl=`<label class="lesson-complete"><input id="song-melody" type="checkbox" checked> ${sampledInstruments?'Ouvir exemplo':'Ouvir guitarra'}</label>`;
  const metronomeControl=`<label class="lesson-complete"><input id="song-click" type="checkbox"${mission?.metronomeByDefault===false?'':' checked'}> Metrônomo</label>`;
  const degreesControl='<label class="lesson-complete"><input id="song-labels" type="checkbox"> Mostrar graus</label>';
  const speedControl='<label class="song-speed">Velocidade <input id="song-bpm" type="range" min="40" max="160" step="1" value="80"><output id="song-bpm-value">80 BPM</output></label>';
  const plan=lesson.accompaniment&&!lesson.blocks.length?accompanimentPlan():assembleLessonBlocks(lesson,track.blocks);
  const practiceCues=mission?.practiceMode==='along'?plan.entries.flatMap(({block,offset})=>
    (block.cues??[]).map(cue=>({...cue,beat:offset+cue.beat}))).sort((a,b)=>a.beat-b.beat):undefined;
  const round=mission?missionRound(missionPracticeBeats(plan.beats,mission.practiceMode,mission.exampleBeats,mission.practiceBeats),practiceCues):null;
  type MissionMeasure=NonNullable<typeof round>['measures'][number];
  const cueGroups:{label:string;items:{cue:MissionMeasure;index:number}[]}[]=[];
  round?.measures.forEach((cue,index)=>{
    const label=cue.group??'';
    const group=cueGroups.at(-1);
    if(!group||group.label!==label)cueGroups.push({label,items:[{cue,index}]});
    else group.items.push({cue,index});
  });
  const gridLabel=practiceCues?'Sequência da prática':'Compassos da rodada';
  const missionGridMarkup=`<div class="mission-grid" role="group" aria-label="${gridLabel}"${practiceCues?' data-mode="along"':''}>${cueGroups.map(group=>`<ol class="mission-grid-group"${group.label?` aria-label="${escape(group.label)}"`:''}>${group.items.map(({cue,index})=>`<li class="mission-cell" data-phase="${cue.phase}"><button class="mission-cell-jump" type="button" data-cue-index="${index}" aria-label="Tocar a partir de ${escape(cue.label)}, trecho ${index+1}" title="Tocar a partir daqui"><span>${escape(cue.label)}</span></button></li>`).join('')}</ol>`).join('')}</div>`;
  const missionTurnMarkup=mission&&!mission.hideTurnLabel&&plan.entries.some(entry=>entry.block.responseBeat!==undefined||entry.block.phaseCues?.length)
    ?'<p class="mission-turn" id="mission-turn" role="status"></p>':'';
  let mode:'prepare'|'play'='prepare';
  const preparingMission=()=>!!mission&&mode==='prepare';
  const links=songLessons.map((item,i)=>{
    const current=item.id===lesson.id;
    const marker=mission?`<span class="mission-done"${(current?prior:readProgress(item.ref))?.step==='complete'?'':' hidden'}><svg viewBox="0 0 16 16" role="img" aria-label="Concluída"><path d="m3.5 8 3 3 6-6"/></svg></span>`:'';
    return `<li><a href="${escape(item.href)}" ${current?'aria-current="page"':''}>${mission?'':`<span class="song-step-number">${String(i+1).padStart(2,'0')}</span>`}${escape(item.navTitle)}${marker}</a>${!mission&&i<songLessons.length-1?'<span class="song-step-separator" aria-hidden="true">&gt;</span>':''}</li>`;
  }).join('');
  const trackLabel=`<p class="eyebrow">${escape(track.manifest.title)}${track.manifest.musicalWork?' · '+escape(track.manifest.musicalWork.artistName):''}</p>`;
  const boardsMarkup=`<div id="song-boards" class="song-boards ${lesson.accompaniment?'chord-boards':''}"></div>`;
  const completionMarkup=`<div class="lesson-completion">
    <label class="lesson-complete"><input id="song-complete" type="checkbox" ${prior?.step==='complete'?'checked':''}><span>${mission?'Missão concluída':'Lição concluída'}</span></label>
    <p id="song-storage" class="song-storage" role="status">${saved?'':'Não foi possível salvar o progresso.'}</p>
  </div>`;
  const celebrationMarkup=mission&&!nextLesson?`
    <dialog id="mission-celebration" class="mission-celebration" aria-labelledby="mission-celebration-title" aria-describedby="mission-celebration-description">
      <div class="mission-celebration-body">
      <button class="mission-celebration-close" type="button" aria-label="Fechar">×</button>
      <div class="mission-confetti" aria-hidden="true">${Array.from({length:14},(_,i)=>`<i style="--piece:${i};--drift:${i%2===0?-1:1};--delay:${i%4*60}ms"></i>`).join('')}</div>
      <svg class="mission-celebration-icon" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19"/><path d="m15 24 6 6 12-13"/></svg>
      <h2 id="mission-celebration-title">Última missão concluída</h2>
      <p id="mission-celebration-description">Você pode continuar tocando por aqui ou explorar outra trilha.</p>
      <div class="mission-celebration-actions">
        <a class="mission-celebration-link" href="/#tracks" autofocus>Ver outras trilhas <span aria-hidden="true">→</span></a>
        <button class="mission-celebration-stay" type="button">Continuar praticando</button>
      </div>
      </div>
    </dialog>`:'';
  app.innerHTML=`
    <a class="skip-link" href="#song-main">Ir para a prática</a>
    <header class="header">${renderBrand()}</header>
    <main id="song-main" class="song-page${mission?' mission-page':''}"${mission?' data-mode="prepare"':''}>
      <div class="song-intro">${mission?`<div class="mission-heading"><a class="mission-app-back" href="/#tracks">Voltar</a>${trackLabel}<details class="mission-route"><summary>Ver missões</summary><nav class="song-steps" aria-label="Missões"><ol>${links}</ol></nav></details></div>`:trackLabel}<h1>${escape(lesson.title)}</h1>${mission?'':`<p>${escape(lesson.instruction)}</p>${studyBook?'<button id="song-read-more" class="song-read-more" type="button">Explorar notas e relações</button>':''}`}
      </div>
      ${mission&&round?`
        <div class="mission-tabs">
          <div class="mission-tab-list" role="tablist" aria-label="Modo da missão"><button type="button" role="tab" id="mission-tab-prepare" aria-controls="mission-prepare" aria-selected="true">Preparar</button><button type="button" role="tab" id="mission-tab-play" aria-controls="mission-play" aria-selected="false" tabindex="-1">Tocar</button></div>
        </div>
        <section id="mission-prepare" role="tabpanel" aria-labelledby="mission-tab-prepare" class="mission-panel">
          <article class="mission-notebook reader-page">
            <div class="mission-scene">
              <h2 class="mission-scene-title">${escape(mission.scene.title)}</h2>
              ${mission.scene.illustration?`<figure class="mission-listening">
                <img src="${escape(mission.scene.illustration.src)}" alt="${escape(mission.scene.illustration.alt)}" width="${mission.scene.illustration.size?.width??210}" height="${mission.scene.illustration.size?.height??84}">
                ${mission.scene.prompt?`<figcaption class="mission-scene-prompt">${escape(mission.scene.prompt)}</figcaption>`:''}
              </figure>`:''}
              <p class="mission-scene-intro">${studyTextMarkup(mission.scene.text)}</p>
              ${mission.scene.followup?`<p class="mission-scene-intro">${studyTextMarkup(mission.scene.followup)}</p>`:''}
              ${mission.hidePreparationExample?'':`<button id="mission-example" class="mission-example" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span>Ouvir o trecho</span></button>
              <p class="mission-example-status" id="mission-example-status" role="status"></p>`}
            </div>
            ${studyBook?.pages.map((page,i)=>studyTopicMarkup(page,`mission-topic-${i}`)).join('')??''}
            <div class="mission-prepare-actions">
              <button id="mission-ready" class="mission-ready" type="button">${escape(mission.practiceLabel)} <span aria-hidden="true">→</span></button>
            </div>
          </article>
        </section>
        <div class="mission-practice">
          <section id="mission-play" role="tabpanel" aria-labelledby="mission-tab-play" class="mission-panel" hidden>
            ${mission.playInstruction?`<p class="mission-cue">${studyTextMarkup(mission.playInstruction)}</p>`:''}
            <div id="mission-player-play"></div>
            <div class="mission-play-actions">
              ${completionMarkup}
              <a class="mission-next" href="${nextLesson?.href??'/#tracks'}"${nextLesson?` rel="next" aria-label="Próxima missão. ${escape(nextLesson.title)}"`:''}>${nextLesson?'Próxima missão':'Todas as trilhas'}</a>
            </div>
            ${celebrationMarkup}
          </section>
        </div>`:
        `<nav class="song-steps" aria-label="Lições de ${escape(track.manifest.title)}"><ol>${links}</ol></nav>`}

      <section id="song-player" class="song-player" aria-label="Estudo por trechos no braço estático">
        ${track.mapLegend&&lesson.mapStyle!=='plain-degrees'?`<p class="song-map-legend">${escape(track.mapLegend)}</p>`:''}
        ${mission?'':boardsMarkup}
        ${mission?`<div class="mission-player-header">${missionGridMarkup}${missionTurnMarkup}`:''}
        <div class="song-controls song-transport" role="group" aria-label="Reprodução"><button id="song-play" class="song-primary" type="button" aria-label="Play" title="Play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button><button id="song-stop" type="button" aria-label="Stop" title="Stop"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"/></svg></button><button id="song-options-toggle" class="song-options-toggle" type="button" aria-label="Ajustes da prática" title="Ajustes da prática" aria-expanded="false" aria-controls="song-options"><svg class="song-settings-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h2m4 0h10M4 12h10m4 0h2M4 18h5m4 0h7"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="11" cy="18" r="2"/></svg></button></div>
        ${mission?'</div>':''}
        <div id="song-options" class="song-options" hidden>
          ${mission?`
            <div class="mission-option-row">${melodyControl}${timbreMarkup}</div>
            <div class="mission-option-row">${metronomeControl}<label class="lesson-complete"><input id="song-count-in" type="checkbox"> Contagem inicial</label></div>
            <div class="mission-option-sliders">
              ${speedControl}
              <label class="song-volume">Volume <input id="song-volume" type="range" min="0" max="100" step="1" value="100"><output id="song-volume-value">100%</output></label>
            </div>
            <div class="mission-option-row">${degreesControl}</div>`:`
            <div class="song-controls"><label class="lesson-complete"><input id="song-loop" type="checkbox"> Repetir</label>${melodyControl}${metronomeControl}</div>
            <div class="song-settings">${degreesControl}${timbreMarkup}${speedControl}</div>`}
        </div>
        <p class="song-status" id="song-status" role="status"></p>
        ${mission?boardsMarkup:''}
      </section>
      ${mission?'':`<footer class="lesson-footer song-footer">
        ${completionMarkup}
        <nav class="lesson-pager" aria-label="Navegação entre lições"><a href="${nextLesson?.href??'/#tracks'}" ${nextLesson?'rel="next"':''}><span>${nextLesson?'Próxima →':'Voltar →'}</span><strong>${nextLesson?`${String(songLessons.indexOf(nextLesson)+1).padStart(2,'0')} · ${nextLesson.title}`:'Todas as trilhas'}</strong></a></nav>
      </footer>`}
    </main>`;
  const get=<T extends HTMLElement>(id:string)=>app.querySelector<T>(`#${id}`)!;
  const missionRoute=app.querySelector<HTMLDetailsElement>('.mission-route');
  const closeMissionRouteOnOutsideClick=(event:MouseEvent)=>{
    if(missionRoute?.open&&!event.composedPath().includes(missionRoute))missionRoute.open=false;
  };
  if(missionRoute)document.addEventListener('click',closeMissionRouteOnOutsideClick,true);
  const complete=get<HTMLInputElement>('song-complete');
  const currentMissionMarker=app.querySelector<HTMLElement>('.mission-route [aria-current="page"] .mission-done');
  const savePracticeProgress=()=>{
    const persisted=saveProgress(lesson.ref,complete.checked?'complete':'practice',revision);
    if(persisted&&currentMissionMarker)currentMissionMarker.hidden=!complete.checked;
    get('song-storage').textContent=persisted?'':'Não foi possível salvar o progresso.';
  };
  const player=get('song-player');
  if(mission)get('mission-player-play').append(player);
  const example=app.querySelector<HTMLButtonElement>('#mission-example');
  const exampleStatus=app.querySelector<HTMLElement>('#mission-example-status');
  const measures=[...app.querySelectorAll<HTMLElement>('.mission-cell')];
  const play=get<HTMLButtonElement>('song-play'), bpmInput=get<HTMLInputElement>('song-bpm');
  const labels=get<HTMLInputElement>('song-labels'),melody=get<HTMLInputElement>('song-melody'),click=get<HTMLInputElement>('song-click');
  const loop=app.querySelector<HTMLInputElement>('#song-loop');
  const settingDefaults={metronome:mission?.metronomeByDefault??true};
  const settings=readPracticeSettings(settingDefaults);
  const pianoToggle=app.querySelector<HTMLInputElement>('#song-piano');
  const countIn=app.querySelector<HTMLInputElement>('#song-count-in');
  const volumeInput=app.querySelector<HTMLInputElement>('#song-volume');
  const preferredTimbre=settings.referenceTimbre;
  let referenceTimbre:SampledInstrument|undefined=preferredTimbre&&sampledInstruments?.includes(preferredTimbre)?preferredTimbre:sampledInstruments?.[0];
  if(pianoToggle)pianoToggle.checked=referenceTimbre==='piano';
  if(countIn)countIn.checked=settings.skipCountIn===false;
  let volume=settings.volume??100;
  if(volumeInput){
    volumeInput.value=String(volume);
    get('song-volume-value').textContent=`${volume}%`;
  }
  if(loop)loop.checked=lesson.repeatByDefault??settings.repeat;
  melody.checked=settings.guitar;click.checked=settings.metronome;
  const persistSettings=(changes:Partial<typeof settings>)=>savePracticeSettings({...readPracticeSettings(settingDefaults),...changes});
  loop?.addEventListener('change',()=>persistSettings({repeat:loop.checked}));
  melody.addEventListener('change',()=>persistSettings({guitar:melody.checked}));
  click.addEventListener('change',()=>persistSettings({metronome:click.checked}));
  const status=get('song-status');
  const optionsToggle=get<HTMLButtonElement>('song-options-toggle'),options=get('song-options');
  const setOptionsExpanded=(expanded:boolean)=>{
    optionsToggle.setAttribute('aria-expanded',String(expanded));
    options.hidden=!expanded;
  };
  const dismissOptionsOnOutsideClick=(event:MouseEvent)=>{
    const path=event.composedPath();
    if(!options.hidden&&!path.includes(options)&&!path.includes(optionsToggle))setOptionsExpanded(false);
  };
  const dismissOptionsOnEscape=(event:KeyboardEvent)=>{
    if(event.key!=='Escape'||options.hidden)return;
    event.preventDefault();
    setOptionsExpanded(false);
    optionsToggle.focus({preventScroll:true});
  };
  if(mission){
    options.setAttribute('role','group');
    options.setAttribute('aria-label','Ajustes da prática');
    app.querySelector('.mission-tabs')!.append(optionsToggle,options);
    document.addEventListener('click',dismissOptionsOnOutsideClick,true);
    document.addEventListener('keydown',dismissOptionsOnEscape);
    options.addEventListener('focusout',event=>{
      const next=event.relatedTarget;
      if(next instanceof Node&&next!==optionsToggle&&!options.contains(next))setOptionsExpanded(false);
    });
  }
  optionsToggle.addEventListener('click',()=>{
    const expanded=options.hasAttribute('hidden');
    setOptionsExpanded(expanded);
    if(mission&&expanded){
      const overflow=options.getBoundingClientRect().bottom-window.innerHeight+8;
      if(overflow>0)window.scrollBy({top:overflow,behavior:'instant'});
    }
  });
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const cardPlan=studyCards(plan,(lesson.referenceBlocks??[]).map(id=>track.blocks.find(block=>block.id===id)!));
  let cards:HTMLElement[]=[], boards:Board[]=[];
  const initialBpm=settings.bpm??track.bpm;
  bpmInput.value=String(initialBpm);get('song-bpm-value').textContent=`${initialBpm} BPM`;
  let beat=preparingMission()?0:-4,bpm=initialBpm,anchorBeat=beat,anchorTime=0;
  let singleIndex:number|null=null,stopped=true;
  const rangeStart=()=>singleIndex===null?0:plan.entries[singleIndex]!.offset;
  const rangeEnd=()=>preparingMission()&&mission?.exampleBeats?Math.min(plan.beats,mission.exampleBeats):mode==='play'&&round?round.beats:singleIndex===null?plan.beats:plan.entries[singleIndex]!.offset+(plan.entries[singleIndex]!.block.endBeat-plan.entries[singleIndex]!.block.startBeat);
  const updateTransport=()=>{
    const active=running||starting;
    const label=active?'Pausa':'Play';
    const icon=active?'M6 5h4v14H6zm8 0h4v14h-4z':'M8 5v14l11-7z';
    play.setAttribute('aria-label',label);play.title=`${label} (Espaço)`;
    play.querySelector('path')!.setAttribute('d',icon);
    if(example){
      example.querySelector('span')!.textContent=active&&preparingMission()?'Pausar o trecho':'Ouvir o trecho';
      example.querySelector('path')!.setAttribute('d',preparingMission()?icon:'M8 5v14l11-7z');
    }
  };
  let audio:AudioContext|null=null,audition:AudioContext|null=null;
  const volumeBuses=new WeakMap<AudioContext,GainNode>();
  const roomBuses=new WeakMap<AudioContext,AudioNode>();
  const outputFor=(context:AudioContext):AudioNode=>{
    if(!volumeInput)return context.destination;
    const existing=volumeBuses.get(context);
    if(existing)return existing;
    const output=context.createGain();
    output.gain.value=volume/100;
    output.connect(context.destination);
    volumeBuses.set(context,output);
    return output;
  };
  const melodicOutputFor=(context:AudioContext):AudioNode=>{
    const existing=roomBuses.get(context);
    if(existing)return existing;
    const room=createStudyRoom(context,outputFor(context));
    roomBuses.set(context,room);
    return room;
  };
  let sampledVoice:StudySampleVoice|undefined,auditionRequest=0;
  const backingVoices=new Map<SampledInstrument,StudySampleVoice>();
  let backingOutput:GainNode|null=null;
  let chordOutput:GainNode|null=null;
  let running=false,starting=false,disposed=false,token=0,frame=0,rendered=-1,shownMeasure=-1;
  let repeatingMission=false,nextRoundBeat=0;
  const rawBeat=()=>running&&audio?anchorBeat+(audio.currentTime-anchorTime)*bpm/60:beat;
  const currentBeat=()=>beatInMission(rawBeat(),round?.beats??plan.beats,repeatingMission);
  const tone=(context:AudioContext,output:AudioNode,midi:number,when:number,duration:number,volume:number)=>{
    const osc=context.createOscillator(),gain=context.createGain();
    osc.type='triangle';osc.frequency.value=440*2**((midi-69)/12);
    gain.gain.setValueAtTime(0,when);gain.gain.linearRampToValueAtTime(volume,when+.008);
    gain.gain.exponentialRampToValueAtTime(.0001,when+Math.max(.03,duration));
    osc.connect(gain).connect(output);osc.start(when);osc.stop(when+duration+.02);
  };
  const pause=()=>{
    status.textContent='';
    if(exampleStatus)exampleStatus.textContent='';
    beat=Math.min(currentBeat(),rangeEnd());running=false;starting=false;token++;
    repeatingMission=false;
    chordOutput=null;
    backingOutput=null;
    const old=audio;audio=null;if(old)void old.close().catch(()=>{});
    updateTransport();
  };
  const auditionNote=async(midi:number)=>{
    if(running||starting)pause();
    const request=++auditionRequest;
    const timbre=referenceTimbre;
    try{
      const context=audition??=new AudioContext();
      await context.resume();
      const voice=timbre?await loadStudySampleVoice(timbre):playStudyGuitar;
      if(!disposed&&audition===context&&request===auditionRequest)voice(context,midi,context.currentTime+.01,.6,undefined,melodicOutputFor(context));
    }catch{
      if(!disposed&&request===auditionRequest)status.textContent='Não foi possível ouvir a nota neste navegador.';
    }
  };
  // Later rounds use the same audio context and clock as the first one.
  const schedule=(context:AudioContext,offset:number,from:number)=>{
    const endBeat=rangeEnd(),spb=60/bpm;
    const output=outputFor(context);
    const when=(onset:number)=>anchorTime+(offset+onset-anchorBeat)*spb;
    if(!preparingMission())for(let b=Math.ceil(from);b<endBeat;b++)if(b<0||click.checked)tone(context,output,b%4===0?84:76,when(b),.04,.04);
    const noteOutput=chordOutput??melodicOutputFor(context);
    const notes=lesson.accompaniment&&referenceTimbre==='clean-guitar'?strumChordNotes(plan.notes,spb):plan.notes;
    if(preparingMission()||melody.checked)for(const note of notes){
      const end=Math.min(note.beat+note.duration,endBeat);if(end<=from||note.beat>=endBeat||(singleIndex!==null&&note.beat<rangeStart()))continue;
      const onset=Math.max(from,note.beat);
      const duration=(end-onset)*spb;
      const voice=sampledVoice??playStudyGuitar;
      const pitch=referenceTimbre==='piano'?[]:pitchAutomation(note,onset-note.beat,end-onset,spb);
      voice(context,note.midi,when(onset),duration,pitch,noteOutput);
    }
    for(const entry of plan.entries){
      const backingLevel=context.createGain();
      backingLevel.gain.value=entry.block.backingGain??1;
      backingLevel.connect(backingOutput??output);
      for(const note of entry.block.backing??[]){
        const onsetBeat=entry.offset+note.beat,end=Math.min(onsetBeat+note.duration,endBeat);
        if(end<=from||onsetBeat>=endBeat||(singleIndex!==null&&onsetBeat<rangeStart()))continue;
        const onset=Math.max(from,onsetBeat);
        const backingVoice=note.instrument?backingVoices.get(note.instrument):undefined;
        if(backingVoice)backingVoice(context,note.midi,when(onset),(end-onset)*spb,undefined,backingLevel,note.velocity);
        else tone(context,output,note.midi,when(onset),(end-onset)*spb,.025*(entry.block.backingGain??1));
      }
    }
  };
  const start=async()=>{
    if(running||starting||disposed)return;
    if(beat>=rangeEnd())beat=singleIndex===null&&!preparingMission()?-4:rangeStart();
    if(countIn&&!countIn.checked&&beat<0)beat=0;
    const attempt=++token;starting=true;updateTransport();
    try{
      const context=new AudioContext();audio=context;await context.resume();
      const voice=referenceTimbre&&(preparingMission()||melody.checked)?await loadStudySampleVoice(referenceTimbre):undefined;
      const backingInstruments=[...new Set(plan.entries.flatMap(entry=>(entry.block.backing??[]).flatMap(note=>note.instrument?[note.instrument]:[])))];
      await Promise.all(backingInstruments.map(async instrument=>backingVoices.set(instrument,await loadStudySampleVoice(instrument))));
      if(attempt!==token||disposed){void context.close().catch(()=>{});return;}
      sampledVoice=voice;
      if(backingInstruments.length){backingOutput=context.createGain();backingOutput.gain.value=.3;backingOutput.connect(outputFor(context));}
      if(voice&&lesson.accompaniment){
        chordOutput=context.createGain();
        chordOutput.gain.value=.55;
        chordOutput.connect(melodicOutputFor(context));
      }
      stopped=false;anchorBeat=beat;anchorTime=context.currentTime+.08;
      repeatingMission=mode==='play'&&!!round;
      nextRoundBeat=round?.beats??0;
      schedule(context,0,beat);
      running=true;starting=false;updateTransport();
      savePracticeProgress();
    }catch{
      if(attempt!==token)return;
      pause();
      (preparingMission()&&exampleStatus?exampleStatus:status).textContent='Não foi possível iniciar o áudio. Tente novamente.';
    }
  };
  const setBoard=(board:Board,block:StudyBlock)=>{
    if(block.map){
      const map=block.map;
      if(!map.positions.length)board.setAttribute('empty-message','Ouça a base e encontre seu caminho no instrumento.');
      const plain=lesson.mapStyle==='plain-degrees';
      board.classList.toggle('plain-degree-map',plain);
      const annotations=plain&&!labels.checked?map.positions.map(p=>({stringId:p.stringId,fret:p.fret,label:studyDegree(p.midi,map.tonic),description:`Grau ${studyDegree(p.midi,map.tonic)} em relação à tônica.`})):[];
      board.configuration={tonic:map.tonic,scaleId:map.scaleId,spelling:map.spelling,startFret:block.startFret,endFret:block.endFret,labelMode:labels.checked?'degree':'letter',positions:map.positions,degreeLabels:map.degreeLabels,roles:plain?[]:studyMapRoles(map),annotations};
      board.highlightedPositions=[];return;
    }
    const {phrase,possibilities,additional}=lessonMapPositions(lesson,block);
    const positions=[...phrase,...possibilities];
    const intervals=[0,2,3,5,7,8,10];
    const roles=[...positions.filter(pos=>!intervals.includes((pos.midi-4+120)%12)),...additional].map(pos=>({...pos,roles:['context']}));
    const annotations=[...new Map(block.notes.filter(note=>note.technique).map(note=>[`${note.stringId}:${note.fret}`,{stringId:note.stringId,fret:note.fret,label:note.technique!.kind==='bend'?(note.technique!.semitones===2?'↗1t':'↗¼'):note.pitchCurve?.[0]&&note.pitchCurve[0].midi>note.midi?'↘':'↗',description:note.technique!.kind==='bend'?(note.technique!.semitones===2?'Bend de um tom: eleve o som sem trocar de casa.':'Bend leve: eleve a nota um quarto de tom.'):'Slide: deslize até esta nota.'}])).values()];
    board.configuration={tonic:4,scaleId:lesson.exploration?'minorPentatonic':'naturalMinor',startFret:lesson.exploration?12:block.startFret,endFret:lesson.exploration?15:block.endFret,spelling:block.id.startsWith('intro')?'flat':'sharp',labelMode:labels.checked?'degree':'letter',positions:positions.filter(pos=>intervals.includes((pos.midi-4+120)%12)),roles,annotations};
    board.highlightedPositions=[];
  };
  const renderCards=()=>{
    get('song-boards').classList.toggle('song-boards--current',!!mission);
    get('song-boards').innerHTML=cardPlan.entries.map(({block,entryIndex},i)=>{
      const reference=entryIndex===null,title=escape(lesson.mapTitle??block.title);
      const boardLabel=mission?.hideBoardTitle?`Braço ${i+1}`:escape(lesson.mapTitle??`Mapa de ${block.title}`);
      const progressLabel=mission?.hideBoardTitle?boardLabel:escape(block.title);
      const boardHeading=reference||mission?title:`<button class="study-card-play" type="button" aria-label="Ouvir apenas ${escape(block.title)}">${title}</button>`;
      const heading=mission?.hideBoardTitle?'':`<h3 id="song-block-title-${i}">${boardHeading}</h3>`;
      return `<article class="study-card${reference?' study-card--reference':''}${lesson.exploration?' study-card--exploration':''}" data-study-block="${block.id}"${heading?` aria-labelledby="song-block-title-${i}"`:''}>${heading}<penta-fretboard id="song-board-${i}" aria-label="${boardLabel}"></penta-fretboard>${reference?'':`<input class="study-progress" type="range" min="0" max="${block.endBeat-block.startBeat}" step=".01" value="0" aria-label="Posição em ${progressLabel}">`}</article>`;
    }).join('');
    cards=Array.from(get('song-boards').querySelectorAll<HTMLElement>('.study-card'));
    boards=cards.map(card=>card.querySelector<Board>('penta-fretboard')!);
    boards.forEach((board,i)=>setBoard(board,cardPlan.entries[i]!.block));
    cards.forEach((card,i)=>card.querySelector<HTMLInputElement>('.study-progress')?.addEventListener('input',event=>{
      const input=event.currentTarget as HTMLInputElement,resume=running;
      const entry=cardPlan.entries[i]!;
      pause();singleIndex=entry.entryIndex;beat=entry.offset+Number(input.value);stopped=false;rendered=-1;
      if(resume)void start();
    }));
    rendered=-1;
  };
  const showBlock=(index:number,nextIndex?:number,transition=0)=>{
    rendered=index;
    const currentCard=cardPlan.indices[index];
    const nextCard=nextIndex===undefined?undefined:cardPlan.indices[nextIndex];
    const blending=!!mission&&nextCard!==undefined&&nextCard!==currentCard&&transition>0;
    cards.forEach((card,i)=>{
      const current=i===currentCard,incoming=blending&&i===nextCard;
      card.hidden=!!mission&&!current&&!incoming;
      card.classList.toggle('is-current',current);
      card.classList.toggle('is-next',incoming);
      card.inert=incoming;
      card.style.setProperty('--board-opacity',String(incoming?transition:current&&blending?1-transition:1));
      if(current)card.setAttribute('aria-current','step');else card.removeAttribute('aria-current');
      if(incoming)card.setAttribute('aria-hidden','true');else card.removeAttribute('aria-hidden');
    });
  };
  const draw=()=>{
    if(disposed)return;
    if(repeatingMission&&round&&audio&&running){
      const raw=rawBeat();
      if(raw>=nextRoundBeat-2){
        const offset=Math.max(nextRoundBeat,Math.ceil(raw/round.beats)*round.beats);
        schedule(audio,offset,0);
        nextRoundBeat=offset+round.beats;
      }
    }
    const now=Math.max(-4,Math.min(currentBeat(),rangeEnd()));
    const playingMission=mode==='play'&&round;
    const responseBeat=playingMission?playingMission.responseBeat:null;
    const responding=responseBeat!==null&&now>=responseBeat;
    const phraseBeat=responding?now-responseBeat:now;
    const measure=playingMission&&!stopped&&now>=0&&now<playingMission.beats
      ? playingMission.measures.findIndex((cue,i)=>now>=cue.beat&&now<(playingMission.measures[i+1]?.beat??playingMission.beats))
      : -1;
    if(measure!==shownMeasure){
      measures[shownMeasure]?.removeAttribute('aria-current');
      measures[measure]?.setAttribute('aria-current','step');
      shownMeasure=measure;
    }
    if(playingMission&&measure>=0){
      const start=playingMission.measures[measure]!.beat;
      const end=playingMission.measures[measure+1]?.beat??playingMission.beats;
      const elapsed=reducedMotion.matches?Math.floor(now-start):now-start;
      measures[measure]?.style.setProperty('--cue-progress',String(Math.max(0,Math.min(1,elapsed/(end-start)))));
    }
    const index=singleIndex??blockIndexAt(plan,phraseBeat);
    const entry=plan.entries[index]!,local=phraseBeat-entry.offset;
    const duration=entry.block.endBeat-entry.block.startBeat;
    const nextIndex=singleIndex===null
      ?index<plan.entries.length-1?index+1:repeatingMission?0:undefined
      :undefined;
    const boardTransition=running&&!stopped&&nextIndex!==undefined&&now<rangeEnd()&&!reducedMotion.matches
      ?boardTransitionProgress(local,duration)
      :0;
    if(mission)showBlock(index,boardTransition>0?nextIndex:undefined,boardTransition);
    else if(index!==rendered)showBlock(index);
    const turn=app.querySelector<HTMLElement>('#mission-turn');
    if(turn){
      const phaseLabel=phaseLabelAt(entry.block.phaseCues,local);
      const label=stopped||now<0?'':phaseLabel==='Toque junto'&&!melody.checked?'Toque':phaseLabel??(!melody.checked||(entry.block.responseBeat!==undefined&&local>=entry.block.responseBeat)?'Toque':'Ouça');
      if(turn.textContent!==label)turn.textContent=label;
    }
    const active=entry.block.notes.filter(note=>!responding&&!stopped&&local>=note.beat&&local<note.beat+note.duration&&now<rangeEnd());
    boards.forEach((board,i)=>{board.highlightedPositions=i===cardPlan.indices[index]?active:[];});
    if(now>=rangeEnd())cards.forEach(card=>{card.classList.remove('is-current');card.removeAttribute('aria-current');});
    const counting=!stopped&&anchorBeat<0&&now<0;
    play.classList.toggle('is-counting',counting);
    const preparation=Math.max(0,Math.min(1,(now+4)/4));
    play.style.setProperty('--count-in-progress',`${(reducedMotion.matches?Math.floor(preparation*4)/4:preparation)*360}deg`);
    cards.forEach((card,i)=>{
      const cardDuration=cardPlan.entries[i]!.block.endBeat-cardPlan.entries[i]!.block.startBeat;
      const progress=stopped||i!==cardPlan.indices[index]?0:Math.max(0,Math.min(cardDuration,local));
      const input=card.querySelector<HTMLInputElement>('.study-progress');
      if(!input)return;
      input.value=String(progress);input.style.setProperty('--study-progress',`${progress/cardDuration*100}%`);
    });
    if(running&&now>=rangeEnd()){
      pause();
      if(loop?.checked){beat=rangeStart();rendered=-1;void start();}
    }
    frame=requestAnimationFrame(draw);
  };
  const togglePlayback=()=>{if(running||starting)pause();else{rendered=-1;void start();}};
  play.setAttribute('aria-keyshortcuts','Space');play.title='Play (Espaço)';
  play.addEventListener('click',togglePlayback);
  example?.addEventListener('click',togglePlayback);
  measures.forEach((measure,index)=>measure.querySelector<HTMLButtonElement>('.mission-cell-jump')?.addEventListener('click',()=>{
    const cue=round?.measures[index];
    if(!cue)return;
    pause();singleIndex=null;beat=cue.beat;stopped=false;rendered=-1;
    void start();
  }));
  const onTransportKey=(event:KeyboardEvent)=>{
    if(preparingMission())return;
    if(document.querySelector('dialog[open]')||(event.target instanceof HTMLElement&&event.target.closest('input,select,textarea,button:not(#song-play),a')))return;
    if(disposed||(event.code!=='Space'&&event.key!==' ')||event.altKey||event.ctrlKey||event.metaKey)return;
    event.preventDefault();
    if(!event.repeat)togglePlayback();
  };
  document.addEventListener('keydown',onTransportKey,true);
  get('song-stop').addEventListener('click',()=>{pause();stopped=true;singleIndex=null;beat=-4;rendered=-1;boards.forEach(board=>{board.highlightedPositions=[];});status.textContent='';});
  get('song-boards').addEventListener('click',event=>{
    if(mode==='play')return;
    if((event.target as HTMLElement).closest('.study-progress'))return;
    if(event.composedPath().some(node=>node instanceof HTMLElement&&node.tagName==='BUTTON'&&node.classList.contains('note')))return;
    const card=(event.target as HTMLElement).closest<HTMLElement>('.study-card');
    if(!card||card.classList.contains('study-card--reference'))return;
    pause();singleIndex=cardPlan.entries[cards.indexOf(card)]!.entryIndex;beat=rangeStart();rendered=-1;void start();
  });
  labels.addEventListener('change',()=>boards.forEach((board,i)=>setBoard(board,cardPlan.entries[i]!.block)));
  countIn?.addEventListener('change',()=>{
    persistSettings({skipCountIn:!countIn.checked});
    if(!countIn.checked&&(running||starting)&&currentBeat()<0){
      pause();
      void start();
    }
  });
  pianoToggle?.addEventListener('change',()=>{
    const resume=running||starting;
    if(resume)pause();
    referenceTimbre=pianoToggle.checked?'piano':'clean-guitar';
    auditionRequest++;
    if(audition){void audition.close().catch(()=>{});audition=null;}
    persistSettings({referenceTimbre});
    if(resume)void start();
  });
  volumeInput?.addEventListener('input',()=>{
    volume=Number(volumeInput.value);
    get('song-volume-value').textContent=`${volume}%`;
    for(const context of [audio,audition]){
      if(context)volumeBuses.get(context)?.gain.setTargetAtTime(volume/100,context.currentTime,.01);
    }
    persistSettings({volume});
  });
  bpmInput.addEventListener('input',()=>{const resume=running;pause();bpm=Number(bpmInput.value);get('song-bpm-value').textContent=`${bpm} BPM`;persistSettings({bpm});if(resume)void start();});
  for(const input of[melody,click])input.addEventListener('change',()=>{const resume=running;pause();if(resume)void start();});
  if(mission){
    const modes=['prepare','play'] as const;
    const tabs=modes.map(value=>get<HTMLButtonElement>(`mission-tab-${value}`));
    let preparationScroll=0;
    const switchMode=(next:typeof mode)=>{
      if(next===mode)return;
      if(mode==='prepare')preparationScroll=window.scrollY;
      pause();
      if(audition){void audition.close().catch(()=>{});audition=null;}
      mode=next;stopped=true;singleIndex=null;beat=next==='prepare'?0:-4;rendered=-1;
      get('song-main').dataset.mode=mode;
      setOptionsExpanded(false);
      modes.forEach((value,i)=>{
        const selected=value===mode;
        get(`mission-${value}`).hidden=!selected;
        tabs[i]!.setAttribute('aria-selected',String(selected));
        tabs[i]!.tabIndex=selected?0:-1;
      });
      if(next==='prepare')window.scrollTo({top:preparationScroll,behavior:'instant'});
      else{
        const panelTop=get('mission-play').getBoundingClientRect().top;
        const tabBottom=tabs[1]!.getBoundingClientRect().bottom;
        if(panelTop<tabBottom)window.scrollBy({top:panelTop-tabBottom,behavior:'instant'});
      }
    };
    get('mission-ready').addEventListener('click',()=>{switchMode('play');tabs[1]!.focus({preventScroll:true});});
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',()=>switchMode(modes[i]!));
      tab.addEventListener('keydown',event=>{
        if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
        event.preventDefault();
        const next=event.key==='Home'?0:event.key==='End'?1:1-i;
        switchMode(modes[next]!);tabs[next]!.focus();
      });
    });
  }

  get('song-boards').addEventListener('fret-activate',event=>void auditionNote((event as CustomEvent<{midi:number}>).detail.midi));
  const celebration=app.querySelector<HTMLDialogElement>('#mission-celebration');
  celebration?.addEventListener('click',event=>{
    if(event.target===celebration)celebration.close();
  });
  celebration?.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>celebration.close()));
  celebration?.addEventListener('close',()=>celebration.classList.remove('is-celebrating'));
  complete.addEventListener('change',()=>{
    savePracticeProgress();
    if(!celebration)return;
    if(complete.checked){
      pause();
      celebration.classList.add('is-celebrating');
      celebration.showModal();
    }else celebration.close();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&(running||starting)){pause();}});
  const readMore=app.querySelector<HTMLButtonElement>('#song-read-more');
  const disposeReader=readMore&&studyBook?mountStudyReader(readMore,studyGuide,lesson.id,()=>{
    pause();
    if(audition){void audition.close().catch(()=>{});audition=null;}
  }):()=>{};
  window.addEventListener('pagehide',()=>{
    disposed=true;
    document.removeEventListener('keydown',onTransportKey,true);
    document.removeEventListener('click',closeMissionRouteOnOutsideClick,true);
    document.removeEventListener('click',dismissOptionsOnOutsideClick,true);
    document.removeEventListener('keydown',dismissOptionsOnEscape);
    pause();
    cancelAnimationFrame(frame);
    disposeReader();
    if(audition)void audition.close().catch(()=>{});
  },{once:true});
  renderCards();draw();
  if(!mission)preserveBreadcrumbScroll(app.querySelector<HTMLElement>('.song-steps')!);
}
