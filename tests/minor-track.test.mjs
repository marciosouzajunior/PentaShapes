import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {buildFretboard} from '../public/components/music.mjs';
const vite=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
after(()=>vite.close());
const {minorTrack,minorBlocks,minorPracticeRegions}=await vite.ssrLoadModule('/src/minor-pentatonic.ts');
const {amRegions,amRegion,bmRegion,dmRegion}=await vite.ssrLoadModule('/src/caged-positions.ts');
const {validateTrack}=await vite.ssrLoadModule('/src/track-model.ts');
const {assembleLessonBlocks,studyCards,studyMapRoles,blockIndexAt}=await vite.ssrLoadModule('/src/song-content.ts');
const {lessonKey}=await vite.ssrLoadModule('/src/content-identity.ts');
const block=id=>minorBlocks.find(b=>b.id===id);
const keys=positions=>positions.map(p=>`${p.stringId}:${p.fret}`);

test('every lesson has valid sounding events, explicit chord references and one reading section',()=>{
  validateTrack(minorTrack);
  assert.equal(minorTrack.lessons.length,10);
  for(const lesson of minorTrack.lessons){
    assert.equal(minorTrack.guide.lessons.find(b=>b.lessonId===lesson.id).pages.length,1);
    assert.ok(assembleLessonBlocks(lesson,minorBlocks).beats>=8);
    assert.ok(!/^pm0/.test(lesson.ref.lessonId),'new musical tasks must not inherit completion from the discarded first version');
  }
  for(const b of minorBlocks){
    assert.ok(b.map.reference&&b.map.chordPositions.length);
    if(!['pm-chord','pm-shape'].includes(b.id)&&!['pm-map-','pm-reference-','pm-recall-'].some(prefix=>b.id.startsWith(prefix)))assert.ok(b.backing.length);
    assert.ok(b.notes.every(n=>keys(b.map.positions).includes(`${n.stringId}:${n.fret}`)));
    const model=buildFretboard({tonic:b.map.tonic,scaleId:b.map.scaleId,startFret:b.startFret,endFret:b.endFret,positions:b.map.positions,roles:studyMapRoles(b.map)});
    assert.ok(model.rows.flatMap(row=>row.notes).length>=b.map.positions.length);
  }
});
test('five A minor regions contain full pentatonics and recognizable, correctly named chord voicings',()=>{
  assert.deepEqual(amRegions.map(r=>r.form),['G menor','E menor','D menor','C menor','A menor']);
  for(const region of amRegions){
    assert.equal(region.positions.length,12);
    assert.deepEqual([...new Set(region.positions.map(p=>p.midi%12))].sort((a,b)=>a-b),[0,2,4,7,9]);
    assert.deepEqual([...new Set(region.chordPositions.map(p=>p.midi%12))].sort((a,b)=>a-b),region.chord==='Am7'?[0,4,7,9]:[0,4,9]);
    assert.equal(region.root.midi%12,9);
    assert.ok(keys(region.chordPositions).every(k=>keys(region.positions).includes(k)));
  }
  assert.deepEqual(amRegion.chordPositions.map(p=>p.fret),[5,7,7,5,5,5]);
  assert.deepEqual(dmRegion.chordPositions.map(p=>[p.stringId,p.fret]),[['a',5],['d',7],['g',7],['b',6],['e_high',5]]);
});
test('map styling distinguishes the actual grip from other available chord tones',()=>{
  const roles=studyMapRoles(block('pm-shape').map);
  const grip=roles.filter(p=>p.roles.includes('chord'));
  assert.deepEqual(keys(grip).sort(),keys(amRegion.chordPositions).sort());
  assert.ok(roles.some(p=>p.roles.includes('target')));
  assert.ok(roles.every(p=>[0,4,9].includes(p.midi%12)));
});
test('first lesson plays the entire scale up and down, with no call-and-response window',()=>{
  const scale=block('pm-shape'),notes=scale.notes,ascending=amRegion.positions.map(p=>p.midi).sort((a,b)=>a-b);
  assert.equal(scale.endBeat-scale.startBeat,22);
  assert.deepEqual(notes.map(n=>n.midi),[...ascending,...ascending.slice(1,-1).reverse()]);
  assert.deepEqual(notes.map(n=>n.beat),Array.from({length:22},(_,i)=>i));
  const repeated=[...notes,...notes];
  assert.ok(repeated.every((n,i)=>i===0||n.midi!==repeated[i-1].midi),'neither turning point repeats a note');
  assert.equal(notes.filter(n=>n.midi===45).length,1);
  assert.equal(notes.filter(n=>n.midi===72).length,1);
  assert.equal(notes.at(-1).midi,48);
  assert.ok(notes.every(n=>n.duration===.85));
  assert.equal(minorTrack.lessons[0].ref.lessonId,'am-scale-up-and-down');
  const lesson=minorTrack.lessons[0],plan=assembleLessonBlocks(lesson,minorBlocks),cards=studyCards(plan,lesson.referenceBlocks.map(block));
  assert.deepEqual(lesson.blocks,['pm-shape']);
  assert.equal(plan.beats,22);
  assert.deepEqual(plan.entries.map(e=>e.block.backing),[[]]);
  assert.equal(lesson.repeatByDefault,true);
  assert.equal(cards.entries[0].entryIndex,null);
  assert.equal(cards.entries[1].entryIndex,0);
  assert.deepEqual(cards.indices,[1]);
  assert.deepEqual(block('pm-chord').notes,[]);
});
test('transposition moves the chord, root, scale, phrase and accompaniment together',()=>{
  const a=block('pm-transpose-a'),b=block('pm-transpose-b');
  a.notes.forEach((n,i)=>assert.deepEqual(b.notes[i],{...n,fret:n.fret+2,midi:n.midi+2}));
  a.backing.forEach((n,i)=>assert.deepEqual(b.backing[i],{...n,midi:n.midi+2}));
  assert.deepEqual(bmRegion.positions.map(p=>p.midi),amRegion.positions.map(p=>p.midi+2));
  assert.equal(b.map.reference.root.fret,7);assert.equal(b.map.tonic,11);
});

