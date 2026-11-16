import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';

const vite=await createServer({configFile:false,logLevel:'silent',optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
after(()=>vite.close());
const {resolveLocale,localeFromPath,localePath,localeHome,landingLocale,preferredLocale,saveLocale}=await vite.ssrLoadModule('/src/locale.ts');
const {tracks,archivedTracks}=await vite.ssrLoadModule('/src/legacy-track-content.ts');
const {englishTracks,tracksForLocale,allRouteTracks}=await vite.ssrLoadModule('/src/track-locales.ts');
const {playableLessons}=await vite.ssrLoadModule('/src/content-catalog.ts');
const {renderSongLesson}=await vite.ssrLoadModule('/src/song.ts');
const {validateTrack}=await vite.ssrLoadModule('/src/track-model.ts');
const {readProgress,saveProgress}=await vite.ssrLoadModule('/src/progress.ts');
const {studyTextMarkup}=await vite.ssrLoadModule('/src/study-reader.ts');
const {studyNote,intervalName}=await vite.ssrLoadModule('/src/study-model.ts');
const {phaseCueAt,missionRound}=await vite.ssrLoadModule('/src/song-missions.ts');
const {tracks:defaultTracks,purpleTrack:defaultPurple}=await vite.ssrLoadModule('/src/tracks.ts');
const {DEFAULT_LOCALE,ui}=await vite.ssrLoadModule('/src/locale.ts');

test('English is the public authoring and rendering default, with stable compatibility identities',()=>{
  assert.equal(DEFAULT_LOCALE,'en');
  assert.equal(defaultTracks,englishTracks);
  assert.equal(tracksForLocale(),englishTracks);
  assert.ok(defaultTracks.every(track=>track.manifest.language==='en'));
  assert.equal(defaultPurple.manifest.language,'en');
  assert.equal(ui('en','Prepare'),'Prepare');assert.equal(ui('pt-BR','Prepare'),'Preparar');
  assert.equal(intervalName(12),'octave');
  assert.equal(missionRound(8).measures[0].label,'Listen');
  const track=defaultTracks.find(track=>!track.manifest.musicalWork);
  assert.equal(track.manifest.slug,'minor-pentatonic-part-1');
  assert.equal(track.lessons[0].id,'first-path');
  assert.equal(track.lessons[0].ref.lessonId,'primeiro-caminho');
});

test('locale selection respects manual choice, browser order and supported regional variants',()=>{
  assert.equal(resolveLocale('pt-BR',['en-US']),'pt-BR');
  assert.equal(resolveLocale('en',['pt-PT']),'en');
  assert.equal(resolveLocale(null,['fr','pt-PT','en-US']),'pt-BR');
  assert.equal(resolveLocale('invalid',['en-GB','pt-BR']),'en');
  assert.equal(resolveLocale(null,['pt']),'pt-BR');
  assert.equal(resolveLocale(null,['de','fr']),'en');
  assert.equal(resolveLocale(null,[]),'en');
  assert.equal(localeFromPath('/en/track/purple-haze/'),'en');
  assert.equal(localeFromPath('/track/purple-haze/'),'pt-BR');
  assert.equal(localePath('/#tracks','en'),'/en/#tracks');
  assert.equal(landingLocale('?lang=pt-BR','en'),'pt-BR');
  assert.equal(landingLocale('','en'),'en');
  assert.equal(localeHome('pt-BR'),'/?lang=pt-BR');
});

test('blocked preference storage still allows browser detection',()=>{
  const storage=globalThis.localStorage,navigator=Object.getOwnPropertyDescriptor(globalThis,'navigator');
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{languages:['pt-PT'],language:'en-US'}});
  globalThis.localStorage={getItem(){throw new Error('blocked');},setItem(){throw new Error('blocked');}};
  try{assert.equal(preferredLocale(),'pt-BR');assert.doesNotThrow(()=>saveLocale('en'));}
  finally{globalThis.localStorage=storage;if(navigator)Object.defineProperty(globalThis,'navigator',navigator);else delete globalThis.navigator;}
});

