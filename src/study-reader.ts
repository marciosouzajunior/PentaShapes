import type { StudyGuide, StudyPage, StudyVisual } from './study-model';
import { intervalName, referenceRelation, studyNote } from './study-model';
import {pianoDiagram} from './piano-diagram';
import './study-reader.css';

const escape=(value:string)=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const letters=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const flats=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];

function positionsFigure(visual:Extract<StudyVisual,{kind:'positions'|'scale'}>):string{
  const strings=['e_high','b','g','d','a','e_low'];
  const count=visual.endFret-visual.startFret+1,cell=76;
  const right=50+count*cell,width=right+30;
  const labels=['e','B','G','D','A','E'];
  const grid=Array.from({length:count+1},(_,i)=>`<line x1="${50+i*cell}" y1="20" x2="${50+i*cell}" y2="212"/>`).join('');
  const rows=strings.map((_,i)=>`<text x="20" y="${44+i*31}" class="string-name">${labels[i]}</text><line x1="50" y1="${40+i*31}" x2="${right}" y2="${40+i*31}" class="string-line"/>`).join('');
  const frets=Array.from({length:count},(_,i)=>`<text x="${50+(i+.5)*cell}" y="235" class="fret-number">${visual.startFret+i}</text>`).join('');
  const point=(position:{stringId:string;fret:number})=>({x:50+(position.fret-visual.startFret+.5)*cell,y:40+strings.indexOf(position.stringId)*31});
  let arrow='';
  if(visual.kind==='positions'&&visual.showDirection&&visual.positions.length===2){
    const start=point(visual.positions[0]!),end=point(visual.positions[1]!);
    const length=Math.hypot(end.x-start.x,end.y-start.y);
    if(length>38){
      const dx=(end.x-start.x)/length,dy=(end.y-start.y)/length;
      const x1=start.x+dx*19,y1=start.y+dy*19,x2=end.x-dx*19,y2=end.y-dy*19;
      arrow=`<g class="fretboard-direction" aria-hidden="true"><path class="direction-line" d="M${x1} ${y1}L${x2} ${y2}"/><path d="M${x2-dx*8-dy*4} ${y2-dy*8+dx*4}L${x2} ${y2}L${x2-dx*8+dy*4} ${y2-dy*8-dx*4}"/></g>`;
    }
  }
  const notes=visual.positions.map(position=>{
    const x=50+(position.fret-visual.startFret+.5)*cell,y=40+strings.indexOf(position.stringId)*31;
    const name=(visual.kind==='positions'&&visual.spelling==='flat'?flats:letters)[position.midi%12]!;
    const root=visual.kind==='scale'?position.midi%12===visual.root%12:position.midi===visual.rootMidi;
    return `<circle cx="${x}" cy="${y}" r="14"${root?' class="position-root"':''}/><text x="${x}" y="${y+5}" class="position-note">${name}</text>`;
  }).join('');
  return `<figure><div class="reading-fretboard-scroll"><svg class="reading-fretboard" viewBox="0 0 ${width} 250" style="--reading-fretboard-width:${width}px" role="img" aria-label="${escape(visual.caption)}">${grid}${rows}${frets}${arrow}${notes}</svg></div><figcaption>${escape(visual.caption)}</figcaption></figure>`;
}

