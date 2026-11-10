import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import midiPackage from '@tonejs/midi';
import { createServer } from 'vite';
const { Midi } = midiPackage;
const vite = await createServer({ configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom' });
after(()=>vite.close());
const { pilotSong,studyBlocks,songLessons,midiPitch,assembleBlocks,assembleLessonBlocks,blockIndexAt,noteLabel,lessonMapPositions } = await vite.ssrLoadModule('/src/song-content.ts');
const {accompanimentChord,accompanimentPlan,chordStringsHint}=await vite.ssrLoadModule('/src/song-chords.ts');
const { playableLessons } = await vite.ssrLoadModule('/src/content-catalog.ts');
const { lessonKey } = await vite.ssrLoadModule('/src/content-identity.ts');
const {pitchAt,pitchAutomation}=await vite.ssrLoadModule('/src/song-expression.ts');

const omittedOpeningNote=n=>n.midi===63&&n.ticks===3360;

test('MIDI-preserved blocks retain timing and reference replacements are explicitly identified',()=>{
  const midi=new Midi(readFileSync(pilotSong.sourceFile));
  assert.equal(pilotSong.ppq,midi.header.ppq);
  assert.equal(pilotSong.bpm,midi.header.tempos[0].bpm);
  for(const block of studyBlocks){
    const curated=pilotSong.blocks.find(item=>item.id===block.id).sourceEdits?.some(edit=>edit.action==='replace-block');
    if(curated){
      for(const note of block.notes){
        assert.equal(note.sourceTicks,-1);
        assert.equal(midiPitch(note),note.midi);
        assert.ok(note.fret>=block.startFret&&note.fret<=block.endFret);
        assert.ok(note.beat>=0&&note.duration>0&&note.beat+note.duration<=block.endBeat-block.startBeat);
        if(note.pitchCurve){
          assert.equal(note.pitchCurve[0].beat,0);
          assert.ok(note.pitchCurve.every((point,i)=>point.beat<=note.duration&&(i===0||point.beat>note.pitchCurve[i-1].beat)));
        }
      }
      continue;
    }
    const source=midi.tracks[pilotSong.trackIndex].notes.filter(n=>n.ticks/midi.header.ppq<block.endBeat&&(n.ticks+n.durationTicks)/midi.header.ppq>block.startBeat).filter(n=>block.id!=='intro-b'||!omittedOpeningNote(n));
    assert.equal(block.notes.length,source.length);
    for(const [i,n] of source.entries()){
      const actual=block.notes[i], onset=Math.max(block.startBeat,n.ticks/midi.header.ppq);
      assert.equal(actual.midi,n.midi);
      assert.equal(midiPitch(actual),n.midi);
      assert.equal(actual.sourceTicks,n.ticks);
      assert.equal(actual.beat,onset-block.startBeat);
      assert.equal(actual.duration,Math.min(block.endBeat,(n.ticks+n.durationTicks)/midi.header.ppq)-onset);
      assert.ok(actual.fret>=block.startFret&&actual.fret<=block.endFret);
    }
  }
  const intro=studyBlocks.find(b=>b.id==='intro-a');
  assert.deepEqual(intro.notes.map(n=>n.midi),[46,58,46,58]);
  const response=studyBlocks.find(b=>b.id==='intro-b');
  assert.deepEqual(response.notes.map(n=>n.midi),[46,58,46,58]);
  assert.equal(response.notes.filter(n=>n.beat===3).length,1);
  const edits=pilotSong.blocks.find(block=>block.id==='intro-b').sourceEdits;
  assert.equal(edits.length,1);
  assert.deepEqual([edits[0].action,edits[0].midi,edits[0].sourceTicks],['omit',63,3360]);
  assert.ok(midi.tracks[pilotSong.trackIndex].notes.some(omittedOpeningNote),'the original MIDI remains unchanged');
});

test('assembled timeline advances the preview at boundaries and removes only the gaps between selected blocks',()=>{
  const plan=assembleBlocks(['intro-a','riff-a','solo-c']);
  assert.deepEqual(plan.entries.map(e=>e.offset),[0,4,8]);
  assert.equal(plan.beats,10);
  assert.equal(blockIndexAt(plan,-4),0);
  assert.equal(blockIndexAt(plan,3.999),0);
  assert.equal(blockIndexAt(plan,4),1);
  assert.equal(blockIndexAt(plan,8),2);
  assert.equal(blockIndexAt(plan,10),2);
  assert.equal(plan.notes.find(n=>n.sourceTicks===128*480),undefined);
  const firstSolo=plan.notes.find(n=>n.beat===8&&n.midi===67);
  assert.equal(firstSolo.beat,8);
  assert.equal(firstSolo.duration,1.5);
  assert.throws(()=>assembleBlocks([]),/Escolha/);
  assert.throws(()=>assembleBlocks(['intro-a','intro-a']),/Escolha/);
  assert.throws(()=>assembleBlocks(['missing']),/desconhecido/);
});

test('pitch labels teach names and degrees relative to E rather than fret numbers',()=>{
  assert.equal(noteLabel(46,'name','flat'),'Si♭');
  assert.equal(noteLabel(46,'degree'),'♭5');
  assert.equal(noteLabel(40,'degree'),'1');
  assert.equal(noteLabel(55,'degree'),'♭3');
  assert.equal(noteLabel(66),'Fá♯');
  assert.equal(noteLabel(62,'degree'),'♭7');
  assert.throws(()=>midiPitch({stringId:'g',fret:-1}),/Posição/);
});

test('new content has independent progress and preserves the foundation catalog',()=>{
  assert.deepEqual(songLessons.map(lesson=>lesson.id),['s01','s02','s02-variacao','s05','s03','s04']);
  assert.equal(playableLessons.filter(l=>l.kind==='phrase').length,12);
  assert.equal(playableLessons.filter(l=>l.kind==='song'&&l.ref.trackId==='hendrix-purple-haze').length,6);
  assert.equal(new Set(playableLessons.map(l=>l.href)).size,playableLessons.length);
  assert.equal(new Set(playableLessons.map(l=>lessonKey(l.ref))).size,playableLessons.length);
  assert.ok(songLessons.every(l=>l.ref.trackId==='hendrix-purple-haze'&&l.blocks.every(id=>studyBlocks.some(b=>b.id===id))));
});

test('reference fingering keeps the riff in its neck region and places E4 by phrase',()=>{
  const byId=id=>studyBlocks.find(block=>block.id===id);
  const firstRiff=byId('riff-a');
  assert.deepEqual(firstRiff.notes.slice(0,3).map(note=>[note.stringId,note.fret]),[['d',9],['g',7],['b',8]]);
  const returnRiff=byId('riff-b');
  assert.ok(returnRiff.notes.some(note=>note.midi===40&&note.stringId==='e_low'&&note.fret===0));
  assert.deepEqual(returnRiff.notes.find(note=>note.midi===50),{stringId:'d',fret:0,midi:50,beat:.5,duration:.5,sourceTicks:-1});
  assert.ok(returnRiff.notes.filter(note=>note.midi===52).every(note=>note.stringId==='a'&&note.fret===7));
  const approachE=byId('solo-a').notes.find(note=>note.midi===64);
  const higherE=byId('solo-b').notes.find(note=>note.midi===64);
  const descentE=byId('solo-d').notes.find(note=>note.midi===64);
  assert.deepEqual([approachE.stringId,approachE.fret],['g',9]);
  for(const note of [higherE,descentE]){
    assert.deepEqual([note.stringId,note.fret],['d',14]);
    assert.equal(midiPitch(note),midiPitch(approachE));
  }
});

test('single-card lessons preserve reviewed phrases and timing, including the corrected opening',()=>{
  const midi=new Midi(readFileSync(pilotSong.sourceFile));
  const original=JSON.stringify(studyBlocks);
  for(const [id,start,end] of [['s01',0,8],['s04',146.5,149.5]]){
    const plan=assembleLessonBlocks(songLessons.find(lesson=>lesson.id===id));
    assert.equal(plan.entries.length,1);
    assert.equal(plan.beats,end-start);
    if(id==='s04'){
      assert.deepEqual(plan.notes.map(note=>[note.beat,note.midi]),[[0,64],[.5,67],[.75,69],[1,67],[1.25,64],[1.5,67]]);
      continue;
    }
    const source=midi.tracks[pilotSong.trackIndex].notes.filter(n=>n.ticks/midi.header.ppq<end&&(n.ticks+n.durationTicks)/midi.header.ppq>start).filter(n=>!omittedOpeningNote(n));
    assert.equal(plan.notes.length,source.length);
    for(const [i,n] of source.entries()){
      const actual=plan.notes[i],onset=Math.max(start,n.ticks/midi.header.ppq);
      assert.equal(actual.midi,n.midi);
      assert.equal(midiPitch(actual),n.midi);
      assert.equal(actual.sourceTicks,n.ticks);
      assert.equal(actual.beat,onset-start);
      assert.equal(actual.duration,Math.min(end,(n.ticks+n.durationTicks)/midi.header.ppq)-onset);
    }
  }
  const opening=assembleLessonBlocks(songLessons.find(lesson=>lesson.id==='s01'));
  assert.deepEqual(opening.notes.map(note=>[note.beat,note.midi]),Array.from({length:8},(_,beat)=>[beat,beat%2===0?46:58]));
  const exploration=assembleLessonBlocks(songLessons.find(lesson=>lesson.id==='s04'));
  assert.ok(exploration.notes.every(note=>[64,67,69].includes(note.midi)));
  assert.equal(JSON.stringify(studyBlocks),original);
  for(const [id,count] of [['s02',2],['s03',2]]){
    assert.equal(assembleLessonBlocks(songLessons.find(lesson=>lesson.id===id)).entries.length,count);
  }
});

test('the curated riff restores A and treats the D-to-E slide as one event',()=>{
 const first=studyBlocks.find(block=>block.id==='riff-a'),response=studyBlocks.find(block=>block.id==='riff-b');
 assert.deepEqual(first.notes.map(note=>[note.beat,note.midi,note.duration]),[[0,59,.5],[.5,62,.5],[1,67,.5],[1.5,57,2.5]]);
 assert.deepEqual(response.notes.map(note=>[note.beat,note.midi,note.duration]),[[0,55,.5],[.5,50,.5],[1,40,.5],[1.5,52,2.5]]);
 assert.deepEqual(response.notes.at(-1).pitchCurve,[{beat:0,midi:50},{beat:.125,midi:52}]);
});

test('the approach retains two motifs per card and excludes the following high E',()=>{
 const first=studyBlocks.find(block=>block.id==='solo-a'),higher=studyBlocks.find(block=>block.id==='solo-b');
 assert.deepEqual(first.notes.map(note=>note.midi),[61,64,71,61,64,71]);
 assert.deepEqual(higher.notes.map(note=>note.midi),[64,67,79,64,67,79]);
 for(const note of [...first.notes,...higher.notes].filter(note=>note.technique?.kind==='bend')){
  assert.equal(note.technique.semitones,.5);
  assert.equal(Math.max(...note.pitchCurve.map(point=>point.midi)),note.midi+.5);
 }
 assert.equal(higher.notes.at(-1).duration,1);
});

test('pitch automation resumes bends and slides at the current pitch and clips at the card boundary',()=>{
 const bend=studyBlocks.find(block=>block.id==='solo-a').notes[2];
 assert.equal(pitchAt(bend,.1),71.25);
 assert.equal(pitchAt(bend,.5),71.5);
 assert.deepEqual(pitchAutomation(bend,.1,.1,.75),[{offset:0,midi:71.25},{offset:.07500000000000001,midi:71.5}]);
 assert.deepEqual(pitchAutomation(bend,.5,.5,.75),[{offset:0,midi:71.5},{offset:.375,midi:71.5}]);
 const slide=studyBlocks.find(block=>block.id==='riff-b').notes.at(-1);
 assert.equal(pitchAt(slide,.0625),51);
 assert.equal(pitchAt(slide,1),52);
 assert.deepEqual(pitchAutomation({midi:52},0,1,.75),[]);
});

test('the intro variation separates the fretted A from its bend destination B',()=>{
  const variation=studyBlocks.find(block=>block.id==='riff-variation');
  assert.deepEqual(variation.notes.map(note=>note.midi),[55,57,57,55]);
  const midi=new Midi(readFileSync(pilotSong.sourceFile));
  const source=midi.tracks[pilotSong.trackIndex].notes.filter(note=>note.ticks/midi.header.ppq>=24&&note.ticks/midi.header.ppq<28);
  assert.deepEqual(variation.notes.map(note=>[note.midi,note.beat,note.duration]),source.map(note=>[note.midi,note.ticks/midi.header.ppq-24,note.durationTicks/midi.header.ppq]));
  const bent=variation.notes[2];
  assert.equal(bent.technique.semitones,2);
  assert.equal(pitchAt(bent,.25),59);
  assert.equal(midiPitch(bent),57);
  const ids=songLessons.map(lesson=>lesson.id);
  assert.ok(ids.indexOf('s02-variacao')>ids.indexOf('s02'));
  assert.ok(ids.indexOf('s02-variacao')<ids.indexOf('s03'));
});

test('exploration expands the map without adding audio notes or inheriting descent completion',()=>{
  const lesson=songLessons.find(lesson=>lesson.id==='s04');
  const plan=assembleLessonBlocks(lesson),before=JSON.stringify(plan.notes);
  const {phrase,possibilities,additional}=lessonMapPositions(lesson,plan.entries[0].block);
  assert.equal(lesson.ref.lessonId,'s04-exploracao');
  assert.deepEqual(phrase.map(note=>note.midi),[64,67,69]);
  const map=[...phrase,...possibilities];
  assert.equal(map.length,12);
  assert.equal(new Set(map.map(note=>note.stringId)).size,6);
  assert.deepEqual([...new Set(map.map(note=>note.midi%12))].sort((a,b)=>a-b),[2,4,7,9,11]);
  for(const stringId of ['e_low','a','d','g','b','e_high'])assert.equal(map.filter(note=>note.stringId===stringId).length,2);
  assert.deepEqual(additional.map(note=>note.midi),[78,73]);
  for(const note of additional){assert.equal(midiPitch(note),note.midi);assert.ok(note.fret>=12&&note.fret<=15);assert.ok(!map.some(position=>position.stringId===note.stringId&&position.fret===note.fret));}
  const keys=new Set(phrase.map(note=>`${note.stringId}:${note.fret}`));
  for(const note of possibilities){
    assert.equal(midiPitch(note),note.midi);
    assert.ok(note.fret>=12&&note.fret<=15);
    assert.ok(!keys.has(`${note.stringId}:${note.fret}`));
  }
  assert.equal(JSON.stringify(plan.notes),before);
  assert.deepEqual(lessonMapPositions(songLessons[0],studyBlocks[0]).possibilities,[]);
});



test('verse chords use correct voicings, durations and sounding strings',()=>{
  for(const [id,pitches,beats] of [
    ['e',[52,56,62,67],4],
    ['g',[43,47,50,55,59,67],2],
    ['a',[45,52,57,61,64],2],
  ]){
    const block=accompanimentChord(id);
    assert.equal(block.endBeat,beats);
    for(let beat=0;beat<beats;beat++){
      const notes=block.notes.filter(note=>note.beat===beat);
      assert.deepEqual(notes.map(note=>note.midi),pitches);
      assert.ok(notes.every(note=>midiPitch(note)===note.midi));
    }
    if(id==='a')assert.ok(block.notes.every(note=>note.stringId!=='e_low'));
    if(id==='e')assert.ok(block.notes.every(note=>!['e_low','e_high'].includes(note.stringId)));
  }
  const plan=accompanimentPlan();
  assert.equal(plan.beats,8);
  assert.deepEqual(plan.entries.map(entry=>entry.offset),[0,4,6]);
  assert.deepEqual(plan.notes.filter(note=>note.beat===4).map(note=>note.midi),[43,47,50,55,59,67]);
  assert.deepEqual(plan.notes.filter(note=>note.beat===6).map(note=>note.midi),[45,52,57,61,64]);
  assert.match(chordStringsHint('a'),/6ª/);
  const lesson=songLessons.find(lesson=>lesson.id==='s05');
  assert.equal(lesson.accompaniment,true);
  assert.equal(lesson.ref.lessonId,'s05-acordes');
  assert.equal(lesson.title,'Acompanhe com acordes');
});
