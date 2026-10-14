import type { LessonRef } from './content-identity';
import data from './data/purple-haze.json';

export const songStrings = [
  { id: 'e_high', label: '1ª · Mi', midi: 64 },
  { id: 'b', label: '2ª · Si', midi: 59 },
  { id: 'g', label: '3ª · Sol', midi: 55 },
  { id: 'd', label: '4ª · Ré', midi: 50 },
  { id: 'a', label: '5ª · Lá', midi: 45 },
  { id: 'e_low', label: '6ª · Mi', midi: 40 },
] as const;
export type SongNote = { stringId: string; fret: number; midi: number; beat: number; duration: number; sourceTicks: number;technique?:{kind:string;semitones?:number};pitchCurve?:{beat:number;midi:number}[] };
export type StudyBlock = { id: string; title: string; startBeat: number; endBeat: number; startFret: number; endFret: number; notes: SongNote[] };
export type SongLesson = { id: string; ref: LessonRef; href: string; title: string; instruction: string; explanation?: string[]; blocks: string[]; accompaniment?: boolean; singleCardTitle?: string };
export const pilotSong = data;
export const studyBlocks: StudyBlock[] = data.blocks;
export const songLessons: SongLesson[] = [
  { id:'s01', title:'Ouça a abertura', blocks:['intro-a','intro-b'], singleCardTitle:'A abertura em oitavas',
    instruction:'Alterne o Si♭ grave e o agudo: a mesma nota em alturas diferentes. Perceba também o contraste desses sons com Mi, o ponto de apoio da música.',
    explanation:["Purple Haze tem o Mi como ponto de apoio: pense nele como o lugar para onde a música volta. O Si♭ soa tenso contra esse Mi. Essa combinação ajuda a criar o som inquieto da abertura. O tom dá uma referência para ouvir as notas; as escolhas também criam contraste.","Os dois pontos do braço são o mesmo Si♭, um grave e outro agudo. Essa distância recebe o nome de oitava. Ao alterná-los, você muda a altura sem mudar a identidade da nota. Encontre o Si♭ grave na 6ª corda, casa 6, e o agudo na 4ª corda, casa 8.","A distância entre Mi e Si♭ chama-se trítono. São seis semitons: cada semitom é um pequeno passo, como passar de uma casa para a seguinte na mesma corda. Em relação ao Mi, o Si♭ é a quinta abaixada (♭5): a quinta de Mi é Si, e Si♭ fica um passo abaixo dela.","Comece pelo ouvido. Toque um Mi na 6ª corda solta e depois o Si♭ na casa 6. Perceba o contraste. Em seguida, alterne os dois Si♭ do mapa, devagar. Nesta lição, o áudio toca a parte da guitarra; na gravação, o baixo também sustenta a referência em Mi."] },
  { id:'s02', title:'Entenda o riff', blocks:["riff-a","riff-b"],
    instruction:'Ouça a subida Si–Ré–Sol e a chegada em Lá, antes da resposta grave. Vamos perceber como essas notas se relacionam com Mi.',
    explanation:[
      'Um riff é uma frase curta que volta várias vezes e ajuda a reconhecer a música. Neste recorte, Si–Ré–Sol sobe e chega a um Lá mais grave, que dura antes da resposta. Depois ouvimos Sol, Ré, Mi grave e a chegada em outro Mi. Ouça como a frase muda de altura e volta ao ponto de apoio da música.',
      'Por que essas notas combinam? Mi, Sol, Lá, Si e Ré formam a pentatônica menor de Mi: uma coleção de cinco notas muito usada no blues e no rock. As notas deste riff pertencem a essa coleção. O nome dá uma referência para explorar o som, mas não obriga uma música a usar somente essas notas.',
      'O Si tem uma relação de quinta com o Mi. Experimente tocar um Mi e depois um Si: ouça como os dois se apoiam. O Sol é a terça menor de Mi, uma das notas que dão a cor menor a essa coleção. Para encontrar Ré, parta de um Mi e recue duas casas na mesma corda: Ré fica um tom abaixo. Em relação ao Mi, essa nota é a sétima menor (♭7).',
      'A primeira parte fica principalmente entre as casas 5 e 9. Essa posição aproxima as notas e facilita tocar a frase sem procurar cada altura em uma região diferente. A resposta usa notas mais graves e um Mi na 6ª corda solta. Uma mesma nota pode existir em vários lugares do braço; aqui, a posição ajuda a organizar o movimento.',
      'Comece com Si–Ré–Sol–Lá. Toque devagar e deixe o Lá durar. Depois acrescente a resposta. A seta de slide indica deslizar pela mesma corda sem perder o contato; ↗¼ indica um bend leve, esticando a corda para elevar o som um quarto de tom. O exemplo foi revisto pela tablatura; o timbre e o vibrato da gravação não são reproduzidos.'
    ] },
  { id:'s03', title:'Explore um motivo do solo', blocks:["solo-a","solo-b"],
    instruction:'Ouça a ideia Dó♯–Mi–Si e compare com a parte mais aguda. Vamos explorar a cor do Dó♯ em relação a Mi e distinguir mudar de posição de mudar a altura da nota.',
    explanation:[
      'Um motivo é uma pequena ideia musical que pode ser repetida ou transformada. Neste trecho que prepara a entrada do solo, Dó♯, Mi e Si formam uma ideia curta; o Si recebe um bend leve. A parte seguinte traz Mi e dois Sol em alturas diferentes, com outro bend no Sol agudo. Antes de juntar tudo, ouça cada parte separadamente.',
      'O Mi continua sendo nossa referência. O Si é sua quinta, uma relação que você já ouviu no riff. Aqui, tocamos Dó♯ na 4ª corda, casa 11, e depois Mi na 3ª corda, casa 9: o som sobe uma terça menor. Para comparar, toque Dó na 4ª corda, casa 10, e chegue ao mesmo Mi; essa subida é uma terça maior. Dó é apenas uma comparação, enquanto Dó♯ faz parte do motivo e traz uma cor fora da pentatônica menor de Mi.',
      'O Sol, por sua vez, é a terça menor de Mi. O trecho coloca essa cor ao lado do Dó♯. Isso mostra que explorar uma música em Mi não significa ficar preso a uma única coleção de notas. As alturas podem trazer cores diferentes sem que o Mi deixe de ser nossa referência para ouvir o trecho.',
      'Na primeira parte, o Mi está na 3ª corda, casa 9. Na seguinte, outro Mi, da mesma altura, aparece na 4ª corda, casa 14. A troca de posição aproxima esse Mi das notas agudas que vêm depois. Já o Sol da 1ª corda, casa 15, é uma oitava acima do Sol da 3ª corda, casa 12: a mesma nota, em outra altura.',
      'Pratique primeiro a ideia curta. ↗¼ indica um bend leve: estique a corda para subir um quarto de tom, menos que a distância até a próxima casa. Ouça a pequena mudança no Si e, no segundo card, no Sol agudo. A chegada por slide e os bends estão no áudio de estudo; o vibrato e o timbre da gravação ficam para sua exploração no instrumento.'
    ] },
  { id:'s04', title:'Ouça a descida', blocks:["solo-c","solo-d"], singleCardTitle:'A descida do solo',
    instruction:'Deixe Sol soar, ouça a ligação Fá♯–Sol–Fá♯ e siga até Mi–Ré. Vamos perceber o movimento e por que a frase pode terminar fora de Mi.',
    explanation:[
      'Neste recorte do solo, Sol dura antes da ligação Fá♯–Sol–Fá♯. Esse pequeno retorno ao Sol vem antes da descida até Mi e Ré. Ouça a nota longa e tente antecipar o movimento seguinte.',
      'Fá♯ é a segunda de Mi, um tom acima. Na ligação Fá♯–Sol–Fá♯, a mão avança uma casa e volta, na mesma corda. Depois, Fá♯ desce um tom até Mi. Compare o pequeno vai e volta com a descida seguinte; cada movimento conecta sons próximos.',
      'Você já ouviu Sol e Ré no riff: são a terça menor e a sétima menor em relação ao Mi. Aqui, o Mi aparece no meio da descida, e a frase termina no Ré. Ter Mi como ponto de apoio não exige terminar toda frase nele. Depois de tocar o Ré, experimente um Mi e ouça como a continuação soa.',
      'O Sol e o Fá♯ ficam na 3ª corda, em casas vizinhas: 12 e 11. O Mi e o Ré ficam na 4ª corda, casas 14 e 12. Esse desenho mantém a frase em uma região compacta. O som desce mesmo quando sua mão muda de corda: a altura depende da corda e da casa juntas.',
      'Comece com Fá♯–Sol–Fá♯ e acrescente Mi–Ré quando o caminho estiver confortável. Deslize entre as casas 11–12–11 da 3ª corda, sem perder o contato. Depois toque com o áudio e preserve o espaço do Sol inicial. O braço mostra onde as notas estão; o ouvido ajuda a reconhecer para onde a frase vai.'
    ] },
  { id:'s05', title:'Acompanhe com acordes', blocks:[], accompaniment:true,
    instruction:'Toque E7♯9 por quatro tempos, Sol por dois e Lá por dois. Vamos conhecer as notas desses acordes e ouvir como a base do verso volta ao Mi.',
    explanation:[
      'Um acorde reúne notas que soam juntas. Nesta base, seguimos E7♯9, G e A: um acorde de Mi com uma cor especial, Sol maior e Lá maior. Toque o Mi durante quatro tempos, o Sol durante dois e o Lá durante dois; depois volte ao Mi. Play toca esse caminho, e clicar em um card toca somente aquele acorde.',
      'No primeiro desenho, tocamos Mi, Sol♯, Ré e Sol. Sol♯ e Sol são notas diferentes, separadas por um semitom, mas aparecem em alturas diferentes nesse acorde. Ouça cada ponto e depois as notas juntas. Esse encontro ajuda a criar o som áspero associado ao acorde de Hendrix. Toque apenas as quatro cordas do meio nesse desenho.',
      'O Sol maior reúne Sol, Si e Ré. Você já encontrou essas notas no riff; agora elas soam juntas como uma base. O Lá maior reúne Lá, Dó♯ e Mi. O Dó♯ também apareceu na lição do motivo do solo. Perceber essas notas em comum ajuda a ligar as frases que você estudou ao acompanhamento.',
      'O tom de Mi dá um ponto de apoio, mas não exige que todos os acordes sejam de Mi ou usem somente notas da escala menor. Sol e Lá trazem outros grupos de notas antes da volta ao Mi. Toque a sequência e deixe o último Mi durar: ouça o efeito desse retorno, sem precisar decorar os nomes das relações.',
      'Para entender o nome E7♯9, separe as ideias. Sol♯ é a terça maior de Mi, uma das notas que formam sua cor maior. Ré é a sétima menor. Fá♯ seria a segunda de Mi e, uma oitava acima, sua nona normal. O símbolo ♯9 pede essa nona um semitom mais alta: no instrumento, tocamos Sol. Por isso o braço mostra G♯ na 4ª corda, casa 6, e G na 2ª corda, casa 8. São dois sons distintos; não há um Fá♯ escondido no desenho.',
      'Comece pelas trocas, com um toque para baixo em cada tempo. No Sol, toque as seis cordas; no Lá, deixe a 6ª corda em silêncio. Esta é uma base simplificada do verso: a gravação tem outros acentos e variações, e estes três acordes não acompanham todas as partes do solo. Primeiro encontre o caminho entre eles; depois compare com a parte cantada da música.'
    ] },
].map(lesson => ({ ...lesson, href:`/track/purple-haze-por-dentro/${lesson.id}/`, ref:{ source:'system',trackId:'hendrix-purple-haze',lessonId:lesson.accompaniment?'s05-acordes':lesson.id } }));

