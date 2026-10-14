import { buildFretboard, noteAt, positionKey } from './music.mjs';

const stylesheet = `
  :host { display:block; min-width:0; color:var(--fretboard-ink,#10152f); font-family:inherit; }
  * { box-sizing:border-box; }
  .scroll { max-width:100%; overflow-x:auto; overflow-y:hidden; padding:8px 4px 14px; scrollbar-width:none; overscroll-behavior-inline:contain; }
  .scroll::-webkit-scrollbar { display:none; }
  .board { --body-gutter:48px; position:relative; display:grid; grid-template-columns:48px repeat(var(--frets),minmax(44px,1fr)); width:min(100%,var(--fretboard-width,calc(96px + var(--frets) * 64px))); min-width:calc(96px + var(--frets) * 44px); padding-right:var(--body-gutter); margin-inline:auto; isolation:isolate; }
  :host([demo]) .scroll { padding-inline:0; }
  .board::before { content:''; position:absolute; z-index:5; top:0; left:48px; right:var(--body-gutter); height:calc(var(--strings) * 44px); border:1px solid #cbd4e3; border-radius:12px 0 0 12px; pointer-events:none; -webkit-mask-image:linear-gradient(to right,#000 0%,#000 92%,transparent 100%); mask-image:linear-gradient(to right,#000 0%,#000 92%,transparent 100%); }
  .board.left::before { left:var(--body-gutter); right:48px; border-radius:0 12px 12px 0; -webkit-mask-image:linear-gradient(to left,#000 0%,#000 92%,transparent 100%); mask-image:linear-gradient(to left,#000 0%,#000 92%,transparent 100%); }
  @media (max-width:360px) { .board { --body-gutter:32px; width:min(100%,calc(80px + var(--frets) * 64px)); min-width:calc(80px + var(--frets) * 44px); } }
  .board.left { grid-template-columns:repeat(var(--frets),minmax(44px,1fr)) 48px; padding-right:0; padding-left:var(--body-gutter); }
  .number { padding-top:8px; height:30px; text-align:center; font-size:11px; font-weight:600; color:#646878; }
  :host([demo]) .number { padding-top:12px; font-weight:500; color:#8b95a8; }
  .string-label { height:44px; display:flex; flex-direction:column; align-items:flex-end; padding-right:10px; justify-content:center; font-size:12px; font-weight:650; color:#646878; }
  .left .string-label { align-items:flex-start; padding-right:0; padding-left:12px; }
  :host([demo]) .string-label { padding-right:17px; font-size:11px; font-weight:500; color:#8b95a8; }
  :host([demo]) .left .string-label { padding-right:0; padding-left:17px; }
  .cell { position:relative; height:44px; background:var(--fretboard-surface,#fff); }
  .cell::before { content:''; position:absolute; z-index:1; left:0; right:0; top:calc(50% - var(--thickness) / 2); height:var(--thickness); background:#7d859d; pointer-events:none; }
  .cell.body-edge::before { -webkit-mask-image:linear-gradient(to right,#000 0%,#000 68%,transparent 100%); mask-image:linear-gradient(to right,#000 0%,#000 68%,transparent 100%); }
  .board.left .cell.body-edge::before { -webkit-mask-image:linear-gradient(to left,#000 0%,#000 68%,transparent 100%); mask-image:linear-gradient(to left,#000 0%,#000 68%,transparent 100%); }
  .cell::after { content:''; position:absolute; z-index:2; top:0; bottom:0; right:-1px; width:2px; background:#bac2d8; pointer-events:none; }
  .left .cell::after { right:auto; left:-1px; }
  .cell.body-edge::after { display:none; }
  .semitone-link { position:absolute; z-index:0; top:6px; height:32px; left:calc(50% - 16px); width:calc(100% + 32px); border-radius:18px; background:var(--fretboard-link,#d8e3ff); pointer-events:none; }
  .note { position:relative; z-index:3; display:grid; place-items:center; padding:0; width:100%; height:44px; min-width:44px; border:0; background:transparent; cursor:pointer; color:var(--fretboard-ink,#10152f); font:inherit; touch-action:manipulation; }
  .note.open-note { width:48px; justify-self:center; }
  .board.has-open .string-label { align-items:center; padding-inline:0; }
  .board.open-only { grid-template-columns:48px; width:96px; min-width:96px; }
  .board.open-only::before,.board.open-only::after { display:none; }
  .dot { position:relative; display:grid; place-items:center; width:28px; height:28px; border:2px solid #9ca6be; border-radius:50%; background:#fff; font-family:Inter,Arial,Helvetica,sans-serif; font-size:14px; font-weight:600; line-height:1; }
  .emphasized .dot,.root .dot { color:var(--fretboard-note-ink,#fff); background:var(--fretboard-note,#3156e8); border-color:var(--fretboard-note,#3156e8); }
  .root .dot { color:#10152f; background:#fff; border-color:#9ca6be; outline:2px solid var(--fretboard-note,#3156e8); outline-offset:3px; }
  .chord .dot { color:#182239; background:var(--fretboard-chord,#edf4f2); border-color:#9bafac; }
  .target .dot { font-weight:800; }
  .target:not(.root) .dot::after { content:''; position:absolute; left:50%; bottom:-9px; width:4px; height:4px; border-radius:50%; background:#182239; transform:translateX(-50%); }
  .context .dot { border-style:var(--fretboard-context-border-style,dashed); }
  .note.playing .dot { animation:note-flash var(--flash-duration,1100ms) ease-in-out both; }
  :host([demo]) .root .dot { outline:none; }
  @keyframes note-flash {
    0% { color:#10152f; background:#fff; border-color:#9ca6be; box-shadow:0 0 0 0 #3156e800; transform:scale(1); }
    28% { color:#fff; background:#3156e8; border-color:#3156e8; box-shadow:0 0 0 4px #3156e855,0 0 14px 4px #3156e833; transform:scale(1.13); }
    58% { color:#fff; background:#3156e8; border-color:#3156e8; box-shadow:0 0 0 5px #3156e833,0 0 18px 5px #3156e822; transform:scale(1.09); }
    100% { color:#10152f; background:#fff; border-color:#9ca6be; box-shadow:0 0 0 8px #3156e800; transform:scale(1); }
  }
  .note:hover .dot { border-color:#10152f; }
  .note-annotation { position:absolute; top:1px; left:calc(50% + 12px); color:#657188; font:10px Manrope,Arial,sans-serif; white-space:nowrap; pointer-events:none; }
  .note:focus-visible { outline:2px solid #10152f; outline-offset:-2px; border-radius:8px; }
  .marker { height:16px; display:flex; align-items:center; justify-content:center; gap:4px; }
  .marker i { display:block; width:6px; height:6px; border-radius:50%; background:#bac2d8; }
  :host([demo]) .marker { height:0; }
  :host([demo]) .marker i { display:none; }
  .empty { margin:12px 4px; font-size:14px; }
  @media (prefers-reduced-motion:reduce) { .note.playing .dot { animation:none; transform:none; box-shadow:none; color:#fff; background:#3156e8; border-color:#3156e8; } }
  @media (forced-colors:active) { .dot { border:1px solid ButtonText; } .chord .dot { border:3px double ButtonText; } .target .dot::after { background:ButtonText; } .root .dot { outline:3px double ButtonText; } .note.playing .dot { animation:none; outline:3px solid Highlight; outline-offset:2px; } }
`;

