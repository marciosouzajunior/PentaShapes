import { buildFretboard, noteAt, positionKey } from './music.mjs';

const stylesheet = `
  :host { display:block; min-width:0; color:var(--fretboard-ink,#10152f); font-family:inherit; }
  * { box-sizing:border-box; }
  .scroll { max-width:100%; overflow-x:auto; overflow-y:hidden; padding:8px 4px 14px; scrollbar-width:none; overscroll-behavior-inline:contain; }
  .scroll::-webkit-scrollbar { display:none; }
  .board { position:relative; display:grid; grid-template-columns:48px repeat(var(--frets),minmax(44px,1fr)); width:min(100%,calc(48px + var(--frets) * 64px)); min-width:calc(48px + var(--frets) * 44px); margin-inline:auto; isolation:isolate; }
  .board.left { grid-template-columns:repeat(var(--frets),minmax(44px,1fr)) 48px; }
  .board.has-open::after { content:''; position:absolute; z-index:4; top:0; left:calc(48px + (100% - 48px) / var(--frets) - 3px); width:6px; height:calc(var(--strings) * 44px); border-radius:3px; background:#11162f; pointer-events:none; }
  .board.left.has-open::after { left:auto; right:calc(48px + (100% - 48px) / var(--frets) - 3px); }
  .number { padding-top:8px; height:30px; text-align:center; font-size:11px; font-weight:600; color:#646878; }
  .string-label { height:44px; display:flex; flex-direction:column; align-items:flex-end; padding-right:10px; justify-content:center; font-size:12px; font-weight:650; color:#646878; }
  .left .string-label { align-items:flex-start; padding-right:0; padding-left:12px; }
  .cell { position:relative; height:44px; background:var(--fretboard-surface,#fff); }
  .cell::before { content:''; position:absolute; z-index:1; left:0; right:0; top:calc(50% - var(--thickness) / 2); height:var(--thickness); background:#7d859d; pointer-events:none; }
  .cell::after { content:''; position:absolute; z-index:2; top:0; bottom:0; right:-1px; width:2px; background:#bac2d8; pointer-events:none; }
  .left .cell::after { right:auto; left:-1px; }
  .cell.open::after { display:none; }
  .cell.open::before { left:50%; }
  .left .cell.open::before { left:0; right:50%; }
  .semitone-link { position:absolute; z-index:0; top:6px; height:32px; left:calc(50% - 16px); width:calc(100% + 32px); border-radius:18px; background:var(--fretboard-link,#d8e3ff); pointer-events:none; }
  .note { position:relative; z-index:3; display:grid; place-items:center; padding:0; width:100%; height:44px; min-width:44px; border:0; background:transparent; cursor:pointer; color:var(--fretboard-ink,#10152f); font:inherit; touch-action:manipulation; }
  .dot { display:grid; place-items:center; width:28px; height:28px; border:2px solid #9ca6be; border-radius:50%; background:#fff; font-family:Arial,Helvetica,sans-serif; font-size:13px; font-weight:700; line-height:1; }
  .emphasized .dot,.root .dot { color:var(--fretboard-note-ink,#fff); background:var(--fretboard-note,#3156e8); border-color:var(--fretboard-note,#3156e8); }
  .root .dot { outline:2px solid var(--fretboard-note,#3156e8); outline-offset:3px; }
  .note[aria-pressed=true] .dot { border:3px solid #10152f; }
  .note.playing .dot { color:#fff; background:#3156e8; border-color:#3156e8; box-shadow:0 0 0 5px #a9bbff; transform:scale(1.08); }
  :host([demo]) .root .dot { color:#10152f; background:#fff; border-color:#9ca6be; outline:none; }
  :host([demo]) .note.playing .dot { animation:demo-flash var(--flash-duration,430ms) ease-in-out both; }
  @keyframes demo-flash {
    0% { color:#10152f; background:#fff; border-color:#9ca6be; box-shadow:0 0 0 0 #3156e800; transform:scale(1); }
    28% { color:#fff; background:#3156e8; border-color:#3156e8; box-shadow:0 0 0 4px #3156e855,0 0 14px 4px #3156e833; transform:scale(1.13); }
    58% { color:#fff; background:#3156e8; border-color:#3156e8; box-shadow:0 0 0 5px #3156e833,0 0 18px 5px #3156e822; transform:scale(1.09); }
    100% { color:#10152f; background:#fff; border-color:#9ca6be; box-shadow:0 0 0 8px #3156e800; transform:scale(1); }
  }
  .note:hover .dot { border-color:#10152f; }
  .note:focus-visible { outline:3px solid #263c88; outline-offset:-3px; border-radius:8px; }
  .marker { height:16px; display:flex; align-items:center; justify-content:center; gap:4px; }
  .marker i { display:block; width:6px; height:6px; border-radius:50%; background:#bac2d8; }
  :host([demo]) .marker { height:0; }
  :host([demo]) .marker i { display:none; }
  .hint { margin:8px 4px 0; color:#59667b; font-size:12px; line-height:1.6; }
  .empty { margin:12px 4px; font-size:14px; }
  @media (prefers-reduced-motion:reduce) { :host([demo]) .note.playing .dot { animation:none; transform:none; box-shadow:none; color:#fff; background:#3156e8; border-color:#3156e8; } }
  @media (forced-colors:active) { .dot { border:1px solid ButtonText; } .root .dot { outline:3px double ButtonText; } :host([demo]) .note.playing .dot { animation:none; outline:3px solid Highlight; outline-offset:2px; } }
`;

