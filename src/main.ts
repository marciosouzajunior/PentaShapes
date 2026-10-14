import '../public/components/fretboard.mjs';
import './styles.css';
import { readActiveLessonKey, readCompletion, readNextIncompleteLessonKey } from './progress';
import { lessonKey } from './content-identity';
import { lessons } from './lesson-content';
import { renderLesson } from './lesson';
import { renderTrackPlaceholder } from './track-placeholder';
import foundationsArt from './assets/track-foundations.svg';
import phrasesArt from './assets/track-phrases.svg';
import harmonyArt from './assets/track-harmony.svg';
import rockArt from './assets/track-purple-haze.webp';
import { playableLessons } from './content-catalog';
import { songLessons } from './song-content';
import { renderSongLesson } from './song';

type BoardConfiguration = {
  tonic: number;
  scaleId: string;
  startFret: number;
  endFret: number;
  labelMode: 'letter' | 'degree';
  positions: { stringId: string; fret: number }[];
};

type FretboardElement = HTMLElement & {
  configuration: BoardConfiguration;
  highlightedPosition: { stringId: string; fret: number } | null;
  highlightedPositions: { stringId: string; fret: number }[];
};

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Elemento principal ausente.');

const songPath=location.pathname.replace(/^\/track\/rock-em-movimento(?=\/|$)/,'/track/purple-haze-por-dentro');
if(songPath!==location.pathname)history.replaceState(history.state,'',songPath+location.search+location.hash);

const currentLesson = playableLessons.find(item => item.href.replace(/\/$/, '') === location.pathname.replace(/\/$/, ''));
if (currentLesson?.kind === 'song') renderSongLesson(app, currentLesson.lesson);
else if (currentLesson?.kind === 'phrase') renderLesson(app, currentLesson.lesson.id);
else if (location.pathname.replace(/\/$/, '') === '/track/purple-haze-por-dentro') renderSongLesson(app, songLessons[0]!);
else if (location.pathname.startsWith('/lesson')) renderLesson(app);
else if (location.pathname.startsWith('/track/')) renderTrackPlaceholder(app, location.pathname);
else renderLanding(app);

