import { readProgress, saveProgress } from './progress';
import { FOUNDATIONS_L01 } from './content-identity';
import './lesson.css';

type FretboardElement = HTMLElement & {
  configuration: object;
  highlightedPosition: { stringId: string; fret: number } | null;
};

const beatSeconds = 60 / 80;
const exerciseSeconds = beatSeconds * 8;

export function renderLesson(app: HTMLDivElement): void {
  const prior = readProgress(FOUNDATIONS_L01);
  const saved = prior ? true : saveProgress(FOUNDATIONS_L01, 'listen');

  app.innerHTML = `
    <a class="skip-link" href="#lesson-main">Ir para a lição</a>
    <header class="header lesson-header"><a class="brand" href="/" aria-label="PentaShapes, início"><span class="brand-mark" aria-hidden="true">p</span><span>PentaShapes</span></a><a class="back-link" href="/">Voltar</a></header>
    <main id="lesson-main" class="lesson-layout">
      <div class="lesson-intro"><p class="eyebrow">FUNDAMENTOS · L01</p><h1>Encontre o repouso</h1><p>Toque o <strong>Lá</strong> na 1ª corda, casa 5. Ouça como essa nota se encaixa no acorde de Am e experimente sustentá-la por dois compassos.</p></div>
      <div class="lesson-board board-panel"><div class="board-top"><div><span class="board-kicker">UMA NOTA, UM DESTINO</span><h2>Lá sobre Am</h2></div><span class="lesson-tempo">80 BPM</span></div><penta-fretboard id="lesson-fretboard"></penta-fretboard><p class="board-feedback" id="lesson-note" role="status" aria-live="polite">Encontre o Lá no braço ou ouça o exemplo.</p></div>
      <div class="lesson-practice"><p class="eyebrow">MÃO NA MASSA</p><h2>Ouça. Depois toque.</h2><p>Primeiro, escute o Lá sobre Am. Depois, toque junto com a contagem e deixe a nota soar. O silêncio entre os sons também faz parte do exercício.</p><div class="lesson-actions"><button type="button" class="action-button" id="hear-example">Ouvir exemplo</button><button type="button" class="action-button secondary" id="practice-beats">Tocar com o pulso</button><button type="button" class="text-button" id="stop-audio" disabled>Parar</button></div><p class="lesson-status" id="lesson-status" role="status" aria-live="polite">${prior?.step === 'complete' ? 'Você já praticou esta lição. Pode repeti-la quando quiser.' : 'Pronto para começar.'}</p><button type="button" class="complete-button" id="complete-lesson">Concluí esta prática</button>${saved ? '' : '<p class="storage-warning">Seu navegador não permitiu salvar o progresso. Você ainda pode praticar nesta visita.</p>'}</div>
      <details class="lesson-tip"><summary>Por que começar com uma nota?</summary><p>O Lá é a tônica de Am: uma nota de repouso. Antes de buscar muitas escalas, vale ouvir a diferença entre tocar, esperar e voltar a esse ponto de chegada.</p></details>
    </main>
  `;

  const board = app.querySelector<FretboardElement>('#lesson-fretboard');
  const note = app.querySelector<HTMLElement>('#lesson-note');
  const status = app.querySelector<HTMLElement>('#lesson-status');
  const stopButton = app.querySelector<HTMLButtonElement>('#stop-audio');
  const completeButton = app.querySelector<HTMLButtonElement>('#complete-lesson');
  const hearButton = app.querySelector<HTMLButtonElement>('#hear-example');
  const practiceButton = app.querySelector<HTMLButtonElement>('#practice-beats');
  if (!board || !note || !status || !stopButton || !completeButton || !hearButton || !practiceButton) throw new Error('Lição incompleta.');

  board.configuration = { tonic: 9, scaleId: 'minorPentatonic', startFret: 5, endFret: 8, labelMode: 'letter', positions: [{ stringId: 'e_high', fret: 5 }] };
  board.addEventListener('fret-select', () => { note.textContent = 'Lá, 1ª corda, casa 5: a nota de repouso de Am.'; });

  let audio: AudioContext | null = null;
  let timers: number[] = [];
  const clearTimers = () => { for (const timer of timers) window.clearTimeout(timer); timers = []; };
  const stop = () => {
    clearTimers();
    board.highlightedPosition = null;
    if (audio) { void audio.close(); audio = null; }
    stopButton.disabled = true;
    hearButton.disabled = false;
    practiceButton.disabled = false;
  };
  const scheduleTone = (context: AudioContext, midi: number, when: number, duration: number, gain: number, waveform: OscillatorType = 'sine') => {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = waveform;
    oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    envelope.gain.setValueAtTime(0, when);
    envelope.gain.linearRampToValueAtTime(gain, when + .02);
    envelope.gain.setValueAtTime(gain, when + Math.max(.03, duration - .12));
    envelope.gain.linearRampToValueAtTime(0, when + duration);
    oscillator.connect(envelope).connect(context.destination);
    oscillator.start(when);
    oscillator.stop(when + duration + .02);
  };
  const play = async (mode: 'example' | 'practice') => {
    stop();
    try {
      const context = new AudioContext();
      audio = context;
      await context.resume();
      const start = context.currentTime + .08;
      for (let beat = 0; beat < 8; beat++) {
        const when = start + beat * beatSeconds;
        scheduleTone(context, beat % 4 === 0 ? 81 : 76, when, .08, .035);
        if (beat % 4 === 0) for (const chordNote of [57, 60, 64]) scheduleTone(context, chordNote, when, beatSeconds * 3.5, .018);
      }
      if (mode === 'example') {
        for (const beat of [0, 4]) {
          scheduleTone(context, 69, start + beat * beatSeconds, beatSeconds * 2, .12);
          timers.push(window.setTimeout(() => { board.highlightedPosition = { stringId: 'e_high', fret: 5 }; }, beat * beatSeconds * 1000));
          timers.push(window.setTimeout(() => { board.highlightedPosition = null; }, (beat + 2) * beatSeconds * 1000));
        }
      } else saveProgress(FOUNDATIONS_L01, 'practice');
      stopButton.disabled = false;
      hearButton.disabled = true;
      practiceButton.disabled = true;
      status.textContent = mode === 'example' ? 'Escute o Lá aparecer e descansar sobre Am.' : 'Toque o Lá na primeira batida de cada compasso. Deixe espaço para o silêncio.';
      timers.push(window.setTimeout(() => {
        stop();
        status.textContent = mode === 'example' ? 'Agora tente tocar o Lá com o pulso.' : 'Como soou? Repita se quiser ou marque a prática como concluída.';
      }, (exerciseSeconds + .2) * 1000));
    } catch {
      stop();
      status.textContent = 'Não foi possível tocar o áudio neste navegador. Você pode praticar no instrumento usando a posição indicada.';
    }
  };

  hearButton.addEventListener('click', () => { void play('example'); });
  practiceButton.addEventListener('click', () => { void play('practice'); });
  stopButton.addEventListener('click', () => { stop(); status.textContent = 'Áudio parado. Você pode ouvir ou praticar novamente.'; });
  completeButton.addEventListener('click', () => {
    stop();
    if (saveProgress(FOUNDATIONS_L01, 'complete')) {
      status.textContent = 'Prática registrada neste navegador. Volte quando quiser para repetir.';
    } else status.textContent = 'Prática concluída, mas este navegador não permitiu salvar o progresso.';
  });
  window.addEventListener('pagehide', stop, { once: true });
}
