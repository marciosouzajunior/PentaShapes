export type PracticeSettings={repeat:boolean;guitar:boolean;metronome:boolean};
const key='pentashapes.practice-settings.v1';
const defaults:PracticeSettings={repeat:false,guitar:true,metronome:true};

export function readPracticeSettings():PracticeSettings{
  try{
    const value:unknown=JSON.parse(localStorage.getItem(key)??'null');
    if(!value||typeof value!=='object'||Array.isArray(value))return {...defaults};
    const stored=value as Record<string,unknown>;
    return {
      repeat:typeof stored.repeat==='boolean'?stored.repeat:defaults.repeat,
      guitar:typeof stored.guitar==='boolean'?stored.guitar:defaults.guitar,
      metronome:typeof stored.metronome==='boolean'?stored.metronome:defaults.metronome,
    };
  }catch{return {...defaults};}
}

export function savePracticeSettings(settings:PracticeSettings):void{
  try{
    localStorage.setItem(key,JSON.stringify({repeat:settings.repeat,guitar:settings.guitar,metronome:settings.metronome}));
  }catch{ /* Controls remain usable if browser storage is unavailable. */ }
}