export function midiPitch(note: Pick<SongNote,'stringId'|'fret'>): number {
  const string = songStrings.find(string => string.id === note.stringId);
  if (!string || !Number.isInteger(note.fret) || note.fret < 0 || note.fret > 24) throw new RangeError('Posição inválida.');
  return string.midi + note.fret;
}
const names = ['Dó','Dó♯','Ré','Ré♯','Mi','Fá','Fá♯','Sol','Sol♯','Lá','Lá♯','Si'];
const flatNames = ['Dó','Ré♭','Ré','Mi♭','Mi','Fá','Sol♭','Sol','Lá♭','Lá','Si♭','Si'];
const degrees = ['1','♭2','2','♭3','3','4','♭5','5','♭6','6','♭7','7'];
export function noteLabel(midi: number, mode = 'name', spelling = 'sharp'): string {
  return mode === 'degree' ? degrees[(midi-4+120)%12]! : (spelling === 'flat' ? flatNames : names)[midi%12]!;
}
export function assembleBlocks(ids: string[], blocks: StudyBlock[] = studyBlocks) {
  if (!ids.length || new Set(ids).size !== ids.length) throw new RangeError('Escolha blocos diferentes.');
  let beats=0;
  const entries=ids.map(id => {
    const block=blocks.find(block => block.id===id);
    if(!block) throw new RangeError('Bloco desconhecido.');
    const entry={block,offset:beats};
    beats+=block.endBeat-block.startBeat;
    return entry;
  });
  return { entries, beats, notes:entries.flatMap(({block,offset}) => block.notes.map(note => ({...note,beat:offset+note.beat}))) };
}
export function blockIndexAt(plan: ReturnType<typeof assembleBlocks>, beat: number): number {
  let index=0; for(let i=0;i<plan.entries.length;i++) if(beat>=plan.entries[i]!.offset) index=i; return index;
}

export function assembleLessonBlocks(lesson: SongLesson) {
  if(lesson.accompaniment)throw new RangeError('Use os acordes da base para esta lição.');
  const plan=assembleBlocks(lesson.blocks);
  if(!lesson.singleCardTitle)return plan;
  const notes=plan.notes;
  const first=plan.entries[0]!.block;
  const block:StudyBlock={
    id:`${first.id}-complete`,title:lesson.singleCardTitle,
    startBeat:first.startBeat,endBeat:first.startBeat+plan.beats,
    startFret:Math.min(...plan.entries.map(entry=>entry.block.startFret)),
    endFret:Math.max(...plan.entries.map(entry=>entry.block.endFret)),notes,
  };
  return {entries:[{block,offset:0}],beats:plan.beats,notes};
}
