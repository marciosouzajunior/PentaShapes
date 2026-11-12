import '../public/components/fretboard.mjs';
import './styles.css';
import './landing.css';
import { renderBrand } from './brand';
import { readCompletion } from './progress';
import { lessons } from './lesson-content';
import { renderLesson } from './lesson';
import { renderTrackPlaceholder } from './track-placeholder';
import foundationsArt from './assets/track-foundations.svg';
import phrasesArt from './assets/track-phrases.svg';
import harmonyArt from './assets/track-harmony.svg';
import rockArt from './assets/track-purple-haze.webp';
import { playableLessons } from './content-catalog';
import { purpleTrack, tracks, routeTracks } from './tracks';
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

const songPath=location.pathname.replace(/^\/track\/(?:rock-em-movimento|purple-haze-por-dentro|purple-haze-missoes)(?=\/|$)/,'/track/purple-haze');
if(songPath!==location.pathname)history.replaceState(history.state,'',songPath+location.search+location.hash);

const currentLesson = playableLessons.find(item => item.href.replace(/\/$/, '') === location.pathname.replace(/\/$/, ''));
if (currentLesson?.kind === 'song') renderSongLesson(app, currentLesson.lesson,currentLesson.track);
else if (currentLesson?.kind === 'phrase') renderLesson(app, currentLesson.lesson.id);
else if (routeTracks.some(track=>location.pathname.replace(/\/$/,'')===`/track/${track.manifest.slug}`)) { const track=routeTracks.find(track=>location.pathname.replace(/\/$/,'')===`/track/${track.manifest.slug}`)!; renderSongLesson(app,track.lessons[0]!,track); }
else if (location.pathname.startsWith('/lesson')) renderLesson(app);
else if (location.pathname.startsWith('/track/')) renderTrackPlaceholder(app, location.pathname);
else renderLanding(app);

function renderLanding(app: HTMLDivElement): void {
const lessonRefs = lessons.map(lesson => lesson.ref);
const completion = readCompletion(lessonRefs);

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
    ${renderBrand()}
  </header>
  <main id="main" class="landing-page">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 id="hero-title">Aprenda a improvisar.<span>Uma frase de cada vez.</span></h1>
        <p class="lead">Explore frases e músicas na guitarra ou no violão. Ouça os exemplos, encontre as notas no braço e experimente suas próprias ideias.</p>
      </div>
      <div class="board-panel hero-board">
        <penta-fretboard id="preview-board"></penta-fretboard>
      </div>
    </section>
    <section class="tracks" id="tracks" aria-labelledby="tracks-title">
      <div class="section-heading"><h2 id="tracks-title">Escolha uma trilha</h2><p class="section-intro">Explore uma música ou pratique uma ideia para criar suas próprias frases.</p></div>
      <div class="track-grid">
        ${[purpleTrack,...tracks.filter(track=>track!==purpleTrack)].map(track=>{
          const progress=readCompletion(track.lessons.map(l=>l.ref));
          const missions=track.lessons.some(lesson=>lesson.mission);
          const category=track.manifest.publication.status==='draft'?'EXPERIMENTAL':track.manifest.purposeIds.includes('repertoire')?'REPERTÓRIO':'FUNDAMENTOS';
          return `<article class="track-card"><img class="track-art${track.manifest.musicalWork?' track-art--photo':''}" src="${track.manifest.musicalWork?rockArt:phrasesArt}" alt="" loading="lazy"><div class="track-content"><div class="track-meta"><span class="level">${category}</span><span class="track-progress" data-track-progress="${track.manifest.id}" aria-label="${progress.completed} de ${progress.total} ${missions?'missões':'lições'} concluídas">${progress.percent}% concluído</span></div><h3>${track.manifest.title}</h3><p>${track.manifest.summary}</p><a class="track-link" href="/track/${track.manifest.slug}/">${missions?'Ver missões':'Ver lições'} <span aria-hidden="true">→</span></a></div></article>`;
        }).join('')}
        <article class="track-card">
          <img class="track-art" src="${foundationsArt}" alt="" loading="lazy">
          <div class="track-content"><div class="track-meta"><span class="level">INICIANTE</span><span class="track-progress" id="foundations-progress" aria-label="${completion.completed} de ${completion.total} lições concluídas">${completion.percent}% concluído</span></div><h3>Primeiras frases</h3><p>Transforme poucas notas em frases que você consegue ouvir e repetir.</p><a class="track-link" href="/lesson/">Ver lições <span aria-hidden="true">→</span></a></div>
        </article>
        <article class="track-card">
          <img class="track-art" src="${phrasesArt}" alt="" loading="lazy">
          <div class="track-content"><span class="level">EM PREPARAÇÃO</span><h3>Frases com intenção</h3><p>Crie motivos, use pausas e leve suas ideias para novos contextos.</p><a class="track-link" href="/track/frases/">Conhecer a trilha <span aria-hidden="true">→</span></a></div>
        </article>
        <article class="track-card">
          <img class="track-art" src="${harmonyArt}" alt="" loading="lazy">
          <div class="track-content"><span class="level">EM PREPARAÇÃO</span><h3>Harmonia jazzística</h3><p>Conecte acordes e dê direção às tensões em progressões de jazz.</p><a class="track-link" href="/track/harmonia/">Conhecer a trilha <span aria-hidden="true">→</span></a></div>
        </article>

      </div>
    </section>
  </main>
  <footer class="footer">
    <strong>PentaShapes</strong>
    <p>Um espaço para ouvir, tocar e experimentar.</p>
    <nav class="footer-links" aria-label="Links do projeto">
      <a href="https://github.com/marciosouzajunior/pentashapes" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      <a href="/legacy/">Legacy</a>
    </nav>
  </footer>
`;

const board = app.querySelector<FretboardElement>('#preview-board');
const refreshCompletion = (): void => {
  for(const track of tracks){
    const chip=app.querySelector<HTMLElement>(`[data-track-progress="${track.manifest.id}"]`),progress=readCompletion(track.lessons.map(l=>l.ref));
    if(chip){chip.textContent=`${progress.percent}% concluído`;chip.setAttribute('aria-label',`${progress.completed} de ${progress.total} ${track.lessons.some(lesson=>lesson.mission)?'missões':'lições'} concluídas`);}
  }
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
