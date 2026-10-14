import { songLessons } from './song-content';
import type { StudyBook, StudyGuide, StudyPage, StudyVisual } from './study-model';

function page(title:string,paragraphs:string[],visual:StudyVisual,practice:string,question:string,answer:string):StudyPage{
  return {title,paragraphs,visual,practice,question,answer};
}
const text=(id:string,index:number)=>songLessons.find(lesson=>lesson.id===id)!.explanation![index]!;
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
   text('s01',0),
   'Seis semitons são três tons. Daí vem a palavra trítono: a distância de três tons. Na abertura, esse contraste faz parte do som da frase. Em outro ritmo ou junto de outras notas, o mesmo intervalo pode soar diferente.',
   'A quinta de Mi é Si. Para encontrar Si♭, parta desse Si e recue uma casa na mesma corda. Você abaixou a quinta um pequeno passo: é isso que o símbolo ♭5 indica.'
  ],{kind:'interval',root:40,distances:[6,7],initial:6,spelling:'flat'},
  'Compare Mi–Si com Mi–Si♭. Só o destino muda uma casa. Depois volte à abertura.',
  'O ♭5 significa casa 5?',
  'Não. Significa a quinta da referência um semitom abaixo. Na 6ª corda em Mi, Si♭ fica na casa 6.'),
  page('Leve a relação para a frase',[
   'Você tem duas pistas: as oitavas de Si♭ e o contraste desses Si♭ com Mi. Deixe os nomes de lado por um momento e toque o movimento.',
   'Ouça um Mi antes de tocar a abertura. Depois alterne os dois Si♭ e perceba como o contraste com Mi continua presente nas duas alturas.'
  ],{kind:'alternation',notes:[46,58],spelling:'flat',caption:'Alterne o Si♭ grave e o agudo · uma oitava entre eles'},
  'Toque um Mi solto antes da abertura. Faça a frase devagar. Depois acompanhe o áudio mantendo as durações.',
  'O que vale levar para o instrumento?',
  'Reconhecer uma nota em outra oitava e ouvir sua relação com Mi. Encontrar esses sons com calma vale mais do que recitar nomes.')
 ]},
 {lessonId:'s02',title:'O caminho do riff',pages:[
  page('Cinco notas que se encontram',[
   'Um riff é uma frase curta que volta e ajuda a reconhecer a música. Ouça a subida e sua resposta grave.',
   text('s02',1),
   'Mi é nosso ponto de apoio. Por enquanto, escolha apenas um par de notas do desenho e ouça como elas se relacionam. Você pode conhecer essa coleção aos poucos.'
  ],{kind:'scale',root:4,startFret:5,endFret:9,positions:[
   {stringId:'e_low',fret:5,midi:45},{stringId:'e_low',fret:7,midi:47},
   {stringId:'a',fret:5,midi:50},{stringId:'a',fret:7,midi:52},
   {stringId:'d',fret:5,midi:55},{stringId:'d',fret:7,midi:57},{stringId:'d',fret:9,midi:59},
   {stringId:'g',fret:7,midi:62},{stringId:'g',fret:9,midi:64},
   {stringId:'b',fret:5,midi:64},{stringId:'b',fret:8,midi:67},
   {stringId:'e_high',fret:5,midi:69},{stringId:'e_high',fret:7,midi:71}
  ],caption:'Pentatônica menor de Mi · casas 5–9. Os Mi estão destacados. O mapa mostra a coleção nessa região; o riff usa parte dessas notas.'},
  'Ouça as cinco notas. Depois compare Mi–Sol com Mi–Si. Cada par tem um tamanho e um som próprios.',
  'Preciso usar as cinco notas em toda frase?',
  'Não. A coleção oferece possibilidades. Uma ideia pode usar só duas ou três notas, com repetição, duração e pausas.'),
  page('Subir, responder, voltar',[
   'Si–Ré–Sol aparece cada vez mais agudo. O salto de Ré a Sol é maior que o de Si a Ré: a subida ganha espaço.',
   'A frase chega a Lá e deixa essa nota durar. Depois vem a resposta grave, que nos leva de volta a Mi. Experimente ouvir esse movimento como uma pergunta e uma resposta.'
  ],{kind:'path',notes:[59,62,67],compact:true,showCaption:false,caption:'Si → Ré → Sol · passos de tamanhos diferentes'},
  'Toque a subida e pare. Cante ou imagine uma resposta grave antes de tocar o card seguinte. Depois una as partes.',
  'Trocar de corda significa necessariamente subir o som?',
  'Não. A altura depende da corda e da casa juntas. Ouça as notas de chegada para reconhecer a direção.'),
  page('Uma frase antes de um mapa inteiro',[
   'Primeiro reconheça a subida pelo ouvido. Depois encontre as notas. Quando estiver confortável, acrescente a resposta. Você não precisa processar todo o braço de uma vez.',
   'Nos exemplos abaixo, compare cada nota com Mi. Sol é sua terça menor, Si é sua quinta e Ré é sua sétima menor. Escolha um par por vez; não é preciso guardar todos esses nomes agora.',
   'Essas relações ajudam a reconhecer os sons da pentatônica dentro da frase. O ritmo, as pausas e as notas que duram também fazem parte do riff.'
  ],{kind:'fretboard-intervals',root:{stringId:'a',fret:7,midi:52},targets:[
   {stringId:'d',fret:5,midi:55},{stringId:'d',fret:9,midi:59},{stringId:'g',fret:7,midi:62}
  ],startFret:5,endFret:9},
  'Escolha uma relação. Ouça Mi e o destino. Depois procure essa nota no riff, dentro da frase.',
  'Por que estudar relações se já vejo as notas?',
  'A posição responde “onde tocar?”. A relação ajuda a ouvir “como essa nota se conecta à referência?”. As duas informações se completam.')
 ]},
 {lessonId:'s03',title:'Uma ideia, outras cores',pages:[
  page('O Dó♯ traz outra cor',[
   'Dó♯–Mi–Si prepara a entrada do solo neste recorte. Dó♯ acrescenta um som que não estava na pentatônica menor do riff, enquanto Mi continua sendo nosso ponto de apoio.',
   'Ouça Dó♯ subir até Mi: essa distância é uma terça menor. Compare com Dó–Mi, uma terça maior. A chegada é a mesma; começar um semitom abaixo deixa o caminho um pouco maior.',
   'Dó aparece apenas para essa comparação. Na frase, tocamos Dó♯. Os desenhos usam a região do motivo para você experimentar a diferença.'
  ],{kind:'fretboard-intervals',root:{stringId:'g',fret:9,midi:64},targets:[{stringId:'d',fret:10,midi:60},{stringId:'d',fret:11,midi:61}],startFret:9,endFret:12,context:'comparison',towardRoot:true},
  'Toque Dó–Mi e depois Dó♯–Mi, mantendo o Mi na mesma posição. Ouça a diferença. Depois volte a Dó♯–Mi–Si, como no motivo.',
  'Dó♯ fora da pentatônica menor de Mi é uma nota errada?',
  'Não. Uma coleção ajuda a estudar algumas relações, mas não limita tudo o que a música pode fazer. Aqui ouvimos outra cor em relação a Mi.'),
  page('Dois lugares, o mesmo Mi',[
   'Os dois pontos abaixo produzem o mesmo Mi, na mesma altura. Você muda o lugar da mão sem mudar a nota que ouve.',
   'A segunda posição aproxima a mão da parte aguda da frase. Assim, uma troca de corda pode tornar o caminho mais confortável, sem fazer o som subir.'
  ],{kind:'positions',positions:[{stringId:'g',fret:9,midi:64},{stringId:'d',fret:14,midi:64}],startFret:9,endFret:14,caption:'Mi na 3ª corda, casa 9 · Mi na 4ª corda, casa 14'},
  'Alterne os dois Mi. O timbre pode mudar porque as cordas são diferentes; a altura continua igual.',
  'De casa 9 a casa 14 são sempre cinco semitons?',
  'Só se compararmos posições na mesma corda. Neste exemplo são cordas diferentes, e os dois pontos produzem o mesmo Mi.'),
  page('Quando a ideia sobe de altura',[
   'Agora, os dois Sol têm alturas diferentes: o segundo está uma oitava acima.',
   'Você ouve outra versão do mesmo Sol, mais aguda. É diferente dos dois Mi do exemplo anterior, que tinham exatamente a mesma altura.',
   'No Sol agudo, um bend leve eleva um pouco o som antes de deixá-lo voltar. Para fazê-lo, estique a corda enquanto a nota soa. A marca ↗¼ indica essa pequena subida de um quarto de tom.'
  ],{kind:'positions',positions:[{stringId:'g',fret:12,midi:67},{stringId:'e_high',fret:15,midi:79}],startFret:12,endFret:15,caption:'Sol e Sol uma oitava acima · a altura muda, o nome se repete'},
  'Ouça o par e cante ou imagine grave–agudo. Pratique os cards separados e depois una as partes.',
  'O que mudou nos dois exemplos de posição?',
  'Nos dois Mi, mudou o lugar da mão, e a altura ficou igual. Nos dois Sol, a altura subiu uma oitava. Casa, nota e intervalo são informações diferentes.')
 ]},
 {lessonId:'s04',title:'Escute cada passo da descida',pages:[
  page('Um caminho entre Sol e Mi',[
   'Deixe Sol durar. Depois ouça Fá♯–Sol–Fá♯: a frase sobe um pequeno passo e volta, antes de descer até Mi e Ré.',
   'Fá♯ e Sol são vizinhos, separados por um semitom. Já de Fá♯ até Mi, a descida é de um tom. Compare o pequeno vai e volta com esse passo maior.'
  ],{kind:'alternation',notes:[66,67],intervalLabel:'1 semitom',showCaption:false,caption:'Fá♯–Sol–Fá♯ · um semitom para subir e outro para voltar'},
  'Toque Fá♯–Sol–Fá♯ deslizando sem perder o contato com a corda. Depois siga até Mi e Ré.',
  'Fá♯ ser a segunda de Mi significa que Sol–Fá♯ tem dois semitons?',
  'Não. Mi–Fá♯ tem dois semitons; Sol–Fá♯ tem um. Um intervalo depende das duas alturas comparadas.'),
  page('A chegada em Ré',[
   'Depois do vai e volta, a frase desce por Fá♯–Mi–Ré. Ouça cada chegada, acompanhando o caminho no braço.',
   'Ré está um tom abaixo desse Mi. A frase termina ali, mesmo tendo Mi como ponto de apoio: nem toda frase precisa terminar na referência da música.'
  ],{kind:'positions',positions:[{stringId:'d',fret:14,midi:64},{stringId:'d',fret:12,midi:62}],rootMidi:64,showDirection:true,startFret:11,endFret:14,caption:'Mi → Ré · um tom abaixo, na mesma corda'},
  'Toque a descida até Ré e pare. Depois experimente voltar ao Mi e compare os finais. Essa volta é um exercício de escuta, não faz parte do trecho.',
  'Toda frase de uma música em Mi precisa terminar em Mi?',
  'Não. O centro musical é uma referência para ouvir a música, não uma obrigação para a última nota de cada frase.')
 ]},
 {lessonId:'s05',title:'As notas dentro dos acordes',pages:[
  page('A base entre os trechos',[
   'E7♯9, Sol e Lá formam a base do verso. Pratique as trocas e ouça a volta ao Mi. Aqui usamos uma base simples para acompanhar a música.',
   'O E7♯9 reúne Sol♯ e um Sol mais agudo. Esses dois sons diferentes convivem no acorde e ajudam a dar sua cor característica. Ouça o Sol agudo junto das outras notas; é ele que acrescenta a nona aumentada.'
  ],{kind:'positions',positions:[{stringId:'a',fret:7,midi:52},{stringId:'d',fret:6,midi:56},{stringId:'g',fret:7,midi:62},{stringId:'b',fret:8,midi:67}],startFret:5,endFret:8,rootMidi:52,context:'chord',caption:'E7♯9 · Mi, Sol♯, Ré e Sol'},
  'Ouça as notas do E7♯9 separadamente e depois juntas. Pratique a troca para Sol e Lá, voltando ao Mi sem apressar o movimento.',
  'Sol♯ e Sol são dois nomes para a mesma nota?',
  'Não. São sons separados por um semitom dentro da mesma oitava. Aqui aparecem em alturas diferentes. Sol♯ é a terça maior; Sol agudo é chamado de nona aumentada.'),
  page('Uma segunda na próxima oitava',[
   'Na oitava, chegamos a outro Mi e a escala recomeça. Fá♯ é a segunda desse novo Mi; contando desde o Mi mais grave, é a nona. É a mesma relação, uma oitava acima.',
   'O ♯9 eleva essa nona um semitom: de Fá♯, chegamos ao som de Sol. O desenho mostra esse caminho. Fá♯ é apenas uma referência para entender o nome; no acorde, tocamos Sol.'
  ],{kind:'positions',positions:[{stringId:'a',fret:7,midi:52},{stringId:'b',fret:5,midi:64},{stringId:'b',fret:7,midi:66},{stringId:'b',fret:8,midi:67}],startFret:5,endFret:8,rootMidi:52,context:'comparison',caption:'Mi → Mi (oitava) → Fá♯ (nona) → Sol (♯9)'},
  'Experimente Mi–Fá♯–Sol nas posições do desenho. Depois volte ao acorde e ouça como o Sol se mistura às outras notas.',
  'A terça maior de Mi e a nona aumentada são a mesma nota?',
  'Não. A terça maior é Sol♯. A nona aumentada deste acorde soa como Sol, em outra altura. São notas e funções distintas.')
 ]}
];
export const studyBooks:StudyBook[]=books.map(book=>{
  const lesson=songLessons.find(lesson=>lesson.id===book.lessonId)!;
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
