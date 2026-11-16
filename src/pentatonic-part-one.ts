import type { SongLesson, SongNote, SongPosition, StudyBlock, BackingNote } from './song-content';
import type { StudyPage, StudyVisual } from './study-model';
import type { TrackContent } from './track-model';
import { amRegion, dmRegion, transposeRegion, regionMap, position, type ChordRegion } from './caged-positions';
import scaleSketch from './assets/mission-scale-path.svg';
import phraseSketch from './assets/mission-phrase-space.svg';
import bluesLickSketch from './assets/mission-blues-lick.svg';
import journeySketch from './assets/mission-context-journey.svg';
import transportSketch from './assets/mission-shape-transport.svg';
import {softPopBacking} from './practice-band';

const id='minor-pentatonic-part-one',slug='pentatonica-menor-parte-1';
const gm=transposeRegion(amRegion,-2,'gm-e','Gm');
const bm=transposeRegion(amRegion,2,'bm-e','Bm');
const emA=transposeRegion(dmRegion,2,'em-a','Em');
const cmA=transposeRegion(dmRegion,-2,'cm-a','Cm');
const note=(p:SongPosition,beat:number,duration=.42):SongNote=>({...p,beat,duration,sourceTicks:-1});

/** A closed two-note-per-string shape, ordered by sounding pitch. Neither endpoint is doubled. */
export function scaleCycle(region:ChordRegion):SongPosition[]{
  const up=[...region.positions].sort((a,b)=>a.midi-b.midi);
  return [...up,...up.slice(1,-1).reverse()];
}

/** Original gentle 4/4 vamp: root/fifth bass and lightly staggered minor-seventh voicings. */
export function practiceBacking(region:ChordRegion,beats:number):BackingNote[]{
  const root=36+region.tonic;
  const voicing=[root+12,root+15,root+19,root+22];
  const result:BackingNote[]=[];
  for(let bar=0;bar<beats;bar+=4){
    for(const [offset,midi] of [[0,root],[2,root+7]] as const){
      if(bar+offset<beats)result.push({midi,beat:bar+offset,duration:Math.min(1.5,beats-bar-offset)});
    }
    for(const offset of [1,3])voicing.forEach((midi,string)=>{
      const beat=bar+offset+string*.018;
      if(beat<beats)result.push({midi,beat,duration:Math.min(.7,beats-beat),instrument:'clean-guitar'});
    });
  }
  return result;
}