test('each new position has its own lesson with a silent chord reference and one complete scale cycle',()=>{
  const lessons=['pm02','pm02c','pm02b','pm02d'].map(id=>minorTrack.lessons.find(l=>l.id===id));
  assert.deepEqual(lessons.map(l=>l.blocks.length),[1,1,1,1]);
  assert.deepEqual(lessons.flatMap(l=>l.blocks),['pm-map-d','pm-map-c','pm-map-a','pm-map-g']);
  assert.ok(lessons.every(l=>l.repeatByDefault&&l.mapStyle==='plain-degrees'));
  assert.ok(lessons.every(l=>l.ref.lessonId!=='am-five-chord-regions'));
  assert.equal(minorTrack.lessons[6].id,'pm03','existing later routes retain their musical task');
  for(const lesson of lessons){
    const plan=assembleLessonBlocks(lesson,minorBlocks);
    assert.equal(plan.beats,22);
    const reference=block(lesson.referenceBlocks[0]),cards=studyCards(plan,[reference]);
    assert.equal(cards.entries.length,2);
    assert.equal(cards.entries[0].entryIndex,null);
    assert.deepEqual(cards.indices,[1]);
    assert.deepEqual(reference.notes,[]);
    assert.deepEqual(reference.backing,[]);
    assert.deepEqual(reference.map.positions,reference.map.chordPositions);
    for(const id of lesson.blocks){
      const b=block(id),ascending=b.map.positions.map(p=>p.midi).sort((a,b)=>a-b);
      assert.deepEqual(b.notes.map(n=>n.midi),[...ascending,...ascending.slice(1,-1).reverse()]);
      assert.deepEqual(b.notes.map(n=>n.beat),Array.from({length:22},(_,i)=>i));
      assert.ok(b.notes.every(n=>n.duration===.85));
      assert.deepEqual(b.backing,[]);
      assert.deepEqual(b.cues,[]);
      const repeated=[...b.notes,...b.notes];
      assert.ok(repeated.every((n,i)=>i===0||n.midi!==repeated[i-1].midi));
    }
  }
});

test('source-informed references have correct bass notes, extensions, muted strings and scale membership',()=>{
  const expected=[
    {id:'d',name:'Am/C',grip:[['e_low',8],['d',7],['g',9],['b',10]],pitches:[48,57,64,69]},
    {id:'c',name:'Am7',grip:[['a',12],['d',10],['g',12],['b',13]],pitches:[57,60,67,72]},
    {id:'a',name:'Am7',grip:[['a',12],['d',14],['g',12],['b',13],['e_high',12]],pitches:[57,64,67,72,76]},
    {id:'g',name:'Am7(11)',grip:[['e_low',5],['d',5],['g',5],['b',3]],pitches:[45,55,60,62]},
  ];
  for(const [i,e] of expected.entries()){
    const region=minorPracticeRegions[i];
    assert.equal(region.id,e.id);assert.equal(region.chord,e.name);
    assert.deepEqual(region.chordPositions.map(p=>[p.stringId,p.fret]),e.grip);
    assert.deepEqual(region.chordPositions.map(p=>p.midi),e.pitches);
    assert.deepEqual(region.chordTones,[...new Set(e.pitches.map(m=>m%12))]);
    assert.ok(keys(region.chordPositions).every(k=>keys(region.positions).includes(k)));
    assert.equal(region.root.midi%12,9);
  }
  // Changing practice references must not turn the later Dm triad into Dm7.
  assert.deepEqual(dmRegion.chordTones,[2,5,9]);
});

