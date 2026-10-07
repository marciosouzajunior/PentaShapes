import '../public/components/fretboard.mjs';
import './styles.css';
import { readProgress } from './progress';
import { FOUNDATIONS_L01 } from './content-identity';
import { renderLesson } from './lesson';
import { renderTrackPlaceholder } from './track-placeholder';
import foundationsArt from './assets/track-foundations.svg';
import phrasesArt from './assets/track-phrases.svg';
import harmonyArt from './assets/track-harmony.svg';

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
  showHint: boolean;
};

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Elemento principal ausente.');

if (location.pathname.startsWith('/lesson')) renderLesson(app);
else if (location.pathname.startsWith('/track/')) renderTrackPlaceholder(app, location.pathname);
else renderLanding(app);

function renderLanding(app: HTMLDivElement): void {
const ctaLabel = readProgress(FOUNDATIONS_L01) ? 'Continuar lição' : 'Começar agora';
const melody = [
  { position: { stringId: 'g', fret: 7 }, note: 'D', degree: '1', atMs: 0, durationMs: 390 },
  { position: { stringId: 'b', fret: 5 }, note: 'E', degree: '2', atMs: 480, durationMs: 390 },
  { position: { stringId: 'b', fret: 6 }, note: 'F', degree: '♭3', atMs: 960, durationMs: 390 },
  { position: { stringId: 'b', fret: 8 }, note: 'G', degree: '4', atMs: 1440, durationMs: 390 },
  { position: { stringId: 'b', fret: 5 }, note: 'E', degree: '2', atMs: 1920, durationMs: 600 },
  { position: { stringId: 'g', fret: 5 }, note: 'C', degree: '♭7', atMs: 2700, durationMs: 390 },
  { position: { stringId: 'g', fret: 7 }, note: 'D', degree: '1', atMs: 3180, durationMs: 880 },
];

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
        <a class="start-link" href="/lesson/">${ctaLabel} <span aria-hidden="true">→</span></a>
      </div>
      <div class="board-panel hero-board">
        <div class="demo-heading"><span>UMA IDEIA EM RÉ MENOR</span></div>
        <penta-fretboard id="preview-board"></penta-fretboard>
        <div class="demo-phrase" role="img" aria-label="Frase em Ré menor: Ré, grau um; Mi, grau dois; Fá, terça menor; Sol, grau quatro; Mi, grau dois; Dó, sétima menor; Ré, grau um">
          ${melody.map(({ note, degree }, index) => `<span class="phrase-pair">${note} (${degree})${index < melody.length - 1 ? '<span class="phrase-divider">·</span>' : ''}</span>`).join('')}
        </div>
      </div>
    </section>
    <section class="tracks" id="tracks" aria-labelledby="tracks-title">
      <div class="section-heading"><p class="eyebrow">TRILHAS</p><h2 id="tracks-title">Explore novos caminhos</h2></div>
      <div class="track-grid">
        <article class="track-card">
          <img class="track-art" src="${foundationsArt}" alt="" loading="lazy">
          <div class="track-content"><span class="level">INICIANTE</span><h3>Primeiras frases</h3><p>Transforme poucas notas em frases que você consegue ouvir e repetir.</p><a class="track-link" href="/lesson/">Ir para a lição <span aria-hidden="true">→</span></a></div>
        </article>
        <article class="track-card">
          <img class="track-art" src="${phrasesArt}" alt="" loading="lazy">
          <div class="track-content"><span class="level">INTERMEDIÁRIO</span><h3>Frases com intenção</h3><p>Crie motivos, use pausas e leve suas ideias para novos contextos.</p><a class="track-link" href="/track/frases/">Ver lição <span aria-hidden="true">→</span></a></div>
        </article>
        <article class="track-card">
          <img class="track-art" src="${harmonyArt}" alt="" loading="lazy">
          <div class="track-content"><span class="level">AVANÇADO</span><h3>Harmonia jazzística</h3><p>Conecte acordes e dê direção às tensões em progressões de jazz.</p><a class="track-link" href="/track/harmonia/">Ver lição <span aria-hidden="true">→</span></a></div>
        </article>
        <article class="track-card track-card--future" aria-label="Novas trilhas, em breve">
          <div class="future-art" aria-hidden="true"><span>+</span></div>
          <div class="track-content"><span class="level">EM BREVE</span><h3>Novos caminhos</h3><p>Mais formas de explorar o improviso estão por vir.</p><span class="future-status">Mais trilhas no futuro</span></div>
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
board.showHint = false;
board.configuration = config;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let animationTimers: number[] = [];
function stopAnimation(): void {
  for (const timer of animationTimers) window.clearTimeout(timer);
  animationTimers = [];
  board!.highlightedPosition = null;
}
function playPhrase(): void {
  if (document.hidden || reducedMotion.matches) return;
  melody.forEach(({ position, atMs, durationMs }) => {
    animationTimers.push(window.setTimeout(() => {
      board!.style.setProperty('--flash-duration', `${durationMs}ms`);
      board!.highlightedPosition = position;
    }, atMs));
    animationTimers.push(window.setTimeout(() => { board!.highlightedPosition = null; }, atMs + durationMs));
  });
  animationTimers.push(window.setTimeout(() => { animationTimers = []; playPhrase(); }, 5300));
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