function block(key:string,region:ChordRegion,beats:number,notes:SongNote[],label=region.chord):StudyBlock{
  return {id:key,title:`${region.chord} · forma de ${region.root.stringId==='e_low'?'Em':'Am'}`,startBeat:0,endBeat:beats,
    startFret:region.startFret,endFret:region.endFret,map:{...regionMap(region),spelling:region.tonic===7||region.tonic===0?'flat':'sharp'},notes,
    backing:practiceBacking(region,beats),cues:[{beat:0,label}]};
}
function scale(key:string,region:ChordRegion):StudyBlock{
  const cycle=scaleCycle(region);
  const finalTonic=[...region.positions].filter(p=>p.midi%12===region.tonic).sort((a,b)=>a.midi-b.midi)[0]!;
  // Two complete paths establish the shape without turning the mission into endurance practice.
  const paths=Array.from({length:2},(_,lap)=>cycle.map((p,i)=>note(p,lap*11+i*.5))).flat();
  const result=block(key,region,24,[...paths,note(finalTonic,22,2)]);
  result.backing=softPopBacking(region.tonic,24);
  result.backingGain=.85;
  return result;
}
function shapePosition(region:ChordRegion,stringId:SongPosition['stringId'],fretOffset:number):SongPosition{
  const found=region.positions.find(p=>p.stringId===stringId&&p.fret===region.root.fret+fretOffset);
  if(!found)throw new Error(`Posição ausente em ${region.id}: ${stringId} ${fretOffset}`);
  return found;
}
function motifNotes(positions:SongPosition[],offset=0):SongNote[]{
  return positions.map((p,i)=>note(p,offset+i,i===3||i===7?.85:.62));
}
/** One compact 1–♭3–4–5 idea that survives when the E-shape moves. */
function eShapeMotif(region:ChordRegion,offset=0):SongNote[]{
  const root=shapePosition(region,'d',2),third=shapePosition(region,'g',0);
  const fourth=shapePosition(region,'g',2),fifth=shapePosition(region,'b',0);
  return motifNotes([root,third,fourth,fifth,fifth,fourth,third,root],offset);
}
/** The same degree contour placed inside the A-shape. */
function aShapeMotif(region:ChordRegion,offset=0):SongNote[]{
  const root=shapePosition(region,'g',2),third=shapePosition(region,'b',1);
  const fourth=shapePosition(region,'b',3),fifth=shapePosition(region,'e_high',0);
  return motifNotes([root,third,fourth,fifth,fifth,fourth,third,root],offset);
}
function musicalBlock(key:string,region:ChordRegion,beats:number,notes:SongNote[]):StudyBlock{
  const result=block(key,region,beats,notes);
  result.backing=softPopBacking(region.tonic,beats);
  result.backingGain=.85;
  return result;
}
function transportedShape(key:string,region:ChordRegion,orient=true):StudyBlock{
  const notes=orient
    ?[...scaleCycle(region).map((p,i)=>note(p,i*.5)),...eShapeMotif(region,12)]
    :eShapeMotif(region);
  return musicalBlock(key,region,orient?20:8,notes);
}
function anchoredShape(key:string,region:ChordRegion):StudyBlock{
  const chordAnchor=[0,4].flatMap(start=>region.chordPositions.map((p,string)=>note(p,start+string*.025,3.2)));
  const cycle=scaleCycle(region);
  const fullPath=[...cycle,cycle[0]!];
  const path=fullPath.map((p,i)=>note(p,8+i*.5,i===fullPath.length-1?1:.42));
  const motif=aShapeMotif(region,20);
  const result=musicalBlock(key,region,28,[...chordAnchor,...path,...motif]);
  result.phaseCues=[
    {beat:0,label:'Acorde'},
    {beat:8,label:'Escala'},
    {beat:20,label:'Motivo'},
  ];
  return result;
}
const bluesPhrase:SongNote[]=[
  {...note(position('g',7),0,1.5),technique:{kind:'bend',semitones:2},pitchCurve:[{beat:0,midi:62},{beat:.75,midi:64},{beat:1.5,midi:64}]},
  note(position('e_high',5),2,1),
  note(position('b',8),4,.6),note(position('b',5),4.75,.6),note(position('g',7),5.5,.6),
  note(position('g',5),6.25,.6),note(position('d',7),7,1),
];
// Authored adaptation of the repeated-tonic gesture discussed by Tom Kolb
// in relation to The Thrill Is Gone; not a transcription of the recording.
function journeyArrival(p:SongPosition):SongNote{
  return {...note(p,6,2),pitchCurve:[{beat:0,midi:p.midi},{beat:.5,midi:p.midi},
    ...Array.from({length:12},(_,i)=>({beat:.625+i*.125,midi:p.midi+(i%2===0?.16:0)}))]};
}
const journeyAmPhrase:SongNote[]=[
  ...[0,.5,1,1.5].map(beat=>note(position('e_high',5),beat,.4)),
  note(position('b',8),2.5,.75),
  note(position('b',5),4.5,.45),note(position('g',7),5,.45),
  note(position('g',5),5.5,.45),journeyArrival(position('d',7)),
];
const journeyDmPhrase:SongNote[]=[
  ...[0,.5,1,1.5].map(beat=>note(position('g',7),beat,.4)),
  note(position('g',5),2.5,.75),
  note(position('d',7),4.5,.45),note(position('d',5),5,.45),
  note(position('a',8),5.5,.45),journeyArrival(position('a',5)),
];
const journeyGmPhrase=journeyAmPhrase.map(note=>({...note,fret:note.fret-2,midi:note.midi-2,
  pitchCurve:note.pitchCurve?.map(point=>({...point,midi:point.midi-2}))}));
