import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const vite=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
after(()=>vite.close());
const {readPracticeSettings,savePracticeSettings}=await vite.ssrLoadModule('/src/practice-settings.ts');
const key='pentashapes.practice-settings.v1';
function storage(value=null){
  const values=new Map(value===null?[]:[[key,JSON.stringify(value)]]);
  globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
  return values;
}
test('old preferences retain their toggles and leave tempo to the track default',()=>{
  storage({repeat:false,guitar:true,metronome:false});
  assert.deepEqual(readPracticeSettings(),{repeat:false,guitar:true,metronome:false,bpm:null});
});
test('tempo survives subsequent preference changes and fresh reads',()=>{
  storage();
  savePracticeSettings({repeat:true,guitar:true,metronome:true,bpm:96});
  assert.equal(readPracticeSettings().bpm,96);
  savePracticeSettings({...readPracticeSettings(),metronome:false});
  assert.deepEqual(readPracticeSettings(),{repeat:true,guitar:true,metronome:false,bpm:96});
});
test('recorded timbre survives subsequent preference changes and ignores unsupported values',()=>{
  storage();
  savePracticeSettings({...readPracticeSettings(),referenceTimbre:'clean-guitar'});
  savePracticeSettings({...readPracticeSettings(),bpm:96});
  assert.equal(readPracticeSettings().referenceTimbre,'clean-guitar');
  storage({referenceTimbre:'unsupported'});
  assert.equal(readPracticeSettings().referenceTimbre,undefined);
});
test('volume persists at zero and rejects values outside the slider range',()=>{
  storage();
  savePracticeSettings({...readPracticeSettings(),volume:0});
  savePracticeSettings({...readPracticeSettings(),referenceTimbre:'piano'});
  assert.equal(readPracticeSettings().volume,0);
  for(const volume of [-1,101,'50']){
    storage({volume});
    assert.equal(readPracticeSettings().volume,undefined);
  }
});
test('skipping the count-in persists independently of the metronome',()=>{
  storage();
  savePracticeSettings({...readPracticeSettings(),skipCountIn:true});
  savePracticeSettings({...readPracticeSettings(),metronome:false});
  assert.equal(readPracticeSettings().skipCountIn,true);
  savePracticeSettings({...readPracticeSettings(),skipCountIn:false});
  assert.equal(readPracticeSettings().skipCountIn,false);
  storage({skipCountIn:'true'});
  assert.equal(readPracticeSettings().skipCountIn,undefined);
});
test('invalid stored tempo falls back safely and storage errors do not break controls',()=>{
  for(const bpm of [39,161,72.5,'96',null]){
    storage({repeat:false,guitar:false,metronome:false,bpm});
    assert.equal(readPracticeSettings().bpm,null);
    assert.equal(readPracticeSettings().repeat,false);
  }
  for(const bpm of [40,160]){storage({bpm});assert.equal(readPracticeSettings().bpm,bpm);}
  globalThis.localStorage={getItem:()=>{throw new Error('Unavailable');},setItem:()=>{throw new Error('Unavailable');}};
  assert.equal(readPracticeSettings().bpm,null);
  assert.doesNotThrow(()=>savePracticeSettings({repeat:true,guitar:true,metronome:true,bpm:96}));
});