test('root-string recap groups existing positions by the chosen tonic and keeps inversion bass distinct',()=>{
  const lesson=minorTrack.lessons.find(l=>l.id==='pm02-localizar');
  assert.equal(minorTrack.lessons[5],lesson);
  assert.equal(lesson.ref.lessonId,'locate-caged-by-root-string');
  assert.equal(lesson.mapStyle,'plain-degrees');
  assert.equal(lesson.repeatByDefault,true);
  const originals=['pm-shape','pm-map-g','pm-map-c','pm-map-a','pm-map-d'];
  assert.deepEqual(lesson.blocks,['pm-recall-e','pm-recall-g','pm-recall-c','pm-recall-a','pm-recall-d']);
  const roots=[];
  for(const [i,id] of lesson.blocks.entries()){
    const recap=block(id),original=block(originals[i]);
    assert.deepEqual(recap.notes,original.notes);
    assert.deepEqual(recap.map,original.map);
    assert.deepEqual(recap.backing,[]);
    roots.push(recap.map.reference.root);
  }
  assert.deepEqual(roots.map(p=>[p.stringId,p.fret,p.midi]),[
    ['e_low',5,45],['e_low',5,45],['a',12,57],['a',12,57],['d',7,57]
  ]);
  assert.equal(Math.min(...block('pm-recall-d').map.chordPositions.map(p=>p.midi)),48);
  assert.equal(roots[4].midi,57,'D form is located by A on string 4, not the C bass');
  const reading=minorTrack.guide.lessons.find(b=>b.lessonId===lesson.id).pages[0];
  assert.equal(reading.visual.kind,'table');
  assert.equal(reading.visual.rows.length,3);
  assert.equal(assembleLessonBlocks(lesson,minorBlocks).beats,110);
});
test('Dm is a complete D minor pentatonic in the same region, not Am plus F',()=>{
  const am=block('pm-locate-am'),dm=block('pm-locate-dm');
  assert.equal(am.startFret,dm.startFret);assert.equal(am.endFret,dm.endFret);
  assert.equal(am.map.tonic,9);assert.equal(dm.map.tonic,2);
  assert.deepEqual([...new Set(dm.map.positions.map(p=>p.midi%12))].sort((a,b)=>a-b),[0,2,5,7,9]);
  assert.deepEqual(dm.map.chordTones,[2,5,9]);
  assert.ok(!dm.map.positions.some(p=>p.midi%12===4));
});
test('the progression connects E to F at the change, then returns to the same two fixed cards for responses',()=>{
  const lesson=minorTrack.lessons.find(l=>l.id==='pm05'),plan=assembleLessonBlocks(lesson,minorBlocks),cards=studyCards(plan);
  assert.deepEqual(plan.entries.map(e=>e.offset),[0,4,8,12]);
  assert.equal(cards.entries.length,2);assert.deepEqual(cards.indices,[0,1,0,1]);
  for(const [beat,expected] of [[0,0],[4,1],[8,0],[12,1]])assert.equal(cards.indices[blockIndexAt(plan,beat)],expected);
  const e=plan.notes.find(n=>n.midi===64),f=plan.notes.find(n=>n.midi===65);
  assert.equal(e.beat+e.duration,4);assert.equal(f.beat,4);
  assert.equal(e.stringId,f.stringId);assert.equal(f.fret-e.fret,1);
  assert.ok(plan.notes.every(n=>n.beat+n.duration<=8));
  assert.ok(plan.entries.slice(2).every(e=>e.block.notes.length===0&&e.block.backing.length>0));
  assert.equal(new Set(minorTrack.lessons.map(l=>lessonKey(l.ref))).size,10);
});
test('final practice removes demonstrated melody and scale dots while preserving the chord shapes and full base',()=>{
  const plan=assembleLessonBlocks(minorTrack.lessons.find(l=>l.id==='pm06'),minorBlocks);
  assert.equal(plan.beats,16);assert.deepEqual(plan.notes,[]);
  for(const {block:b} of plan.entries){
    assert.deepEqual(b.map.positions,b.map.chordPositions);
    assert.equal(Math.max(...b.backing.map(n=>n.beat+n.duration)),7.85);
  }
});
test('validation rejects wrong pitch, broken chord reference and conflicting maps under one static card',()=>{
  const bad=structuredClone(minorTrack);bad.blocks.find(b=>b.id==='pm-shape').notes[0].midi++;
  assert.throws(()=>validateTrack(bad),/Posição inválida/);
  const root=structuredClone(minorTrack);root.blocks[0].map.reference.root=positionStub('b',5,64);
  assert.throws(()=>validateTrack(root),/Fundamental/);
  const conflict=structuredClone(minorTrack);conflict.blocks.find(b=>b.id==='pm-answer-am').title='Outro mapa';
  assert.throws(()=>validateTrack(conflict),/card precisa manter/);
});
function positionStub(stringId,fret,midi){return {stringId,fret,midi};}