const journeyCmPhrase=journeyDmPhrase.map(note=>({...note,fret:note.fret-2,midi:note.midi-2,
  pitchCurve:note.pitchCurve?.map(point=>({...point,midi:point.midi-2}))}));
const journeyContexts:[string,ChordRegion,SongNote[]][]=[
  ['am-ida',amRegion,journeyAmPhrase],['dm-ida',dmRegion,journeyDmPhrase],['gm-ida',gm,journeyGmPhrase],
  ['cm',cmA,journeyCmPhrase],['gm-volta',gm,[]],['dm-volta',dmRegion,[]],
];
const journeyBlocks=journeyContexts.map(([key,region,phrase])=>{
  const guided=phrase.length>0;
  const result=block(`journey-${key}`,region,16,phrase);
  result.cardId=`journey-${region.id}`;
  result.phaseCues=guided?[{beat:0,label:'Toque junto'},{beat:8,label:'Responda'}]:[{beat:0,label:'Responda'}];
  result.responseBeat=guided?8:0;
  return result;
});
const bridgeAmPhrase:SongNote[]=[
  note(position('e_high',5),0,1.25),note(position('e_high',8),1.5,.6),note(position('e_high',5),2.25,.75),
  note(position('b',8),4,.6),note(position('b',5),4.75,.75),
  {...note(position('g',7),5.75,1.25),technique:{kind:'bend',semitones:2},pitchCurve:[{beat:0,midi:62},{beat:.65,midi:64},{beat:1.25,midi:64}]},
  note(position('b',5),7.25,.75),
];
const bridgeDmPhrase=[
  note(position('b',6),0,1),note(position('e_high',5),1.25,1),note(position('e_high',8),2.5,.75),
  note(position('e_high',5),4,1),note(position('b',8),5.25,.6),note(position('b',6),6,.75),note(position('g',7),7,1),
];
const blocks:StudyBlock[]=[
  scale('e-am',amRegion),
  transportedShape('transport-am',amRegion),transportedShape('transport-gm',gm),transportedShape('transport-am-return',amRegion,false),transportedShape('transport-bm',bm),
  anchoredShape('shape-dm',dmRegion),anchoredShape('shape-em',emA),anchoredShape('shape-cm',cmA),
  block('phrase-listen',amRegion,8,bluesPhrase,'Ouça'),block('phrase-answer',amRegion,16,[],'Toque'),
  block('bridge-am-listen',amRegion,8,bridgeAmPhrase),block('bridge-dm-listen',dmRegion,8,bridgeDmPhrase),
  block('bridge-am-answer',amRegion,16,[]),block('bridge-dm-answer',dmRegion,16,[]),
  ...journeyBlocks,
];
for(const b of blocks){
  if(['phrase-answer','bridge-am-answer','bridge-dm-answer'].includes(b.id))b.responseBeat=0;
  if(['bridge-am-listen','bridge-dm-listen'].includes(b.id))b.phaseCues=[{beat:0,label:'Toque junto'}];
  if(['bridge-am-answer','bridge-dm-answer'].includes(b.id))b.phaseCues=[{beat:0,label:'Responda'}];
  if(['phrase-listen','phrase-answer'].includes(b.id)){
    b.backing=softPopBacking(amRegion.tonic,b.endBeat);
    b.backingGain=.85;
  }
  if(b.id.startsWith('bridge-')||b.id.startsWith('journey-')){
    b.backing=softPopBacking(b.map!.tonic,b.endBeat);
    b.backingGain=.85;
  }
}

const scaleVisual=(region:ChordRegion,caption=''):StudyVisual=>({kind:'scale',root:region.tonic,
  spelling:region.tonic===7||region.tonic===0?'flat':'sharp',
  positions:region.positions,phrasePositions:region.positions.filter(p=>region.chordTones.includes(p.midi%12)),
  degreeAnnotations:true,startFret:region.startFret,endFret:region.endFret,caption});
