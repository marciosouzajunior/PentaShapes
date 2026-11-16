import { soloExplorationPositions, songLessons, studyBlocks } from './song-content';
import type { StudyBook, StudyGuide, StudyPage, StudyVisual } from './study-model';

function page(title:string,paragraphs:string[],visual:StudyVisual,practice:string,question:string,answer:string):StudyPage{
  return {title,paragraphs,visual,practice,question,answer};
}
const hendrixChordDiagram:Extract<StudyVisual,{kind:'positions'}>={
  kind:'positions',
  positions:[{stringId:'a',fret:7,midi:52},{stringId:'d',fret:6,midi:56},{stringId:'g',fret:7,midi:62},{stringId:'b',fret:8,midi:67}],
  annotations:[{stringId:'g',fret:7,label:'7'},{stringId:'b',fret:8,label:'♯9'}],
  startFret:5,endFret:8,rootMidi:52,context:'chord',caption:'[[chord:E7♯9]] · D ([[degree:7]]) e G ([[degree:♯9]])',
};
const books:Omit<StudyBook,'introduction'>[]=[
 {lessonId:'s01',title:'A abertura, por dentro',pages:[
  page('A mesma nota, em outra altura',[
   'Ouça os dois [[note:B♭]]. Um é grave; o outro é sua versão mais aguda. O nome se repete, mas a altura muda.',
   'Essa distância recebe o nome de oitava. Você reconhece a mesma nota em duas alturas; o desenho mostra onde encontrá-las.'
  ],{kind:'positions',positions:[{stringId:'e_low',fret:6,midi:46},{stringId:'d',fret:8,midi:58}],startFret:5,endFret:8,spelling:'flat',caption:'B♭ grave e B♭ agudo · uma oitava de distância'},
  'Alterne os dois pontos e deixe cada um soar. Cante ou imagine o movimento grave–agudo.',
  'Os dois [[note:B♭]] têm a mesma altura?',
  'Não. São a mesma nota em oitavas diferentes: um [[note:B♭]] grave e sua versão mais aguda.'),
  page('Por que esse contraste com E?',[
   '[[note:E]] é o ponto de apoio da música. Ouça um [[note:E]] e depois o [[note:B♭]] da abertura: esse contraste faz parte do som que reconhecemos na frase.',
   'A distância entre esse [[note:E]] e [[note:B♭]] é de seis semitons, ou três tons. Por isso recebe o nome de trítono.',
   'O [[note:B♭]] também aparece como [[degree:♭5]], a quinta abaixada de [[note:E]]: [[note:B]] é a quinta, e [[note:B♭]] fica um semitom abaixo.'
  ],{kind:'interval',root:40,distances:[6],initial:6,spelling:'flat'},
  'Toque um [[note:E]] antes da abertura. Depois alterne os dois [[note:B♭]] e ouça o contraste com essa referência.',
  'O [[degree:♭5]] significa casa 5?',
  'Não. [[degree:♭5]] indica a quinta de [[note:E]] um semitom abaixo: [[note:B♭]].')
 ]},
 {lessonId:'s02',title:'O caminho do riff',pages:[
  page('Cinco notas que se encontram',[
   'Um riff é uma frase curta que volta e ajuda a reconhecer a música. Aqui, suas notas vêm da pentatônica menor de [[note:E]]: [[note:E]], [[note:G]], [[note:A]], [[note:B]] e [[note:D]], uma coleção de cinco sons muito usada no blues e no rock.',
   'Toque a pentatônica subindo e descendo pelo shape abaixo, ouvindo como as notas se relacionam com [[note:E]]. Depois encontre [[note:B]]–[[note:D]]–[[note:G]]–[[note:A]] nas posições de contorno contínuo. As demais notas ficam em tracejado: o shape mostra possibilidades, e a frase escolhe algumas delas.',
   'Ouça [[note:B]]–[[note:D]]–[[note:G]] subir, com um salto maior entre [[note:D]] e [[note:G]]. A frase chega a um [[note:A]] mais grave e deixa essa nota durar. Depois, a resposta grave volta a [[note:E]], como uma resposta à primeira ideia.',
   '[[note:E]] é nosso ponto de apoio. Em relação a ele, [[note:G]] é a terça menor, [[note:B]] é a quinta e [[note:D]] é a sétima menor. Reconheça esses sons dentro da frase; o ritmo, as pausas e as notas que duram também fazem parte do riff.'
  ],{kind:'scale',root:4,startFret:7,endFret:10,phrasePositions:studyBlocks.find(block=>block.id==='riff-a')!.notes,positions:[
   {stringId:'e_low',fret:7,midi:47},{stringId:'e_low',fret:10,midi:50},
   {stringId:'a',fret:7,midi:52},{stringId:'a',fret:10,midi:55},
   {stringId:'d',fret:7,midi:57},{stringId:'d',fret:9,midi:59},
   {stringId:'g',fret:7,midi:62},{stringId:'g',fret:9,midi:64},
   {stringId:'b',fret:8,midi:67},{stringId:'b',fret:10,midi:69},
   {stringId:'e_high',fret:7,midi:71},{stringId:'e_high',fret:10,midi:74}
  ],caption:'Pentatônica menor de E · casas 7 a 10'},
  'Percorra o shape e depois toque a primeira parte do riff. Deixe o [[note:A]] durar antes de acrescentar a resposta grave.',
  'Preciso usar as cinco notas em toda frase?',
  'Não. A coleção oferece possibilidades. Uma ideia pode usar só duas ou três notas, com repetição, duração e pausas.')
 ]},
 {lessonId:'s02-variation',title:'Uma variação do riff',pages:[
  page('Uma ideia conhecida ganha movimento',[
   'Depois das repetições do riff, a introdução continua explorando [[note:G]] e [[note:A]]. A frase repete o [[note:A]], muda sua expressão e volta ao [[note:G]]. Poucas notas já bastam para desenvolver outra ideia.',
   'No segundo [[note:A]], o bend leva o som em direção a [[note:B]]. Você estica a corda enquanto a nota soa, sem deslizar para outra casa. A marca ↗1t indica essa subida de um tom.',
   'Para experimentar, pressione o [[note:A]] com o anelar e apoie os dedos anteriores atrás dele, na mesma corda. Toque a nota e desloque a corda lateralmente com os dedos juntos, ajudando o movimento com uma pequena rotação do pulso.',
   'Ouça um [[note:B]] antes para ter a chegada no ouvido. Depois tente alcançar esse som com o bend. O dedo continua no lugar do [[note:A]]; o que sobe é a altura da nota. Na frase, siga para [[note:G]] e deixe-o durar.'
  ],{kind:'positions',positions:[{stringId:'d',fret:5,midi:55},{stringId:'d',fret:7,midi:57}],startFret:5,endFret:8,bend:{stringId:'d',fret:7,targetMidi:59},caption:'A → B no bend · o dedo permanece na mesma casa'},
  'Toque [[note:G]]–[[note:A]]–[[note:A]] com bend–[[note:G]]. Compare a chegada do bend com um [[note:B]] tocado diretamente e depois volte à frase.',
  'O bend é uma troca de casa?',
  'Não. A corda esticada muda a altura enquanto o dedo permanece na posição de partida.')
 ]},
 {lessonId:'s03',title:'Uma ideia, outras cores',pages:[
  page('Uma ideia, outra região',[
   '[[note:C♯]]–[[note:E]]–[[note:B]] prepara a entrada do solo neste recorte. [[note:C♯]] acrescenta um som que não estava na pentatônica menor do riff, enquanto [[note:E]] continua sendo nosso ponto de apoio.',
   'Ouça [[note:C♯]] subir até [[note:E]]: essa distância é uma terça menor. Depois vem [[note:B]], a quinta de [[note:E]]. A frase usa essas relações para formar uma pequena ideia que se repete.',
   'Na parte seguinte, [[note:E]] aparece em outra corda, mas continua na mesma altura. A troca aproxima a mão das notas agudas que vêm depois. Os dois [[note:E]] destacados no desenho ajudam a reconhecer essa ligação.',
   'Já os dois [[note:G]] têm alturas diferentes: o segundo está uma oitava acima. No [[note:B]] da primeira parte e no [[note:G]] agudo da seguinte, a marca ↗¼ indica um bend leve de um quarto de tom. Estique a corda só um pouco para elevar o som.'
  ],{kind:'positions',positions:[
   {stringId:'d',fret:11,midi:61},{stringId:'g',fret:9,midi:64},{stringId:'b',fret:12,midi:71},
   {stringId:'d',fret:14,midi:64},{stringId:'g',fret:12,midi:67},{stringId:'e_high',fret:15,midi:79}
  ],rootMidi:64,startFret:9,endFret:15,annotations:[{stringId:'b',fret:12,label:'↗¼'},{stringId:'e_high',fret:15,label:'↗¼'}],caption:'C♯–E–B → E–G–G agudo · bends leves no B e no G agudo'},
  'Toque cada parte separadamente. Compare os dois [[note:E]] e os dois [[note:G]]; depois una as partes, antecipando a mudança de região.',
  'Mudar de posição sempre muda a altura da nota?',
  'Não. Os dois [[note:E]] têm a mesma altura; os dois [[note:G]] estão separados por uma oitava.')
 ]},
 {lessonId:'s04',title:'Explore seu próprio caminho',pages:[
  page('Uma frase como ponto de partida',[
   'Ouça [[note:E]]–[[note:G]]–[[note:A]]–[[note:G]]–[[note:E]]–[[note:G]]. Esse movimento vem do solo e pode ser o começo da sua própria resposta. No player, só as notas dessa frase recebem os destaques da reprodução.',
   'Encontre a frase no shape abaixo. [[note:E]], [[note:G]], [[note:A]], [[note:B]] e [[note:D]] formam a pentatônica menor; os [[note:E]] destacados ajudam a reconhecer a posição nas seis cordas e a guardar os caminhos ao redor.',
   'Escolha duas ou três notas e crie uma resposta curta. Repita uma ideia, deixe uma pausa e experimente mudar a chegada. Você pode desenvolver a frase sem percorrer o desenho inteiro.',
   '[[note:F♯]] e [[note:C♯]] aparecem em tracejado como notas adicionais, também presentes nas passagens consultadas do solo. [[note:F♯]] é a segunda de [[note:E]]; [[note:C♯]] é sua sexta maior. Experimente uma delas e depois volte a uma nota conhecida.'
  ],{kind:'scale',root:4,positions:soloExplorationPositions,additionalPositions:songLessons.find(lesson=>lesson.id==='s04')!.additionalPositions,startFret:12,endFret:15,caption:'Pentatônica menor de E · F♯ e C♯ como notas adicionais'},
  'Responda à frase com [[note:G]], [[note:A]] e [[note:E]]. Depois experimente [[note:E]]–[[note:F♯]]–[[note:G]] ou [[note:B]]–[[note:C♯]]–[[note:E]], acrescentando uma cor de cada vez.',
  'Essas são todas as notas do solo?',
  'Não. É uma seleção para começar a explorar; a gravação também tem outras passagens, bends e variações expressivas.')
 ]},
 {lessonId:'s05',title:'As notas dentro dos acordes',pages:[
  page('A base entre os trechos',[
   '[[chord:E7♯9]] é um acorde de [[note:E]] com sétima e nona aumentada. O nome reúne essas duas ideias; vamos encontrar cada uma no braço. Depois, use esse acorde na base [[chord:E]]–[[chord:G]]–[[chord:A]] do verso.',
   'O [[degree:7]] acrescenta [[note:D]], a sétima menor de [[note:E]]. Para reconhecer esse som, pense em um [[note:E]] e desça um tom: você chega a [[note:D]]. No desenho, procure o [[note:D]] marcado com [[degree:7]].',
   'A nona é a segunda na próxima oitava. Ao chegar a outro [[note:E]], pense que a escala recomeça: [[note:F♯]] é a segunda desse novo [[note:E]] e a nona contando desde o [[note:E]] mais grave.',
   'O ♯ pede subir essa nona mais um semitom, chegando ao som de [[note:G]]. Parta do [[note:E]] tracejado e avance duas casas na mesma corda até [[note:F♯]]; mais uma casa chega ao [[note:G]] marcado com [[degree:♯9]]. [[note:E]] e [[note:F♯]] tracejados são apenas referências: a nota acrescentada ao acorde é esse [[note:G]].'
  ],{...hendrixChordDiagram,additionalPositions:[{stringId:'b',fret:5,midi:64},{stringId:'b',fret:7,midi:66}]},
  'Ouça as notas do [[chord:E7♯9]] separadas e depois juntas. Pratique a troca para [[chord:G]] e [[chord:A]], voltando ao [[chord:E]] sem apressar o movimento.',
  'Quais sons o [[degree:7]] e o [[degree:♯9]] acrescentam ao acorde de [[note:E]]?',
  '[[note:D]] é a sétima menor; o [[note:G]] agudo é a nona aumentada. [[note:F♯]] serve apenas para entender de onde a nona aumentada vem.')
 ]}
];
// The lesson catalog also defines the continuous reader order.
export const studyBooks:StudyBook[]=songLessons.map(lesson=>{
  const book=books.find(book=>book.lessonId===lesson.id)!;
  return {...book,title:lesson.title,introduction:lesson.instruction};
});
export const studyGuide:StudyGuide={
  id:'hendrix-purple-haze',
  title:'Notas e relações em Purple Haze',
  lessons:studyBooks
};
export function studyBookFor(lessonId:string):StudyBook|undefined{
  return studyBooks.find(book=>book.lessonId===lessonId);
}

