import { soloExplorationPositions, songLessons, studyBlocks } from './song-content';
import type { StudyBook, StudyGuide, StudyPage, StudyVisual } from './study-model';

function page(title:string,paragraphs:string[],visual:StudyVisual,practice:string,question:string,answer:string):StudyPage{
  return {title,paragraphs,visual,practice,question,answer};
}
const hendrixChordDiagram:Extract<StudyVisual,{kind:'positions'}>={
  kind:'positions',
  positions:[{stringId:'a',fret:7,midi:52},{stringId:'d',fret:6,midi:56},{stringId:'g',fret:7,midi:62},{stringId:'b',fret:8,midi:67}],
  annotations:[{stringId:'g',fret:7,label:'7'},{stringId:'b',fret:8,label:'♯9'}],
  startFret:5,endFret:8,rootMidi:52,context:'chord',caption:'E7♯9 · Ré (7) e Sol (♯9)',
};
const books:Omit<StudyBook,'introduction'>[]=[
 {lessonId:'s01',title:'A abertura, por dentro',pages:[
  page('A mesma nota, em outra altura',[
   'Ouça os dois Si♭. Um é grave; o outro é sua versão mais aguda. O nome se repete, mas a altura muda.',
   'Essa distância recebe o nome de oitava. Você reconhece a mesma nota em duas alturas; o desenho mostra onde encontrá-las.'
  ],{kind:'positions',positions:[{stringId:'e_low',fret:6,midi:46},{stringId:'d',fret:8,midi:58}],startFret:5,endFret:8,spelling:'flat',caption:'Si♭ grave e Si♭ agudo · uma oitava de distância'},
  'Alterne os dois pontos e deixe cada um soar. Cante ou imagine o movimento grave–agudo.',
  'Os dois Si♭ têm a mesma altura?',
  'Não. São a mesma nota em oitavas diferentes: um Si♭ grave e sua versão mais aguda.'),
  page('Por que esse contraste com Mi?',[
   'Mi é o ponto de apoio da música. Ouça um Mi e depois o Si♭ da abertura: esse contraste faz parte do som que reconhecemos na frase.',
   'A distância entre esse Mi e Si♭ é de seis semitons, ou três tons. Por isso recebe o nome de trítono.',
   'O Si♭ também aparece como ♭5, a quinta abaixada de Mi: Si é a quinta, e Si♭ fica um semitom abaixo.'
  ],{kind:'interval',root:40,distances:[6],initial:6,spelling:'flat'},
  'Toque um Mi antes da abertura. Depois alterne os dois Si♭ e ouça o contraste com essa referência.',
  'O ♭5 significa casa 5?',
  'Não. Indica a quinta de Mi um semitom abaixo: Si♭.')
 ]},
 {lessonId:'s02',title:'O caminho do riff',pages:[
  page('Cinco notas que se encontram',[
   'Um riff é uma frase curta que volta e ajuda a reconhecer a música. Aqui, suas notas vêm da pentatônica menor de Mi: Mi, Sol, Lá, Si e Ré, uma coleção de cinco sons muito usada no blues e no rock.',
   'Toque a pentatônica subindo e descendo pelo shape abaixo, ouvindo como as notas se relacionam com Mi. Depois encontre Si–Ré–Sol–Lá nas posições de contorno contínuo. As demais notas ficam em tracejado: o shape mostra possibilidades, e a frase escolhe algumas delas.',
   'Ouça Si–Ré–Sol subir, com um salto maior entre Ré e Sol. A frase chega a um Lá mais grave e deixa essa nota durar. Depois, a resposta grave volta a Mi, como uma resposta à primeira ideia.',
   'Mi é nosso ponto de apoio. Em relação a ele, Sol é a terça menor, Si é a quinta e Ré é a sétima menor. Reconheça esses sons dentro da frase; o ritmo, as pausas e as notas que duram também fazem parte do riff.'
  ],{kind:'scale',root:4,startFret:7,endFret:10,phrasePositions:studyBlocks.find(block=>block.id==='riff-a')!.notes,positions:[
   {stringId:'e_low',fret:7,midi:47},{stringId:'e_low',fret:10,midi:50},
   {stringId:'a',fret:7,midi:52},{stringId:'a',fret:10,midi:55},
   {stringId:'d',fret:7,midi:57},{stringId:'d',fret:9,midi:59},
   {stringId:'g',fret:7,midi:62},{stringId:'g',fret:9,midi:64},
   {stringId:'b',fret:8,midi:67},{stringId:'b',fret:10,midi:69},
   {stringId:'e_high',fret:7,midi:71},{stringId:'e_high',fret:10,midi:74}
  ],caption:'Pentatônica menor de Mi · casas 7 a 10'},
  'Percorra o shape e depois toque a primeira parte do riff. Deixe o Lá durar antes de acrescentar a resposta grave.',
  'Preciso usar as cinco notas em toda frase?',
  'Não. A coleção oferece possibilidades. Uma ideia pode usar só duas ou três notas, com repetição, duração e pausas.')
 ]},
 {lessonId:'s02-variacao',title:'Uma variação do riff',pages:[
  page('Uma ideia conhecida ganha movimento',[
   'Depois das repetições do riff, a introdução continua explorando Sol e Lá. A frase repete o Lá, muda sua expressão e volta ao Sol. Poucas notas já bastam para desenvolver outra ideia.',
   'No segundo Lá, o bend leva o som em direção a Si. Você estica a corda enquanto a nota soa, sem deslizar para outra casa. A marca ↗1t indica essa subida de um tom.',
   'Para experimentar, pressione o Lá com o anelar e apoie os dedos anteriores atrás dele, na mesma corda. Toque a nota e desloque a corda lateralmente com os dedos juntos, ajudando o movimento com uma pequena rotação do pulso.',
   'Ouça um Si antes para ter a chegada no ouvido. Depois tente alcançar esse som com o bend. O dedo continua no lugar do Lá; o que sobe é a altura da nota. Na frase, siga para Sol e deixe-o durar.'
  ],{kind:'positions',positions:[{stringId:'d',fret:5,midi:55},{stringId:'d',fret:7,midi:57}],startFret:5,endFret:8,bend:{stringId:'d',fret:7,targetMidi:59},caption:'Lá → Si no bend · o dedo permanece na mesma casa'},
  'Toque Sol–Lá–Lá com bend–Sol. Compare a chegada do bend com um Si tocado diretamente e depois volte à frase.',
  'O bend é uma troca de casa?',
  'Não. A corda esticada muda a altura enquanto o dedo permanece na posição de partida.')
 ]},
 {lessonId:'s03',title:'Uma ideia, outras cores',pages:[
  page('Uma ideia, outra região',[
   'Dó♯–Mi–Si prepara a entrada do solo neste recorte. Dó♯ acrescenta um som que não estava na pentatônica menor do riff, enquanto Mi continua sendo nosso ponto de apoio.',
   'Ouça Dó♯ subir até Mi: essa distância é uma terça menor. Depois vem Si, a quinta de Mi. A frase usa essas relações para formar uma pequena ideia que se repete.',
   'Na parte seguinte, Mi aparece em outra corda, mas continua na mesma altura. A troca aproxima a mão das notas agudas que vêm depois. Os dois Mi destacados no desenho ajudam a reconhecer essa ligação.',
   'Já os dois Sol têm alturas diferentes: o segundo está uma oitava acima. No Si da primeira parte e no Sol agudo da seguinte, a marca ↗¼ indica um bend leve de um quarto de tom. Estique a corda só um pouco para elevar o som.'
  ],{kind:'positions',positions:[
   {stringId:'d',fret:11,midi:61},{stringId:'g',fret:9,midi:64},{stringId:'b',fret:12,midi:71},
   {stringId:'d',fret:14,midi:64},{stringId:'g',fret:12,midi:67},{stringId:'e_high',fret:15,midi:79}
  ],rootMidi:64,startFret:9,endFret:15,annotations:[{stringId:'b',fret:12,label:'↗¼'},{stringId:'e_high',fret:15,label:'↗¼'}],caption:'Dó♯–Mi–Si → Mi–Sol–Sol agudo · bends leves no Si e no Sol agudo'},
  'Toque cada parte separadamente. Compare os dois Mi e os dois Sol; depois una as partes, antecipando a mudança de região.',
  'Mudar de posição sempre muda a altura da nota?',
  'Não. Os dois Mi têm a mesma altura; os dois Sol estão separados por uma oitava.')
 ]},
 {lessonId:'s04',title:'Explore seu próprio caminho',pages:[
  page('Uma frase como ponto de partida',[
   'Ouça Mi–Sol–Lá–Sol–Mi–Sol. Esse movimento vem do solo e pode ser o começo da sua própria resposta. No player, só as notas dessa frase recebem os destaques da reprodução.',
   'Encontre a frase no shape abaixo. Mi, Sol, Lá, Si e Ré formam a pentatônica menor; os Mi destacados ajudam a reconhecer a posição nas seis cordas e a guardar os caminhos ao redor.',
   'Escolha duas ou três notas e crie uma resposta curta. Repita uma ideia, deixe uma pausa e experimente mudar a chegada. Você pode desenvolver a frase sem percorrer o desenho inteiro.',
   'Fá♯ e Dó♯ aparecem em tracejado como notas adicionais, também presentes nas passagens consultadas do solo. Fá♯ é a segunda de Mi; Dó♯ é sua sexta maior. Experimente uma delas e depois volte a uma nota conhecida.'
  ],{kind:'scale',root:4,positions:soloExplorationPositions,additionalPositions:songLessons.find(lesson=>lesson.id==='s04')!.additionalPositions,startFret:12,endFret:15,caption:'Pentatônica menor de Mi · Fá♯ e Dó♯ como notas adicionais'},
  'Responda à frase com Sol, Lá e Mi. Depois experimente Mi–Fá♯–Sol ou Si–Dó♯–Mi, acrescentando uma cor de cada vez.',
  'Essas são todas as notas do solo?',
  'Não. É uma seleção para começar a explorar; a gravação também tem outras passagens, bends e variações expressivas.')
 ]},
 {lessonId:'s05',title:'As notas dentro dos acordes',pages:[
  page('A base entre os trechos',[
   'E7♯9 é um acorde de Mi com sétima e nona aumentada. O nome reúne essas duas ideias; vamos encontrar cada uma no braço. Depois, use esse acorde na base Mi–Sol–Lá do verso.',
   'O 7 acrescenta Ré, a sétima menor de Mi. Para reconhecer esse som, pense em um Mi e desça um tom: você chega a Ré. No desenho, procure o Ré marcado com 7.',
   'A nona é a segunda na próxima oitava. Ao chegar a outro Mi, pense que a escala recomeça: Fá♯ é a segunda desse novo Mi e a nona contando desde o Mi mais grave.',
   'O ♯ pede subir essa nona mais um semitom, chegando ao som de Sol. Parta do Mi tracejado e avance duas casas na mesma corda até Fá♯; mais uma casa chega ao Sol marcado com ♯9. Mi e Fá♯ tracejados são apenas referências: a nota acrescentada ao acorde é esse Sol.'
  ],{...hendrixChordDiagram,additionalPositions:[{stringId:'b',fret:5,midi:64},{stringId:'b',fret:7,midi:66}]},
  'Ouça as notas do E7♯9 separadas e depois juntas. Pratique a troca para Sol e Lá, voltando ao Mi sem apressar o movimento.',
  'Quais sons o 7 e o ♯9 acrescentam ao acorde de Mi?',
  'Ré é a sétima menor; o Sol agudo é a nona aumentada. Fá♯ serve apenas para entender de onde a nona aumentada vem.')
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
        'O que muda é a altura. Os dois sons são Si♭, separados por uma oitava. Encontre o grave na corda mais grossa e o agudo na corda Ré, duas casas adiante.',
      ],
      highlightPractice:true,
      practice:'Toque o Si♭ grave e deixe-o soar. Responda com o agudo e volte ao grave. Repita até conseguir ouvir o salto antes de tocar.',
    },
    {
      title:'A sombra do Mi',
      paragraphs:[
        'Toque um Mi antes de voltar ao Si♭. Mi é o ponto de apoio da música. Ao ouvir as duas notas juntas na memória, talvez você reconheça o contraste da abertura.',
        'Entre Mi e Si♭ há seis semitons, ou três tons. Essa distância se chama trítono. O Si♭ também pode aparecer como ♭5: é a quinta de Mi, o Si, abaixada um semitom.',
      ],
      practice:'Toque Mi, depois faça o salto entre os dois Si♭. Volte ao Mi e ouça o que muda quando a frase chega a esse ponto de apoio.',
    },
  ],
  s02:[
    {
      title:'A pentatônica no braço',
      hideTitle:true,
      paragraphs:[
        'Mi, Sol, Lá, Si e Ré formam a pentatônica menor de Mi. No braço abaixo, siga as notas em roxo para reencontrar o começo do riff. Os círculos tracejados completam o desenho da escala nessa região.',
      ],
      highlightPractice:true,
      practice:'Encontre Si, Ré, Sol e Lá no desenho do braço. Toque as quatro notas na ordem do exemplo e deixe o Lá soar. Quando a primeira parte estiver confortável, acrescente a resposta grave.',
    },
  ],
  's02-variacao':[
    {
      title:'O bend de Lá a Si',
      hideTitle:true,
      paragraphs:[
        'O segundo Lá sobe porque a corda é esticada enquanto a nota soa. Esse gesto se chama bend. A marca ↗1t indica uma subida de um tom, a mesma distância que separa Lá de Si.',
      ],
      highlightPractice:true,
      practice:'Toque um Si para guardar a altura. Volte ao Lá e use o anelar, com os outros dedos apoiados atrás, para esticar a corda até ouvir o Si. Depois encaixe o gesto entre o primeiro Lá e a volta ao Sol.',
    },
  ],
  s05:[
    {
      title:'A cor do primeiro acorde',
      hideTitle:true,
      paragraphs:[
        'Comece pelo Mi, a tônica que dá nome ao acorde. Acrescente Sol♯, a terça maior. A quinta de Mi é Si, que fica de fora nesta digitação.',
        'Junte o Ré, a sétima menor de Mi. É a nota que o 7 indica no nome do acorde.',
        'Por fim, acrescente o Sol agudo, marcado com ♯9. Ele é a nona aumentada. Toque as três primeiras notas juntas e depois acrescente esse Sol para ouvir o que muda.',
        'Para tocar o E7♯9, use as quatro cordas do meio. Sol e Lá usam formas abertas. No Lá, deixe a corda mais grossa em silêncio.',
      ],
      visual:hendrixChordDiagram,
      visualAfterParagraph:3,
      insight:{
        afterParagraph:4,
        title:'Da segunda à nona',
        text:'Em Mi, a segunda maior é Fá♯. Toque esse Fá♯ uma oitava acima e você tem a nona. Para chegar à ♯9, avance mais uma casa na mesma corda. Esse é o Sol agudo do acorde.',
      },
      practice:'',
    },
  ],
  s03:[
    {
      title:'Dois caminhos para o mesmo Mi',
      hideTitle:true,
      paragraphs:[
        'O primeiro Mi está na corda Sol e o segundo, na corda Ré. A altura é a mesma. A segunda posição aproxima a mão do Sol agudo que vem depois. Compare com os dois Sóis do desenho. O segundo está uma oitava acima do primeiro.',
        'A marca ↗¼ no Si e no Sol agudo indica um bend de um quarto de tom. É um movimento pequeno da corda, bem menor que o bend de Lá a Si da variação do riff.',
      ],
      highlightPractice:true,
      practice:'Toque Dó♯–Mi–Si. Depois recue uma casa na corda Ré para começar em Dó natural e toque Dó–Mi–Si. Ouça como o salto até Mi é um semitom mais curto quando você começa em Dó♯. O Dó natural faz parte de Mi menor natural. Já o Dó♯ é a sexta maior de Mi e apareceu no acorde de Lá maior da missão anterior.',
    },
  ],
  s04:[
    {
      title:'Notas para a sua resposta',
      hideTitle:true,
      paragraphs:[
        'Use os Mi do desenho como referência. Ao redor deles, você encontra a pentatônica menor de Mi que já apareceu no riff. Escolha duas ou três notas próximas e deixe uma pausa entre a frase que ouviu e a sua resposta.',
        'Fá♯ e Dó♯ estão em tracejado. São duas notas extras que você pode experimentar depois de encontrar uma resposta com as notas da pentatônica.',
      ],
      highlightPractice:true,
      practice:'Comece respondendo com Sol, Lá e Mi. Na rodada seguinte, mantenha o começo da sua resposta e experimente terminar em Sol. Ouça como a chegada muda.',
    },
  ],
};