const chordVisual=(region:ChordRegion):Extract<StudyVisual,{kind:'scale'}>=>({kind:'scale',root:region.tonic,positions:region.chordPositions,
  degreeAnnotations:true,startFret:region.startFret,endFret:region.endFret,caption:region.chord});
const page=(paragraphs:string[],visual:StudyVisual,practice:string,extra:Partial<StudyPage>={}):StudyPage=>({
  title:'',hideTitle:true,paragraphs,visual,visualAfterParagraph:1,practice,question:'',answer:'',highlightPractice:true,...extra,
});

const entries=[
  {
    id:'primeiro-caminho',title:'O primeiro caminho',sceneTitle:'Cinco notas para começar',sketch:undefined,
    alt:'',exampleBeats:11,
    text:'A pentatônica é uma escala de cinco notas. Nesta trilha, vamos explorar a pentatônica menor, muito usada no blues e no rock para criar melodias e solos. Começaremos em Lá menor, usando o acorde de Am como referência para encontrar a escala no braço.',
    instruction:'Suba e desça duas vezes para reconhecer o shape. Depois, desmarque “Ouvir exemplo”: toque primeiro as notas do acorde e então acrescente Ré e Sol para completar a escala.',
    blocks:['e-am'],
    pages:[page([
      'Leve a forma do Mi menor aberto até a casa 5. A pestana passa a fazer o papel das cordas soltas e o acorde se torna Am. Lá é a referência dessa posição.',
      'O acorde reúne Lá, Dó e Mi. A pentatônica menor de Lá acrescenta Ré e Sol: são cinco nomes de notas, que reaparecem em alturas diferentes ao longo das seis cordas. No desenho da escala, as notas do acorde têm contorno contínuo; Ré e Sol ficam em tracejado.',
      'Toque do grave ao agudo e volte pelo mesmo caminho. Use o indicador na casa 5, o anelar na 7 e o mínimo na 8. Cada nota ocupa meio tempo; reduza a velocidade se a troca de corda interromper o movimento.',
      'Os graus usam Lá como referência: Lá, Dó e Mi são [[degree:1]], [[degree:♭3]] e [[degree:5]], as notas do acorde. Ré ([[degree:4]]) e Sol ([[degree:♭7]]) completam a escala. Alterne as notas do acorde com a escala inteira para ouvir o que elas acrescentam.',
    ],{kind:'scale',root:9,startFret:5,endFret:8,degreeAnnotations:true,caption:'',
      positions:amRegion.positions.filter(p=>amRegion.chordTones.includes(p.midi%12)),
      additionalPositions:amRegion.positions.filter(p=>!amRegion.chordTones.includes(p.midi%12))},
    'Se perder o desenho, reencontre Lá, Dó e Mi no acorde e procure Ré e Sol ao redor. Retome a escala no seu ritmo.',{visualAfterParagraph:1,highlightPractice:false})],
  },
  {
    id:'outros-lugares',title:'O desenho muda de lugar',sceneTitle:'A mesma forma encontra outro tom',sketch:transportSketch,
    alt:'Um pequeno grupo de bolinhas reaparece com a mesma forma em outro lugar, ligado por uma seta curva e marcas de movimento.',exampleBeats:11,
    text:'Retome a escala de Lá menor. Agora leve a mão inteira duas casas para trás: a referência passa de Lá para Sol e o mesmo desenho encontra Sol menor. Depois vamos experimentar Si menor e voltar a Lá.',
    instruction:'Em Am, Gm e Bm, percorra o shape uma vez e toque o mesmo motivo de dois compassos. No retorno a Am, recupere o motivo sem refazer a escala inteira.',
    blocks:['transport-am','transport-gm','transport-am-return','transport-bm'],
    pages:[page([
      'Uma forma sem cordas soltas pode ser deslocada inteira. As distâncias entre os dedos continuam iguais; o acorde e a escala mudam de tom. Na sexta corda, Sol está na casa 3, Lá na 5 e Si na 7. Ao encontrar a nova tônica, recupere os marcos anteriores: [[degree:♭3]] três casas adiante; [[degree:4]] na mesma casa da corda vizinha mais aguda; [[degree:5]] duas casas adiante nessa corda.',
      'No Sol, o acorde Gm reúne Sol, Si♭ e Ré, e sua pentatônica acrescenta Dó e Fá. No Si, Bm reúne Si, Ré e Fá♯, e sua pentatônica acrescenta Mi e Lá. O desenho se conserva porque todas as posições avançam ou recuam juntas.',
      'Em cada novo tom, o exemplo percorre o shape uma vez e termina com o mesmo motivo: [[degree:1]]–[[degree:♭3]]–[[degree:4]]–[[degree:5]] e o caminho de volta. Ao retornar a Am, aparece somente o motivo. Assim você verifica se transportou uma ideia musical, não apenas o desenho da escala.',
    ],{kind:'table',columns:['Acorde','Fundamental na 6ª corda','Movimento a partir de Am'],rows:[['Am','Lá · casa 5','Referência'],['Gm','Sol · casa 3','Duas casas para trás'],['Bm','Si · casa 7','Duas casas adiante']],caption:''},
    'Cante ou memorize o motivo em Am. Depois leve a mesma ideia para Gm e Bm, conservando ritmo, pausas e contorno. Se se perder, encontre a tônica na sexta corda antes de recomeçar.',{
      additionalVisuals:[{afterParagraph:2,visual:scaleVisual(gm,'Gm · a mesma forma duas casas para trás')}],
    })],
  },
  {
    id:'frase-e-espaco',title:'Uma frase ganha espaço',sceneTitle:'Um clássico do blues',sketch:bluesLickSketch,
    alt:'Os graus mostram 4 subindo em bend até 5 e chegando a 1; depois da pausa, a frase desce por ♭7, 5, 4 e ♭3 até voltar a 1.',exampleBeats:8,practiceBeats:24,hideTurnLabel:true,
    text:'Você já percorreu o desenho. Agora ouça um gesto clássico do blues: Ré sobe em bend até Mi e chega a Lá. Depois de uma pausa, a frase desce por Sol, Mi, Ré e Dó antes de voltar a Lá.',
    instruction:'Ouça dois compassos e responda durante quatro. Comece imitando o contorno; depois preserve a pausa e experimente outro ritmo ou outra chegada. A base permanece em Am.',
    blocks:['phrase-listen','phrase-answer'],
    pages:[page([
      'O primeiro gesto parte de Ré, a quarta de Lá. Uma pista para encontrar a [[degree:4]]: ela costuma ficar logo abaixo da tônica no desenho, na mesma casa da corda vizinha mais aguda. Aqui, parta do Lá na quarta corda, casa 7, e encontre Ré na terceira corda, também na casa 7. Na passagem da terceira para a segunda corda, exceção da afinação padrão, procure a [[degree:4]] uma casa adiante.',
      'Desse Ré, faça um bend de um tom até soar como Mi, a quinta. Empurre a terceira corda na casa 7 sem trocar de casa e compare o som de chegada com o Mi da segunda corda, casa 5.',
      'Depois do Lá agudo, a pausa separa chamada e resposta. A descida Sol–Mi–Ré–Dó–Lá percorre somente notas da pentatônica e termina na tônica. Cante o contorno antes de procurar as casas.',
      'Na sua resposta, comece imitando a duração da pausa. Depois mude apenas o final: compare chegar a Lá, Dó ou Mi sobre a mesma base. As três notas pertencem ao acorde, mas cada chegada tem um som próprio.',
    ],{kind:'scale',root:9,positions:amRegion.positions,phrasePositions:bluesPhrase,startFret:5,endFret:8,degreeAnnotations:true,caption:'Contorno contínuo: notas usadas no lick. ↗1t: bend de Ré até Mi.'},
    'Repita o lick até o bend alcançar Mi sem pressa. Em seguida, crie uma resposta curta e preserve o espaço entre as ideias.')],
  },
  {
    id:'corda-la',title:'Outro ponto de partida',sceneTitle:'Os mesmos graus, outra forma',sketch:scaleSketch,
    alt:'Um desenho delicado de pontos se transforma em outro formato; a tônica lilás muda da sexta para a quinta corda.',exampleBeats:28,
    text:'Você já viu como o acorde ajuda a encontrar a escala. Agora vamos usar a mesma ideia com Dm na forma de Am: partir do acorde, completar a pentatônica e depois levar o novo shape para [[chord:Em]] e Cm.',
    instruction:'Cada acorde segue a mesma ordem: Acorde, Escala e Motivo. Pratique Dm, [[chord:Em]] e Cm mantendo a pulsação entre as etapas; perceba a escala como extensão do acorde e o motivo como recorte da escala.',
    blocks:['shape-dm','shape-em','shape-cm'],
    pages:[page([
      'A montagem x–5–7–7–6–5 é Dm na forma de Am. Deixe a sexta corda em silêncio. Ré é [[degree:1]], Fá é [[degree:♭3]] e Lá é [[degree:5]]: essas três notas formam o acorde. Sol, a [[degree:4]], e Dó, a [[degree:♭7]], completam a pentatônica.',
      'Veja o acorde como o núcleo do shape. Primeiro encontre Ré, Fá e Lá no mapa. Depois procure Sol e Dó ao redor dessas notas. A escala não substitui o acorde: ela amplia os caminhos disponíveis para criar uma frase sobre ele.',
      'A escala também alcança a sexta corda: nela, Lá e Dó completam o desenho. A subida começa nesse Lá grave, embora a fundamental que orienta esta forma seja Ré, na quinta corda. O acorde começa na quinta corda; a escala percorre as seis.',
      'Ao transportar, monte primeiro o acorde na quinta corda e reconheça suas três notas. Em Dm, acrescente Sol e Dó; em [[chord:Em]], Lá e Ré; em Cm, Fá e Si♭. São sempre [[degree:4]] e [[degree:♭7]] completando [[degree:1]], [[degree:♭3]] e [[degree:5]].',
      'Os rótulos organizam três etapas em cada acorde. Em Acorde, toque duas vezes a forma completa, ouvindo [[degree:1]], [[degree:♭3]] e [[degree:5]] soarem juntas. Em Escala, percorra o shape completo. Em Motivo, use [[degree:1]], [[degree:♭3]], [[degree:4]] e [[degree:5]] e retorne pelo mesmo contorno. A ordem não muda ao passar por [[chord:Em]] e Cm.',
    ],chordVisual(dmRegion),'Siga os rótulos Acorde, Escala e Motivo. Toque a forma completa duas vezes antes de percorrer a escala e repetir o motivo.',{
      additionalVisuals:[{afterParagraph:2,visual:scaleVisual(dmRegion)}],
    })],
  },
  {
    id:'proximo-acorde',title:'O próximo acorde',sceneTitle:'Poucas notas, muito espaço',sketch:phraseSketch,
    alt:'Os shapes de Am e Dm aparecem sobrepostos; quase todas as bolinhas coincidem, enquanto Mi em lilás avança uma casa até Fá em verde.',exampleBeats:16,
    text:'Este lick usa uma ideia clássica do blues: poucas notas no registro agudo, espaço entre as frases e um bend expressivo. Quando Dm chega, Mi avança uma casa até Fá e a resposta continua no novo acorde.',
    instruction:'Toque junto por dois compassos em Am e dois em Dm. Depois, improvise por quatro compassos em cada acorde. Use Mi–Fá para acompanhar a troca; acrescente o bend quando estiver confortável.',
    blocks:['bridge-am-listen','bridge-dm-listen','bridge-am-answer','bridge-dm-answer'],
    pages:[page([
      'A primeira ideia toca [[note:Lá–Dó–Lá]] e deixa uma pausa. A resposta desce por [[note:Sol]] e [[note:Mi]]; depois, [[note:Ré]] sobe em bend até [[note:Mi]]. Toque devagar e deixe cada nota terminar antes de seguir: o espaço faz parte do lick.',
      'Uma forma de ligar os acordes é escolher uma nota de Am e chegar a uma nota de Dm por um caminho curto. Aqui, [[note:Mi]] é a [[degree:5]] de [[chord:Am]] e [[note:Fá]] é a [[degree:♭3]] de [[chord:Dm]]. Eles ficam lado a lado na segunda corda, casas 5 e 6, e esse passo de uma casa acompanha a mudança da base.',
      '[[note:Lá]] pertence aos dois acordes: é [[degree:1]] em [[chord:Am]] e [[degree:5]] em [[chord:Dm]]. Sustentá-lo durante a troca cria continuidade, mesmo que sua função mude no novo acorde.',
      '[[note:Dó]] também é compartilhado: [[degree:♭3]] de [[chord:Am]] e [[degree:♭7]] de [[chord:Dm]]. Use notas comuns para sustentar a frase e notas vizinhas, como [[note:Mi–Fá]], para conduzi-la. Assim, a troca não exige recomeçar a escala.',
      'Esses são dois caminhos possíveis, não uma regra: escolha uma nota do próximo acorde como chegada ou mantenha uma nota comum enquanto a harmonia muda.',
    ],{kind:'scale-overlay',layers:[{label:'Am',root:9,positions:amRegion.positions},{label:'Dm',root:2,positions:dmRegion.positions}],startFret:5,endFret:8,initialLayer:'second',caption:'Ative ou desative cada escala para comparar os shapes e revelar as posições compartilhadas.'},
    'Para criar sua resposta, experimente terminar uma frase em Mi sobre Am e chegar a Fá quando Dm entrar. Deixe uma pausa antes de começar outra ideia.',{highlightPractice:false})],
  },
  {
    id:'volta-pelas-quartas',title:'Uma volta pela sequência',sceneTitle:'Um trecho do ciclo das quartas',sketch:journeySketch,
    alt:'Am, Dm, Gm e Cm aparecem em quatro pontos igualmente distribuídos sobre um círculo desenhado à mão.',exampleBeats:8,
    text:'Começamos em [[chord:Am]] e avançamos uma quarta até [[chord:Dm]]. Repetimos o mesmo movimento para chegar a [[chord:Gm]] e depois [[chord:Cm]]. Esse movimento vem do ciclo das quartas — uma ordem simples para transportar a mesma ideia entre tons próximos. Depois de chegar a [[chord:Cm]], o caminho se inverte: você toca novamente sobre [[chord:Gm]] e [[chord:Dm]] antes de recomeçar em [[chord:Am]].',
    examplePrompt:'O motivo repete a tônica com ataques curtos. Depois, desce até uma chegada sustentada. Ouça o trecho para se familiarizar com essa intenção.',
    instruction:'Em Am, Dm, Gm e Cm, toque junto por dois compassos e improvise por dois. Depois de Cm, Gm e Dm ficam quatro compassos cada, só com a base: improvise desde a troca.',
    blocks:journeyBlocks.map(block=>block.id),
    pages:[page([
      'Em cada acorde, o motivo usa um recorte da pentatônica. Veja abaixo quais formas utilizar para criar sua resposta.',
      'Uma dica para encontrar a quarta: partindo da sexta corda, ela está na mesma casa da corda vizinha mais aguda. Na casa 5, [[note:Lá]] leva a [[note:Ré]] na quinta corda. Na casa 3, [[note:Sol]] leva a [[note:Dó]]. Esses dois pares ajudam a localizar as regiões da sequência.',
    ],{kind:'table',columns:['Acordes','Forma'],rows:[
      ['[[chord:Am]] e [[chord:Gm]]','Forma de [[chord:Em]]'],
      ['[[chord:Dm]] e [[chord:Cm]]','Forma de [[chord:Am]]'],
    ],caption:''},
    'Sua resposta pode ser uma frase sua, sem copiar o exemplo. Experimente tocar a mesma nota duas vezes antes de continuar a frase. Se quiser, acrescente um bend ou ligue duas notas na mesma corda com um slide.',{visualAfterParagraph:1,highlightPractice:false,
      insight:{afterParagraph:2,afterPractice:true,title:'Para explorar depois',text:'Nesta aula em inglês da Berklee Online, Rick Peckham apresenta o ciclo das quartas e demonstra como usá-lo para praticar na guitarra.',link:{label:'Assistir à aula sobre o ciclo das quartas',href:'https://www.youtube.com/watch?v=1DcOm0v3XAQ'}}})],
  },
];