function visualMarkup(visual:StudyVisual):string{
  if(visual.kind==='positions'||visual.kind==='scale')return positionsFigure(visual);
  if(visual.kind==='fretboard-intervals'){
    return `<div class="reading-fretboard-intervals">${visual.targets.map(target=>{
      const [from,to]=visual.towardRoot?[target,visual.root]:[visual.root,target];
      return positionsFigure({kind:'positions',positions:[from!,to!],rootMidi:visual.root.midi,showDirection:true,startFret:visual.startFret,endFret:visual.endFret,caption:`${studyNote(from!.midi)} → ${studyNote(to!.midi)} · ${intervalName(to!.midi-from!.midi)}`});
    }).join('')}</div>`;
  }
  if(visual.kind==='interval'){
    const distances=visual.showName===false?[1,2]:visual.distances;
    const limit=Math.max(...distances),spelling=visual.spelling??'sharp';
    const endMidi=Math.floor((visual.root+limit)/12)*12+11;
    return `<figure class="reading-piano-figure"><div class="reading-intervals">${distances.map(distance=>`<div class="reading-interval">${pianoDiagram({from:visual.root,to:visual.root+distance,endMidi,spelling})}<div class="reading-interval-description"><strong>${studyNote(visual.root,spelling)} → ${studyNote(visual.root+distance,spelling)}</strong><span>${visual.showName===false?(distance===1?'uma casa na mesma corda':'um tom'):intervalName(distance)}<small class="reading-measure"> · ${distance} ${distance===1?'semitom':'semitons'}</small></span></div></div>`).join('')}</div>${visual.caption?`<figcaption>${escape(visual.caption)}</figcaption>`:''}</figure>`;
  }
  if(visual.kind==='degrees'){
    return `<figure><div class="reading-references">${(['e','a'] as const).map(reference=>{
      const relation=referenceRelation(reference);
      return `<div><strong>${studyNote(relation.root)} → Si</strong><span>Si é o <b>${relation.degree}º grau</b></span><small>${relation.distance} semitons de distância</small></div>`;
    }).join('')}</div><figcaption>A nota Si tem a mesma altura nos dois exemplos. A referência muda sua relação.</figcaption></figure>`;
  }
  if(visual.kind==='alternation'){
    return `<figure class="reading-alternation-figure"><svg class="reading-alternation" viewBox="0 0 320 200" role="img" aria-label="${escape(visual.caption)}"><g class="alternation-arrows" fill="none"><path d="M85 65C120 10 200 10 235 65"/><path d="M224 60L235 65L232 53"/><path d="M235 135C200 190 120 190 85 135"/><path d="M88 147L85 135L97 140"/></g>${visual.notes.map((midi,i)=>`<text x="${i===0?60:260}" y="106" class="alternation-note">${studyNote(midi,visual.spelling??'sharp')}</text>`).join('')}<text x="160" y="105" class="alternation-interval">${escape(visual.intervalLabel??intervalName(Math.abs(visual.notes[1]-visual.notes[0])))}</text></svg>${visual.showCaption===false?'':`<figcaption>${escape(visual.caption)}</figcaption>`}</figure>`;
  }
  if(visual.kind==='path'){
    return `<figure><div class="reading-path${visual.compact?' reading-path-compact':''}">${visual.notes.map((midi,i)=>{
      const next=visual.notes[i+1],distance=next===undefined?0:Math.abs(next-midi);
      return `<strong>${studyNote(midi,visual.spelling??'sharp')}</strong>${next===undefined?'':`<span><b aria-hidden="true">${next>midi?'↗':next<midi?'↘':'→'}</b><small>${distance>=8?intervalName(distance):`${distance} ${distance===1?'semitom':'semitons'}`}</small></span>`}`;
    }).join('')}</div>${visual.showCaption===false?'':`<figcaption>${escape(visual.caption)}</figcaption>`}</figure>`;
  }
  const roles=visual.kind==='chord'?visual.roles:visual.degrees;
  return `<figure><div class="reading-notes">${visual.notes.map((midi,i)=>`<div><strong>${studyNote(midi)}</strong><small>${escape(roles[i]!)}</small></div>`).join('')}</div><figcaption>${escape(visual.caption)}</figcaption></figure>`;
}

