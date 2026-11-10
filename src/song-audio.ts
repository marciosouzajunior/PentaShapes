type PitchPoint = {offset:number;midi:number};

const guitarVoices=new WeakMap<BaseAudioContext,{wave:PeriodicWave;bus:DynamicsCompressorNode}>();
const toFrequency=(midi:number)=>440*2**((midi-69)/12);

function guitarVoice(context:BaseAudioContext,output:AudioNode){
  const existing=guitarVoices.get(context);
  if(existing)return existing;

  const harmonics=Float32Array.of(0,1,.54,.33,.23,.15,.10,.075,.052,.04,.028);
  const wave=context.createPeriodicWave(new Float32Array(harmonics.length),harmonics);
  const bus=context.createDynamicsCompressor();
  bus.threshold.value=-12;
  bus.knee.value=10;
  bus.ratio.value=4;
  bus.attack.value=.003;
  bus.release.value=.09;
  const headroom=context.createGain();
  headroom.gain.value=.85;
  bus.connect(headroom).connect(output);

  const voice={wave,bus};
  guitarVoices.set(context,voice);
  return voice;
}

/** Plucked reference sound with pitch automation for slides and bends. */
export function playStudyGuitar(context:BaseAudioContext,midi:number,when:number,duration:number,pitch:PitchPoint[]=[],output:AudioNode=context.destination):void{
  const {wave,bus}=guitarVoice(context,output);
  const oscillator=context.createOscillator();
  const filter=context.createBiquadFilter();
  const envelope=context.createGain();
  const frequency=toFrequency(pitch[0]?.midi??midi);
  oscillator.setPeriodicWave(wave);
  oscillator.frequency.setValueAtTime(frequency,when);
  for(const point of pitch.slice(1)){
    oscillator.frequency.exponentialRampToValueAtTime(toFrequency(point.midi),when+point.offset);
  }

  const maxCutoff=context.sampleRate*.45;
  filter.type='lowpass';
  filter.Q.value=.55;
  filter.frequency.setValueAtTime(Math.min(maxCutoff,1600+frequency*10),when);
  filter.frequency.setTargetAtTime(Math.min(maxCutoff,700+frequency*4),when+.018,.085);

  const attack=Math.min(.004,duration*.2);
  const release=Math.min(.045,duration*.3);
  const level=envelope.gain;
  level.setValueAtTime(0,when);
  level.linearRampToValueAtTime(.24,when+attack);
  level.setTargetAtTime(.10,when+attack,.12);
  level.setTargetAtTime(.0001,when+duration-release,release/5);

  oscillator.connect(filter).connect(envelope).connect(bus);
  oscillator.start(when);
  oscillator.stop(when+duration);
}
