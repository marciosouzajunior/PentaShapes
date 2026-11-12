import type { SongLesson, SongNote, SongPosition, StudyBlock, BackingNote } from './song-content';
import type { StudyPage, StudyVisual } from './study-model';
import type { TrackContent } from './track-model';
import { amRegion, dmRegion, transposeRegion, regionMap, position, type ChordRegion } from './caged-positions';
import scaleSketch from './assets/mission-scale-path.svg';
import phraseSketch from './assets/mission-phrase-space.svg';
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
  return {id:key,title:`${region.chord} · forma ${region.root.stringId==='e_low'?'E':'A'}`,startBeat:0,endBeat:beats,
    startFret:region.startFret,endFret:region.endFret,map:{...regionMap(region),spelling:region.tonic===7||region.tonic===0?'flat':'sharp'},notes,
    backing:practiceBacking(region,beats),cues:[{beat:0,label}]};
}
function scale(key:string,region:ChordRegion):StudyBlock{
  const cycle=scaleCycle(region);
  // Four 11-beat cycles = eleven full measures. The path need not restart at each barline.
  const result=block(key,region,44,Array.from({length:4},(_,lap)=>cycle.map((p,i)=>note(p,lap*11+i*.5))).flat());
  if(key.startsWith('e-')){
    result.backing=softPopBacking(region.tonic,44);
    result.backingGain=.85;
  }
  return result;
}
const amPhrase=[note(position('g',5),0,.8),note(position('g',7),1,.8),note(position('b',5),2,1.5),
  note(position('g',5),4,.8),note(position('b',5),5,.8),note(position('d',7),6,1.5)];
