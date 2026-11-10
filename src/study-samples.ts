const pianoSamples=[
  {midi:39,file:'Ds2.mp3'},
  {midi:45,file:'A2.mp3'},
  {midi:48,file:'C3.mp3'},
  {midi:54,file:'Fs3.mp3'},
  {midi:60,file:'C4.mp3'},
  {midi:66,file:'Fs4.mp3'},
];

const guitarSamples=[
  {midi:41,file:'F2.wav'},
  {midi:45,file:'A2.wav'},
  {midi:48,file:'C3.wav'},
  {midi:52,file:'E3.wav'},
  {midi:55,file:'G3.wav'},
  {midi:59,file:'B3.wav'},
  {midi:64,file:'E4.wav'},
  {midi:67,file:'G4.wav'},
];

export type SampledInstrument='piano'|'clean-guitar';
type PitchPoint={offset:number;midi:number};
export type StudySampleVoice = (context:BaseAudioContext,midi:number,when:number,duration:number,pitch?:PitchPoint[],output?:AudioNode)=>void;
const banks={piano:pianoSamples,'clean-guitar':guitarSamples};
const loadedVoices=new Map<SampledInstrument,Promise<StudySampleVoice>>();

function sampleLevel(buffer:AudioBuffer):number{
  const attackFrames=Math.min(buffer.length,Math.round(buffer.sampleRate*.2));
  let peak=0,power=0;
  for(let channel=0;channel<buffer.numberOfChannels;channel++){
    const frames=buffer.getChannelData(channel);
    for(let i=0;i<frames.length;i++){
      const amplitude=frames[i]!;
      peak=Math.max(peak,Math.abs(amplitude));
      if(i<attackFrames)power+=amplitude**2;
    }
  }
  const rms=Math.sqrt(power/(attackFrames*buffer.numberOfChannels));
  return Math.min(.08/Math.max(rms,.001),.22/Math.max(peak,.001));
}

export function loadStudySampleVoice(instrument:SampledInstrument):Promise<StudySampleVoice>{
  const cached=loadedVoices.get(instrument);
  if(cached)return cached;
  const decoder=new OfflineAudioContext(1,1,44100);
  const voice=Promise.all(banks[instrument].map(async sample=>{
    const response=await fetch(`${import.meta.env.BASE_URL}audio/${instrument}/${sample.file}`);
    if(!response.ok)throw new Error('Amostra de áudio indisponível.');
    const buffer=await decoder.decodeAudioData(await response.arrayBuffer());
    return {...sample,buffer,level:sampleLevel(buffer)};
  })).then(buffers=>(context:BaseAudioContext,midi:number,when:number,duration:number,pitch:PitchPoint[] = [],output:AudioNode=context.destination)=>{
    const nearest=buffers.reduce((best,sample)=>Math.abs(sample.midi-midi)<Math.abs(best.midi-midi)?sample:best);
    const source=context.createBufferSource();
    const gain=context.createGain();
    source.buffer=nearest.buffer;
    const rateAt=(note:number)=>2**((note-nearest.midi)/12);
    source.playbackRate.setValueAtTime(rateAt(pitch[0]?.midi??midi),when);
    for(const point of pitch.slice(1)){
      source.playbackRate.exponentialRampToValueAtTime(rateAt(point.midi),when+point.offset);
    }
    const end=when+duration;
    const release=Math.min(.07,duration*.3);
    gain.gain.setValueAtTime(nearest.level,when);
    gain.gain.setValueAtTime(nearest.level,end-release);
    gain.gain.linearRampToValueAtTime(0,end);
    source.connect(gain).connect(output);
    source.start(when);
    source.stop(end);
  }).catch(error=>{
    loadedVoices.delete(instrument);
    throw error;
  });
  loadedVoices.set(instrument,voice);
  return voice;
}
