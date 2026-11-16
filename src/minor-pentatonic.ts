import type { SongNote, SongPosition, StudyBlock } from './song-content';
import type { TrackContent } from './track-model';
import type { StudyPage, StudyVisual } from './study-model';
import emToAmImage from './diagrams/em-to-am.svg';
import {amRegions,amRegion,amNeighborRegion,bmRegion,dmRegion,position,regionMap,type ChordRegion} from './caged-positions';

export const amShape=amRegion.positions,bmShape=bmRegion.positions,amNeighbor=amNeighborRegion.positions;
const note=(p:SongPosition,beat:number,duration=.75):SongNote=>({...p,beat,duration,sourceTicks:-1});
const phrase=(region:ChordRegion,offset=0)=>region.phrase.map((p,i)=>note(p,offset+i,i===2?1.5:.75));
const backing=(region:ChordRegion,beats:number)=>Array.from({length:Math.ceil(beats/4)},(_,bar)=>region.chordPositions.map(p=>({midi:p.midi,beat:bar*4,duration:Math.min(4,beats-bar*4)-.15}))).flat();
const chord=(region:ChordRegion,beat=0)=>region.chordPositions.map(p=>note(p,beat,1.5));
function block(id:string,title:string,region:ChordRegion,notes:SongNote[],beats=8,chordOnly=false):StudyBlock{
  return {id,title,startBeat:0,endBeat:beats,startFret:region.startFret,endFret:region.endFret,notes,backing:backing(region,beats),map:regionMap(region,chordOnly),cues:[{beat:0,label:`${region.chord} · ouça`},{beat:beats/2,label:`${region.chord} · sua resposta`}]};
}
function scaleBlock(id:string,title:string,region:ChordRegion):StudyBlock{
  const ascending=[...region.positions].sort((a,b)=>a.midi-b.midi);
  // The next cycle supplies the lowest note; neither turning point is doubled.
  const cycle=[...ascending,...ascending.slice(1,-1).reverse()];
  return {...block(id,title,region,cycle.map((p,i)=>note(p,i,.85)),cycle.length),backing:[],cues:[]};
}
function referenceRegion(region:ChordRegion,chord:string,frets:(number|null)[]):ChordRegion{
  const strings=['e_low','a','d','g','b','e_high'];
  const chordPositions=frets.flatMap((fret,i)=>fret===null?[]:[position(strings[i]!,fret)]);
  return {...region,chord,chordPositions,chordTones:[...new Set(chordPositions.map(p=>p.midi%12))]};
}
// Reference grips checked against the source PDF; silent strings are explicit.
// Keep these separate from the triads used by the later harmony exercises.
export const minorPracticeRegions=[
  referenceRegion(amNeighborRegion,'Am/C',[8,null,7,9,10,null]),
  referenceRegion(amRegions[3]!,'Am7',[null,12,10,12,13,null]),
  referenceRegion(amRegions[4]!,'Am7',[null,12,14,12,13,12]),
  referenceRegion(amRegions[0]!,'Am7(11)',[5,null,5,5,3,null]),
];
const mapBlocks=minorPracticeRegions.map(region=>scaleBlock(`pm-map-${region.id}`,'Pentatônica de A menor · subida e descida',region));
const referenceBlocks=minorPracticeRegions.map(region=>({...block(`pm-reference-${region.id}`,`${region.chord} · acorde de referência`,region,[],4,true),backing:[],cues:[]}));
// Recap the existing scales grouped by the chosen root string, without new notes.
const recallRegions=[amRegion,minorPracticeRegions[3]!,minorPracticeRegions[1]!,minorPracticeRegions[2]!,minorPracticeRegions[0]!];
const recallBlocks=recallRegions.map(region=>scaleBlock(`pm-recall-${region.id}`,`${region.root.stringId==='e_low'?'6ª':region.root.stringId==='a'?'5ª':'4ª'} corda · forma ${region.id.toUpperCase()}`,region));
function contextBlock(id:string,cardId:string,region:ChordRegion,notes:SongNote[],response=false):StudyBlock{
  const b=block(id,`${region.chord} · acorde e pentatônica`,region,notes,4);
  return {...b,cardId,cues:[{beat:0,label:`${region.chord} · ${response?'sua resposta':'ouça a frase'}`} ]};
}
const amTitle='Am · acorde e pentatônica',dmTitle='Dm · acorde e pentatônica';
export const minorBlocks:StudyBlock[]=[
  {...block('pm-chord','Am · forma de E menor · referência',amRegion,[],4,true),backing:[],cues:[]},
  scaleBlock('pm-shape','Pentatônica de A menor · subida e descida',amRegion),
  ...mapBlocks,
  ...referenceBlocks,
  ...recallBlocks,
  block('pm-transpose-a','Am · forma de E menor',amRegion,[...chord(amRegion),...phrase(amRegion,3)],16),
  block('pm-transpose-b','Bm · a mesma forma duas casas adiante',bmRegion,[...chord(bmRegion),...phrase(bmRegion,3)],16),
  block('pm-locate-am',amTitle,amRegion,[...chord(amRegion),...phrase(amRegion,3)],16),
  block('pm-locate-dm',dmTitle,dmRegion,[...chord(dmRegion),...phrase(dmRegion,3)],16),
  contextBlock('pm-bridge-am','bridge-am',amRegion,[note(position('g',5),0),note(position('g',7),1),note(position('b',5),2,2)]),
  contextBlock('pm-bridge-dm','bridge-dm',dmRegion,[note(position('b',6),0,1.5),note(position('g',7),2,1.5)]),
  contextBlock('pm-answer-am','bridge-am',amRegion,[],true),
  contextBlock('pm-answer-dm','bridge-dm',dmRegion,[],true),
  {...block('pm-free-am','Am · referências do acorde',amRegion,[],8,true),cues:[{beat:0,label:'Am · crie uma frase'},{beat:4,label:'Am · prepare uma chegada em Dm'}]},
  {...block('pm-free-dm','Dm · referências do acorde',dmRegion,[],8,true),cues:[{beat:0,label:'Dm · continue a ideia'},{beat:4,label:'Dm · deixe espaço e prepare a volta a Am'}]},
];

