import { assembleLessonBlocks, blockIndexAt, pilotSong, songLessons, type SongLesson, type StudyBlock } from './song-content';
import { readProgress, saveProgress } from './progress';
import './song.css';
import { accompanimentPlan } from './song-chords';
import { studyBookFor, studyGuide } from './study-books';
import { mountStudyReader } from './study-reader';
import {pitchAutomation} from './song-expression';
import {readPracticeSettings,savePracticeSettings} from './practice-settings';

type Board = HTMLElement & { configuration: object; highlightedPositions: {stringId:string;fret:number}[] };
export function renderSongLesson(app: HTMLDivElement, lesson: SongLesson): void {
  const prior=readProgress(lesson.ref), saved=prior||saveProgress(lesson.ref,'listen',1);
  const nextLesson=songLessons[songLessons.indexOf(lesson)+1];
  const studyBook=studyBookFor(lesson.id);
  app.innerHTML=`
    <a class="skip-link" href="#song-main">Ir para a prática</a>
    <header class="header"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true">p</span><span>PentaShapes</span></a></header>
    <main id="song-main" class="song-page">
      <div class="song-intro"><p class="eyebrow">PURPLE HAZE POR DENTRO · JIMI HENDRIX</p><h1>${lesson.title}</h1><p>${lesson.instruction}</p>${studyBook?'<button id="song-read-more" class="song-read-more" type="button">Explorar notas e relações</button>':''}
      </div>
      <nav class="song-steps" aria-label="Lições de Purple Haze"><ol>${songLessons.map((item,i)=>`<li><a href="${item.href}" ${item.id===lesson.id?'aria-current="page"':''}><span class="song-step-number">0${i+1}</span>${item.title}</a>${i<songLessons.length-1?'<span class="song-step-separator" aria-hidden="true">&gt;</span>':''}</li>`).join('')}</ol></nav>

      <section class="song-player" aria-label="Estudo por trechos no braço estático">
        <div id="song-boards" class="song-boards ${lesson.accompaniment?'chord-boards':''}"></div>
        <div class="song-controls song-transport" role="group" aria-label="Reprodução"><button id="song-play" class="song-primary" type="button" aria-label="Play" title="Play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button><button id="song-stop" type="button" aria-label="Stop" title="Stop"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"/></svg></button><button id="song-options-toggle" class="song-options-toggle" type="button" aria-label="Ajustes da prática" title="Ajustes da prática" aria-expanded="false" aria-controls="song-options"><svg class="song-settings-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h2m4 0h10M4 12h10m4 0h2M4 18h5m4 0h7"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="11" cy="18" r="2"/></svg></button></div>
        <div id="song-options" class="song-options" hidden>
        <div class="song-controls"><label class="lesson-complete"><input id="song-loop" type="checkbox"> Repetir</label><label class="lesson-complete"><input id="song-melody" type="checkbox" checked> Ouvir guitarra</label><label class="lesson-complete"><input id="song-click" type="checkbox" checked> Metrônomo</label></div>

        <div class="song-settings"><label class="lesson-complete"><input id="song-labels" type="checkbox"> Mostrar graus</label><label class="song-speed">Velocidade <input id="song-bpm" type="range" min="40" max="160" step="1" value="80"><output id="song-bpm-value">80 BPM</output></label>${lesson.accompaniment?'':`<span>Arranjo original: ${Math.round(pilotSong.bpm)} BPM</span>`}</div>
        </div>
        <p class="song-status" id="song-status" role="status"></p>
      </section>
      <footer class="lesson-footer song-footer">
        <div class="lesson-completion"><label class="lesson-complete"><input id="song-complete" type="checkbox" ${prior?.step==='complete'?'checked':''}><span>Lição concluída</span></label><p id="song-storage" class="song-storage" role="status">${saved?'':'Não foi possível salvar o progresso.'}</p></div>
        <nav class="lesson-pager" aria-label="Navegação entre lições"><a href="${nextLesson?.href??'/#tracks'}" ${nextLesson?'rel="next"':''}><span>${nextLesson?'Próxima →':'Voltar →'}</span><strong>${nextLesson?`${String(songLessons.indexOf(nextLesson)+1).padStart(2,'0')} · ${nextLesson.title}`:'Todas as trilhas'}</strong></a></nav>
      </footer>
    </main>`;
  const get=<T extends HTMLElement>(id:string)=>app.querySelector<T>(`#${id}`)!;
  const play=get<HTMLButtonElement>('song-play'), bpmInput=get<HTMLInputElement>('song-bpm');
  const labels=get<HTMLInputElement>('song-labels'),loop=get<HTMLInputElement>('song-loop'),melody=get<HTMLInputElement>('song-melody'),click=get<HTMLInputElement>('song-click');
  const settings=readPracticeSettings();
  loop.checked=settings.repeat;melody.checked=settings.guitar;click.checked=settings.metronome;
  for(const input of [loop,melody,click])input.addEventListener('change',()=>savePracticeSettings({repeat:loop.checked,guitar:melody.checked,metronome:click.checked}));
  const status=get('song-status');
  const optionsToggle=get<HTMLButtonElement>('song-options-toggle'),options=get('song-options');
  optionsToggle.addEventListener('click',()=>{
    const expanded=optionsToggle.getAttribute('aria-expanded')!=='true';
    optionsToggle.setAttribute('aria-expanded',String(expanded));
    options.hidden=!expanded;
  });
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const plan=lesson.accompaniment?accompanimentPlan():assembleLessonBlocks(lesson);
  let cards:HTMLElement[]=[], boards:Board[]=[];
  let beat=-4,bpm=80,anchorBeat=beat,anchorTime=0;
  let singleIndex:number|null=null,stopped=true;
  const rangeStart=()=>singleIndex===null?0:plan.entries[singleIndex]!.offset;
  const rangeEnd=()=>singleIndex===null?plan.beats:plan.entries[singleIndex]!.offset+(plan.entries[singleIndex]!.block.endBeat-plan.entries[singleIndex]!.block.startBeat);
  const updateTransport=()=>{
    const active=running||starting;
    const label=active?'Pausa':'Play';
    play.setAttribute('aria-label',label);play.title=`${label} (Espaço)`;
    play.querySelector('path')!.setAttribute('d',active?'M6 5h4v14H6zm8 0h4v14h-4z':'M8 5v14l11-7z');
  };
  let audio:AudioContext|null=null,audition:AudioContext|null=null;
  let running=false,starting=false,disposed=false,token=0,frame=0,rendered=-1;
  const currentBeat=()=>running&&audio?anchorBeat+(audio.currentTime-anchorTime)*bpm/60:beat;
  const tone=(context:AudioContext,midi:number,when:number,duration:number,volume=.065,pitch:{offset:number;midi:number}[]=[])=>{
    const osc=context.createOscillator(),gain=context.createGain();
    osc.type='triangle';osc.frequency.value=440*2**((midi-69)/12);
    if(pitch.length){
      osc.frequency.setValueAtTime(440*2**((pitch[0]!.midi-69)/12),when);
      for(const point of pitch.slice(1))osc.frequency.exponentialRampToValueAtTime(440*2**((point.midi-69)/12),when+point.offset);
    }
    gain.gain.setValueAtTime(0,when);gain.gain.linearRampToValueAtTime(volume,when+.008);
    gain.gain.exponentialRampToValueAtTime(.0001,when+Math.max(.03,duration));
    osc.connect(gain).connect(context.destination);osc.start(when);osc.stop(when+duration+.02);
  };
  const pause=()=>{
    status.textContent='';
    beat=Math.min(currentBeat(),rangeEnd());running=false;starting=false;token++;
    const old=audio;audio=null;if(old)void old.close().catch(()=>{});
    updateTransport();
  };
  const auditionNote=async(midi:number)=>{
    if(running||starting)pause();
    try{audition??=new AudioContext();await audition.resume();if(!disposed)tone(audition,midi,audition.currentTime+.01,.6);}
    catch{status.textContent='Não foi possível ouvir a nota neste navegador.';}
  };
  const start=async()=>{
    if(running||starting||disposed)return;
    if(beat>=rangeEnd())beat=singleIndex===null?-4:rangeStart();
    const attempt=++token;starting=true;updateTransport();
    try{
      const context=new AudioContext();audio=context;await context.resume();
      if(attempt!==token||disposed){void context.close().catch(()=>{});return;}
      stopped=false;anchorBeat=beat;anchorTime=context.currentTime+.08;
      const spb=60/bpm;
      for(let b=Math.ceil(beat);b<rangeEnd();b++)if(b<0||click.checked)tone(context,b%4===0?84:76,anchorTime+(b-beat)*spb,.04,.018);
      if(melody.checked)for(const note of plan.notes){
        const end=Math.min(note.beat+note.duration,rangeEnd());if(end<=beat||note.beat>=rangeEnd()||(singleIndex!==null&&note.beat<rangeStart()))continue;
        const onset=Math.max(beat,note.beat);
        tone(context,note.midi,anchorTime+(onset-beat)*spb,(end-onset)*spb,.065,pitchAutomation(note,onset-note.beat,end-onset,spb));
      }
      running=true;starting=false;updateTransport();
      if(!saveProgress(lesson.ref,get<HTMLInputElement>('song-complete').checked?'complete':'practice',1))get('song-storage').textContent='Não foi possível salvar o progresso.';
    }catch{if(attempt!==token)return;pause();status.textContent='Não foi possível iniciar o áudio. Tente novamente.';}
  };
  const setBoard=(board:Board,block:StudyBlock)=>{
    const positions=[...new Map(block.notes.map(note=>[`${note.stringId}:${note.fret}`,{stringId:note.stringId,fret:note.fret,midi:note.midi}])).values()];
    const intervals=[0,2,3,5,7,8,10];
    const roles=positions.filter(pos=>!intervals.includes((pos.midi-4+120)%12)).map(pos=>({...pos,roles:['context']}));
    const annotations=[...new Map(block.notes.filter(note=>note.technique).map(note=>[`${note.stringId}:${note.fret}`,{stringId:note.stringId,fret:note.fret,label:note.technique!.kind==='bend'?'↗¼':note.pitchCurve?.[0]&&note.pitchCurve[0].midi>note.midi?'↘':'↗',description:note.technique!.kind==='bend'?'Bend leve: eleve a nota um quarto de tom.':'Slide: deslize até esta nota.'}])).values()];
    board.configuration={tonic:4,scaleId:'naturalMinor',startFret:block.startFret,endFret:block.endFret,spelling:block.id.startsWith('intro')?'flat':'sharp',labelMode:labels.checked?'degree':'letter',positions:positions.filter(pos=>intervals.includes((pos.midi-4+120)%12)),roles,annotations};
    board.highlightedPositions=[];
  };
  const renderCards=()=>{
    get('song-boards').innerHTML=plan.entries.map(({block},i)=>`<article class="study-card" data-study-block="${block.id}" aria-labelledby="song-block-title-${i}"><h3 id="song-block-title-${i}"><button class="study-card-play" type="button" aria-label="Ouvir apenas ${block.title}">${block.title}</button></h3><penta-fretboard id="song-board-${i}" aria-label="Mapa de ${block.title}"></penta-fretboard><input class="study-progress" type="range" min="0" max="${block.endBeat-block.startBeat}" step=".01" value="0" aria-label="Posição em ${block.title}"></article>`).join('');
    cards=Array.from(get('song-boards').querySelectorAll<HTMLElement>('.study-card'));
    boards=cards.map(card=>card.querySelector<Board>('penta-fretboard')!);
    boards.forEach((board,i)=>setBoard(board,plan.entries[i]!.block));
    cards.forEach((card,i)=>card.querySelector<HTMLInputElement>('.study-progress')!.addEventListener('input',event=>{
      const input=event.currentTarget as HTMLInputElement,resume=running;
      pause();singleIndex=i;beat=plan.entries[i]!.offset+Number(input.value);stopped=false;rendered=-1;
      if(resume)void start();
    }));
    rendered=-1;
  };
  const showBlock=(index:number)=>{
    rendered=index;
    cards.forEach((card,i)=>{
      card.classList.toggle('is-current',i===index);
      if(i===index)card.setAttribute('aria-current','step');else card.removeAttribute('aria-current');
    });
  };
  const draw=()=>{
    if(disposed)return;
    const now=Math.max(-4,Math.min(currentBeat(),rangeEnd())),index=singleIndex??blockIndexAt(plan,now);
    if(index!==rendered)showBlock(index);
    const entry=plan.entries[index]!,local=now-entry.offset;
    const active=entry.block.notes.filter(note=>!stopped&&local>=note.beat&&local<note.beat+note.duration&&now<rangeEnd());
    boards.forEach((board,i)=>{board.highlightedPositions=i===index?active:[];});
    if(now>=rangeEnd())cards.forEach(card=>{card.classList.remove('is-current');card.removeAttribute('aria-current');});
    const counting=!stopped&&anchorBeat<0&&now<0;
    play.classList.toggle('is-counting',counting);
    const preparation=Math.max(0,Math.min(1,(now+4)/4));
    play.style.setProperty('--count-in-progress',`${(reducedMotion.matches?Math.floor(preparation*4)/4:preparation)*360}deg`);
    cards.forEach((card,i)=>{
      const item=plan.entries[i]!,duration=item.block.endBeat-item.block.startBeat;
      const progress=stopped||(singleIndex!==null&&singleIndex!==i)?0:Math.max(0,Math.min(duration,now-item.offset));
      const input=card.querySelector<HTMLInputElement>('.study-progress')!;
      input.value=String(progress);input.style.setProperty('--study-progress',`${progress/duration*100}%`);
    });
    if(running&&now>=rangeEnd()){
      pause();
      if(loop.checked){beat=rangeStart();rendered=-1;void start();}
    }
    frame=requestAnimationFrame(draw);
  };
  const togglePlayback=()=>{if(running||starting)pause();else{rendered=-1;void start();}};
  play.setAttribute('aria-keyshortcuts','Space');play.title='Play (Espaço)';
  play.addEventListener('click',togglePlayback);
  const onTransportKey=(event:KeyboardEvent)=>{
    if(disposed||(event.code!=='Space'&&event.key!==' ')||event.altKey||event.ctrlKey||event.metaKey)return;
    event.preventDefault();
    if(!event.repeat)togglePlayback();
  };
  document.addEventListener('keydown',onTransportKey,true);
  get('song-stop').addEventListener('click',()=>{pause();stopped=true;singleIndex=null;beat=-4;rendered=-1;boards.forEach(board=>{board.highlightedPositions=[];});status.textContent='';});
  get('song-boards').addEventListener('click',event=>{
    if((event.target as HTMLElement).closest('.study-progress'))return;
    if(event.composedPath().some(node=>node instanceof HTMLElement&&node.tagName==='BUTTON'&&node.classList.contains('note')))return;
    const card=(event.target as HTMLElement).closest<HTMLElement>('.study-card');
    if(!card)return;
    pause();singleIndex=cards.indexOf(card);beat=rangeStart();rendered=-1;void start();
  });
  labels.addEventListener('change',()=>boards.forEach((board,i)=>setBoard(board,plan.entries[i]!.block)));
  bpmInput.addEventListener('input',()=>{const resume=running;pause();bpm=Number(bpmInput.value);get('song-bpm-value').textContent=`${bpm} BPM`;if(resume)void start();});
  for(const input of[melody,click])input.addEventListener('change',()=>{const resume=running;pause();if(resume)void start();});

  get('song-boards').addEventListener('fret-activate',event=>void auditionNote((event as CustomEvent<{midi:number}>).detail.midi));
  get('song-complete').addEventListener('change',()=>{get('song-storage').textContent=saveProgress(lesson.ref,get<HTMLInputElement>('song-complete').checked?'complete':'practice',1)?'':'Não foi possível salvar o progresso.';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&(running||starting)){pause();}});
  const readMore=app.querySelector<HTMLButtonElement>('#song-read-more');
  const disposeReader=readMore&&studyBook?mountStudyReader(readMore,studyGuide,lesson.id,()=>{
    pause();
    if(audition){void audition.close().catch(()=>{});audition=null;}
  }):()=>{};
  window.addEventListener('pagehide',()=>{disposed=true;document.removeEventListener('keydown',onTransportKey,true);pause();cancelAnimationFrame(frame);disposeReader();if(audition)void audition.close().catch(()=>{});},{once:true});
  renderCards();draw();
}
