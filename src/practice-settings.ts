import type {SampledInstrument} from './study-samples';

export type PracticeSettings={repeat:boolean;guitar:boolean;metronome:boolean;bpm:number|null;referenceTimbre?:SampledInstrument;volume?:number;skipCountIn?:boolean};
const key='pentashapes.practice-settings.v1';
const defaults:PracticeSettings={repeat:true,guitar:true,metronome:true,bpm:null};
const validBpm=(value:unknown):value is number=>typeof value==='number'&&Number.isInteger(value)&&value>=40&&value<=160;
const validTimbre=(value:unknown):value is SampledInstrument=>value==='piano'||value==='clean-guitar';
const validVolume=(value:unknown):value is number=>typeof value==='number'&&Number.isInteger(value)&&value>=0&&value<=100;

export function readPracticeSettings():PracticeSettings{
  try{
    const value:unknown=JSON.parse(localStorage.getItem(key)??'null');
    if(!value||typeof value!=='object'||Array.isArray(value))return {...defaults};
    const stored=value as Record<string,unknown>;
    return {
      repeat:typeof stored.repeat==='boolean'?stored.repeat:defaults.repeat,
      guitar:typeof stored.guitar==='boolean'?stored.guitar:defaults.guitar,
      metronome:typeof stored.metronome==='boolean'?stored.metronome:defaults.metronome,
      bpm:validBpm(stored.bpm)?stored.bpm:defaults.bpm,
      ...(validTimbre(stored.referenceTimbre)?{referenceTimbre:stored.referenceTimbre}:{}),
      ...(validVolume(stored.volume)?{volume:stored.volume}:{}),
      ...(typeof stored.skipCountIn==='boolean'?{skipCountIn:stored.skipCountIn}:{}),
    };
  }catch{return {...defaults};}
}

export function savePracticeSettings(settings:PracticeSettings):void{
  try{
    localStorage.setItem(key,JSON.stringify({
      repeat:settings.repeat,guitar:settings.guitar,metronome:settings.metronome,
      bpm:validBpm(settings.bpm)?settings.bpm:null,
      referenceTimbre:validTimbre(settings.referenceTimbre)?settings.referenceTimbre:undefined,
      volume:validVolume(settings.volume)?settings.volume:undefined,
      skipCountIn:typeof settings.skipCountIn==='boolean'?settings.skipCountIn:undefined,
    }));
  }catch{ /* Controls remain usable if browser storage is unavailable. */ }
}