test('English variants retain every musical event and map while using distinct progress identities',()=>{
  assert.equal(englishTracks.length,2);
  assert.equal(englishTracks.flatMap(t=>t.lessons).length,12);
  assert.equal(tracksForLocale('pt-BR'),tracks);
  assert.ok(archivedTracks.every(t=>allRouteTracks.includes(t)));
  for(const [index,en] of englishTracks.entries()){
    const pt=tracks[index];validateTrack(en);
    assert.equal(en.manifest.id,`${pt.manifest.id}-en`);
    assert.equal(en.bpm,pt.bpm);
    for(const [i,b] of en.blocks.entries()){
      assert.deepEqual(b.notes,pt.blocks[i].notes);assert.deepEqual(b.backing,pt.blocks[i].backing);
      assert.deepEqual(b.map?.positions,pt.blocks[i].map?.positions);
      assert.deepEqual(b.map?.chordPositions,pt.blocks[i].map?.chordPositions);
      assert.equal(b.responseBeat,pt.blocks[i].responseBeat);
    }
    for(const [i,l] of en.lessons.entries()){
      assert.equal(l.href,`/en${pt.lessons[i].href}`);
      assert.equal(l.ref.trackId,en.manifest.id);
      assert.ok(playableLessons.some(item=>item.href===l.href));
      assert.deepEqual(l.blocks,pt.lessons[i].blocks);
    }
  }
  const store=new Map(),previous=globalThis.localStorage;
  globalThis.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value)};
  try{
    const pt=tracks[0].lessons[0].ref,en=englishTracks[0].lessons[0].ref;
    saveProgress(pt,'practice');saveProgress(en,'complete');
    assert.equal(readProgress(pt).step,'practice');assert.equal(readProgress(en).step,'complete');
    const historic={source:'system',trackId:'minor-pentatonic-part-one-en',lessonId:'corda-la'};
    saveProgress(historic,'complete');
    const canonical=englishTracks[0].lessons.find(lesson=>lesson.id==='another-starting-point');
    assert.deepEqual(canonical.ref,historic);
    assert.equal(readProgress(canonical.ref).step,'complete');
  }finally{globalThis.localStorage=previous;}
});

