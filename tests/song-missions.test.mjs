import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {buildFretboard} from '../public/components/music.mjs';

const vite=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
after(()=>vite.close());
const {purpleTrack,tracks}=await vite.ssrLoadModule('/src/tracks.ts');
const {assembleLessonBlocks,songLessons,studyBlocks}=await vite.ssrLoadModule('/src/song-content.ts');
const {accompanimentPlan,strumChordNotes}=await vite.ssrLoadModule('/src/song-chords.ts');
const {beatInMission,missionRound}=await vite.ssrLoadModule('/src/song-missions.ts');
const {lessonKey}=await vite.ssrLoadModule('/src/content-identity.ts');

test('Purple Haze missions retain the reviewed examples and have independent progress',()=>{
  assert.equal(purpleTrack.lessons.length,6);
  assert.deepEqual(tracks.filter(track=>track.manifest.musicalWork?.title==='Purple Haze'),[purpleTrack]);
  assert.equal(purpleTrack.manifest.title,'Purple Haze');
  assert.deepEqual(purpleTrack.manifest.publication,{status:'published',visibility:'public',revision:1});
  assert.deepEqual(purpleTrack.lessons.map(lesson=>lesson.id),['s01','s02','s02-variacao','s05','s03','s04']);
  for(const lesson of purpleTrack.lessons){
    const original=songLessons.find(item=>item.id===lesson.id);
    const example=assembleLessonBlocks(lesson,purpleTrack.blocks);
    assert.notEqual(lessonKey(lesson.ref),lessonKey(original.ref));
    assert.equal(lesson.ref.trackId,'hendrix-purple-haze-missions');
    assert.equal(lesson.href,`/track/purple-haze/${lesson.id}/`);
    assert.equal(lesson.ref.lessonId,original.ref.lessonId);
    const book=purpleTrack.guide.lessons.find(book=>book.lessonId===lesson.id);
    assert.ok(lesson.mission.scene.illustration.src&&book.pages[0].hideTitle);
    assert.deepEqual(example.notes,(original.accompaniment?accompanimentPlan():assembleLessonBlocks(original,studyBlocks)).notes);
    if(lesson.mission.practiceMode==='along')continue;
    const round=missionRound(example.beats);
    const measureCount=Math.ceil(example.beats/4);
    assert.deepEqual(round.measures.map(measure=>measure.label),[
      ...Array(measureCount).fill('Ouça'),...Array(measureCount).fill('Toque'),
    ]);
    assert.ok(example.notes.every(note=>note.beat+note.duration<=round.responseBeat));
    assert.equal(round.beats-round.responseBeat,measureCount*4);
  }
});

test('the chord mission loops its original accompaniment with changes at beats 0, 4 and 6',()=>{
  const lesson=purpleTrack.lessons.find(lesson=>lesson.id==='s05');
  const plan=assembleLessonBlocks(lesson,purpleTrack.blocks);
  const cues=plan.entries.flatMap(({block,offset})=>block.cues.map(cue=>({...cue,beat:offset+cue.beat})));
  const round=missionRound(plan.beats,cues);
  assert.equal(round.beats,8);
  assert.equal(round.responseBeat,null);
  assert.deepEqual(round.measures.map(({beat,label,phase})=>[beat,label,phase]),[
    [0,'E7♯9','along'],[4,'G','along'],[6,'A','along'],
  ]);
  for(const {block} of plan.entries){
    const board=buildFretboard({...block.map,startFret:block.startFret,endFret:block.endFret});
    const visible=board.rows.flatMap(row=>row.notes.filter(note=>note.visible));
    const voicing=block.notes.filter(note=>note.beat===0);
    assert.deepEqual(visible.map(note=>note.midi).sort((a,b)=>a-b),voicing.map(note=>note.midi).sort((a,b)=>a-b));
    if(block.id==='chord-e')assert.equal(visible.find(note=>note.midi===67).degree,'♯9');
  }
  assert.equal(beatInMission(8,round.beats,true),0);
});

test('a repeating round returns to the first measure without a new count-in',()=>{
  const {beats}=missionRound(8);
  assert.equal(beatInMission(-4,beats,true),-4);
  assert.equal(beatInMission(beats,beats,true),0);
  assert.equal(beatInMission(beats*3+4,beats,true),4);
  assert.equal(beatInMission(beats,beats,false),beats);
});

test('a guitar downstroke staggers the sounding strings while keeping the chord on the beat',()=>{
  const {notes}=accompanimentPlan();
  for(const bpm of [40,80,160]){
    const secondsPerBeat=60/bpm;
    const strummed=strumChordNotes(notes,secondsPerBeat);
    for(let beat=0;beat<8;beat++){
      const original=notes.filter(note=>note.beat===beat);
      const stroke=strummed.filter(note=>Math.floor(note.beat)===beat);
      assert.equal(stroke[0].beat,beat);
      assert.deepEqual(stroke.map(note=>note.stringId),original.map(note=>note.stringId));
      for(const [index,note] of stroke.entries()){
        assert.ok(Math.abs((note.beat-beat)*secondsPerBeat-index*.009)<1e-9);
        assert.ok(Math.abs(note.beat+note.duration-(beat+original[index].duration))<1e-9);
      }
    }
  }
});