/** A continuous reading view. Diagrams are static; practice happens on the instrument. */
export function mountStudyReader(trigger:HTMLButtonElement,guide:StudyGuide,lessonId:string,onOpen:()=>void):()=>void{
  const dialog=document.createElement('dialog');
  dialog.className='study-reader';
  dialog.id='song-study-reader';
  dialog.setAttribute('aria-labelledby',`${dialog.id}-title`);
  trigger.setAttribute('aria-haspopup','dialog');
  trigger.setAttribute('aria-controls',dialog.id);
  const topic=(page:StudyPage,id:string)=>`<section class="reader-topic" aria-labelledby="${id}"><h2 id="${id}" tabindex="-1">${escape(page.title)}</h2><div class="reader-prose">${page.paragraphs.map(paragraph=>`<p>${escape(paragraph)}</p>`).join('')}</div><div class="reader-visual">${visualMarkup(page.visual)}</div><p class="reader-practice"><span class="reader-practice-icon" aria-hidden="true">♪</span><span><span class="sr-only">No instrumento: </span>${escape(page.practice)}</span></p></section>`;
  dialog.innerHTML=`
    <header class="reader-header"><div><p>Caderno de estudo · Purple Haze</p><strong id="${dialog.id}-title">${escape((guide.lessons.find(book=>book.lessonId===lessonId)??guide.lessons[0])?.title??guide.title)}</strong></div><button type="button" class="reader-close" aria-label="Fechar leitura" autofocus>×</button></header>
    <div class="reader-scroll" tabindex="0" aria-label="Conteúdo da leitura"><article class="reader-page">
      ${guide.lessons.map(book=>`<div class="reader-lesson" id="reading-${book.lessonId}">${book.pages.map((page,i)=>topic(page,`reading-${book.lessonId}-topic-${i}`)).join('')}</div>`).join('')}
    </article></div>
    <footer class="reader-footer"><button type="button" class="reader-return">Voltar à prática →</button></footer>`;
  document.body.append(dialog);
  const scroll=dialog.querySelector<HTMLElement>('.reader-scroll')!;
  const storageKey=`pentashapes.study-reader.v1:${guide.id??guide.title}:${lessonId}`;
  const topics=Array.from(dialog.querySelectorAll<HTMLElement>('.reader-topic'));
  type ReadingPosition={topicId:string;progress:number};
  let position:ReadingPosition|null=null;
  try{
    const entryKey=`pentashapes.study-reader-entry.v1:${guide.id??guide.title}`;
    const previousLesson=sessionStorage.getItem(entryKey);
    const changedLesson=previousLesson!==null&&previousLesson!==lessonId;
    sessionStorage.setItem(entryKey,lessonId);
    if(changedLesson)localStorage.removeItem(storageKey);
    const stored=changedLesson?null:JSON.parse(localStorage.getItem(storageKey)??'null');
    if(stored&&typeof stored.topicId==='string'&&typeof stored.progress==='number'&&Number.isFinite(stored.progress)&&stored.progress>=0&&stored.progress<=1&&topics.some(topic=>topic.querySelector('h2')!.id===stored.topicId))position=stored;
  }catch{ /* Reading remains available when local storage is unavailable. */ }
  const rememberPosition=()=>{
    if(!dialog.open)return;
    const line=scroll.getBoundingClientRect().top+parseFloat(getComputedStyle(scroll).paddingTop);
    let current=topics[0];
    for(const topic of topics){
      if(topic.getBoundingClientRect().top>line+1)break;
      current=topic;
    }
    if(current){
      const rect=current.getBoundingClientRect();
      position={topicId:current.querySelector('h2')!.id,progress:Math.max(0,Math.min(1,(line-rect.top)/rect.height))};
    }
  };
  const savePosition=()=>{
    rememberPosition();
    if(position)try{localStorage.setItem(storageKey,JSON.stringify(position));}catch{ /* Keep the in-memory bookmark. */ }
  };
  const title=dialog.querySelector<HTMLElement>(`#${dialog.id}-title`)!;
  const chapters=guide.lessons.map(book=>({book,heading:dialog.querySelector<HTMLElement>(`#reading-${book.lessonId} h2`)!}));
  const updateTitle=()=>{
    if(!dialog.open)return;
    const readingLine=scroll.getBoundingClientRect().top+parseFloat(getComputedStyle(scroll).paddingTop)+1;
    let current=chapters[0];
    for(const chapter of chapters){
      if(chapter.heading.getBoundingClientRect().top>readingLine)break;
      current=chapter;
    }
    if(current&&title.textContent!==current.book.title)title.textContent=current.book.title;
  };
  const onScroll=()=>{updateTitle();rememberPosition();};
  scroll.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('pagehide',savePosition);
  const resizeObserver=new ResizeObserver(updateTitle);
  resizeObserver.observe(scroll);
  const open=()=>{
    if(dialog.open)return;
    onOpen();
    document.documentElement.classList.add('study-reading');
    dialog.showModal();
    if(position){
      const heading=topics.find(topic=>topic.querySelector('h2')!.id===position!.topicId)!.querySelector<HTMLElement>('h2')!;
      const topic=heading.closest<HTMLElement>('.reader-topic')!;
      scroll.scrollTop+=topic.getBoundingClientRect().top-scroll.getBoundingClientRect().top-parseFloat(getComputedStyle(scroll).paddingTop)+position.progress*topic.getBoundingClientRect().height;
      scroll.focus({preventScroll:true});
      updateTitle();return;
    }
    const anchor=dialog.querySelector<HTMLElement>(`#reading-${lessonId}`);
    if(anchor){
      const heading=anchor.querySelector<HTMLElement>('h2')!;
      heading.focus({preventScroll:true});
      const padding=parseFloat(getComputedStyle(scroll).paddingTop);
      scroll.scrollTop+=heading.getBoundingClientRect().top-scroll.getBoundingClientRect().top-padding;
    }else{
      scroll.scrollTop=0;
      dialog.querySelector<HTMLButtonElement>('.reader-close')!.focus({preventScroll:true});
    }
    updateTitle();
  };
  trigger.addEventListener('click',open);
  dialog.addEventListener('close',()=>{
    if(dialog.open)return;
    savePosition();
    document.documentElement.classList.remove('study-reading');
    if(trigger.isConnected)trigger.focus({preventScroll:true});
  });
  dialog.addEventListener('cancel',savePosition);
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const controls=Array.from(dialog.querySelectorAll<HTMLElement>('button,[tabindex="0"]')).filter(control=>control.getClientRects().length>0);
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  });
  dialog.addEventListener('click',event=>{
    if((event.target as HTMLElement).closest('.reader-close,.reader-return')){savePosition();dialog.close();}
    else if(event.target===dialog){
      const rect=dialog.getBoundingClientRect();
      if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom){savePosition();dialog.close();}
    }
  });
  // First opening starts at the lesson; later openings resume the reading bookmark.
  scroll.addEventListener('keydown',event=>{
    if(event.key==='Home'&&event.ctrlKey){event.preventDefault();scroll.scrollTop=0;}
  });
  return ()=>{
    if(dialog.open)savePosition();
    if(dialog.open)dialog.close();
    resizeObserver.disconnect();scroll.removeEventListener('scroll',onScroll);window.removeEventListener('pagehide',savePosition);
    trigger.removeEventListener('click',open);dialog.remove();
    document.documentElement.classList.remove('study-reading');
  };
}
