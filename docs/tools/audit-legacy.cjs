// Read-only characterization of the legacy musical data. Run: node docs/tools/audit-legacy.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const evaluate = (file, expression) => vm.runInNewContext(`${read(file)}\n${expression}`, {}, { timeout: 1000 });
const scales = evaluate('legacy/js/scales.js', 'scales');
const preset = evaluate('legacy/presets/circle_of_fourths_minor.js', 'circleOfFourthsMinor');
const main = read('legacy/js/main.js');
const notes = vm.runInNewContext(`${main.slice(0, main.indexOf('for (var i'))}\nnotes`, {}, { timeout: 1000 });
const tuning = { e_low: 4, a: 9, d: 2, g: 7, b: 11, e_high: 4 };
const intervals = { '1': 0, '8': 0, '♭2': 1, '2': 2, '∆2': 2, '♭3': 3, '3': 4, '∆3': 4, '4': 5, p4: 5, '♭5': 6, '5': 7, p5: 7, '♭6': 8, '6': 9, '∆6': 9, '♭7': 10, '7': 11, '∆7': 11 };
const pitch = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const mod = n => ((n % 12) + 12) % 12;
const errors = [];
let entries = 0;
const catalog = {};
for (const [id, scale] of Object.entries(scales)) {
  catalog[id] = { labels: scale.shape_labels || null, anchors: {} };
  for (const [anchor, shapes] of Object.entries(scale)) {
    if (anchor === 'shape_labels') continue;
    catalog[id].anchors[anchor] = {};
    for (const [shape, data] of Object.entries(shapes)) {
      const offsets = data.map(n => n.offset);
      catalog[id].anchors[anchor][shape] = { entries: data.length, offsetRange: [Math.min(...offsets), Math.max(...offsets)], degrees: [...new Set(data.map(n => n.label))] };
      for (const n of data) {
        entries++;
        const actual = mod(tuning[n.string] - tuning[anchor] + n.offset);
        if (actual !== intervals[n.label]) errors.push({ id, anchor, shape, ...n, actual });
      }
    }
  }
}
const fretboardErrors = [];
for (const [string, data] of Object.entries(notes)) data.forEach((note, index) => {
  if (pitch[mod(tuning[string] + index + 1)] !== note) fretboardErrors.push({ string, index, note });
});
const presetSummary = preset.map(item => {
  const strings = [...item.html.matchAll(/data-string="([^"]+)"[^>]*><ul>([\s\S]*?)<\/ul>/g)];
  let cells = 0, highlighted = 0, rootAlsoInactive = 0;
  const mismatches = [];
  for (const [, string, html] of strings) for (const [, attributes, label] of html.matchAll(/<li\b([^>]*)>([^<]*)<\/li>/g)) {
    cells++;
    const classes = attributes.match(/class="([^"]*)"/)?.[1].split(/\s+/) || [];
    if (!classes.includes('active') && !classes.includes('active-root')) continue;
    highlighted++;
    if (classes.includes('active-root') && classes.includes('inactive')) rootAlsoInactive++;
    const index = Number(attributes.match(/data-index="(\d+)"/)?.[1]);
    const actual = mod(tuning[string] + index + 1 - pitch.indexOf(item.root));
    if (intervals[label] !== actual) mismatches.push({ string, index, label, actual });
  }
  return { index: item.index, root: item.root, scaleId: item.scaleId, scaleName: item.scaleName, shapeIds: item.shapeIds, htmlBytes: Buffer.byteLength(item.html), strings: strings.length, cells, highlighted, rootAlsoInactive, mismatches };
});
const invalidPresetStructure = presetSummary.filter(item => item.strings !== 6 || item.cells !== 102);
const report = { fretboard: { strings: Object.keys(notes).length, fretsPerString: notes.e_low.length, errors: fretboardErrors }, catalog, intervalEntriesChecked: entries, intervalErrors: errors, invalidPresetStructure, preset: presetSummary };
const summary = { fretboardCellsChecked: Object.values(notes).reduce((total, row) => total + row.length, 0), fretboardErrors: fretboardErrors.length, intervalEntriesChecked: entries, intervalErrors: errors.length, presetItems: preset.length, presetCellsChecked: presetSummary.reduce((total, item) => total + item.cells, 0), presetIntervalErrors: presetSummary.reduce((total, item) => total + item.mismatches.length, 0), invalidPresetStructure: invalidPresetStructure.length, presetRoots: presetSummary.map(item => item.root), presetRootAlsoInactive: presetSummary.map(item => item.rootAlsoInactive) };
console.log(JSON.stringify(process.argv.includes('--summary') ? summary : report, null, 2));
if (fretboardErrors.length || errors.length || invalidPresetStructure.length || summary.presetIntervalErrors || preset.length !== 12) process.exitCode = 1;