const dmPhrase=[note(position('b',6),0,1.5),note(position('g',7),2,1.5),note(position('b',6),4,.8),note(position('g',7),5,.8),note(position('g',5),6,1.5)];
const bridgeAmPhrase=[...amPhrase.slice(0,-1),note(position('b',5),6,1.5)];
const gmPhrase=[note(position('g',3),0,.8),note(position('g',5),1,.8),note(position('b',3),2,1.5),note(position('g',3),4,.8),note(position('b',3),5,.8),note(position('d',5),6,1.5)];
const blocks:StudyBlock[]=[
  scale('e-am',amRegion),scale('e-gm',gm),scale('e-am-return-1',amRegion),scale('e-bm',bm),
  scale('a-dm',dmRegion),scale('a-em',emA),scale('a-dm-return-1',dmRegion),scale('a-cm',cmA),scale('a-dm-return-2',dmRegion),
  block('phrase-listen',amRegion,8,amPhrase,'Ouça'),block('phrase-answer',amRegion,16,[],'Toque'),
  block('bridge-am-listen',amRegion,8,bridgeAmPhrase),block('bridge-dm-listen',dmRegion,8,dmPhrase),
  block('bridge-am-answer',amRegion,16,[]),block('bridge-dm-answer',dmRegion,16,[]),
  ...[
    ['journey-am',amRegion,amPhrase],['journey-dm',dmRegion,dmPhrase],['journey-gm',gm,gmPhrase],
    ['journey-dm-return',dmRegion,dmPhrase],['journey-am-return',amRegion,amPhrase],
  ].map(([key,region,notes])=>block(key as string,region as ChordRegion,16,notes as SongNote[])),
];
for(const b of blocks){
  if(['phrase-answer','bridge-am-answer','bridge-dm-answer'].includes(b.id))b.responseBeat=0;
  else if(b.id.startsWith('journey-'))b.responseBeat=8;
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
    instruction:'Suba e desça com a escala. Fique nesta posição até as notas soarem claras. Depois, abra os ajustes e desmarque “Ouvir exemplo” para tocar só com a base.',
    blocks:['e-am'],
    pages:[page([
      'Leve a forma do Mi menor aberto até a casa 5. A pestana passa a fazer o papel das cordas soltas e o acorde se torna Am. Lá é a referência dessa posição.',
      'O acorde reúne Lá, Dó e Mi. A pentatônica menor de Lá acrescenta Ré e Sol: são cinco nomes de notas, que reaparecem em alturas diferentes ao longo das seis cordas. No desenho da escala, as notas do acorde têm contorno contínuo; Ré e Sol ficam em tracejado.',
      'Toque do grave ao agudo e volte pelo mesmo caminho. Use o indicador na casa 5, o anelar na 7 e o mínimo na 8. Cada nota ocupa meio tempo; reduza a velocidade se a troca de corda interromper o movimento.',
      'Lá, Dó e Mi também aparecem como 1, ♭3 e 5: esses graus descrevem a relação com Lá. Dó dá a terça menor ao acorde. Ré é 4 e Sol é ♭7. Use essas relações como referências enquanto escuta, sem precisar decorá-las antes de tocar.',
    ],{kind:'scale',root:9,startFret:5,endFret:8,degreeAnnotations:true,caption:'',
      positions:amRegion.positions.filter(p=>amRegion.chordTones.includes(p.midi%12)),
      additionalPositions:amRegion.positions.filter(p=>!amRegion.chordTones.includes(p.midi%12))},
    'Repita sem pressa. Retome uma troca difícil mais devagar e depois volte à escala inteira. Para seguir, procure notas claras e pulso confortável.',{visualAfterParagraph:1})],
  },
  {
    id:'outros-lugares',title:'O desenho muda de lugar',sceneTitle:'A mesma forma encontra outro tom',sketch:transportSketch,
    alt:'Um pequeno grupo de bolinhas reaparece com a mesma forma em outro lugar, ligado por uma seta curva e marcas de movimento.',exampleBeats:11,
    text:'Retome a escala de Lá menor. Agora leve a mão inteira duas casas para trás: a referência passa de Lá para Sol e o mesmo desenho encontra Sol menor. Depois vamos experimentar Si menor e voltar a Lá.',
    instruction:'Pratique Am, Gm e Bm nos blocos da base. Os retornos a Am recuperam a posição conhecida. Antecipe a nova casa sem acelerar.',
    blocks:['e-am','e-gm','e-am-return-1','e-bm'],
    pages:[page([
      'Uma forma sem cordas soltas pode ser deslocada inteira. As distâncias entre os dedos continuam iguais; o acorde e a escala mudam de tom. Na sexta corda, Sol está na casa 3, Lá na 5 e Si na 7.',
      'No Sol, o acorde Gm reúne Sol, Si♭ e Ré, e sua pentatônica acrescenta Dó e Fá. No Si, Bm reúne Si, Ré e Fá♯, e sua pentatônica acrescenta Mi e Lá. O desenho se conserva porque todas as posições avançam ou recuam juntas.',
      'A base oferece bastante tempo em cada tom e volta a Am entre as tentativas. São blocos de treino em tons separados, preparados para a escala correspondente. Mais adiante vamos trabalhar a ligação musical entre contextos.',
    ],{kind:'table',columns:['Acorde','Fundamental na 6ª corda','Movimento a partir de Am'],rows:[['Am','Lá · casa 5','Referência'],['Gm','Sol · casa 3','Duas casas para trás'],['Bm','Si · casa 7','Duas casas adiante']],caption:''},
    'Repita a sequência até se sentir confortável ao mudar de posição, com notas claras e pulso regular. Você pode parar e continuar em outro dia; ao voltar, retome devagar antes de aumentar a velocidade.',{
      additionalVisuals:[{afterParagraph:2,visual:scaleVisual(gm,'Gm · a mesma forma duas casas para trás')}],
    })],
  },
  {
    id:'frase-e-espaco',title:'Uma frase ganha espaço',sceneTitle:'A escala pode esperar',sketch:phraseSketch,
    alt:'Uma frase de poucas notas deixa um espaço antes de voltar a Lá.',exampleBeats:8,
    text:'Você já percorreu o desenho. Agora ouça uma frase que usa só uma parte dele: Dó, Ré e Mi, uma pausa, depois Dó, Mi e Lá. O espaço entre as ideias também faz parte da música.',
    instruction:'Ouça dois compassos e responda durante quatro. Repita o começo e experimente outro ritmo ou outra chegada. A base permanece em Am.',
    blocks:['phrase-listen','phrase-answer'],
    pages:[page([
      'O exemplo usa Dó e Mi, que pertencem a Am, e passa por Ré antes de terminar em Lá. Reconheça o caminho no desenho e toque a frase com calma.',
      'Ouça mais uma vez e tente cantarolar o contorno antes de procurar as casas. Na sua resposta, você pode imitar a ideia inteira, repetir uma nota ou deixar uma pausa maior.',
      'Depois mude apenas o final: compare chegar a Lá, Dó ou Mi sobre a mesma base. As três notas pertencem ao acorde, mas cada chegada tem um som próprio. Deixe a última nota durar para ouvir essa relação.',
    ],{kind:'scale',root:9,positions:amRegion.positions,phrasePositions:amPhrase,startFret:5,endFret:8,degreeAnnotations:true,caption:'Contorno contínuo: notas usadas no exemplo. Tracejado: outras notas disponíveis.'},
    'Repita uma resposta de que gostou antes de inventar outra. Se perder o caminho, percorra a escala uma vez e volte à frase.')],
  },
  {
    id:'corda-la',title:'Outro ponto de partida',sceneTitle:'Uma referência na corda Lá',sketch:scaleSketch,
    alt:'Uma referência na quinta corda orienta outro caminho de subida e descida.',exampleBeats:11,
    text:'Antes da nova posição, retome uma volta de Lá menor na forma E no instrumento. Depois encontre Ré na quinta corda, casa 5. A forma do Lá menor aberto, agora com pestana, se torna Dm e oferece outro desenho de pentatônica ao redor.',
    instruction:'Pratique Dm, Em e Cm pela quinta corda. Volte a Dm entre os blocos e mantenha as trocas de corda claras.',
    blocks:['a-dm','a-em','a-dm-return-1','a-cm','a-dm-return-2'],
    pages:[page([
      'A montagem x–5–7–7–6–5 é Dm na forma A. Deixe a sexta corda em silêncio ao tocar o acorde. Suas notas são Ré, Fá e Lá; a pentatônica acrescenta Dó e Sol.',
      'A escala também alcança a sexta corda: nela, Lá e Dó completam o desenho. A subida começa nesse Lá grave, embora a fundamental que orienta esta forma seja Ré, na quinta corda. O acorde começa na quinta corda; a escala percorre as seis.',
      'Use o indicador na casa 5, o médio na 6, o anelar na 7 e o mínimo na 8. O ponto na casa 6 da segunda corda é Fá. Nas demais cordas, mantenha o desenho completo visível até a sequência ficar confortável.',
      'O procedimento de transporte continua igual. Na quinta corda, Ré está na casa 5, Mi na 7 e Dó na 3. Mova todas as posições juntas para acompanhar cada base. Aqui você aprende outro desenho e também o transporta para outros tons.',
    ],chordVisual(dmRegion),'Retome a forma E na próxima prática. Antes de consultar o desenho de Dm, tente lembrar onde estão Ré, Fá e Lá dentro desta nova forma.',{
      additionalVisuals:[{afterParagraph:2,visual:scaleVisual(dmRegion)}],
    })],
  },
  {
    id:'proximo-acorde',title:'O próximo acorde',sceneTitle:'Uma nota prepara a troca',sketch:phraseSketch,
    alt:'Uma frase chega a Mi e continua em Fá no contexto seguinte.',exampleBeats:16,
    text:'Am na forma E e Dm na forma A ficam perto da casa 5. Ouça a primeira frase chegar a Mi. Quando entra Dm, a frase continua em Fá, uma casa adiante na mesma corda. Esse pequeno movimento liga os dois contextos.',
    instruction:'Ouça Am e Dm por dois compassos cada. Depois toque por quatro compassos em cada acorde. Tente ligar o final de uma frase ao começo da próxima.',
    blocks:['bridge-am-listen','bridge-dm-listen','bridge-am-answer','bridge-dm-answer'],
    pages:[page([
      'Na primeira parte do exemplo, Mi pertence ao acorde de Am. Na troca, Fá passa a fazer parte de Dm. Na segunda corda, Mi está na casa 5 e Fá na 6: ouça como esse passo curto acompanha a mudança da base.',
      'Lá é outra ponte: pertence aos dois acordes. Você pode sustentá-lo na troca e continuar a frase depois. As duas pentatônicas também compartilham Dó, Ré e Sol, embora essas notas tenham relações diferentes com cada acorde.',
      'No fim da frase de Dm, o exemplo chega a Dó. Dó também pertence a Am e pode permanecer quando a base volta. Assim, a ligação não depende de recomeçar uma escala inteira em cada troca.',
      'Nesta base foram escolhidos Am e Dm com acompanhamentos compatíveis com suas pentatônicas menores. Em outras músicas, a escolha do material depende da harmonia e do som desejado; a raiz de um acorde sozinha não determina a escala.',
    ],{kind:'positions',positions:[position('b',5),position('b',6)],startFret:5,endFret:8,showDirection:true,caption:'Mi → Fá · um passo na troca de Am para Dm'},
    'Faça uma volta usando Lá como ligação. Na próxima, experimente Mi → Fá. Repita a opção que soou mais clara antes de variar.',{
      additionalVisuals:[{afterParagraph:2,visual:scaleVisual(dmRegion,'Dm · a forma A ocupa a região já conhecida')}],
    })],
  },
  {
    id:'volta-pelas-quartas',title:'Uma volta pela sequência',sceneTitle:'O caminho continua',sketch:journeySketch,
    alt:'Am segue para Dm e Gm, depois retorna por Dm até Am.',exampleBeats:8,
    text:'A base percorre Am, Dm e Gm, depois volta por Dm até Am. Cada contexto dura quatro compassos. Você já conhece os dois desenhos necessários; agora vamos recuperá-los enquanto a música continua.',
    instruction:'Em cada bloco, ouça dois compassos e use os dois seguintes para responder. Se preferir, desligue Ouvir exemplo e toque durante todo o bloco.',
    blocks:['journey-am','journey-dm','journey-gm','journey-dm-return','journey-am-return'],
    pages:[page([
      'De Lá para Ré e de Ré para Sol, as fundamentais sobem uma quarta: Lá–Si–Dó–Ré; Ré–Mi–Fá–Sol. Esse é o começo de um ciclo de quartas. Aqui exploramos só três contextos e voltamos pelo caminho inverso.',
      'Use Am na forma E e Dm na forma A perto da casa 5. Para Gm, leve a forma E à casa 3. O pequeno deslocamento faz parte deste exercício; as outras posições poderão oferecer caminhos diferentes numa próxima parte.',
      'A frase de Am termina em Lá; a de Dm começa em Fá. De Dm para Gm, Dó pode continuar soando como nota comum às duas pentatônicas. Você também pode pausar na troca, ouvir a base e só então responder.',
      'Esta sequência foi composta para praticar esses contextos menores. Ela não representa todos os acordes de uma única tonalidade. Na volta, tente recuperar as posições antes de consultar e repetir uma ideia que funcionou na ida.',
    ],{kind:'table',columns:['Contexto','Referência','Região'],rows:[['Am','Forma E · Lá na 6ª corda','Casas 5–8'],['Dm','Forma A · Ré na 5ª corda','Casas 5–8'],['Gm','Forma E · Sol na 6ª corda','Casas 3–6']],caption:'Quatro compassos por contexto. Ida: Am → Dm → Gm. Volta: Dm → Am.'},
    'Comece percorrendo a escala, se precisar. Depois escolha poucas notas e deixe espaço. Em outro dia, retome esta sequência e observe quais posições consegue recuperar com menos consulta.')],
  },
];

