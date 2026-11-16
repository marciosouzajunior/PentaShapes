import '../public/components/fretboard.mjs';
import './styles.css';
import './landing.css';
import { renderBrand } from './brand';
import { readCompletion } from './progress';
import { renderLesson } from './lesson';
import rockArt from './assets/track-purple-haze.webp';
import minorPentatonicArt from './assets/track-minor-pentatonic.webp';
import { playableLessons } from './content-catalog';
import { tracksForLocale, allRouteTracks as routeTracks } from './track-locales';
import { ui, localeFromPath, localePath, localeHome, landingLocale, preferredLocale, saveLocale } from './locale';
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

const locale=location.pathname==='/'?landingLocale(location.search,preferredLocale()):localeFromPath(location.pathname);
const t=(text:Parameters<typeof ui>[1])=>ui(locale,text);
const tracks=tracksForLocale(locale);
const purpleTrack=tracks.find(track=>track.manifest.musicalWork)!;
if(location.pathname==='/'&&locale==='en')location.replace('/en/'+location.search+location.hash);
document.documentElement.lang=locale;
document.title=locale==='en'?'PentaShapes · A place to explore music your way.':'PentaShapes · Um espaço para explorar a música do seu jeito.';
document.querySelector('meta[name="description"]')?.setAttribute('content',locale==='en'?'Learn to improvise on electric or acoustic guitar. Listen, practise short passages and create your own phrases.':'Uma nova forma de aprender e improvisar na guitarra ou no violão. Pratique em pequenas partes e combine teoria e prática na medida certa para você.');
const songPath=location.pathname;

const currentLesson = playableLessons.find(item => item.href.replace(/\/$/, '') === songPath.replace(/\/$/, ''));
const currentTrack = routeTracks.find(track=>songPath.replace(/\/$/,'')===localePath(`/track/${track.manifest.slug}`,track.manifest.language==='en'?'en':'pt-BR'));
if (currentLesson?.kind === 'song') renderSongLesson(app, currentLesson.lesson,currentLesson.track);
else if (currentLesson?.kind === 'phrase') renderLesson(app, currentLesson.lesson.id);
else if (currentTrack) renderSongLesson(app,currentTrack.lessons[0]!,currentTrack);
else if (location.pathname.startsWith('/lesson')) renderLesson(app);
else renderLanding(app);

function renderLanding(app: HTMLDivElement): void {

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
  <a class="skip-link" href="#main">${t('Skip to content')}</a>
  <header class="header">
    ${renderBrand(locale)}
    <details class="language-picker" id="language-menu">
      <summary><span lang="${locale}">${locale==='en'?'English':'Português'}</span><svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m3 4.5 3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>
      <nav aria-label="${locale==='en'?'Language':'Idioma'}">
        <a href="${localeHome('pt-BR')}" data-locale="pt-BR" lang="pt-BR"${locale==='pt-BR'?' aria-current="true"':''}>Português</a>
        <a href="${localeHome('en')}" data-locale="en" lang="en"${locale==='en'?' aria-current="true"':''}>English</a>
      </nav>
    </details>
  </header>
  <main id="main" class="landing-page">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 id="hero-title">${t('Learn to improvise.')}<span>${t('One phrase at a time.')}</span></h1>
        <p class="lead">${t('Turn scales into music. Develop your phrasing on electric or acoustic guitar with tracks that connect foundations, repertoire and making music.')}</p>
      </div>
      <div class="board-panel hero-board">
        <penta-fretboard id="preview-board"></penta-fretboard>
      </div>
    </section>
    <section class="tracks" id="tracks" aria-labelledby="tracks-title">
      <div class="section-heading"><h2 id="tracks-title">${t('Choose a track')}</h2><p class="section-intro">${t('Explore a song or practise an idea to create your own phrases.')}</p></div>
      <div class="track-grid">
        ${[purpleTrack,...tracks.filter(track=>track!==purpleTrack)].map(track=>{
          const progress=readCompletion(track.lessons.map(l=>l.ref));
          const missions=track.lessons.some(lesson=>lesson.mission);
          const category=track.manifest.publication.status==='draft'?t('EXPERIMENTAL'):track.manifest.purposeIds.includes('repertoire')?t('REPERTOIRE'):t('FOUNDATIONS');
          const trackArt=track.manifest.musicalWork?rockArt:minorPentatonicArt;
          const isCoverArt=track.manifest.musicalWork||track.manifest.id.replace(/-en$/,'')==='minor-pentatonic-part-one';
          return `<article class="track-card"><img class="track-art${isCoverArt?' track-art--photo':''}" src="${trackArt}" alt="" loading="lazy"><div class="track-content"><div class="track-meta"><span class="level">${category}</span><span class="track-progress" data-track-progress="${track.manifest.id}" aria-label="${progress.completed} ${t('of')} ${progress.total} ${missions?t('missions'):t('lessons')} ${t('completed')}">${progress.percent}% ${t('complete')}</span></div><h3>${track.manifest.title}</h3><p>${track.manifest.summary}</p><a class="track-link" href="${localePath(`/track/${track.manifest.slug}/`,locale)}">${missions?t('View missions'):t('View lessons')} <span aria-hidden="true">→</span></a></div></article>`;
        }).join('')}
      </div>
    </section>
  </main>
  <footer class="footer">
    <strong>PentaShapes</strong>
    <p>${t('A place to explore music your way.')}</p>
    <nav class="footer-links" aria-label="${t('Project links')}">
      <a href="https://github.com/marciosouzajunior/PentaShapes" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      <a href="/legacy/" target="_blank" rel="noopener noreferrer">Legacy <span aria-hidden="true">↗</span></a>
    </nav>
  </footer>
`;

const languageMenu=app.querySelector<HTMLDetailsElement>('#language-menu');
languageMenu?.querySelectorAll<HTMLAnchorElement>('[data-locale]').forEach(link=>{
  link.addEventListener('click',()=>saveLocale(link.dataset.locale==='en'?'en':'pt-BR'));
});
document.addEventListener('click',event=>{
  if(languageMenu?.open&&!event.composedPath().includes(languageMenu))languageMenu.open=false;
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&languageMenu?.open){
    languageMenu.open=false;languageMenu.querySelector('summary')?.focus();
  }
});
const board = app.querySelector<FretboardElement>('#preview-board');
const refreshCompletion = (): void => {
  for(const track of tracks){
    const chip=app.querySelector<HTMLElement>(`[data-track-progress="${track.manifest.id}"]`),progress=readCompletion(track.lessons.map(l=>l.ref));
    if(chip){chip.textContent=`${progress.percent}% ${t('complete')}`;chip.setAttribute('aria-label',`${progress.completed} ${t('of')} ${progress.total} ${track.lessons.some(lesson=>lesson.mission)?t('missions'):t('lessons')} ${t('completed')}`);}
  }
};
window.addEventListener('pageshow', refreshCompletion);
window.addEventListener('storage', refreshCompletion);
if (!board) throw new Error('Prévia do braço incompleta.');

const config: BoardConfiguration & {locale:typeof locale} = {locale,
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
