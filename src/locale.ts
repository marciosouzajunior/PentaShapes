export type Locale = 'pt-BR' | 'en';
const preferenceKey = 'pentashapes.locale.v1';

export function resolveLocale(saved: unknown, languages: readonly string[]): Locale {
  if (saved === 'pt-BR' || saved === 'en') return saved;
  for (const language of languages) {
    if (/^pt(?:-|$)/i.test(language)) return 'pt-BR';
    if (/^en(?:-|$)/i.test(language)) return 'en';
  }
  return 'en';
}
export function preferredLocale(): Locale {
  let saved: unknown;
  try { saved = localStorage.getItem(preferenceKey); } catch { /* URL selection still works. */ }
  return resolveLocale(saved, navigator.languages?.length ? navigator.languages : [navigator.language]);
}
export function saveLocale(locale: Locale): void {
  try { localStorage.setItem(preferenceKey, locale); } catch { /* URL selection still works. */ }
}
export function localeFromPath(path: string): Locale { return /^\/en(?:\/|$)/.test(path) ? 'en' : 'pt-BR'; }
export function localePath(path: string, locale: Locale): string {
  return locale === 'en' ? `/en${path}` : path;
}
/** The root also negotiates browser language; an explicit home link must remain deterministic. */
export function localeHome(locale:Locale):string { return locale==='en'?'/en/':'/?lang=pt-BR'; }
export function landingLocale(search:string,preferred:Locale):Locale {
  return new URLSearchParams(search).get('lang')==='pt-BR'?'pt-BR':preferred;
}

