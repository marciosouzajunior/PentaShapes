import type {StudySampleVoice} from './study-samples';

/** Original mellow electric-keyboard voice; not a recording of a branded instrument. */
export const playElectricPiano:StudySampleVoice=(context,midi,when,duration,_pitch,output=context.destination,velocity=1)=>{
  const frequency=440*2**((midi-69)/12);
  const carrier=context.createOscillator(),modulator=context.createOscillator();
  const modulation=context.createGain(),envelope=context.createGain(),filter=context.createBiquadFilter();
  carrier.type='sine';carrier.frequency.value=frequency;
  modulator.type='sine';modulator.frequency.value=frequency;
  modulation.gain.setValueAtTime(frequency*.6*velocity,when);
  modulation.gain.exponentialRampToValueAtTime(frequency*.08,when+Math.min(2,duration));
  modulator.connect(modulation).connect(carrier.frequency);
  filter.type='lowpass';filter.frequency.value=2200;filter.Q.value=.5;
  const end=when+duration,release=Math.min(.35,duration*.25),level=.19*Math.max(0,Math.min(1,velocity));
  const attack=Math.min(.035,duration*.15),decay=Math.min(.6,duration*.4);
  envelope.gain.setValueAtTime(0,when);
  envelope.gain.linearRampToValueAtTime(level,when+attack);
  envelope.gain.exponentialRampToValueAtTime(Math.max(.00001,level*.65),when+decay);
  envelope.gain.exponentialRampToValueAtTime(Math.max(.00001,level*.45),end-release);
  envelope.gain.linearRampToValueAtTime(0,end);
  carrier.connect(filter).connect(envelope).connect(output);
  carrier.start(when);modulator.start(when);carrier.stop(end+.01);modulator.stop(end+.01);
};