const entries=[
  {id:'pm01',contentId:'am-scale-up-and-down',title:'Toque a pentatônica a partir de Am · forma E',navTitle:'Am e sua escala · forma E',blocks:['pm-shape'],referenceBlocks:['pm-chord'],repeatByDefault:true,instruction:'Encontre A na 6ª corda e reconheça a forma E ao redor dele. Pratique a pentatônica subindo e descendo, com notas claras e pulso regular.'},
  {id:'pm02',contentId:'am-over-c-reference-scale',title:'Encontre a escala a partir de Am · forma D',navTitle:'Am · forma D',blocks:['pm-map-d'],referenceBlocks:['pm-reference-d'],repeatByDefault:true,instruction:'Encontre A na 4ª corda e monte Am com C no baixo. Use esse A para reconhecer a forma D e pratique a escala nos dois sentidos.'},
  {id:'pm02c',contentId:'am-compact-reference-scale',title:'Reconheça Am · forma C',navTitle:'Am · forma C',blocks:['pm-map-c'],referenceBlocks:['pm-reference-c'],repeatByDefault:true,instruction:'Encontre A na 5ª corda e reconheça a forma C principalmente nas casas anteriores. Monte o Am compacto e pratique a escala nos dois sentidos.'},
  {id:'pm02b',contentId:'am7-a-reference-scale',title:'Encontre a escala ao redor de Am · forma A',navTitle:'Am · forma A',blocks:['pm-map-a'],referenceBlocks:['pm-reference-a'],repeatByDefault:true,instruction:'Encontre A na 5ª corda e reconheça a forma A nas casas seguintes. Pratique a escala subindo e descendo, mantendo o pulso e a clareza.'},
  {id:'pm02d',contentId:'am711-reference-scale',title:'Explore a região de Am · forma G',navTitle:'Am · forma G',blocks:['pm-map-g'],referenceBlocks:['pm-reference-g'],repeatByDefault:true,instruction:'Encontre A na 6ª corda e reconheça a forma G nas casas anteriores. Use Am7(11) como referência e pratique a escala nos dois sentidos.'},
  {id:'pm02-localizar',contentId:'locate-caged-by-root-string',title:'Encontre a forma pela tônica',navTitle:'Corda e forma',blocks:recallBlocks.map(b=>b.id),repeatByDefault:true,instruction:'Encontre A e observe sua corda: 6ª para E ou G, 5ª para C ou A, 4ª para D. Reconheça o acorde e escolha um card para praticar a escala dessa posição.'},
  {id:'pm03',contentId:'transpose-chord-and-phrase',title:'Transporte o acorde e a frase',navTitle:'Outro tom',blocks:['pm-transpose-a','pm-transpose-b'],instruction:'Toque Am na forma de E menor. Avance o acorde, a pentatônica e a frase duas casas para encontrar Bm; cada card oferece a base do seu próprio tom.'},
  {id:'pm04',contentId:'am-dm-fixed-region',title:'Encontre Dm perto de Am',navTitle:'Dm na região',blocks:['pm-locate-am','pm-locate-dm'],instruction:'Encontre Am na forma de E menor e Dm na forma de A menor, ambos perto da casa 5. Ouça cada acorde, reconheça suas notas e explore a pentatônica ao redor dele.'},
  {id:'pm05',contentId:'am-dm-connected-phrases',title:'Ligue as frases na troca de acorde',navTitle:'Conecte Am e Dm',blocks:['pm-bridge-am','pm-bridge-dm','pm-answer-am','pm-answer-dm'],instruction:'Ouça a frase em Am chegar a E e continuar em F quando entra Dm. Depois a base repete os dois acordes para sua resposta: mantenha A na troca ou experimente o mesmo movimento E–F.'},
  {id:'pm06',contentId:'am-dm-independent-phrasing',title:'Crie guiado pelos acordes',navTitle:'Seu caminho',blocks:['pm-free-am','pm-free-dm'],instruction:'A base alterna oito tempos de Am e oito de Dm. Os braços mostram apenas as formas dos acordes: imagine a pentatônica ao redor delas e continue uma ideia de um acorde ao outro. Ative Repetir para praticar a volta a Am.'},
];
function visual(region:ChordRegion,caption:string):StudyVisual{
  return {kind:'scale',root:region.tonic,positions:region.positions,chordPositions:region.chordPositions,chordTones:region.chordTones,startFret:region.startFret,endFret:region.endFret,caption};
}
function scaleVisual(region:ChordRegion):StudyVisual{
  return {kind:'scale',root:region.tonic,positions:region.positions,phrasePositions:region.positions.filter(p=>region.chordTones.includes(p.midi%12)),startFret:region.startFret,endFret:region.endFret,degreeAnnotations:true,caption:''};
}
function regionReading(region:ChordRegion,paragraphs:string[]):Pick<StudyPage,'paragraphs'|'practice'|'visual'|'visualAfterParagraph'|'additionalVisuals'>{
  return {paragraphs,visualAfterParagraph:1,visual:{kind:'scale',root:region.tonic,positions:region.chordPositions,startFret:region.startFret,endFret:region.endFret,degreeAnnotations:true,caption:''},additionalVisuals:[{afterParagraph:2,visual:scaleVisual(region)}],practice:'Reconheça o acorde e depois toque a escala subindo e descendo, com notas claras e pulso regular.'};
}
const readings:Pick<StudyPage,'paragraphs'|'practice'|'visual'|'visualAfterParagraph'|'additionalVisuals'>[]=[
  {paragraphs:[
    'Parta do E menor aberto que você conhece. Ao levar sua forma até a casa 5, a pestana assume o papel das cordas soltas e o acorde passa a ser Am. O A da 6ª corda orienta a forma E: a escala se estende para as casas seguintes.',
    'Am reúne A, C e E. Encontre essas notas dentro da pentatônica: D e G, em tracejado, completam a escala. São cinco notas que reaparecem em outras alturas ao longo do desenho. Reconhecer o acorde dentro da escala ajuda a manter uma referência enquanto você percorre o braço.',
    'Os graus indicam a relação com A: [[degree:1]] é o próprio A, [[degree:♭3]] é C e [[degree:5]] é E. Para entender C, conte os nomes — A, B, C — e depois a distância: um tom e meio, que forma a terça menor. E é a quinta justa de A.'
  ],visualAfterParagraph:1,visual:{kind:'image',src:emToAmImage,alt:'E menor aberto, com a digitação 0–2–2–0–0–0, levado cinco casas adiante até A menor, 5–7–7–5–5–5. As cordas soltas passam a ser pressionadas pela pestana na casa 5.',caption:''},additionalVisuals:[{afterParagraph:2,visual:{kind:'scale',root:9,positions:amRegion.positions,phrasePositions:amRegion.positions.filter(p=>amRegion.chordTones.includes(p.midi%12)),startFret:5,endFret:8,degreeAnnotations:true,caption:''}}],practice:'Toque a escala subindo e descendo, com notas claras e pulso regular. Pratique os trechos difíceis mais devagar.'},
  regionReading(minorPracticeRegions[0]!,[
    'Monte A–E–A nas cordas 4, 3 e 2, começando pelo A da casa 7. Acrescente C na 6ª corda, casa 8, e deixe as cordas 5 e 1 em silêncio. O acorde reúne A, C e E, com C como som mais grave: por isso se chama Am/C, A menor com baixo em C.',
    'O A da 4ª corda é a referência escolhida para reconhecer a forma D. Ele também estava na primeira posição e ajuda a ligar as duas regiões. C é o baixo deste acorde; A continua sendo a tônica. Na pentatônica ao redor, D e G, em tracejado, completam a escala.'
  ]),
  regionReading(minorPracticeRegions[1]!,[
    'O C menor aberto tem uma digitação menos habitual, e transportar sua forma pode exigir uma abertura desconfortável dos dedos. Nesta região C, usamos Am7 como referência. Toque as quatro cordas centrais, usando anelar, indicador, médio e mínimo da 5ª à 2ª corda; deixe as duas cordas E em silêncio.',
    'Essa digitação reúne A, C, G e outro C; a quinta, E, fica omitida. O A da 5ª corda orienta a forma C, que se estende principalmente para as casas anteriores. Na pentatônica ao redor, D e E, em tracejado, completam as cinco notas.'
  ]),
  regionReading(minorPracticeRegions[2]!,[
    'Parta do Am7 aberto e leve a forma até a casa 12. Faça a pestana da 5ª à 1ª corda, acrescente E na 4ª corda, casa 14, e C na 2ª corda, casa 13. G na 3ª corda é a sétima menor que dá nome ao Am7.',
    'O A da 5ª corda, casa 12, é a mesma referência da forma C. Agora a forma A se estende para as casas seguintes. O acorde reúne A, C, E e G; D, em tracejado, completa a pentatônica. Se as casas altas forem difíceis de alcançar, retome esse trecho quando estiver confortável.'
  ]),
  regionReading(minorPracticeRegions[3]!,[
    'Volte ao A da 6ª corda, casa 5, conhecido na primeira lição. Junte G e C nas cordas 4 e 3, também na casa 5, e D na 2ª corda, casa 3. Deixe as cordas 5 e 1 em silêncio. Essa referência de Am7(11) tem G como sétima menor e D como décima primeira; a quinta, E, fica de fora desta digitação.',
    'O A da 6ª corda é a mesma referência da forma E. A forma G se estende para as casas anteriores, com G no início do percurso. Encontre as notas do acorde dentro da pentatônica; E, em tracejado, completa a coleção de cinco notas.'
  ]),
  {paragraphs:[
    'Toque A na 6ª corda, casa 5. Ao redor dele, a forma E segue para as casas seguintes e a forma G ocupa as anteriores. Encontre os dois acordes antes de percorrer suas escalas.',
    'Na 5ª corda, use A na casa 12: a forma C se estende principalmente para as casas anteriores, e a forma A para as seguintes. Na 4ª corda, A na casa 7 orienta a forma D.',
    'A corda indica qual A você escolheu como referência para reconhecer a forma. Outras notas A também aparecem nos desenhos. Em Am/C, por exemplo, o som mais grave é C, mas o A da 4ª corda orienta a forma D.'
  ],visualAfterParagraph:2,visual:{kind:'table',columns:['A de referência','Formas','Direção no braço'],rows:[['6ª corda · E grave','G / E','G: casas anteriores · E: seguintes'],['5ª corda · A','C / A','C: principalmente anteriores · A: seguintes'],['4ª corda · D','D','A orienta a forma D']],caption:''},practice:'Encontre A, observe a corda e o lado disponível, reconheça o acorde e toque a escala. Alterne E/G e C/A usando a mesma tônica de referência.'},
  {paragraphs:[
    'O A da 6ª corda, casa 5, vira B quando você avança duas casas. Levando todos os dedos junto, a forma de E menor passa a soar como Bm. A pentatônica muda de A–C–D–E–G para B–D–E–F♯–A.',
    'A frase C–E–A vira D–F♯–B. Seu ritmo e as relações internas permanecem; todas as alturas sobem um tom. Esse deslocamento recebe o nome de transposição. Ele funciona aqui porque a forma inteira é móvel, sem cordas soltas, e a afinação permanece E–A–D–G–B–E.',
    'Observe a diferença para as cinco regiões de Am: lá você reencontrou o mesmo acorde com outras formas; aqui conservou a forma e mudou o acorde e o tom. Cada card tem sua base correspondente e espaço para responder. São dois exercícios separados para comparar o transporte.'
  ],visual:visual(bmRegion,'Bm na forma de E menor: acorde, pentatônica e frase duas casas adiante.'),practice:'Crie uma frase curta em Am. Encontre o B da 6ª corda, leve a forma junto e toque a frase em Bm, conservando também suas pausas.'},
  {paragraphs:[
    'Agora encontre D na 5ª corda, casa 5. A partir dele, monte Dm usando a forma do A menor aberto: a pestana ocupa a casa 5, o médio vai para a 2ª corda na casa 6, e anelar e mínimo ocupam a casa 7 nas cordas 4 e 3. Toque da 5ª corda para a aguda; deixe a 6ª em silêncio.',
    'Am e Dm ficam próximos, mas são acordes diferentes. Am tem A, C e E; Dm tem D, F e A. Em volta da forma de Dm, a pentatônica é D, F, G, A e C. Ela tem dois pontos por corda, assim como o desenho de Am, mas suas referências e algumas posições mudam. Compare E–F nas cordas 5 e 2.',
    'Os braços mantêm as casas 5 a 8. Você recupera outra forma de acorde e outra pentatônica nessa região, em vez de levar o primeiro box inteiro até D. É a ideia de localizar o acorde próximo e, por ele, lembrar a escala. Cada card apresenta primeiro o acorde e a frase, depois deixa oito tempos para sua resposta.',
    'Os graus de cada braço usam a referência do seu próprio mapa: A no card de Am e D no de Dm. F é [[degree:♭3]] de D. A, que era a tônica em Am, passa a ser a quinta de D. Ouça as duas bases separadamente antes de tentar continuar durante a troca.'
  ],visual:visual(dmRegion,'Dm na forma de A menor. D na 5ª corda, casa 5, orienta a pentatônica de D menor.'),practice:'Toque Am e uma frase curta. Depois, sem saltar pelo braço, encontre o Dm próximo e responda a partir de D, F e A. Volte ao acorde quando perder a referência.'},
  {paragraphs:[
    'A base agora alterna quatro tempos de Am e quatro de Dm. Você ouve uma volta demonstrada e responde durante a volta seguinte. Os dois braços ficam no lugar; o destaque apenas indica qual contexto está soando.',
    'O exemplo começa em C, passa por D e chega a E sobre Am. Na troca, E sobe uma casa na 2ª corda e chega a F, a terça menor de Dm. A resposta termina em D. Você passa de uma pentatônica à outra por uma ligação curta, preservando a direção da frase.',
    'Outro caminho é sustentar A: ele pertence aos dois acordes. As pentatônicas de Am e Dm compartilham A, C, D e G; E pertence à primeira e F à segunda. Isso não faz de todas as notas compartilhadas notas dos dois acordes. C, por exemplo, está na tríade de Am e acrescenta uma sétima menor sobre Dm.',
    'Escolher as pentatônicas desses dois acordes faz parte deste exercício com a base preparada. O CAGED ajuda a encontrar o material, mas a harmonia e o som que você procura continuam orientando as escolhas. Em outra progressão, não basta aplicar a pentatônica menor da raiz de cada acorde.'
  ],visual:{kind:'positions',positions:[position('b',5),position('b',6),position('e_high',5)],startFret:5,endFret:8,rootMidi:69,caption:'E → F liga as frases com uma casa na mesma corda. A pode continuar sobre os dois acordes.'},practice:'Na sua volta, toque uma frase em Am e continue em Dm sem recomeçar do zero. Primeiro mantenha A na troca; depois tente E–F. Ao repetir, explore também F–E no retorno a Am.'},
  {paragraphs:[
    'Os mapas mostram agora apenas as formas de Am e Dm. A pentatônica não desapareceu do instrumento: procure suas notas ao redor do acorde que você enxerga. A base dá oito tempos em cada contexto, e não há frase demonstrada nesta lição.',
    'Toque ou imagine o acorde, cante uma ideia curta se isso ajudar e procure os sons. Você pode começar só com notas do acorde e depois alcançar outras da pentatônica. Antes de Dm chegar, escolha uma ligação: A continua; E pode subir para F. Na volta a Am, F pode descer para E.',
    'Nos ajustes, Repetir mantém o trecho escolhido. Use Play para alternar os dois contextos; o título de um card permite ficar só naquele acorde. Se perder a referência da escala, volte à lição de localização e reencontre o par acorde–pentatônica.',
    'Perceba o que você já consegue fazer: reconhecer o acorde em mais de uma região, transportar uma forma móvel e continuar na mesma região quando outro acorde chega. A conclusão é sua autoavaliação; não depende de tocar muitas notas ou de percorrer todos os desenhos em uma sessão.'
  ],visual:{kind:'positions',positions:dmRegion.chordPositions,startFret:5,endFret:8,rootMidi:50,caption:'Dm na forma de A menor: a forma do acorde continua como referência quando o mapa da escala é retirado.'},practice:'Fique algumas voltas com a base. Repita um motivo, varie uma chegada e deixe espaço. Tente ouvir a troca antes de olhar para o outro braço.'},
];
const id='caged-penta-menor',slug='pentatonica-menor-do-acorde-ao-solo';
export const minorTrack:TrackContent={
  manifest:{schemaVersion:1,id,slug,title:'Pentatônica menor',summary:'Encontre acordes e pentatônicas nas regiões do braço e crie frases que continuam quando o acorde muda.',ownerId:'pentashapes',author:{id:'pentashapes',displayName:'PentaShapes'},origin:'official',purposeIds:['fundamentals'],language:'pt-BR',instrumentIds:['guitar'],styleIds:[],topicIds:['minor-pentatonic','caged','chord-tones','transposition','phrasing'],techniqueIds:[],prerequisites:['Tocar acordes simples, experimentar pestanas e localizar casas no braço.'],publication:{status:'published',visibility:'public',revision:6}},
  bpm:72,blocks:minorBlocks,
  mapLegend:'Preenchimento: forma do acorde · Ponto: outras notas do acorde · Aro: tônica de cada mapa',
  lessons:entries.map(l=>({...l,...(l.referenceBlocks||l.id==='pm02-localizar'?{mapStyle:'plain-degrees' as const}:{}),href:`/track/${slug}/${l.id}/`,ref:{source:'system',trackId:id,lessonId:l.contentId}})),
  guide:{id:`${id}:r6`,title:'Pentatônica menor',lessons:entries.map((l,i)=>({lessonId:l.id,title:l.title,introduction:l.instruction,pages:[{title:l.title,...readings[i]!,question:'',answer:''}]}))},
  sources:['docs/referencias-musicais.md','https://www.youtube.com/watch?v=drX6XjaItA4','https://www.youtube.com/watch?v=ziERcFhoSIg','Formas de acordes adaptadas a partir das referências de estudo, com cordas em silêncio explicitadas. Frases e bases próprias, sem reproduzir a numeração dos professores.','https://online.berklee.edu/courses/guitar-improvisation-techniques','https://online.berklee.edu/courses/jazz-guitar-101'],
};