function renderLanding(app: HTMLDivElement): void {
const lessonRefs = lessons.map(lesson => lesson.ref);
const readResume = () => {
  const activeKey = readActiveLessonKey();
  const activeLesson = playableLessons.find(lesson => lessonKey(lesson.ref) === activeKey);
  const nextKey = readNextIncompleteLessonKey(playableLessons.map(item => item.ref));
  const nextLesson = playableLessons.find(lesson => lessonKey(lesson.ref) === nextKey);
  return {
    href: nextLesson?.href ?? activeLesson?.href ?? '/lesson/',
    label: nextLesson ? 'Continuar lição' : activeLesson ? 'Revisar lições' : 'Começar agora',
  };
};
const resume = readResume();
const completion = readCompletion(lessonRefs);
const rockCompletion = readCompletion(songLessons.map(lesson => lesson.ref));
const melody = [
  { position: { stringId: 'g', fret: 7 }, atMs: 0 },
  { position: { stringId: 'b', fret: 5 }, atMs: 680 },
  { position: { stringId: 'b', fret: 6 }, atMs: 1360 },
  { position: { stringId: 'b', fret: 8 }, atMs: 2040 },
  { position: { stringId: 'b', fret: 5 }, atMs: 2720 },
  { position: { stringId: 'g', fret: 5 }, atMs: 3640 },
  { position: { stringId: 'g', fret: 7 }, atMs: 4320 },
];
const noteDurationMs = 1100;

app.innerHTML = `
  <a class="skip-link" href="#main">Ir para o conteúdo</a>
  <header class="header">
    <a class="brand" href="/" aria-label="PentaShapes, início"><span class="brand-mark" aria-hidden="true">p</span><span>PentaShapes</span></a>
  </header>
  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">PARA IR ALÉM DOS ACORDES</p>
        <h1 id="hero-title">Sua próxima frase começa aqui.</h1>
        <p class="lead">Aprenda a improvisar no violão ou na guitarra. Comece com poucas notas, ouça como elas se encaixam e crie suas próprias frases.</p>
        <a class="start-link" href="${resume.href}"><span class="start-label">${resume.label}</span> <span aria-hidden="true">→</span></a>
      </div>
      <div class="board-panel hero-board">
        <h2 class="demo-heading">Uma ideia em <span>Ré menor</span></h2>
        <penta-fretboard id="preview-board"></penta-fretboard>
      </div>
    </section>
    <section class="tracks" id="tracks" aria-labelledby="tracks-title">
      <div class="section-heading"><p class="eyebrow">TRILHAS</p><h2 id="tracks-title">Explore novos caminhos</h2></div>
      <div class="track-grid">
        <article class="track-card">
          <img class="track-art" src="${foundationsArt}" alt="" loading="lazy">
          <div class="track-content"><div class="track-meta"><span class="level">INICIANTE</span><span class="track-progress" id="foundations-progress" aria-label="${completion.completed} de ${completion.total} lições concluídas">${completion.percent}% concluído</span></div><h3>Primeiras frases</h3><p>Transforme poucas notas em frases que você consegue ouvir e repetir.</p><a class="track-link" href="/lesson/">Ver lições <span aria-hidden="true">→</span></a></div>
        </article>
        <article class="track-card">
          <img class="track-art" src="${phrasesArt}" alt="" loading="lazy">
          <div class="track-content"><span class="level">INTERMEDIÁRIO</span><h3>Frases com intenção</h3><p>Crie motivos, use pausas e leve suas ideias para novos contextos.</p><a class="track-link" href="/track/frases/">Ver lições <span aria-hidden="true">→</span></a></div>
        </article>
        <article class="track-card">
          <img class="track-art" src="${harmonyArt}" alt="" loading="lazy">
          <div class="track-content"><span class="level">AVANÇADO</span><h3>Harmonia jazzística</h3><p>Conecte acordes e dê direção às tensões em progressões de jazz.</p><a class="track-link" href="/track/harmonia/">Ver lições <span aria-hidden="true">→</span></a></div>
        </article>
        <article class="track-card">
          <img class="track-art track-art--photo" src="${rockArt}" alt="" loading="lazy">
          <div class="track-content"><div class="track-meta"><span class="level">JIMI HENDRIX</span><span class="track-progress" id="rock-progress">${rockCompletion.percent}% concluído</span></div><h3>Purple Haze por dentro</h3><p>Explore riffs e partes do solo de Purple Haze e aprenda uma base simples com acordes.</p><a class="track-link" href="/track/purple-haze-por-dentro/">Ver lições <span aria-hidden="true">→</span></a></div>
        </article>
      </div>
    </section>
  </main>
  <footer class="footer">
    <strong>PentaShapes</strong>
    <p>O PentaShapes foi criado para quem quer ir além dos acordes. Aprenda a improvisar ouvindo, tocando e criando suas próprias frases.</p>
    <a href="https://github.com/marciosouzajunior/pentashapes" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
  </footer>
`;

const board = app.querySelector<FretboardElement>('#preview-board');
const refreshCompletion = (): void => {
  const resume = readResume();
  const startLink = app.querySelector<HTMLAnchorElement>('.start-link');
  const startLabel = startLink?.querySelector('.start-label');
  if (startLink && startLabel) {
    startLink.href = resume.href;
    startLabel.textContent = resume.label;
  }
  const rockChip = app.querySelector<HTMLElement>('#rock-progress');
  const rockProgress = readCompletion(songLessons.map(lesson => lesson.ref));
  if (rockChip) { rockChip.textContent = `${rockProgress.percent}% concluído`; rockChip.setAttribute('aria-label', `${rockProgress.completed} de ${rockProgress.total} lições concluídas`); }
  const chip = app.querySelector<HTMLElement>('#foundations-progress');
  if (!chip) return;
  const progress = readCompletion(lessonRefs);
  chip.textContent = `${progress.percent}% concluído`;
  chip.setAttribute('aria-label', `${progress.completed} de ${progress.total} lições concluídas`);
};
window.addEventListener('pageshow', refreshCompletion);
window.addEventListener('storage', refreshCompletion);
if (!board) throw new Error('Prévia do braço incompleta.');

const config: BoardConfiguration = {
  tonic: 2,
  scaleId: 'naturalMinor',
  startFret: 5,
  endFret: 8,
  labelMode: 'letter',
  positions: [
    { stringId: 'g', fret: 5 },
    { stringId: 'g', fret: 7 },
    { stringId: 'b', fret: 5 },
    { stringId: 'b', fret: 6 },
    { stringId: 'b', fret: 8 },
  ],
};
board.setAttribute('demo', '');
board.configuration = config;
board.style.setProperty('--flash-duration', `${noteDurationMs}ms`);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let animationTimers: number[] = [];
const activePositions = new Map<string, { stringId: string; fret: number }>();
function stopAnimation(): void {
  for (const timer of animationTimers) window.clearTimeout(timer);
  animationTimers = [];
  activePositions.clear();
  board!.highlightedPositions = [];
}
function playPhrase(): void {
  if (document.hidden || reducedMotion.matches) return;
  melody.forEach(({ position, atMs }) => {
    const key = `${position.stringId}:${position.fret}`;
    animationTimers.push(window.setTimeout(() => {
      activePositions.set(key, position);
      board!.highlightedPositions = [...activePositions.values()];
    }, atMs));
    animationTimers.push(window.setTimeout(() => {
      activePositions.delete(key);
      board!.highlightedPositions = [...activePositions.values()];
    }, atMs + noteDurationMs));
  });
  animationTimers.push(window.setTimeout(() => { animationTimers = []; playPhrase(); }, 6400));
}
function syncAnimation(): void {
  stopAnimation();
  if (reducedMotion.matches) board!.highlightedPosition = melody[0]?.position ?? null;
  else playPhrase();
}
document.addEventListener('visibilitychange', syncAnimation);
reducedMotion.addEventListener('change', syncAnimation);
window.addEventListener('pagehide', stopAnimation, { once: true });
syncAnimation();
}