test('all English mission templates render translated controls, reading and accessible descriptions',()=>{
  const captured=new Error('template captured');
  for(const track of englishTracks)for(const lesson of track.lessons){
    let html='';const app={set innerHTML(value){html=value;throw captured;}};
    assert.throws(()=>renderSongLesson(app,lesson,track),error=>error===captured);
    assert.match(html,/>Prepare<|>Play</);
    assert.match(html,/Show scale degrees/);
    assert.match(html,/href="\/en\/#tracks"/);
    assert.doesNotMatch(html,/\[\[(?:note|degree|chord):/);
    assert.doesNotMatch(html,/Preparar|Mostrar graus|Ouvir|Ajustes|Próxima|concluída|Notas no braço|Sobreposição|semitom|Experimente|cordas|Voltar|Velocidade|Pausar|Espaço/);
  }
});

test('English musical markup and phase behavior do not depend on translated labels',()=>{
  assert.equal(studyTextMarkup('A phrase in E.','en'),'A phrase in E.');
  assert.match(studyTextMarkup('Play [[note:A]] over [[chord:Am]].','en'),/music-token--note">A/);
  assert.equal(studyNote(46,'flat','en'),'B♭');assert.equal(intervalName(6,'en'),'tritone · lowered fifth');
  assert.equal(missionRound(8,undefined,'en').measures[0].label,'Listen');
  const cue=phaseCueAt([{beat:0,kind:'along',label:'arbitrary display text'}],0);
  assert.equal(cue.kind,'along');
  for(const track of englishTracks)for(const block of track.blocks)for(const phase of block.phaseCues??[])assert.ok(phase.kind);
});

test('mission rendering passes the selected locale to boards with and without explicit maps',()=>{
  const names=['document','window'];
  const previous=new Map(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
  const captured=new Error('board configured');
  try{
    globalThis.document={addEventListener(){}};
    globalThis.window={addEventListener(){},matchMedia:()=>({matches:false})};
    for(const locale of ['pt-BR','en'])for(const track of tracksForLocale(locale))for(const lesson of track.lessons){
      let configuration;
      const board={classList:{toggle(){}},setAttribute(){},set configuration(value){configuration=value;throw captured;}};
      const card={querySelector:()=>board};
      const elements=new Map();
      const element=selector=>{
        if(!elements.has(selector))elements.set(selector,{
          classList:{toggle(){}},style:{setProperty(){}},dataset:{},
          addEventListener(){},setAttribute(){},append(){},
          querySelector:()=>null,
          querySelectorAll:query=>selector==='#song-boards'&&query==='.study-card'?[card]:[],
        });
        return elements.get(selector);
      };
      const app={innerHTML:'',querySelector:selector=>['.mission-route','#mission-celebration','#song-read-more'].includes(selector)?null:element(selector),querySelectorAll:()=>[]};
      assert.throws(()=>renderSongLesson(app,lesson,track),error=>error===captured,`${locale}: ${lesson.id}`);
      assert.equal(configuration.locale,locale,`${locale}: ${lesson.id}`);
    }
  }finally{
    for(const [name,descriptor] of previous){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else delete globalThis[name];}
  }
});

test('letter note names and accidentals are shared by Portuguese and English',()=>{
  for(let midi=40;midi<=84;midi++)for(const spelling of ['sharp','flat']){
    assert.equal(studyNote(midi,spelling,'pt-BR'),studyNote(midi,spelling,'en'));
    assert.match(studyNote(midi,spelling,'pt-BR'),/^[A-G][♯♭]?$/);
  }
  for(const track of [...tracks,...englishTracks]){
    const presentation=JSON.stringify({lessons:track.lessons,guide:track.guide,blocks:track.blocks.map(({title})=>title)});
    assert.doesNotMatch(presentation,/(?<![\p{L}\p{N}_])(?:Dó|Ré|Mi|Fá|Sol|Lá|Si|Lás|Sóis)(?:[♭♯]?)(?![\p{L}\p{N}_])/u);
  }
});

test('entrypoint routes English catalog and track URLs and preserves explicit Portuguese visits',async()=>{
  const names=['document','location','history','navigator','HTMLElement','customElements','localStorage'];
  const previous=new Map(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
  const captured=new Error('render captured');
  try{
    Object.defineProperty(globalThis,'HTMLElement',{configurable:true,writable:true,value:class{}});
    Object.defineProperty(globalThis,'customElements',{configurable:true,writable:true,value:{get:()=>true}});
    Object.defineProperty(globalThis,'navigator',{configurable:true,value:{languages:['en-US'],language:'en-US'}});
    globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
    globalThis.history={replaceState(){assert.fail('Track URLs must not be rewritten');}};
    const cases=[
      ['/en/','',/Choose a track/,null],
      ['/en/track/purple-haze/','',/An octave apart/,null],
      ['/en/track/purple-haze/s02/','',/The answering riff/,null],
      ['/en/track/minor-pentatonic-part-1/another-starting-point/','',/Another starting point/,null],
      ['/en/track/purple-haze/s02-variation/','',/The rising A/,null],
      ['/en/track/pentatonica-menor-parte-1/corda-la/','',/Choose a track/,null],
      ['/en/track/purple-haze/s02-variacao/','',/Choose a track/,null],
      ['/track/rock-em-movimento/s01/','',/Escolha uma trilha/,null],
      ['/track/purple-haze/s01/','',/Uma oitava distante/,null],
      ['/','?lang=pt-BR',/Escolha uma trilha/,null],
      ['/','',/Choose a track/,'/en/'],
    ];
    for(const [index,[pathname,search,expected,redirect]] of cases.entries()){
      let html='',replaced=null;
      globalThis.document={documentElement:{lang:''},querySelector:selector=>selector==='#app'?{set innerHTML(value){html=value;throw captured;}}:{setAttribute(){}}};
      globalThis.location={pathname,search,hash:'',replace(value){replaced=value;}};
      await assert.rejects(()=>vite.ssrLoadModule(`/src/main.ts?routeTest=${index}`),error=>error===captured);
      assert.match(html,expected,pathname);assert.equal(replaced,redirect);
      if(pathname==='/en/')assert.match(html,/href="\/en\/track\/purple-haze\/"/);
    }
  }finally{
    for(const [name,descriptor] of previous){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else delete globalThis[name];}
  }
});