/** Reusable view: receives musical configuration, emits fret-select, owns no lesson/progress. */
export class PentaFretboard extends HTMLElement {
  #configuration = {};
  #model;
  #selected = null;
  #highlighted = null;
  #showHint = true;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.addEventListener('click', event => {
      const button = event.target.closest('button[data-position]');
      if (!button) return;
      const note = this.#model.rows.flatMap(row => row.notes).find(n => positionKey(n) === button.dataset.position);
      this.#selected = positionKey(note);
      for (const node of this.shadowRoot.querySelectorAll('button[data-position]')) {
        node.setAttribute('aria-pressed', String(node === button));
      }
      this.dispatchEvent(new CustomEvent('fret-select', { detail: { ...note }, bubbles: true, composed: true }));
    });
    this.shadowRoot.addEventListener('keydown', event => this.#navigate(event));
  }

  connectedCallback() {
    this.#render();
  }

  set configuration(value) {
    const next = structuredClone(value);
    const model = buildFretboard(next);
    this.#configuration = next;
    this.#model = model;
    this.#selected = null;
    this.#render();
  }

  get configuration() {
    return structuredClone(this.#configuration);
  }

  set highlightedPosition(value) {
    this.#highlighted = value ? positionKey(value) : null;
    for (const button of this.shadowRoot.querySelectorAll('button[data-position]')) {
      button.classList.toggle('playing', button.dataset.position === this.#highlighted);
    }
  }

  set showHint(value) {
    this.#showHint = Boolean(value);
    this.#render();
  }

  #navigate(event) {
    const button = event.target.closest('button[data-position]');
    if (!button || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const row = Number(button.dataset.row);
    const col = Number(button.dataset.col);
    const buttons = [...this.shadowRoot.querySelectorAll('button[data-position]')];
    let candidates;
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      candidates = buttons.filter(n => Number(n.dataset.row) === row);
      if (event.key === 'ArrowLeft') candidates = candidates.filter(n => Number(n.dataset.col) < col).reverse();
      if (event.key === 'ArrowRight') candidates = candidates.filter(n => Number(n.dataset.col) > col);
      if (event.key === 'End') candidates.reverse();
    } else {
      const direction = event.key === 'ArrowUp' ? -1 : 1;
      candidates = buttons.filter(n => (Number(n.dataset.row) - row) * direction > 0);
      candidates.sort((a, b) => Math.abs(Number(a.dataset.row) - row) - Math.abs(Number(b.dataset.row) - row) || Math.abs(Number(a.dataset.col) - col) - Math.abs(Number(b.dataset.col) - col));
    }
    event.preventDefault();
    candidates[0]?.focus();
  }

  #render() {
    this.#model = buildFretboard(this.#configuration);
    const focused = this.shadowRoot.activeElement?.dataset.position;
    const scrollLeft = this.shadowRoot.querySelector('.scroll')?.scrollLeft ?? 0;
    const make = (tag, className, text) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (text !== undefined) element.textContent = text;
      return element;
    };
    const style = make('style');
    style.textContent = stylesheet;
    const scroll = make('div', 'scroll');
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', `Braço do instrumento, casas ${this.#model.startFret} a ${this.#model.endFret}`);
    const board = make('div', `board ${this.#model.handedness}${this.#model.startFret === 0 ? ' has-open' : ''}`);
    board.style.setProperty('--frets', this.#model.frets.length);
    board.style.setProperty('--strings', this.#model.rows.length);
    const appendRow = (label, cells) => board.append(...(this.#model.handedness === 'left' ? [...cells, label] : [label, ...cells]));
    let visibleCount = 0;
    this.#model.rows.forEach(({ string, notes }, row) => {
      const openNote = noteAt(string, 0);
      const label = make('span', 'string-label', string.id === 'e_high' && openNote.letter === 'E' ? 'e' : openNote.letter);
      label.title = string.name;
      const cells = notes.map((note, col) => {
        const cell = make('div', `cell${note.fret === 0 ? ' open' : ''}`);
        cell.style.setProperty('--thickness', `${1 + row * 0.3}px`);
        if (note.linkNext) {
          const link = make('span', 'semitone-link');
          link.setAttribute('aria-hidden', 'true');
          cell.append(link);
        }
        if (note.visible) {
          visibleCount++;
          const button = make('button', `note${note.isRoot ? ' root' : ''}${note.emphasized ? ' emphasized' : ''}${this.#highlighted === positionKey(note) ? ' playing' : ''}`);
          button.type = 'button';
          button.dataset.position = positionKey(note);
          button.dataset.row = row;
          button.dataset.col = col;
          button.setAttribute('aria-pressed', String(this.#selected === positionKey(note)));
          const role = note.isRoot ? ', tônica' : note.degree ? `, grau ${note.degree}` : ', nota natural';
          button.setAttribute('aria-label', `${string.number}ª corda, ${note.fret === 0 ? 'solta' : `casa ${note.fret}`}, ${note.name}${role}${note.emphasized ? ', corda em destaque' : ''}`);
          button.append(make('span', 'dot', note[this.#model.labelMode]));
          cell.append(button);
        } else cell.setAttribute('aria-hidden', 'true');
        return cell;
      });
      appendRow(label, cells);
    });
    appendRow(make('span', 'number'), this.#model.frets.map(fret => make('span', 'number', fret === 0 ? 'Solta' : fret)));
    appendRow(make('span'), this.#model.frets.map(fret => {
      const marker = make('span', 'marker');
      marker.setAttribute('aria-hidden', 'true');
      if ([3, 5, 7, 9].includes(fret % 12)) marker.append(make('i'));
      if (fret > 0 && fret % 12 === 0) marker.append(make('i'), make('i'));
      return marker;
    }));
    scroll.append(board);
    const hint = make('p', 'hint', 'Toque numa nota para ver sua posição. No teclado, use Tab e as setas; Enter seleciona.');
    this.shadowRoot.replaceChildren(style, scroll, ...(this.#showHint ? [hint] : []));
    if (!visibleCount) this.shadowRoot.append(make('p', 'empty', 'Nenhuma nota neste recorte. Escolha outra região.'));
    scroll.scrollLeft = scrollLeft;
    if (focused) [...this.shadowRoot.querySelectorAll('button')].find(n => n.dataset.position === focused)?.focus({ preventScroll: true });
  }
}

if (!customElements.get('penta-fretboard')) customElements.define('penta-fretboard', PentaFretboard);
