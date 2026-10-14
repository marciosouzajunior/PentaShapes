import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import midiPackage from '@tonejs/midi';
const { Midi } = midiPackage;

const sourceFile = 'midi/Jimi_Hendrix_-_Purple_Haze.mid';
const midi = new Midi(readFileSync(sourceFile));
const fingeringSources = {
  intro: 'https://guitarcontrol.com/page/Guitarcontrol-com/guitarcontrol.com/chords-rhythm-guitar/how-to-play-purple-haze-by-jimi-hendrix/index.html',
  riff: 'https://www.guitarlessonworld.com/tablature/purple.htm',
  soloEntry: 'https://www.guitarclub.io/blog/purple-haze-jimi-hendrix-guitar-lesson-chords-solo',
  soloDescent: 'https://www.guitarlessonworld.com/tablature/purple.htm',
};
// Review the positions of each phrase, not a global pitch-to-fret dictionary:
// the same E4 is G9 in the approach to the solo, but D14 in the higher phrase.
const definitions = [
  ['intro-a', 'Si♭ em duas oitavas', 0, 4, 5, 8, 'intro'],
  ['intro-b', 'A resposta da abertura', 4, 8, 5, 8, 'intro'],
  ['riff-a', 'Subir e repousar', 8, 12, 5, 9, 'riff'],
  ['riff-b', 'Voltar ao Mi', 12, 16, 0, 7, 'riff'],
  ['solo-a', 'Um motivo em outra região', 128, 132, 9, 12, 'soloEntry'],
  ['solo-b', 'Subir uma oitava', 132, 136, 12, 15, 'soloEntry'],
  ['solo-c', 'Sustentar e descer', 148, 150, 11, 14, 'soloDescent'],
  ['solo-d', 'Continuar a descida', 150, 152, 11, 14, 'soloDescent'],
];
const intro = { 46:['e_low',6], 58:['d',8] };
const sourceEdits = {
  'intro-b': [{action:'omit',midi:63,sourceTicks:3360,
    reason:'The opening references show only alternating Bb octaves; the simultaneous Eb4 is omitted from the study arrangement.',
    reviewedAt:'2026-10-14',
    sourceUrls:[fingeringSources.riff,'https://www.guitarclub.io/blog/purple-haze-jimi-hendrix-guitar-lesson-chords-solo']}],
};
const fingerings = {
  'intro-a': intro,
  'intro-b': intro,
  'riff-a': {59:['d',9],62:['g',7],67:['b',8],55:['d',5]},
  'riff-b': {55:['d',5],50:['a',5],40:['e_low',0],52:['a',7]},
  'solo-a': {61:['d',11],64:['g',9],71:['b',12]},
  'solo-b': {64:['d',14],67:['g',12],79:['e_high',15],76:['e_high',12]},
  'solo-c': {67:['g',12],66:['g',11]},
  'solo-d': {66:['g',11],64:['d',14],62:['d',12]},
};
const reviewNotes = {
  'intro-a': 'Opening octaves agree with the reference.',
  'intro-b': 'Opening corrected against the tablature: only alternating Bb octaves. The simultaneous source MIDI Eb4 at ticks 3360 is omitted; all Bb attacks and durations are retained.',
  'riff-a': 'Reference phrase B-D-G-A, with slide into B and a quarter-tone bend on G. Note values follow the reference score.',
  'riff-b': 'Reference response G-D-E-E: open D and low E, then slide D to E on the A string. The slide is one continuous event, not an extra D attack.',
  'solo-a': 'Reference approach C#-E-B repeated, with a slide into C# and a quarter-tone bend on B as notated in the reference score.',
  'solo-b': 'Reference higher approach E-G-G repeated, with a quarter-tone bend and release on high G. The isolated final high E from the MIDI belongs outside this selected phrase and is omitted.',
  'solo-c': 'Reference descent restores F#-G-F# after the preceding sustained G. Timing is adapted for a four-beat study excerpt; the connecting slides are synthesized.',
  'solo-d': 'Reference descent continues F#-E-D, with a slide back into F#. Timing is adapted for the study excerpt.',
};
const tuning = {e_low:40,a:45,d:50,g:55,b:59,e_high:64};
const scoreSource='https://musescore.org/sites/musescore.org/files/2019-02/Purple%20Haze.pdf';
const note=(stringId,fret,beat,duration,expression={})=>({stringId,fret,midi:tuning[stringId]+fret,beat,duration,sourceTicks:-1,...expression});
const slide=(from,to,duration=.125)=>({technique:{kind:'slide'},pitchCurve:[{beat:0,midi:from},{beat:duration,midi:to}]});
const bend=(midi,duration,release=false)=>({technique:{kind:'bend',semitones:.5},pitchCurve:[{beat:0,midi},{beat:.2,midi:midi+.5},...(release?[{beat:duration-.2,midi:midi+.5},{beat:duration,midi}]:[])]});
const curatedNotes={
  'riff-a':[
    note('d',9,0,.5,slide(57,59)),note('g',7,.5,.5),note('b',8,1,.5,bend(67,.5)),note('d',7,1.5,2.5),
  ],
  'riff-b':[
    note('d',5,0,.5),note('d',0,.5,.5),note('e_low',0,1,.5),note('a',7,1.5,2.5,slide(50,52)),
  ],
  'solo-a':[
    note('d',11,0,.5,slide(59,61)),note('g',9,.5,.5),note('b',12,1,1,bend(71,1)),
    note('d',11,2,.5,slide(59,61)),note('g',9,2.5,.5),note('b',12,3,1,bend(71,1)),
  ],
  'solo-b':[
    note('d',14,0,.5,slide(62,64)),note('g',12,.5,.5),note('e_high',15,1,1,bend(79,1,true)),
    note('d',14,2,.5,slide(62,64)),note('g',12,2.5,.5),note('e_high',15,3,1,bend(79,1,true)),
  ],
  'solo-c':[note('g',12,0,1.5),note('g',11,1.5,.25),note('g',12,1.75,.25,slide(66,67,.125))],
  'solo-d':[note('g',11,0,.5,slide(67,66)),note('d',14,.5,.5),note('d',12,1,1)],
};
for(const id of Object.keys(curatedNotes))sourceEdits[id]=[{action:'replace-block',reviewedAt:'2026-10-14',reason:reviewNotes[id],sourceUrls:[fingeringSources[id.startsWith('riff')?'riff':id==='solo-a'||id==='solo-b'?'soloEntry':'soloDescent'],...(id==='solo-c'||id==='solo-d'?[]:[scoreSource])],timingBasis:id==='solo-c'||id==='solo-d'?'study-adaptation':'reference-score'}];
const blocks = definitions.map(([id,title,start,end,startFret,endFret,sourceId]) => ({
  id,title,startBeat:start,endBeat:end,startFret,endFret,
  ...(sourceEdits[id]?{sourceEdits:sourceEdits[id]}:{}),
  fingeringReview:{
    status:curatedNotes[id]?'reference-curated-study-arrangement':'reference-reviewed-midi-adaptation',
    sourceId,
    sourceUrl:fingeringSources[sourceId],
    notes:reviewNotes[id],
  },
  notes:curatedNotes[id]??midi.tracks[1].notes.filter(n => n.ticks / midi.header.ppq < end && (n.ticks+n.durationTicks)/midi.header.ppq > start)
  .filter(n => !(sourceEdits[id]??[]).some(edit=>edit.action==='omit'&&edit.midi===n.midi&&edit.sourceTicks===n.ticks)).map(n => {
    const originalBeat=n.ticks/midi.header.ppq;
    const onset=Math.max(start,originalBeat);
    const position=fingerings[id][n.midi];
    if(!position) throw new Error('Pitch without study fingering in '+id+': '+n.midi);
    if(tuning[position[0]]+position[1]!==n.midi) throw new Error('Fingering changes MIDI pitch in '+id);
    if(position[1]<startFret||position[1]>endFret) throw new Error('Fingering outside block range in '+id);
    return { stringId:position[0],fret:position[1],midi:n.midi,beat:onset-start,
      duration:Math.min(end,(n.ticks+n.durationTicks)/midi.header.ppq)-onset,sourceTicks:n.ticks };
  })
}));
for(const block of blocks)for(const event of block.notes){
  if(tuning[event.stringId]+event.fret!==event.midi||event.fret<block.startFret||event.fret>block.endFret||event.beat<0||event.duration<=0||event.beat+event.duration>block.endBeat-block.startBeat)throw new Error('Invalid reference event in '+block.id);
}
mkdirSync('src/data',{recursive:true});
writeFileSync('src/data/purple-haze.json',JSON.stringify({
  sourceFile,sourceUrl:'https://www.midiworld.com/files/1056/',trackIndex:1,ppq:midi.header.ppq,
  bpm:midi.header.tempos[0].bpm,title:'Purple Haze',blocks,
  introFingeringSource:fingeringSources.intro,
  fingeringSources,
  fingeringReviewedAt:'2026-10-09',
  openingReviewedAt:'2026-10-14',
  phrasesReviewedAt:'2026-10-14',scoreSource,
  transcriptionScope:'Reference-curated study excerpts. Opening retains corrected MIDI timing; riff and approach use reference score note values. Descent timing and expression curves are study adaptations. Source edits are documented per block; this is not an exact recording transcription.',
},null,2)+'\n');
console.log('Prepared '+blocks.length+' reference-reviewed MIDI study blocks from Purple Haze.');