export const DEFAULT_LOCALE:Locale='en';
const english = {
  "PentaShapes, home": "PentaShapes, home",
  "Skip to content": "Skip to content",
  "Learn to improvise.": "Learn to improvise.",
  "One phrase at a time.": "One phrase at a time.",
  "Turn scales into music. Develop your phrasing on electric or acoustic guitar with tracks that connect foundations, repertoire and making music.": "Turn scales into music. Develop your phrasing on electric or acoustic guitar with tracks that connect foundations, repertoire and making music.",
  "Choose a track": "Choose a track",
  "Explore a song or practise an idea to create your own phrases.": "Explore a song or practise an idea to create your own phrases.",
  "FOUNDATIONS": "FOUNDATIONS",
  "REPERTOIRE": "REPERTOIRE",
  "EXPERIMENTAL": "EXPERIMENTAL",
  "complete": "complete",
  "of": "of",
  "missions": "missions",
  "lessons": "lessons",
  "completed": "completed",
  "View missions": "View missions",
  "View lessons": "View lessons",
  "A place to explore music your way.": "A place to explore music your way.",
  "Project links": "Project links",
  "Skip to practice": "Skip to practice",
  "Piano sound": "Piano sound",
  "Hear example": "Hear example",
  "Hear guitar": "Hear guitar",
  "Metronome": "Metronome",
  "Show scale degrees": "Show scale degrees",
  "Tempo": "Tempo",
  "Practice sequence": "Practice sequence",
  "Bars in the round": "Bars in the round",
  "Play from here": "Play from here",
  "Completed": "Completed",
  "Mission completed": "Mission completed",
  "Lesson completed": "Lesson completed",
  "Your progress could not be saved.": "Your progress could not be saved.",
  "Final mission completed": "Final mission completed",
  "You can keep playing here or explore another track.": "You can keep playing here or explore another track.",
  "View other tracks": "View other tracks",
  "Keep practising": "Keep practising",
  "Close": "Close",
  "Back": "Back",
  "Missions": "Missions",
  "Explore notes and relationships": "Explore notes and relationships",
  "Mission mode": "Mission mode",
  "Prepare": "Prepare",
  "Play": "Play",
  "Hear the passage": "Hear the passage",
  "Next mission": "Next mission",
  "All tracks": "All tracks",
  "Study passages on the fretboard": "Study passages on the fretboard",
  "Playback": "Playback",
  "Practice settings": "Practice settings",
  "Count-in": "Count-in",
  "Repeat": "Repeat",
  "Next →": "Next →",
  "Back →": "Back →",
  "Play (Space)": "Play (Space)",
  "Pause": "Pause",
  "Pause the passage": "Pause the passage",
  "This browser could not play the note.": "This browser could not play the note.",
  "Audio could not start. Please try again.": "Audio could not start. Please try again.",
  "Listen to the backing and find your way on the instrument.": "Listen to the backing and find your way on the instrument.",
  "Whole-step bend: raise the pitch without changing fret.": "Whole-step bend: raise the pitch without changing fret.",
  "Small bend: raise the note by a quarter tone.": "Small bend: raise the note by a quarter tone.",
  "Slide: move along the string to this note.": "Slide: move along the string to this note.",
  "Listen": "Listen",
  "turn.play": "Play",
  "Play along": "Play along",
  "Your response": "Your response",
  "Chord": "Chord",
  "Scale": "Scale",
  "Motif": "Motif",
  "Try it on guitar": "Try it on guitar",
  "On your instrument: ": "On your instrument: ",
  "Visible scales": "Visible scales",
  "Close reading": "Close reading",
  "Reading content": "Reading content",
  "Back to practice →": "Back to practice →",
  "Study notebook": "Study notebook"
} as const;
const portuguese:Record<keyof typeof english,string> = {
  "PentaShapes, home": "PentaShapes, início",
  "Skip to content": "Ir para o conteúdo",
  "Learn to improvise.": "Aprenda a improvisar.",
  "One phrase at a time.": "Uma frase de cada vez.",
  "Turn scales into music. Develop your phrasing on electric or acoustic guitar with tracks that connect foundations, repertoire and making music.": "Transforme escalas em música. Desenvolva seu fraseado na guitarra ou no violão com trilhas que conectam fundamentos, repertório e criação.",
  "Choose a track": "Escolha uma trilha",
  "Explore a song or practise an idea to create your own phrases.": "Explore uma música ou pratique uma ideia para criar suas próprias frases.",
  "FOUNDATIONS": "FUNDAMENTOS",
  "REPERTOIRE": "REPERTÓRIO",
  "EXPERIMENTAL": "EXPERIMENTAL",
  "complete": "concluído",
  "of": "de",
  "missions": "missões",
  "lessons": "lições",
  "completed": "concluídas",
  "View missions": "Ver missões",
  "View lessons": "Ver lições",
  "A place to explore music your way.": "Um espaço para explorar a música do seu jeito.",
  "Project links": "Links do projeto",
  "Skip to practice": "Ir para a prática",
  "Piano sound": "Timbre de piano",
  "Hear example": "Ouvir exemplo",
  "Hear guitar": "Ouvir guitarra",
  "Metronome": "Metrônomo",
  "Show scale degrees": "Mostrar graus",
  "Tempo": "Velocidade",
  "Practice sequence": "Sequência da prática",
  "Bars in the round": "Compassos da rodada",
  "Play from here": "Tocar a partir daqui",
  "Completed": "Concluída",
  "Mission completed": "Missão concluída",
  "Lesson completed": "Lição concluída",
  "Your progress could not be saved.": "Não foi possível salvar o progresso.",
  "Final mission completed": "Última missão concluída",
  "You can keep playing here or explore another track.": "Você pode continuar tocando por aqui ou explorar outra trilha.",
  "View other tracks": "Ver outras trilhas",
  "Keep practising": "Continuar praticando",
  "Close": "Fechar",
  "Back": "Voltar",
  "Missions": "Missões",
  "Explore notes and relationships": "Explorar notas e relações",
  "Mission mode": "Modo da missão",
  "Prepare": "Preparar",
  "Play": "Tocar",
  "Hear the passage": "Ouvir o trecho",
  "Next mission": "Próxima missão",
  "All tracks": "Todas as trilhas",
  "Study passages on the fretboard": "Estudo por trechos no braço estático",
  "Playback": "Reprodução",
  "Practice settings": "Ajustes da prática",
  "Count-in": "Contagem inicial",
  "Repeat": "Repetir",
  "Next →": "Próxima →",
  "Back →": "Voltar →",
  "Play (Space)": "Play (Espaço)",
  "Pause": "Pausa",
  "Pause the passage": "Pausar o trecho",
  "This browser could not play the note.": "Não foi possível ouvir a nota neste navegador.",
  "Audio could not start. Please try again.": "Não foi possível iniciar o áudio. Tente novamente.",
  "Listen to the backing and find your way on the instrument.": "Ouça a base e encontre seu caminho no instrumento.",
  "Whole-step bend: raise the pitch without changing fret.": "Bend de um tom: eleve o som sem trocar de casa.",
  "Small bend: raise the note by a quarter tone.": "Bend leve: eleve a nota um quarto de tom.",
  "Slide: move along the string to this note.": "Slide: deslize até esta nota.",
  "Listen": "Ouça",
  "turn.play": "Toque",
  "Play along": "Toque junto",
  "Your response": "Responda",
  "Chord": "Acorde",
  "Scale": "Escala",
  "Motif": "Motivo",
  "Try it on guitar": "Experimente na guitarra",
  "On your instrument: ": "No instrumento: ",
  "Visible scales": "Escalas visíveis",
  "Close reading": "Fechar leitura",
  "Reading content": "Conteúdo da leitura",
  "Back to practice →": "Voltar à prática →",
  "Study notebook": "Caderno de estudo"
};
export type UiText=keyof typeof english;
export function ui(locale:Locale,text:UiText):string{return (locale==='pt-BR'?portuguese:english)[text];}
