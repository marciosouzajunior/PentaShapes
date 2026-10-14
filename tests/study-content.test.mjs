import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const vite=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
after(()=>vite.close());
const {studyBooks}=await vite.ssrLoadModule('/src/study-books.ts');
const {studyNote,intervalName,referenceRelation,soundOfVisual}=await vite.ssrLoadModule('/src/study-model.ts');
const {songLessons,studyBlocks,midiPitch}=await vite.ssrLoadModule('/src/song-content.ts');
const {accompanimentChord}=await vite.ssrLoadModule('/src/song-chords.ts');

test('changing the reference changes the degree, not the target pitch',()=>{
  const inE=referenceRelation('e'),inA=referenceRelation('a');
  assert.equal(inE.target,inA.target);
  assert.equal(studyNote(inE.target),'Si');
  assert.deepEqual([inE.degree,inE.target-inE.root],['5',7]);
  assert.deepEqual([inA.degree,inA.target-inA.root],['2',2]);
});

test('the octave, ninth and raised ninth retain their actual pitch distances',()=>{
  assert.equal(studyNote(40+2),'Fá♯');
  assert.equal(studyNote(52+14),'Fá♯');
  assert.equal(studyNote(52+15),'Sol');
  assert.equal(studyNote(52+4),'Sol♯');
  assert.equal(intervalName(12),'oitava');
  assert.equal(intervalName(14),'nona maior');
  assert.match(intervalName(15),/nona aumentada/);
  assert.equal(studyNote(46,'flat'),'Si♭');
});

test('every pilot lesson has a complete book with playable, valid examples',()=>{
  assert.deepEqual(studyBooks.map(book=>book.lessonId),songLessons.map(lesson=>lesson.id));
  for(const book of studyBooks){
    assert.ok(book.pages.length>0);
    for(const page of book.pages){
      assert.ok(page.paragraphs.length>=2);
      assert.ok(page.practice&&page.question&&page.answer);
      const visual=page.visual,sound=soundOfVisual(visual);
      assert.ok(sound.every(midi=>Number.isInteger(midi)&&midi>=40&&midi<=79));
      if(visual.kind==='interval')assert.ok(visual.distances.includes(visual.initial));
      if(visual.kind==='positions'||visual.kind==='scale'||visual.kind==='fretboard-intervals'){
        const positions=visual.kind==='fretboard-intervals'?[visual.root,...visual.targets]:visual.positions;
        for(const position of positions){
          assert.equal(midiPitch(position),position.midi);
          assert.ok(position.fret>=visual.startFret&&position.fret<=visual.endFret);
          if(visual.kind!=='scale'&&!(visual.kind==='positions'&&visual.context)&&!(visual.kind==='fretboard-intervals'&&visual.context==='comparison'))assert.ok(studyBlocks.flatMap(block=>block.notes).some(note=>note.stringId===position.stringId&&note.fret===position.fret&&note.midi===position.midi));
        }
      }
    }
  }
  const book=studyBooks.find(book=>book.lessonId==='s03');
  assert.deepEqual(soundOfVisual(book.pages[1].visual),[64,64]);
  assert.deepEqual(soundOfVisual(book.pages[2].visual),[67,79]);
  const chord=studyBooks.find(book=>book.lessonId==='s05').pages[0].visual;
  assert.deepEqual(soundOfVisual(chord),[52,56,62,67]);
  assert.equal(chord.kind,'positions');
  assert.deepEqual(chord.positions,accompanimentChord('e').notes.filter(note=>note.beat===0).map(({stringId,fret,midi})=>({stringId,fret,midi})));
});

test('the riff interval examples keep one E reference and correctly placed minor third, fifth and minor seventh',()=>{
 const visual=studyBooks.find(book=>book.lessonId==='s02').pages[2].visual;
 assert.equal(visual.kind,'fretboard-intervals');
 assert.deepEqual(visual.root,{stringId:'a',fret:7,midi:52});
 assert.deepEqual(visual.targets.map(target=>midiPitch(target)-midiPitch(visual.root)),[3,7,10]);
 assert.deepEqual(soundOfVisual(visual),[52,55,59,62]);
});

test('the E minor pentatonic fretboard contains the complete collection in the riff region',()=>{
  const visual=studyBooks.find(book=>book.lessonId==='s02').pages[0].visual;
  assert.equal(visual.kind,'scale');
  assert.equal(visual.root,4);
  assert.deepEqual([...new Set(visual.positions.map(note=>note.midi%12))].sort((a,b)=>a-b),[2,4,7,9,11]);
  const open={e_low:40,a:45,d:50,g:55,b:59,e_high:64};
  const expected=[];
  for(const [stringId,midi] of Object.entries(open))for(let fret=5;fret<=9;fret++){
    if([2,4,7,9,11].includes((midi+fret)%12))expected.push(`${stringId}:${fret}`);
  }
  assert.deepEqual(visual.positions.map(note=>`${note.stringId}:${note.fret}`).sort(),expected.sort());
});

test('motif comparisons use the musical positions and ascend from C or C sharp to the same E',()=>{
 const visual=studyBooks.find(book=>book.lessonId==='s03').pages[0].visual;
 assert.equal(visual.kind,'fretboard-intervals');
 assert.deepEqual(visual.root,{stringId:'g',fret:9,midi:64});
 assert.deepEqual(visual.targets.map(target=>midiPitch(visual.root)-midiPitch(target)),[4,3]);
 assert.deepEqual(visual.targets.map(target=>[target.stringId,target.fret]),[['d',10],['d',11]]);
 assert.equal(visual.towardRoot,true);
 const motif=studyBlocks.find(block=>block.id==='solo-a');
 assert.ok(motif.notes.some(note=>note.stringId===visual.root.stringId&&note.fret===visual.root.fret));
 assert.ok(motif.notes.some(note=>note.stringId===visual.targets[1].stringId&&note.fret===visual.targets[1].fret));
 assert.equal(visual.context,'comparison');
});

test('the ninth example shows the second above the octave and its raised neighbor on one string',()=>{
 const visual=studyBooks.find(book=>book.lessonId==='s05').pages[1].visual;
 assert.equal(visual.kind,'positions');
 assert.deepEqual(soundOfVisual(visual),[52,64,66,67]);
 assert.deepEqual(visual.positions.slice(1).map(note=>[note.stringId,note.fret]),[['b',5],['b',7],['b',8]]);
 assert.deepEqual(visual.positions.slice(1).map(note=>midiPitch(note)-52),[12,14,15]);
});