export const missionBookCopy:Record<string,(Pick<StudyPage,'title'|'hideTitle'|'paragraphs'|'practice'|'visualAfterParagraph'|'insight'|'highlightPractice'>&{visual?:StudyVisual})[]> = {
  s01:[
    {
      title:'O eco no braço',
      hideTitle:true,
      paragraphs:[
        'O que muda é a altura. Os dois sons são [[note:B♭]], separados por uma oitava. Encontre o grave na corda mais grossa e o agudo na corda [[note:D]], duas casas adiante.',
      ],
      highlightPractice:true,
      practice:'Toque o [[note:B♭]] grave e deixe-o soar. Responda com o agudo e volte ao grave. Repita até conseguir ouvir o salto antes de tocar.',
    },
    {
      title:'A sombra do E',
      paragraphs:[
        'Toque um [[note:E]] antes de voltar ao [[note:B♭]]. [[note:E]] é o ponto de apoio da música. Ao ouvir as duas notas juntas na memória, talvez você reconheça o contraste da abertura.',
        'Entre [[note:E]] e [[note:B♭]] há seis semitons, ou três tons. Essa distância se chama trítono. O [[note:B♭]] também pode aparecer como [[degree:♭5]]: é a quinta de [[note:E]], o [[note:B]], abaixada um semitom.',
      ],
      practice:'Toque [[note:E]], depois faça o salto entre os dois [[note:B♭]]. Volte ao [[note:E]] e ouça o que muda quando a frase chega a esse ponto de apoio.',
    },
  ],
  s02:[
    {
      title:'A pentatônica no braço',
      hideTitle:true,
      paragraphs:[
        '[[note:E]], [[note:G]], [[note:A]], [[note:B]] e [[note:D]] formam a pentatônica menor de [[note:E]]. No braço abaixo, siga as notas em roxo para reencontrar o começo do riff. Os círculos tracejados completam o desenho da escala nessa região.',
      ],
      highlightPractice:true,
      practice:'Encontre [[note:B]], [[note:D]], [[note:G]] e [[note:A]] no desenho do braço. Toque as quatro notas na ordem do exemplo e deixe o [[note:A]] soar. Quando a primeira parte estiver confortável, acrescente a resposta grave.',
    },
  ],
  's02-variation':[
    {
      title:'O bend de A a B',
      hideTitle:true,
      paragraphs:[
        'O segundo [[note:A]] sobe porque a corda é esticada enquanto a nota soa. Esse gesto se chama bend. A marca ↗1t indica uma subida de um tom, a mesma distância que separa [[note:A]] de [[note:B]].',
      ],
      highlightPractice:true,
      practice:'Toque um [[note:B]] para guardar a altura. Volte ao [[note:A]] e use o anelar, com os outros dedos apoiados atrás, para esticar a corda até ouvir o [[note:B]]. Depois encaixe o gesto entre o primeiro [[note:A]] e a volta ao [[note:G]].',
    },
  ],
  s05:[
    {
      title:'A cor do primeiro acorde',
      hideTitle:true,
      paragraphs:[
        'Comece pelo [[note:E]], a tônica que dá nome ao acorde. Acrescente [[note:G♯]], a terça maior. A quinta de [[note:E]] é [[note:B]], que fica de fora nesta digitação.',
        'Junte o [[note:D]], a sétima menor de [[note:E]]. É a nota que o [[degree:7]] indica no nome do acorde.',
        'Por fim, acrescente o [[note:G]] agudo, marcado com [[degree:♯9]]. Ele é a nona aumentada. Toque as três primeiras notas juntas e depois acrescente esse [[note:G]] para ouvir o que muda.',
        'Para tocar o [[chord:E7♯9]], use as quatro cordas do meio. [[chord:G]] e [[chord:A]] usam formas abertas. No [[chord:A]], deixe a corda mais grossa em silêncio.',
      ],
      visual:hendrixChordDiagram,
      visualAfterParagraph:3,
      insight:{
        afterParagraph:4,
        title:'Da segunda à nona',
        text:'Em [[note:E]], a segunda maior é [[note:F♯]]. Toque esse [[note:F♯]] uma oitava acima e você tem a nona. Para chegar à [[degree:♯9]], avance mais uma casa na mesma corda. Esse é o [[note:G]] agudo do acorde.',
      },
      practice:'',
    },
  ],
  s03:[
    {
      title:'Dois caminhos para o mesmo E',
      hideTitle:true,
      paragraphs:[
        'O primeiro [[note:E]] está na corda [[note:G]] e o segundo, na corda [[note:D]]. A altura é a mesma. A segunda posição aproxima a mão do [[note:G]] agudo que vem depois. Compare com os dois [[note:G]] do desenho. O segundo está uma oitava acima do primeiro.',
        'A marca ↗¼ no [[note:B]] e no [[note:G]] agudo indica um bend de um quarto de tom. É um movimento pequeno da corda, bem menor que o bend de [[note:A]] a [[note:B]] da variação do riff.',
      ],
      highlightPractice:true,
      practice:'Toque [[note:C♯]]–[[note:E]]–[[note:B]] e reencontre o mesmo [[note:E]] na corda [[note:D]] para começar a segunda parte. Faça a troca de posição devagar, mantendo o [[note:E]] como referência sonora.',
    },
  ],
  s04:[
    {
      title:'Notas para a sua resposta',
      hideTitle:true,
      paragraphs:[
        'Use os [[note:E]] do desenho como referência. Ao redor deles, você encontra a pentatônica menor de [[note:E]] que já apareceu no riff. Escolha duas ou três notas próximas e deixe uma pausa entre a frase que ouviu e a sua resposta.',
        '[[note:F♯]] e [[note:C♯]] estão em tracejado. São duas notas extras que você pode experimentar depois de encontrar uma resposta com as notas da pentatônica.',
      ],
      highlightPractice:true,
      practice:'Comece respondendo com [[note:G]], [[note:A]] e [[note:E]]. Na rodada seguinte, mantenha o começo da sua resposta e experimente terminar em [[note:G]]. Ouça como a chegada muda.',
    },
  ],
};
