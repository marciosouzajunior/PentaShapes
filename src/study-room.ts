/** A short, quiet room shared by melodic examples. No external effect assets. */
export function createStudyRoom(context:BaseAudioContext,output:AudioNode):AudioNode{
  const input=context.createGain(),dry=context.createGain(),wet=context.createGain();
  const room=context.createConvolver(),highpass=context.createBiquadFilter(),lowpass=context.createBiquadFilter();
  const seconds=1.1,length=Math.ceil(context.sampleRate*seconds);
  const impulse=context.createBuffer(2,length,context.sampleRate);
  for(let channel=0;channel<2;channel++){
    const data=impulse.getChannelData(channel);
    let seed=1729+channel*8191,energy=0;
    for(let i=0;i<length;i++){
      const time=i/context.sampleRate;
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const fade=Math.min(1,Math.max(0,(seconds-time)/.05));
      data[i]=time<.012?0:((seed/4294967296)*2-1)*Math.exp(-time*5.5)*fade;
      energy+=data[i]!**2;
    }
    const level=.8/Math.sqrt(energy);
    for(let i=0;i<length;i++)data[i]=data[i]!*level;
  }
  room.buffer=impulse;room.normalize=false;
  highpass.type='highpass';highpass.frequency.value=160;
  lowpass.type='lowpass';lowpass.frequency.value=4200;
  dry.gain.value=.7;wet.gain.value=.8;
  input.connect(dry).connect(output);
  input.connect(room).connect(highpass).connect(lowpass).connect(wet).connect(output);
  return input;
}
