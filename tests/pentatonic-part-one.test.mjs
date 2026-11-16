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
const {studyTextMarkup}=await vite.ssrLoadModule('/src/study-reader.ts');
const block=id=>track.blocks.find(b=>b.id===id);

test('didactic prose distinguishes notes and chords automatically while degrees stay semantic',()=>{
  const markup=studyTextMarkup('Mi é a [[degree:5]] de Am; procure a casa 5 e <ouça Ré>.');
  assert.match(markup,/music-token--note">Mi<\/span>/);
  assert.match(markup,/music-token--degree">5<\/span>/);
  assert.match(markup,/music-token--chord">Am<\/span>/);
  assert.match(markup,/casa 5/);
  assert.doesNotMatch(markup,/music-token--degree">5<\/span> e/);
  assert.match(markup,/&lt;ouça <span class="music-token music-token--note">Ré<\/span>&gt;/);
  assert.equal(studyTextMarkup('Em cada acorde, toque Em.'),'Em cada acorde, toque Em.');
  assert.match(studyTextMarkup('Toque [[chord:Em]].'),/music-token--chord">Em<\/span>/);
  assert.match(studyTextMarkup('Toque [[chord:E7♯9]].'),/music-token--chord">E7♯9<\/span>/);
  assert.match(studyTextMarkup('A base passa por [[chord:Mi]] e [[chord:Sol]].'),/music-token--chord">Mi<\/span> e <span class="music-token music-token--chord">Sol<\/span>/);
});

test('degree chips are consistent in the early mission readings without styling fret numbers',()=>{
  const foundation=track.guide.lessons.find(lesson=>lesson.lessonId==='primeiro-caminho').pages[0];
  const relationships=studyTextMarkup(foundation.paragraphs[3]);
  for(const degree of ['1','♭3','5','4','♭7'])assert.match(relationships,new RegExp(`music-token--degree">${degree}<\\/span>`));
  const fingering=studyTextMarkup(foundation.paragraphs[2]);
  assert.doesNotMatch(fingering,/music-token--degree/);
  assert.match(fingering,/casa 5/);
  const transport=track.guide.lessons.find(lesson=>lesson.lessonId==='outros-lugares').pages[0];
  assert.equal((studyTextMarkup(transport.paragraphs[0]).match(/music-token--degree/g)??[]).length,3);
});

test('all track readers reserve accidental degree symbols for semantic degree markup',()=>{
  const texts=[];
  for(const candidate of [...tracks,...archivedTracks]){
    for(const lesson of candidate.lessons)texts.push(lesson.instruction,lesson.mission?.scene.text,lesson.mission?.playInstruction);
    for(const book of candidate.guide.lessons)for(const page of book.pages){
      texts.push(...page.paragraphs,page.practice,page.visual.caption);
      if(page.visual.kind==='table')texts.push(...page.visual.columns,...page.visual.rows.flat());
    }
  }
  for(const value of texts.filter(Boolean)){
    const unmarked=value.replaceAll(/\[\[(?:degree|note|chord):[^\]]+\]\]/g,'');
    assert.doesNotMatch(unmarked,/[♭♯][1-9]/,value);
  }
});

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
    assert.ok(lesson.mission.exampleBeats<=assembleLessonBlocks(lesson,track.blocks).beats);
    assert.equal(track.guide.lessons.find(b=>b.lessonId===lesson.id).pages.length,1);
  }
});

test('the foundation uses two closed scale cycles instead of an endurance loop',()=>{
  const b=block('e-am');
  assert.equal(b.endBeat,24);
  assert.equal(b.notes.length,45);
  assert.equal(new Set(b.notes.map(n=>n.stringId)).size,6);
  const pcs=[0,3,5,7,10].map(i=>(b.map.tonic+i)%12);
  assert.deepEqual([...new Set(b.notes.map(n=>n.midi%12))].sort((a,b)=>a-b),pcs.sort((a,b)=>a-b));
  assert.ok(b.notes.every(n=>midiPitch(n)===n.midi));
  assert.deepEqual(b.notes.slice(0,22).map(n=>n.midi),b.notes.slice(22,44).map(n=>n.midi));
  for(let i=0;i<43;i++){
    const next=b.notes[i+1];
    assert.notEqual(b.notes[i].midi,next.midi,'no duplicated turning note or duplicated cycle seam');
    assert.ok(Math.abs(b.notes[i].midi-next.midi)<=3,'one pentatonic step at a time');
  }
  assert.deepEqual({...b.notes.at(-1),sourceTicks:undefined},{...b.notes[0],beat:22,duration:2,sourceTicks:undefined});
  assert.equal(b.endBeat%4,0);
});

test('transport moves one scale pass and the same motif before a concise return to Am',()=>{
  const original=block('transport-am');
  for(const [id,shift] of [['transport-gm',-2],['transport-bm',2]]){
    const moved=block(id);
    assert.deepEqual(moved.notes.map(n=>n.midi),original.notes.map(n=>n.midi+shift));
    assert.deepEqual(moved.map.chordPositions.map(p=>p.fret),original.map.chordPositions.map(p=>p.fret+shift));
  }
  assert.equal(original.endBeat,20);
  assert.deepEqual(original.notes.slice(-8).map(n=>(n.midi-original.map.tonic+120)%12),[0,3,5,7,7,5,3,0]);
  const returned=block('transport-am-return');
  assert.equal(returned.endBeat,8);
  assert.deepEqual(returned.notes.map(n=>n.midi),original.notes.slice(-8).map(n=>n.midi));
  const plan=assembleLessonBlocks(track.lessons[1],track.blocks);
  assert.deepEqual(plan.entries.map(e=>e.block.map.tonic),[9,7,9,11]);
  assert.deepEqual(plan.entries.map(e=>e.offset),[0,20,40,48]);
  assert.notEqual(plan.entries.at(-1).block.map.tonic,plan.entries[0].block.map.tonic,'loop must change context instead of holding Am twice');
});

test('the A-shape starts from chord tones and carries one motif through Dm, Em and Cm',()=>{
  const original=block('shape-dm');
  assert.equal(original.endBeat,28);
  assert.deepEqual(original.notes.slice(0,5).map(({stringId,fret})=>({stringId,fret})),original.map.chordPositions.map(({stringId,fret})=>({stringId,fret})));
  assert.deepEqual(original.notes.slice(0,5).map(n=>(n.midi-original.map.tonic+120)%12),[0,7,0,3,7]);
  assert.deepEqual(original.notes.slice(5,10).map(n=>n.midi),original.notes.slice(0,5).map(n=>n.midi));
  const scaleNotes=original.notes.slice(10,-8);
  assert.equal(scaleNotes.at(-1).midi,scaleNotes[0].midi,'the descending scale must return to its lowest note');
  assert.equal((scaleNotes.at(-1).midi-original.map.tonic+120)%12,7,'the Dm shape ends on its low A');
  assert.equal(scaleNotes.at(-1).beat,19);
  assert.equal(scaleNotes.at(-1).duration,1);
  assert.deepEqual(original.notes.slice(-8).map(n=>(n.midi-original.map.tonic+120)%12),[0,3,5,7,7,5,3,0]);
  for(const [id,shift] of [['shape-em',2],['shape-cm',-2]]){
    const moved=block(id);
    assert.deepEqual(moved.notes.map(n=>n.midi),original.notes.map(n=>n.midi+shift));
  }
  for(const id of ['shape-dm','shape-em','shape-cm']){
    const shaped=block(id);
    const chord=shaped.map.tonic===2?'Dm':shaped.map.tonic===4?'Em':'Cm';
    assert.deepEqual(shaped.cues,[{beat:0,label:chord}]);
    assert.deepEqual(shaped.phaseCues,[{beat:0,label:'Acorde'},{beat:8,label:'Escala'},{beat:20,label:'Motivo'}]);
  }
  const plan=assembleLessonBlocks(track.lessons[3],track.blocks);
  assert.equal(track.lessons[3].mission.exampleBeats,28);
  assert.deepEqual(plan.entries.map(e=>e.block.map.tonic),[2,4,0]);
  assert.deepEqual(plan.entries.map(e=>e.offset),[0,28,56]);
  assert.equal(plan.beats,84);
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
  const phrase=block('phrase-listen'),answer=block('phrase-answer');
  assert.equal(phrase.endBeat,8);
  assert.deepEqual(phrase.notes.map(n=>n.midi),[62,69,67,64,62,60,57]);
  assert.deepEqual(phrase.notes[0].technique,{kind:'bend',semitones:2});
  assert.deepEqual(phrase.notes[0].pitchCurve,[{beat:0,midi:62},{beat:.75,midi:64},{beat:1.5,midi:64}]);
  assert.equal(answer.endBeat,16);
  assert.equal(answer.notes.length,0);
  assert.equal(answer.responseBeat,0);
  assert.deepEqual([phrase.cues[0].label,answer.cues[0].label],['Ouça','Toque']);
  assert.equal(track.lessons[2].mission.exampleBeats,8);
  assert.equal(track.lessons[2].mission.practiceBeats,24);
  assert.equal(track.lessons[2].mission.hideTurnLabel,true);
  for(const b of [phrase,answer]){
    assert.equal(b.backingGain,.85);
    assert.deepEqual([...new Set(b.backing.map(n=>n.instrument))],['electric-piano']);
  }
  const am=block('bridge-am-listen'),dm=block('bridge-dm-listen');
  assert.equal(am.notes.at(-1).midi,64);
  assert.equal(dm.notes[0].midi,65);
  assert.equal(am.notes.at(-1).stringId,dm.notes[0].stringId);
  assert.equal(dm.notes[0].fret-am.notes.at(-1).fret,1);
  assert.deepEqual(am.notes.map(n=>n.midi),[69,72,69,67,64,62,64]);
  assert.deepEqual(am.notes.find(n=>n.technique?.kind==='bend').pitchCurve,[{beat:0,midi:62},{beat:.65,midi:64},{beat:1.25,midi:64}]);
  assert.deepEqual(dm.notes.map(n=>n.midi),[65,69,72,69,67,65,62]);
  assert.equal(am.notes.filter(n=>n.technique).length,1);
  assert.equal(new Set(am.notes.map(n=>n.beat)).size,am.notes.length,'the bridge uses no double stops');
  assert.equal(new Set(dm.notes.map(n=>n.beat)).size,dm.notes.length,'the response uses no double stops');
  assert.deepEqual(am.phaseCues,[{beat:0,label:'Toque junto'}]);
  assert.deepEqual(dm.phaseCues,[{beat:0,label:'Toque junto'}]);
  for(const id of ['bridge-am-listen','bridge-dm-listen','bridge-am-answer','bridge-dm-answer']){
    const bridge=block(id);
    assert.equal(bridge.backingGain,.85);
    assert.deepEqual([...new Set(bridge.backing.map(n=>n.instrument))],['electric-piano']);
  }
  for(const id of ['bridge-am-answer','bridge-dm-answer']){
    const response=block(id);
    assert.ok(!response.notes.length&&response.backing.length);
    assert.deepEqual(response.phaseCues,[{beat:0,label:'Responda'}]);
  }
});

test('scale practice in both reference shapes uses predictable electric-piano entrances',()=>{
  for(const id of ['e-am','transport-am','transport-gm','transport-am-return','transport-bm','shape-dm','shape-em','shape-cm']){
    const b=block(id);
    assert.equal(b.backingGain,.85);
    assert.deepEqual([...new Set(b.backing.map(n=>n.instrument))],['electric-piano']);
    const bass=b.backing.filter(n=>n.instrument==='finger-bass');
    assert.equal(bass.length,0);
    assert.equal(b.backing.filter(n=>n.instrument==='drum-kit').length,0);
    assert.ok(b.backing.every(n=>Number.isInteger(n.beat)),'keyboard stays on the beat');
    const piano=b.backing.filter(n=>n.instrument==='electric-piano');
    const expectedBeats=Array.from({length:Math.ceil(b.endBeat/8)},(_,i)=>i*8);
    assert.equal(piano.length,expectedBeats.length*4);
    assert.ok(piano.every(n=>n.duration<=2.5),'short keyboard chords leave space for the drum pulse');
    assert.deepEqual([...new Set(piano.map(n=>n.beat))],expectedBeats);
    for(const beat of expectedBeats)assert.deepEqual(piano.filter(n=>n.beat===beat).map(n=>n.midi),piano.slice(0,4).map(n=>n.midi));
    assert.equal(piano[0].midi%12,b.map.tonic,'keyboard itself supplies the root');
    assert.ok(piano.some(n=>(n.midi-b.map.tonic+12)%12===10),'minor seventh belongs to the declared harmony');
    assert.ok(b.backing.every(n=>n.velocity>=0&&n.velocity<=1));
  }
  assert.equal(track.lessons[0].mission.metronomeByDefault,false);
  assert.equal(track.lessons[1].mission.metronomeByDefault,false);
});

test('final journey introduces each context then releases the returning chords for improvisation',()=>{
  const plan=assembleLessonBlocks(track.lessons[5],track.blocks);
  assert.deepEqual(plan.entries.map(e=>e.block.map.tonic),[9,2,7,0,7,2]);
  assert.equal(plan.beats,96);
  assert.deepEqual(plan.entries.map(({block})=>block.responseBeat),[8,8,8,8,0,0]);
  for(const {block:b} of plan.entries){
    assert.equal(b.endBeat,16);
    if(b.responseBeat===0){
      assert.deepEqual(b.phaseCues,[{beat:0,label:'Responda'}]);
      assert.equal(b.notes.length,0,'returning chords leave the entire block free');
    }else{
      assert.deepEqual(b.phaseCues,[{beat:0,label:'Toque junto'},{beat:8,label:'Responda'}]);
      const opening=b.notes.slice(0,4);
      assert.deepEqual(opening.map(n=>n.beat),[0,.5,1,1.5]);
      assert.ok(opening.every(n=>n.midi===opening[0].midi&&n.midi%12===b.map.tonic),'four separate attacks repeat the tonic');
      assert.ok(b.notes.every(n=>[0,3,5,7,10].includes((n.midi-b.map.tonic+12)%12)),'the adaptation stays entirely in the minor pentatonic');
      for(const n of b.notes.filter(n=>n.pitchCurve)){
        assert.equal(n.pitchCurve[0].midi,n.midi);
        assert.equal(n.pitchCurve.at(-1).midi,n.midi,'vibrato returns to the fretted pitch');
        assert.ok(n.pitchCurve.every(p=>p.midi>=n.midi&&p.midi<=n.midi+.17&&p.beat<=n.duration),'transport preserves the subtle vibrato and its duration');
      }
      assert.equal(b.notes[4].beat,2.5,'a half-beat rest separates the repeated attacks from the continuation');
      assert.deepEqual(b.notes.slice(5).map(n=>n.beat),[4.5,5,5.5,6],'the descent starts offbeat and reaches the tonic on beat three');
      assert.ok(b.notes[5].beat-(b.notes[4].beat+b.notes[4].duration)>=.75,'the pause follows the continuation note');
    }
    assert.ok(b.notes.every(n=>n.beat+n.duration<=8),'the guide must end before the immediate response');
    assert.equal(b.backingGain,.85);
    assert.deepEqual([...new Set(b.backing.map(n=>n.instrument))],['electric-piano']);
    assert.ok(b.backing.some(n=>n.beat===0));
  }
});

test('validation rejects an example that intrudes into a declared answer window',()=>{
  const changed=structuredClone(track);
  const b=changed.blocks.find(b=>b.id==='journey-dm-ida');
  b.notes=[{...changed.blocks.find(b=>b.id==='journey-am-ida').notes[0],beat:8,duration:1}];
  assert.throws(()=>validateTrack(changed),/resposta/);
});

test('validation rejects broken expression timing without rejecting fractional vibrato pitches',()=>{
  validateTrack(track);
  for(const point of [{beat:3,midi:57},{beat:.5,midi:NaN}]){
    const changed=structuredClone(track);
    const arrival=changed.blocks.find(b=>b.id==='journey-am-ida').notes.at(-1);
    arrival.pitchCurve=[{beat:0,midi:arrival.midi},point];
    assert.throws(()=>validateTrack(changed),/Expressão inválida/);
  }
});
