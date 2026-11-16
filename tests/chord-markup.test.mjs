import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';

const vite=await createServer({configFile:false,logLevel:'silent',optimizeDeps:{noDiscovery:true},server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
after(()=>vite.close());
const {tracksForLocale}=await vite.ssrLoadModule('/src/track-locales.ts');
const {studyTextMarkup}=await vite.ssrLoadModule('/src/study-reader.ts');

test('both current catalogs mark qualified chords explicitly throughout mission prose',()=>{
  for(const locale of ['pt-BR','en'])for(const track of tracksForLocale(locale)){
    const prose=track.lessons.flatMap(lesson=>[
      lesson.instruction,lesson.mission?.playInstruction,lesson.mission?.scene.text,lesson.mission?.scene.followup,
    ]);
    for(const book of track.guide.lessons)for(const page of book.pages){
      prose.push(...page.paragraphs,page.practice,page.insight?.text);
    }
    for(const text of prose.filter(Boolean)){
      const unmarked=text.replace(/\[\[(?:note|degree|chord):[^\]]+\]\]/g,'');
      // In Portuguese, unmarked Em can be a preposition; the chord requires explicit markup.
      const qualified=/(?<![\p{L}\p{N}_])([A-G][#♯♭]?(?:(?:maj|min|dim|aug|sus|m)\d*|\d+(?:[#♯♭]\d+)?)(?:\/[A-G][#♯♭]?)?)(?![\p{L}\p{N}_])/gu;
      for(const match of unmarked.matchAll(qualified)){
        if(locale==='pt-BR'&&match[1]==='Em')continue;
        assert.fail(`${locale}: unmarked ${match[1]} in ${text}`);
      }
    }
  }
});

test('the chord-scale-motif instruction highlights Dm, Em and Cm equally in both languages',()=>{
  for(const locale of ['pt-BR','en']){
    const track=tracksForLocale(locale).find(track=>!track.manifest.musicalWork);
    const lesson=track.lessons.find(lesson=>lesson.blocks.includes('shape-dm'));
    const html=studyTextMarkup(lesson.mission.playInstruction,locale);
    for(const chord of ['Dm','Em','Cm'])assert.ok(html.includes(`music-token--chord">${chord}</span>`));
    assert.doesNotMatch(html,/\[\[chord:/);
  }
});