const lessons:SongLesson[]=entries.map(entry=>({id:entry.id,ref:{source:'system',trackId:id,lessonId:entry.id},
  href:`/track/${slug}/${entry.id}/`,title:entry.title,navTitle:entry.title,instruction:entry.instruction,blocks:entry.blocks,
  mapStyle:'plain-degrees',mission:{practiceLabel:'Praticar',practiceMode:'along',boardDisplay:'current',exampleBeats:entry.exampleBeats,
    playInstruction:entry.instruction,hidePreparationExample:['primeiro-caminho','outros-lugares'].includes(entry.id),metronomeByDefault:!['primeiro-caminho','outros-lugares'].includes(entry.id),scene:{title:entry.sceneTitle,text:entry.text,illustration:entry.sketch?{src:entry.sketch,alt:entry.alt,size:{width:260,height:entry.id==='outros-lugares'?110:94}}:undefined}},
}));

export const minorPartOneTrack:TrackContent={
  manifest:{schemaVersion:1,id,slug,title:'Pentatônica menor · Parte 1',
    summary:'Encontre a escala pelas formas E e A, leve os desenhos a outros tons e crie frases com a base.',
    ownerId:'pentashapes',author:{id:'pentashapes',displayName:'PentaShapes'},origin:'official',purposeIds:['foundations'],
    language:'pt-BR',instrumentIds:['guitar','acoustic-guitar'],styleIds:['pop','blues'],topicIds:['minor-pentatonic','transposition','phrasing'],techniqueIds:[],
    prerequisites:['Reconhecer Mi menor e Lá menor abertos e experimentar suas formas com pestana.'],
    publication:{status:'published',visibility:'public',revision:1}},
  bpm:66,referenceInstruments:['clean-guitar','piano'],lessons,blocks,
  guide:{id,title:'Pentatônica menor · Parte 1',lessons:entries.map(entry=>({lessonId:entry.id,title:entry.title,introduction:entry.text,pages:entry.pages}))},
  sources:['https://www.youtube.com/watch?v=drX6XjaItA4','https://www.youtube.com/watch?v=ziERcFhoSIg',
    'https://online.berklee.edu/courses/guitar-improvisation-techniques','https://online.berklee.edu/courses/jazz-guitar-101'],
};