/** Reusable view: receives musical configuration, emits fret-activate, owns no lesson/progress. */
export class PentaFretboard extends HTMLElement {
  #configuration = {};
  #model;
  #highlighted = new Set();

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.addEventListener('click', event => {
      const button = event.target.closest('button[data-position]');
      if (!button) return;
      const note = this.#model.rows.flatMap(row => row.notes).find(n => positionKey(n) === button.dataset.position);
      this.dispatchEvent(new CustomEvent('fret-activate', { detail: { ...note }, bubbles: true, composed: true }));
    });
  }

  connectedCallback() {
    this.#render();
  }

  set configuration(value) {
    const next = structuredClone(value);
    const model = buildFretboard(next);
    this.#configuration = next;
    this.#model = model;
    this.#render();
  }

  get configuration() {
    return structuredClone(this.#configuration);
  }

  set highlightedPosition(value) {
    this.highlightedPositions = value ? [value] : [];
  }

  set highlightedPositions(values) {
    this.#highlighted = new Set(values.map(positionKey));
    for (const button of this.shadowRoot.querySelectorAll('button[data-position]')) {
      button.classList.toggle('playing', this.#highlighted.has(button.dataset.position));
    }
  }

  #render() {
    this.#model = buildFretboard(this.#configuration);
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
    const frets = this.#model.frets.filter(fret => fret > 0);
    const board = make('div', `board ${this.#model.handedness}${this.#model.startFret === 0 ? ' has-open' : ''}${frets.length ? '' : ' open-only'}`);
    board.style.setProperty('--frets', frets.length);
    board.style.setProperty('--strings', this.#model.rows.length);
    const appendRow = (label, cells) => board.append(...(this.#model.handedness === 'left' ? [...cells, label] : [label, ...cells]));
    let visibleCount = 0;
    const makeNote = (note, string, outside = false) => {
      visibleCount++;
      const button = make('button', `note${outside ? ' open-note' : ''}${note.isRoot ? ' root' : ''}${note.emphasized ? ' emphasized' : ''} ${note.roles.join(' ')}${this.#highlighted.has(positionKey(note)) ? ' playing' : ''}`);
      button.type = 'button';
      button.dataset.position = positionKey(note);
      const role = note.isRoot ? ', tônica' : note.degree ? `, grau ${note.degree}` : ', nota natural';
      const roleLabels = { chord: 'nota do acorde', target: 'nota-alvo', context: 'nota contextual' };
      button.setAttribute('aria-label', `${string.number}ª corda, ${note.fret === 0 ? 'solta' : `casa ${note.fret}`}, ${note.name}${role}${note.roles.map(item => ', ' + roleLabels[item]).join('')}${note.emphasized ? ', corda em destaque' : ''}`);
      button.append(make('span', 'dot', note[this.#model.labelMode]));
      const annotation=(this.#configuration.annotations??[]).find(item=>item.stringId===note.stringId&&item.fret===note.fret);
      if(annotation){
        const mark=make('span','note-annotation',annotation.label);
        mark.setAttribute('aria-hidden','true');button.append(mark);
        button.title=annotation.description;
        button.setAttribute('aria-label',button.getAttribute('aria-label')+', '+annotation.description);
      }
      return button;
    };
    this.#model.rows.forEach(({ string, notes }, row) => {
      const openNote = notes.find(note => note.fret === 0);
      const openPitch = noteAt(string, 0);
      const label = openNote?.visible
        ? makeNote(openNote, string, true)
        : make('span', 'string-label', string.id === 'e_high' && openPitch.letter === 'E' ? 'e' : openPitch.letter);
      label.title = string.name;
      const frettedNotes = notes.filter(note => note.fret > 0);
      const cells = frettedNotes.map((note, col) => {
        const bodyEdge = this.#model.handedness === 'left' ? col === 0 : col === frettedNotes.length - 1;
        const cell = make('div', `cell${bodyEdge ? ' body-edge' : ''}`);
        cell.style.setProperty('--thickness', `${1 + row * 0.3}px`);
        if (note.linkNext) {
          const link = make('span', 'semitone-link');
          link.setAttribute('aria-hidden', 'true');
          cell.append(link);
        }
        if (note.visible) cell.append(makeNote(note, string));
        else cell.setAttribute('aria-hidden', 'true');
        return cell;
      });
      appendRow(label, cells);
    });
    appendRow(make('span', 'number'), frets.map(fret => make('span', 'number', fret)));
    appendRow(make('span'), frets.map(fret => {
      const marker = make('span', 'marker');
      marker.setAttribute('aria-hidden', 'true');
      if ([3, 5, 7, 9].includes(fret % 12)) marker.append(make('i'));
      if (fret % 12 === 0) marker.append(make('i'), make('i'));
      return marker;
    }));
    scroll.append(board);
    this.shadowRoot.replaceChildren(style, scroll);
    if (!visibleCount) this.shadowRoot.append(make('p', 'empty', 'Nenhuma nota neste recorte. Escolha outra região.'));
    scroll.scrollLeft = scrollLeft;
  }
}

if (!customElements.get('penta-fretboard')) customElements.define('penta-fretboard', PentaFretboard);