const lessons:SongLesson[]=entries.map(entry=>({id:entry.id,ref:{source:'system',trackId:id,lessonId:entry.id},
  href:`/track/${slug}/${entry.id}/`,title:entry.title,navTitle:entry.title,instruction:entry.instruction,blocks:entry.blocks,
  mapStyle:'plain-degrees',mission:{practiceLabel:'Praticar',practiceMode:'along',exampleBeats:entry.exampleBeats,practiceBeats:'practiceBeats' in entry?entry.practiceBeats:undefined,hideTurnLabel:'hideTurnLabel' in entry?entry.hideTurnLabel:undefined,
    playInstruction:entry.instruction,hidePreparationExample:['primeiro-caminho','outros-lugares'].includes(entry.id),metronomeByDefault:!['primeiro-caminho','outros-lugares'].includes(entry.id),scene:{title:entry.sceneTitle,text:entry.text,followup:'examplePrompt' in entry?entry.examplePrompt:undefined,illustration:entry.sketch?{src:entry.sketch,alt:entry.alt,size:{width:entry.id==='volta-pelas-quartas'?300:260,height:['outros-lugares','volta-pelas-quartas'].includes(entry.id)?110:94}}:undefined}},
}));

export const minorPartOneTrack:TrackContent={
  manifest:{schemaVersion:1,id,slug,title:'Pentatônica menor · Parte 1',
    summary:'Encontre a escala pelas formas E e A, leve os desenhos a outros tons e crie frases com a base.',
    ownerId:'pentashapes',author:{id:'pentashapes',displayName:'PentaShapes'},origin:'official',purposeIds:['foundations'],
    language:'pt-BR',instrumentIds:['guitar','acoustic-guitar'],styleIds:['pop','blues'],topicIds:['minor-pentatonic','transposition','phrasing'],techniqueIds:['bend','vibrato'],
    prerequisites:['Reconhecer Mi menor e Lá menor abertos e experimentar suas formas com pestana.'],
    publication:{status:'published',visibility:'public',revision:1}},
  bpm:66,referenceInstruments:['clean-guitar','piano'],lessons,blocks,
  guide:{id,title:'Pentatônica menor · Parte 1',lessons:entries.map(entry=>({lessonId:entry.id,title:entry.title,introduction:entry.text,pages:entry.pages}))},
  sources:['https://www.youtube.com/watch?v=drX6XjaItA4','https://www.youtube.com/watch?v=ziERcFhoSIg',
    'https://online.berklee.edu/courses/guitar-improvisation-techniques','https://online.berklee.edu/courses/jazz-guitar-101',
    'https://www.youtube.com/watch?v=1DcOm0v3XAQ',
    'https://www.guitarworld.com/lessons/soloing-strategies-bb-king',
    'https://www.guitarworld.com/lessons/artist-lessons/how-to-play-bb-king-the-thrill-is-gone',
    'Ritmo comparado com a Figura 1, compassos 6–7, da aula de Joe Bonamassa: a frase continua após os quatro ataques repetidos e sustenta uma nota antes da descida seguinte. A missão simplifica esse gesto em quatro ataques, uma nota de continuação, pausa e descida com chegada sustentada; não reproduz os tempos da gravação.',
    'Motivo final autoral inspirado no gesto de tônica repetida descrito por Tom Kolb em Soloing Strategies: B.B. King (Figura 6, compasso 17). Ritmo, descida e transporte entre pentatônicas adaptados para a missão; não é transcrição de The Thrill Is Gone.'],
};
