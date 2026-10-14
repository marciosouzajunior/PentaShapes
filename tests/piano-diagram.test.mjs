import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const vite=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
after(()=>vite.close());
const {pianoLayout,pianoDiagram}=await vite.ssrLoadModule('/src/piano-diagram.ts');

test('a chromatic octave has seven white keys and five correctly placed black keys',()=>{
 const {keys,width}=pianoLayout({from:60,to:71});
 assert.equal(width,336);
 assert.equal(keys.filter(key=>!key.black).length,7);
 assert.deepEqual(keys.filter(key=>key.black).map(key=>key.midi),[61,63,66,68,70]);
 for(const key of keys.filter(key=>key.black)){
  const previous=keys.find(candidate=>candidate.midi===key.midi-1);
  const next=keys.find(candidate=>candidate.midi===key.midi+1);
  assert.equal(key.x+key.width/2,previous.x+previous.width);
  assert.equal(key.x+key.width/2,next.x);
 }
});

test('the tritone and fifth share a range but reach neighboring black and white keys',()=>{
 const tritone=pianoLayout({from:40,to:46,endMidi:47});
 const fifth=pianoLayout({from:40,to:47,endMidi:47});
 assert.deepEqual(tritone.keys.map(key=>key.midi),fifth.keys.map(key=>key.midi));
 assert.equal(tritone.keys.find(key=>key.role==='end').midi,46);
 assert.equal(tritone.keys.find(key=>key.role==='end').black,true);
 assert.equal(fifth.keys.find(key=>key.role==='end').midi,47);
 assert.equal(fifth.keys.filter(key=>key.role==='path').length,6);
 assert.equal(tritone.keys.filter(key=>key.role==='path').length,5);
});

test('compound intervals keep separate octaves, and descending intervals retain their starting note',()=>{
 const ninth=pianoLayout({from:52,to:66}),raised=pianoLayout({from:52,to:67});
 assert.equal(ninth.keys.find(key=>key.role==='end').midi,66);
 assert.equal(raised.keys.find(key=>key.role==='end').midi,67);
 assert.equal(ninth.keys.find(key=>key.midi===64).role,'path');
 const descending=pianoLayout({from:64,to:62});
 assert.equal(descending.keys.find(key=>key.role==='start').midi,64);
 assert.equal(descending.keys.find(key=>key.role==='end').midi,62);
});

test('the static diagram exposes note names and endpoints without adding interactive controls',()=>{
 const markup=pianoDiagram({from:40,to:46,spelling:'flat',label:'Mi → Si♭ "exemplo"'});
 assert.match(markup,/role="img"/);
 assert.match(markup,/Si♭, oitava 2, chegada/);
 assert.match(markup,/&quot;exemplo&quot;/);
 assert.match(markup,/>B♭<\/text>/);
 assert.doesNotMatch(markup,/<button|tabindex|onclick/);
 assert.throws(()=>pianoLayout({from:40,to:47,endMidi:46}),RangeError);
});

test('a scale highlights only its selected pitches without implying the chromatic notes belong to it',()=>{
 const options={from:52,to:64,startMidi:52,endMidi:64,selectedNotes:[52,55,57,59,62,64]};
 const {keys}=pianoLayout(options);
 assert.deepEqual(keys.filter(key=>key.role!=='context').map(key=>key.midi),[52,55,57,59,62,64]);
 assert.ok(keys.filter(key=>[53,54,56,58,60,61,63].includes(key.midi)).every(key=>key.role==='context'));
 assert.match(pianoDiagram(options),/Notas destacadas: Mi, Sol, Lá, Si, Ré, Mi/);
 assert.throws(()=>pianoLayout({...options,selectedNotes:[51]}),RangeError);
});
