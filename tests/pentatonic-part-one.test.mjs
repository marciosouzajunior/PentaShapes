import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const vite=await createServer({configFile:false,optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
after(()=>vite.close());
const {minorPartOneTrack:track}=await vite.ssrLoadModule('/src/pentatonic-part-one.ts');
const {validateTrack}=await vite.ssrLoadModule('/src/track-model.ts');
const {assembleLessonBlocks,midiPitch}=await vite.ssrLoadModule('/src/song-content.ts');
const {tracks,archivedTracks}=await vite.ssrLoadModule('/src/tracks.ts');
const {playableLessons}=await vite.ssrLoadModule('/src/content-catalog.ts');
const block=id=>track.blocks.find(b=>b.id===id);

test('six missions use the shared experience with independent progress and reachable old lessons',()=>{
  validateTrack(track);
  assert.equal(track.lessons.length,6);
  assert.ok(tracks.some(t=>t.manifest.id===track.manifest.id));
  const previous=archivedTracks.find(t=>t.manifest.id==='caged-penta-menor');
  assert.ok(previous);
  assert.ok(previous.lessons.every(l=>playableLessons.some(p=>p.href===l.href)));
  for(const lesson of track.lessons){
    assert.equal(lesson.ref.trackId,track.manifest.id);
    assert.equal(lesson.mission.practiceMode,'along');
    assert.equal(lesson.mission.boardDisplay,'current');
    assert.ok(lesson.mission.exampleBeats<=assembleLessonBlocks(lesson,track.blocks).beats);
    assert.equal(track.guide.lessons.find(b=>b.lessonId===lesson.id).pages.length,1);
  }
});

test('closed scale cycles cover all strings, turn without repeated endpoints, and fill whole measures',()=>{
  for(const b of track.blocks.filter(b=>b.endBeat===44)){
    assert.equal(b.notes.length,88);
    assert.equal(new Set(b.notes.map(n=>n.stringId)).size,6);
    const pcs=[0,3,5,7,10].map(i=>(b.map.tonic+i)%12);
    assert.deepEqual([...new Set(b.notes.map(n=>n.midi%12))].sort((a,b)=>a-b),pcs.sort((a,b)=>a-b));
    assert.ok(b.notes.every(n=>midiPitch(n)===n.midi));
    for(let i=0;i<b.notes.length;i++){
      const next=b.notes[(i+1)%b.notes.length];
      assert.notEqual(b.notes[i].midi,next.midi,'no duplicated turning note or duplicated cycle seam');
      assert.ok(Math.abs(b.notes[i].midi-next.midi)<=3,'one pentatonic step at a time');
    }
    assert.equal(b.endBeat%4,0);
  }
});

test('transport moves every position and pitch together and deliberately returns to the familiar tonic',()=>{
  const original=block('e-am');
  for(const [id,shift] of [['e-gm',-2],['e-bm',2]]){
    const moved=block(id);
    assert.deepEqual(moved.notes.map(n=>n.midi),original.notes.map(n=>n.midi+shift));
    assert.deepEqual(moved.map.chordPositions.map(p=>p.fret),original.map.chordPositions.map(p=>p.fret+shift));
  }
  const plan=assembleLessonBlocks(track.lessons[1],track.blocks);
  assert.deepEqual(plan.entries.map(e=>e.block.map.tonic),[9,7,9,11]);
  assert.deepEqual(plan.entries.map(e=>e.offset),[0,44,88,132]);
  assert.notEqual(plan.entries.at(-1).block.map.tonic,plan.entries[0].block.map.tonic,'loop must change context instead of holding Am twice');
});

test('all vamps match the declared minor harmony and leave space for sustained sounds',()=>{
  for(const b of track.blocks){
    const chord=[0,3,7,10].map(i=>(b.map.tonic+i)%12);
    assert.ok(b.backing.length>0);
    for(const n of b.backing){
      if(n.instrument!=='drum-kit')assert.ok(chord.includes(n.midi%12),`${b.id}: accompaniment outside its minor-seventh chord`);
      assert.ok(n.beat>=0&&n.duration>0&&n.beat+n.duration<=b.endBeat);
    }
    assert.ok(b.notes.every(n=>b.map.positions.some(p=>p.stringId===n.stringId&&p.fret===n.fret)));
  }
});

test('phrase practice and harmonic bridge have real silent response windows over a continuing base',()=>{
  assert.equal(block('phrase-listen').endBeat,8);
  assert.equal(block('phrase-answer').endBeat,16);
  assert.equal(block('phrase-answer').notes.length,0);
  assert.equal(block('phrase-answer').responseBeat,0);
  const am=block('bridge-am-listen'),dm=block('bridge-dm-listen');
  assert.equal(am.notes.at(-1).midi,64);
  assert.equal(dm.notes[0].midi,65);
  assert.equal(am.notes.at(-1).stringId,dm.notes[0].stringId);
  assert.equal(dm.notes[0].fret-am.notes.at(-1).fret,1);
  assert.ok(['bridge-am-answer','bridge-dm-answer'].every(id=>!block(id).notes.length&&block(id).backing.length));
});

test('sixth-string scale practice uses a sampled band with predictable piano entrances',()=>{
  for(const id of ['e-am','e-gm','e-bm']){
    const b=block(id);
    assert.equal(b.backingGain,.85);
    assert.deepEqual([...new Set(b.backing.map(n=>n.instrument))],['electric-piano']);
    const bass=b.backing.filter(n=>n.instrument==='finger-bass');
    assert.equal(bass.length,0);
    assert.equal(b.backing.filter(n=>n.instrument==='drum-kit').length,0);
    assert.ok(b.backing.every(n=>Number.isInteger(n.beat)),'keyboard stays on the beat');
    const piano=b.backing.filter(n=>n.instrument==='electric-piano');
    assert.equal(piano.length,24);
    assert.ok(piano.every(n=>n.duration<=2.5),'short keyboard chords leave space for the drum pulse');
    assert.deepEqual([...new Set(piano.map(n=>n.beat))],[0,8,16,24,32,40]);
    for(const beat of [0,8,16,24,32,40])assert.deepEqual(piano.filter(n=>n.beat===beat).map(n=>n.midi),piano.slice(0,4).map(n=>n.midi));
    assert.equal(piano[0].midi%12,b.map.tonic,'keyboard itself supplies the root');
    assert.ok(piano.some(n=>(n.midi-b.map.tonic+12)%12===10),'minor seventh belongs to the declared harmony');
    assert.ok(b.backing.every(n=>n.velocity>=0&&n.velocity<=1));
  }
  assert.equal(track.lessons[0].mission.metronomeByDefault,false);
  assert.equal(track.lessons[1].mission.metronomeByDefault,false);
});

test('final journey starts in fourths, returns by the reverse route and offers two answer measures per context',()=>{
  const plan=assembleLessonBlocks(track.lessons[5],track.blocks);
  assert.deepEqual(plan.entries.map(e=>e.block.map.tonic),[9,2,7,2,9]);
  assert.equal(plan.beats,80);
  for(const {block:b} of plan.entries){
    assert.equal(b.endBeat,16);
    assert.equal(b.responseBeat,8);
    assert.ok(b.notes.every(n=>n.beat+n.duration<=8));
    assert.ok(b.backing.some(n=>n.beat>=12));
  }
});

test('validation rejects an example that intrudes into a declared answer window',()=>{
  const changed=structuredClone(track);
  const b=changed.blocks.find(b=>b.id==='journey-am');
  b.notes=b.notes.map((note,index)=>index===0?{...note,duration:9}:note);
  assert.throws(()=>validateTrack(changed),/resposta/);
});
