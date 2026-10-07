import '../components/fretboard.mjs';
import { STANDARD_TUNING } from '../components/music.mjs';

const board = document.querySelector('#lesson-board');
const comparison = document.querySelector('#comparison-board');
const controls = Object.fromEntries(['tonic', 'scale', 'region', 'labels', 'handedness'].map(id => [id, document.getElementById(id)]));
const naturalRegion = document.querySelector('#natural-region');
let mode = 'natural';
if (window.matchMedia('(max-width: 600px)').matches) naturalRegion.value = '0,4';

function update() {
  const natural = mode === 'natural';
  const [startFret, endFret] = mode === 'phrase' ? [5, 8] : (natural ? naturalRegion.value : controls.region.value).split(',').map(Number);
  controls.labels.querySelector('[value="degree"]').disabled = natural;
  if (natural && controls.labels.value === 'degree') controls.labels.value = 'letter';
  const tonic = mode === 'phrase' ? 9 : Number(controls.tonic.value);
  const scaleId = mode === 'phrase' ? 'minorPentatonic' : controls.scale.value;
  board.configuration = {
    tonic, scaleId, startFret, endFret,
    handedness: controls.handedness.value, labelMode: controls.labels.value,
    viewMode: natural ? 'natural' : 'scale', focusStrings: natural ? ['a', 'e_low'] : [],
    positions: mode === 'phrase' ? [
      { stringId: 'e_high', fret: 5 }, { stringId: 'e_high', fret: 8 }, { stringId: 'b', fret: 5 },
    ] : null,
  };
  document.querySelector('#explore-settings').hidden = mode !== 'explore';
  document.querySelector('#natural-settings').hidden = !natural;
  document.querySelector('#workspace').classList.toggle('natural-map', natural);
  document.querySelector('#range-label').textContent = `${startFret === 0 ? 'SOLTAS ATÉ A CASA ' : 'CASAS ' + startFret + '–'}${endFret}`;
  document.querySelector('#scroll-guidance').hidden = endFret - startFret < 6;
  const rootName = { 9: 'Lá', 7: 'Sol', 0: 'Dó' }[tonic];
  const rootLetter = { 9: 'A', 7: 'G', 0: 'C' }[tonic];
  document.querySelector('#context-label').textContent = natural ? 'CONHEÇA SEU INSTRUMENTO' : mode === 'phrase' ? 'PRIMEIRA FRASE · LÁ MENOR' : 'EXPLORAÇÃO LIVRE';
  document.querySelector('#context-pill').textContent = natural ? 'ABC' : rootLetter + (scaleId === 'minorPentatonic' ? 'm' : '');
  document.querySelector('#practice-title').textContent = natural ? 'Notas naturais no braço.' : mode === 'phrase' ? 'Três notas já são um começo.' : `Encontre novos caminhos em ${rootName}.`;
  document.querySelector('#objective').textContent = natural ? 'A corda mais fina fica em cima. Comece pelas duas cordas graves, destacadas em azul.' : mode === 'phrase'
    ? 'Use Lá, Dó e Mi. Experimente uma pequena frase e termine em Lá.'
    : 'Escolha uma região e descubra as notas. O aro azul marca o centro musical que você escolheu.';
  document.querySelector('#note-feedback').textContent = 'Toque em uma nota para ver sua posição.';
  comparison.configuration = {
    tonic: 0, scaleId: 'majorPentatonic', startFret: 5, endFret: 8,
    tuning: STANDARD_TUNING.slice(0, 3), labelMode: controls.labels.value, handedness: controls.handedness.value,
  };
  document.querySelector('#comparison-feedback').textContent = 'Casas 5–8 · Cordas 1, 2 e 3';
}

for (const button of document.querySelectorAll('[data-mode]')) {
  button.addEventListener('click', () => {
    mode = button.dataset.mode;
    for (const sibling of document.querySelectorAll('[data-mode]')) sibling.setAttribute('aria-pressed', String(sibling === button));
    update();
  });
}
for (const control of Object.values(controls)) control.addEventListener('change', update);
naturalRegion.addEventListener('change', update);

function describe(note) {
  return `${note.name} (${note.letter}) · ${note.stringNumber}ª corda, ${note.fret === 0 ? 'corda solta' : `casa ${note.fret}`} · ${note.degree === null ? 'Nota natural.' : note.isRoot ? 'Tônica: seu ponto de repouso.' : `Grau ${note.degree} em relação à tônica.`}`;
}
board.addEventListener('fret-select', event => { document.querySelector('#note-feedback').textContent = describe(event.detail); });
comparison.addEventListener('fret-select', event => { document.querySelector('#comparison-feedback').textContent = describe(event.detail); });

for (const id of ['preview-fluid', 'preview-mobile']) {
  document.getElementById(id).addEventListener('click', () => {
    document.querySelector('#workspace').classList.toggle('mobile-preview', id === 'preview-mobile');
    document.querySelector('#preview-fluid').setAttribute('aria-pressed', String(id === 'preview-fluid'));
    document.querySelector('#preview-mobile').setAttribute('aria-pressed', String(id === 'preview-mobile'));
    if (mode === 'natural') {
      naturalRegion.value = id === 'preview-mobile' ? '0,4' : window.matchMedia('(max-width: 600px)').matches ? '0,4' : '0,12';
      update();
    }
  });
}
update();
