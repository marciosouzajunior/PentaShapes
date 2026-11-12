import {playElectricPiano} from './electric-piano';
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

const bassSamples=[{midi:28,file:'E1.flac'},{midi:33,file:'A1.flac'},{midi:36,file:'C2.flac'},{midi:38,file:'D2.flac'}];
const drumSamples=[{midi:36,file:'kick.flac'},{midi:37,file:'snare-soft.flac'},{midi:42,file:'hat-1.flac'},{midi:44,file:'hat-2.flac'},{midi:51,file:'ride-bell.flac',naturalDecay:true}];
export type SampledInstrument='piano'|'clean-guitar'|'finger-bass'|'drum-kit'|'electric-piano';
type PitchPoint={offset:number;midi:number};
export type StudySampleVoice = (context:BaseAudioContext,midi:number,when:number,duration:number,pitch?:PitchPoint[],output?:AudioNode,velocity?:number)=>void;
const banks={piano:pianoSamples,'clean-guitar':guitarSamples,'finger-bass':bassSamples,'drum-kit':drumSamples};
const loadedVoices=new Map<SampledInstrument,Promise<StudySampleVoice>>();

function sampleLevel(buffer:AudioBuffer,peakTarget=.12,rmsTarget=.044):number{
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
  return Math.min(rmsTarget/Math.max(rms,.001),peakTarget/Math.max(peak,.001));
}

export function loadStudySampleVoice(instrument:SampledInstrument):Promise<StudySampleVoice>{
  const cached=loadedVoices.get(instrument);
  if(cached)return cached;
  if(instrument==='electric-piano'){
    const voice=Promise.resolve(playElectricPiano);
    loadedVoices.set(instrument,voice);
    return voice;
  }
  const decoder=new OfflineAudioContext(1,1,44100);
  const voice=Promise.all(banks[instrument].map(async sample=>{
    const response=await fetch(`${import.meta.env.BASE_URL}audio/${instrument}/${sample.file}`);
    if(!response.ok)throw new Error('Amostra de áudio indisponível.');
    const buffer=await decoder.decodeAudioData(await response.arrayBuffer());
    return {...sample,buffer,level:instrument==='drum-kit'?sampleLevel(buffer,.28,.1):sampleLevel(buffer)};
  })).then(buffers=>(context:BaseAudioContext,midi:number,when:number,duration:number,pitch:PitchPoint[] = [],output:AudioNode=context.destination,velocity=1)=>{
    const nearest=instrument==='drum-kit'?buffers.find(sample=>sample.midi===midi):buffers.reduce((best,sample)=>Math.abs(sample.midi-midi)<Math.abs(best.midi-midi)?sample:best);
    if(!nearest)throw new RangeError('Peça de bateria indisponível.');
    const source=context.createBufferSource();
    const gain=context.createGain();
    source.buffer=nearest.buffer;
    const rateAt=(note:number)=>2**((note-nearest.midi)/12);
    source.playbackRate.setValueAtTime(rateAt(pitch[0]?.midi??midi),when);
    for(const point of pitch.slice(1)){
      source.playbackRate.exponentialRampToValueAtTime(rateAt(point.midi),when+point.offset);
    }
    const soundingDuration='naturalDecay' in nearest&&nearest.naturalDecay?nearest.buffer.duration:duration;
    const end=when+soundingDuration;
    const release=Math.min(.07,soundingDuration*.3);
    const level=nearest.level*Math.max(0,Math.min(1,velocity));
    gain.gain.setValueAtTime(level,when);
    gain.gain.setValueAtTime(level,end-release);
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
