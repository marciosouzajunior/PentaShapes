import { readProgress, saveProgress } from './progress';
import { getLesson, type LessonContent, type LessonMap } from './lesson-content';
import { DEFAULT_LESSON_BARS, MAX_LESSON_BARS, planHarmony, planPhrase } from './lesson-playback';
import { buildFretboard } from '../public/components/music.mjs';
import { bindLessonSelector, renderLessonPager, renderLessonSelector } from './lesson-navigation';
import './lesson.css';

type FretboardElement = HTMLElement & {
  configuration: object;
  highlightedPosition: { stringId: string; fret: number } | null;
};

export function renderLesson(app: HTMLDivElement, id: LessonContent['id'] = 'l01'): void {
  const lesson = getLesson(id);
  const minimumBars = lesson.responseAfterBeats ? lesson.responseAfterBeats / 2 : lesson.phrase.beats / 4;
  const prior = readProgress(lesson.ref);
  const saved = prior ? true : saveProgress(lesson.ref, 'listen', lesson.revision);

  app.innerHTML = `
    <a class="skip-link" href="#lesson-main">Ir para a lição</a>
    <header class="header lesson-header"><a class="brand" href="/" aria-label="PentaShapes, início"><span class="brand-mark" aria-hidden="true">p</span><span>PentaShapes</span></a>${renderLessonSelector(id)}</header>
    <main id="lesson-main" class="lesson-layout">
      <div class="lesson-intro"><p class="eyebrow">FUNDAMENTOS · ${lesson.number}</p><h1>${lesson.title}</h1><p>${lesson.instruction}</p><details class="lesson-degrees"><summary>Entenda os graus</summary><p>${lesson.degreeExplanation}</p></details></div>
      <div class="lesson-board board-panel">
        <div class="lesson-board-layout">
          <div class="lesson-board-map"><penta-fretboard id="lesson-fretboard"></penta-fretboard><p class="lesson-scroll-hint">Deslize para explorar as casas →</p><div class="lesson-board-tools">${lesson.practiceGroups ? `<label>Praticar em <select id="practice-group"><option value="all">Todas as cordas</option>${lesson.practiceGroups.map(group => `<option value="${group.id}">${group.label}</option>`).join('')}</select></label>` : ''}<label><input type="checkbox" role="switch" id="show-degrees"> Mostrar graus</label></div></div>
        </div>
      </div>
      <section class="lesson-player" aria-labelledby="player-title">
        <div class="player-head"><h2 id="player-title">Ouça. Depois toque.</h2><button type="button" class="player-settings-toggle" id="settings-toggle" aria-label="Configurar BPM e compassos" aria-controls="player-settings" aria-expanded="false"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h10m4 0h4M3 17h4m4 0h10"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg></button></div>
        <div class="player-settings" id="player-settings" hidden>
          <label><span>BPM <output id="bpm-value" for="player-bpm">80</output></span><input id="player-bpm" type="range" min="40" max="200" step="1" value="80"></label>
          <label><span>Compassos <output id="bars-value" for="player-bars">${DEFAULT_LESSON_BARS}</output></span><input id="player-bars" type="range" min="${minimumBars}" max="${MAX_LESSON_BARS}" step="${minimumBars}" value="${DEFAULT_LESSON_BARS}"></label>
        </div>
        ${lesson.harmony ? `<p class="player-chord">Acorde <strong id="active-chord">${lesson.chord.label}</strong></p>` : ''}
        <div class="player-score">
          <div class="lesson-score" id="lesson-score" role="img" aria-label="${lesson.scoreDescription}"></div>
          <p class="measure-progress" id="measure-progress" hidden>Compasso <span class="measure-number" id="measure-number">1</span> de <span id="measure-total">${DEFAULT_LESSON_BARS}</span></p>
        </div>
        <div class="player-controls">
          <div class="lesson-actions"><button type="button" class="action-button" id="hear-example">Ouvir exemplo</button><button type="button" class="action-button secondary" id="practice-beats">Praticar</button><button type="button" class="text-button" id="stop-audio" disabled hidden>Parar</button></div>
          <p class="lesson-status" id="lesson-status" role="status" aria-live="polite">${prior?.step === 'complete' ? 'Você já praticou esta lição. Pode repeti-la quando quiser.' : ''}</p>
          ${saved ? '' : '<p class="storage-warning">Seu navegador não permitiu salvar o progresso. Você ainda pode praticar nesta visita.</p>'}
        </div>
      </section>
      <ul class="note-legend" aria-label="Legenda das notas no braço">
        <li><span class="legend-example" aria-hidden="true"><span class="legend-note legend-note--root"></span></span><span>Tônica</span></li>
        <li><span class="legend-example" aria-hidden="true"><span class="legend-note legend-note--chord"></span></span><span>Nota do acorde</span></li>
        <li id="target-legend" hidden><span class="legend-example" aria-hidden="true"><span class="legend-note legend-note--target"></span></span><span>Alvo</span></li>
      </ul>
      <footer class="lesson-footer">
        <div class="lesson-completion">
          <label class="lesson-complete"><input type="checkbox" id="complete-lesson" ${prior?.step === 'complete' ? 'checked' : ''}><span>Lição concluída</span></label>
          <button type="button" class="lesson-check-link" id="check-toggle" aria-expanded="false" aria-controls="lesson-check">Confira o que aprendeu</button>
        </div>
        ${renderLessonPager(id)}
      </footer>
      <section class="lesson-check" id="lesson-check" aria-labelledby="check-title" hidden>
        <h2 id="check-title">Confira o que aprendeu</h2>
        <fieldset><legend>${lesson.check.question}</legend>
          ${lesson.check.choices.map((choice, index) => `<label class="lesson-check-choice"><input type="radio" name="lesson-check-answer" value="${index}"><span>${choice}</span></label>`).join('')}
        </fieldset>
        <p class="lesson-check-feedback" id="check-feedback" role="status" aria-live="polite"></p>
      </section>
    </main>
  `;

  bindLessonSelector(app);
  const checkToggle = app.querySelector<HTMLButtonElement>('#check-toggle')!;
  const checkPanel = app.querySelector<HTMLElement>('#lesson-check')!;
  const checkFeedback = app.querySelector<HTMLElement>('#check-feedback')!;
  checkToggle.addEventListener('click', () => {
    checkPanel.hidden = !checkPanel.hidden;
    checkToggle.setAttribute('aria-expanded', String(!checkPanel.hidden));
    if (!checkPanel.hidden) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  });
  checkPanel.addEventListener('change', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.name !== 'lesson-check-answer') return;
    checkFeedback.textContent = Number(input.value) === lesson.check.answer
      ? `Isso! ${lesson.check.explanation}`
      : 'Tente outra opção. Você pode ouvir o exemplo e consultar o braço novamente.';
  });

  const board = app.querySelector<FretboardElement>('#lesson-fretboard');
  const status = app.querySelector<HTMLElement>('#lesson-status');
  const stopButton = app.querySelector<HTMLButtonElement>('#stop-audio');
  const completeCheckbox = app.querySelector<HTMLInputElement>('#complete-lesson');
  const hearButton = app.querySelector<HTMLButtonElement>('#hear-example');
  const practiceButton = app.querySelector<HTMLButtonElement>('#practice-beats');
  const settingsToggle = app.querySelector<HTMLButtonElement>('#settings-toggle');
  const settingsPanel = app.querySelector<HTMLElement>('#player-settings');
  const bpmInput = app.querySelector<HTMLInputElement>('#player-bpm');
  const barsInput = app.querySelector<HTMLInputElement>('#player-bars');
  const bpmValue = app.querySelector<HTMLOutputElement>('#bpm-value');
  const barsValue = app.querySelector<HTMLOutputElement>('#bars-value');
  const measureProgress = app.querySelector<HTMLElement>('#measure-progress');
  const measureNumber = app.querySelector<HTMLElement>('#measure-number');
  const measureTotal = app.querySelector<HTMLElement>('#measure-total');
  const score = app.querySelector<HTMLElement>('#lesson-score');
  if (!board || !status || !stopButton || !completeCheckbox || !hearButton || !practiceButton || !settingsToggle || !settingsPanel || !bpmInput || !barsInput || !bpmValue || !barsValue || !measureProgress || !measureNumber || !measureTotal || !score) throw new Error('Lição incompleta.');

  settingsToggle.addEventListener('click', () => {
    settingsPanel.hidden = !settingsPanel.hidden;
    settingsToggle.setAttribute('aria-expanded', String(!settingsPanel.hidden));
  });

  const degreesToggle = app.querySelector<HTMLInputElement>('#show-degrees')!;
  const groupSelect = app.querySelector<HTMLSelectElement>('#practice-group');
  let currentMap: 'example' | 'practice' = 'example';
  let activeHarmonyMap: LessonMap | null = null;
  const activeChord = app.querySelector<HTMLElement>('#active-chord');
  const applyMap = (mode: 'example' | 'practice') => {
    currentMap = mode;
    board.highlightedPosition = null;
    const map = activeHarmonyMap ?? lesson.maps[mode];
    const group = mode === 'practice' ? lesson.practiceGroups?.find(item => item.id === groupSelect?.value) : undefined;
    const configuration = { ...map,
      positions: group ? map.positions?.filter(position => group.stringIds.includes(position.stringId)) : map.positions,
      roles: group ? map.roles.filter(position => group.stringIds.includes(position.stringId)) : map.roles,
      labelMode: degreesToggle.checked ? 'degree' as const : 'letter' as const };
    board.configuration = configuration;
    const hasSeparateTarget = buildFretboard(configuration).rows.some(row => row.notes.some(note => note.visible && !note.isRoot && note.roles.includes('target')));
    app.querySelector<HTMLElement>('#target-legend')!.hidden = !hasSeparateTarget;
  };
  applyMap('example');
  degreesToggle.addEventListener('change', () => {
    const highlighted = board.highlightedPosition;
    applyMap(currentMap);
    board.highlightedPosition = highlighted;
  });
  let activeScoreNote: number | null = null;
  const highlightScore = (index: number | null) => {
    activeScoreNote = index;
    // abcjs separates rests from pitched notes; repeated pitches keep distinct groups.
    score.querySelectorAll('.abcjs-note').forEach((note, noteIndex) => {
      note.classList.toggle('is-playing', noteIndex === index);
    });
  };
  // Em altura real, o Lá da 1ª corda, casa 5, soa como A4 e aparece sem clave transpositora.
  let scoreResize: ResizeObserver | null = null;
  void import('abcjs').then(({ renderAbc }) => {
    const scoreArea = app.querySelector<HTMLElement>('.player-score')!;
    let previousWide: boolean | null = null;
    const drawScore = () => {
      const wide = Boolean(lesson.wideScore && scoreArea.clientWidth >= 700);
      if (previousWide === wide) return;
      previousWide = wide;
      score.classList.toggle('lesson-score--wide', wide);
      renderAbc(score, wide ? lesson.wideScore! : lesson.score, { responsive: 'resize', add_classes: true, staffwidth: wide ? 620 : id === 'l01' ? 220 : 360, scale: 1.1, paddingtop: 4, paddingbottom: 4 });
      highlightScore(activeScoreNote);
    };
    drawScore();
    if (lesson.wideScore) {
      scoreResize = new ResizeObserver(drawScore);
      scoreResize.observe(scoreArea);
    }
  }).catch(() => { score.textContent = 'Partitura indisponível neste navegador.'; });
  let audio: AudioContext | null = null;
  let timers: number[] = [];
  let playbackToken = 0;

  const readSettings = () => {
    const bpm = Number(bpmInput.value);
    const bars = Number(barsInput.value);
    if (!Number.isInteger(bpm) || bpm < 40 || bpm > 200 || !Number.isInteger(bars) || bars < minimumBars || bars > MAX_LESSON_BARS || bars % minimumBars !== 0) return null;
    return { bpm, bars, beatSeconds: 60 / bpm };
  };
  const visibleBars = () => {
    const bars = Number(barsInput.value);
    return Number.isInteger(bars) && bars >= minimumBars && bars <= MAX_LESSON_BARS && bars % minimumBars === 0 ? bars : DEFAULT_LESSON_BARS;
  };
  const showBeat = (index: number | null, bars: number) => {
    if (index === null) {
      measureProgress.hidden = true;
      measureNumber.classList.remove('is-changing');
      return;
    }
    const current = String(Math.floor(index / 4) + 1);
    const changed = measureProgress.hidden || measureNumber.textContent !== current;
    measureProgress.hidden = false;
    measureTotal.textContent = String(bars);
    if (changed) {
      measureNumber.classList.remove('is-changing');
      measureNumber.textContent = current;
      void measureNumber.offsetWidth;
      measureNumber.classList.add('is-changing');
    }
  };
  const updateRange = (input: HTMLInputElement) => {
    const progress = (Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min));
    input.style.setProperty('--range-progress', (progress * 100) + '%');
  };
  updateRange(bpmInput);
  updateRange(barsInput);
  bpmInput.addEventListener('input', () => { bpmValue.value = bpmInput.value; updateRange(bpmInput); });
  barsInput.addEventListener('input', () => { barsValue.value = barsInput.value; updateRange(barsInput); showBeat(null, visibleBars()); });

  const clearTimers = () => { for (const timer of timers) window.clearTimeout(timer); timers = []; };
  const stop = () => {
    playbackToken++;
    clearTimers();
    activeHarmonyMap = null;
    if (lesson.harmony) applyMap(currentMap);
    if (activeChord) activeChord.textContent = lesson.chord.label;
    board.highlightedPosition = null;
    highlightScore(null);
    if (audio) {
      const context = audio;
      audio = null;
      void context.close().catch(() => {});
    }
    stopButton.disabled = true;
    stopButton.hidden = true;
    hearButton.disabled = false;
    practiceButton.disabled = false;
    bpmInput.disabled = false;
    barsInput.disabled = false;
    if (groupSelect) groupSelect.disabled = false;
    showBeat(null, visibleBars());
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
  const audition = async (selected: { stringId: string; fret: number; midi: number }) => {
    stop();
    status.classList.remove('is-error');
    const token = playbackToken;
    let context: AudioContext | null = null;
    try {
      context = new AudioContext();
      audio = context;
      await context.resume();
      if (audio !== context || token !== playbackToken) return;
      const duration = (60 / (readSettings()?.bpm ?? 80)) * 2;
      board.style.setProperty('--flash-duration', duration * 1000 + 'ms');
      board.highlightedPosition = null;
      void board.offsetWidth;
      board.highlightedPosition = { stringId: selected.stringId, fret: selected.fret };
      const scoreIndex = lesson.phrase.notes.findIndex(note => note.position.stringId === selected.stringId && note.position.fret === selected.fret);
      highlightScore(scoreIndex < 0 ? null : scoreIndex);
      scheduleTone(context, selected.midi, context.currentTime, duration, .12);
      timers.push(window.setTimeout(stop, (duration + .05) * 1000));
    } catch {
      if (audio !== context) return;
      stop();
      status.textContent = 'Não foi possível tocar a nota neste navegador.';
      status.classList.add('is-error');
    }
  };
  board.addEventListener('fret-activate', event => {
    void audition((event as CustomEvent<{ stringId: string; fret: number; midi: number }>).detail);
  });

  const play = async (mode: 'example' | 'practice') => {
    status.classList.remove('is-error');
    const settings = readSettings();
    if (!settings) {
      status.textContent = `Escolha um BPM entre 40 e 200 e um bloco de ${minimumBars} a ${MAX_LESSON_BARS} compassos.`;
      status.classList.add('is-error');
      return;
    }
    stop();
    const token = playbackToken;
    let context: AudioContext | null = null;
    try {
      context = new AudioContext();
      audio = context;
      await context.resume();
      if (audio !== context || token !== playbackToken) return;
      const { bars, beatSeconds } = settings;
      const totalBeats = bars * 4;
      const startDelay = .08;
      const start = context.currentTime + startDelay;
      if (mode === 'example' && groupSelect) groupSelect.value = 'all';
      applyMap(mode);
      board.style.setProperty('--flash-duration', beatSeconds * 2 * 1000 + 'ms');

      const harmony = planHarmony(lesson, bars);
      if (lesson.harmony) {
        for (const change of harmony) {
          timers.push(window.setTimeout(() => {
            const highlighted = board.highlightedPosition;
            activeHarmonyMap = change.map;
            applyMap(mode);
            board.highlightedPosition = highlighted;
            if (activeChord) activeChord.textContent = change.chord.label;
          }, (startDelay + change.beat * beatSeconds) * 1000));
        }
      }

      let harmonyIndex = 0;
      for (let beat = 0; beat < totalBeats; beat++) {
        while (harmony[harmonyIndex + 1] && harmony[harmonyIndex + 1]!.beat <= beat) harmonyIndex++;
        const currentChord = harmony[harmonyIndex]!.chord;
        const when = start + beat * beatSeconds;
        scheduleTone(context, beat % 4 === 0 ? 81 : 76, when, .08, .035);
        if (beat % 4 === 0) {
          for (const chordNote of currentChord.midi) scheduleTone(context, chordNote, when, beatSeconds * 3.5, .018);
        }
        timers.push(window.setTimeout(() => showBeat(beat, bars), (startDelay + beat * beatSeconds) * 1000));
      }

      const cycleBeats = mode === 'practice' && lesson.responseAfterBeats ? lesson.responseAfterBeats * 2 : lesson.phrase.beats;
      for (const note of planPhrase(lesson, mode, bars)) {
            const beat = note.beat;
            const duration = note.duration * beatSeconds;
            scheduleTone(context, note.midi, start + beat * beatSeconds, duration, .12);
            timers.push(window.setTimeout(() => {
              board.highlightedPosition = null;
              void board.offsetWidth;
              board.style.setProperty('--flash-duration', duration * 1000 + 'ms');
              board.highlightedPosition = note.position;
              highlightScore(note.scoreNoteIndex);
            }, (startDelay + beat * beatSeconds) * 1000));
            timers.push(window.setTimeout(() => {
              board.highlightedPosition = null;
              highlightScore(null);
            }, (startDelay + beat * beatSeconds + duration) * 1000));
      }
      for (let cycle = 0; cycle < totalBeats; cycle += cycleBeats) {
        if (mode === 'practice' && lesson.responseAfterBeats) {
          const responseBars = lesson.responseAfterBeats / 4;
          timers.push(window.setTimeout(() => { status.textContent = `Escute o exemplo · ${responseBars} compassos.`; }, (startDelay + cycle * beatSeconds) * 1000));
          if (cycle + lesson.responseAfterBeats < totalBeats) timers.push(window.setTimeout(() => { status.textContent = `Sua vez · ${responseBars} compassos. ${lesson.responseInstruction ?? 'Crie sua resposta.'}`; }, (startDelay + (cycle + lesson.responseAfterBeats) * beatSeconds) * 1000));
        }
      }
      if (mode === 'practice' && !completeCheckbox.checked) saveProgress(lesson.ref, 'practice', lesson.revision);
      stopButton.disabled = false;
      stopButton.hidden = false;
      hearButton.disabled = true;
      practiceButton.disabled = true;
      bpmInput.disabled = true;
      barsInput.disabled = true;
      if (groupSelect) groupSelect.disabled = true;
      status.textContent = mode === 'example' ? lesson.exampleInstruction : lesson.practiceInstruction;
      status.classList.add('is-active');
      timers.push(window.setTimeout(() => {
        stop();
        status.textContent = mode === 'example' ? 'Agora experimente tocar com a base.' : lesson.reflection;
      }, (startDelay + totalBeats * beatSeconds + .15) * 1000));
    } catch {
      if (audio !== context) return;
      stop();
      status.textContent = 'Não foi possível tocar o áudio neste navegador. Você pode praticar no instrumento usando a posição indicada.';
      status.classList.add('is-error');
    }
  };

  hearButton.addEventListener('click', () => { void play('example'); });
  groupSelect?.addEventListener('change', () => {
    stop();
    applyMap('practice');
  });
  practiceButton.addEventListener('click', () => { void play('practice'); });
  stopButton.addEventListener('click', () => { stop(); status.classList.remove('is-error'); status.textContent = 'Áudio parado. Você pode ouvir ou praticar novamente.'; });
  completeCheckbox.addEventListener('change', () => {
    const step = completeCheckbox.checked ? 'complete' : 'practice';
    if (saveProgress(lesson.ref, step, lesson.revision)) {
      status.classList.remove('is-error');
      status.textContent = completeCheckbox.checked ? 'Lição marcada como concluída.' : 'Lição marcada como não concluída.';
    } else {
      completeCheckbox.checked = !completeCheckbox.checked;
      status.textContent = 'Não foi possível salvar o progresso neste navegador.';
      status.classList.add('is-error');
    }
  });
  window.addEventListener('pagehide', () => { scoreResize?.disconnect(); stop(); }, { once: true });
}
