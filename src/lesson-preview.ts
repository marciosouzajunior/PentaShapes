import { bindLessonSelector, foundationLessons, renderLessonPager, renderLessonSelector, type FoundationLessonId } from './lesson-navigation';
import './lesson.css';
import { renderBrand } from './brand';

export function renderLessonPreview(app: HTMLDivElement, lessonId: FoundationLessonId): void {
  const lesson = foundationLessons.find(item => item.id === lessonId);
  if (!lesson || !('preview' in lesson)) throw new Error('Prévia de lição desconhecida.');

  app.innerHTML = `
    <a class="skip-link" href="#lesson-main">Ir para a lição</a>
    <header class="header lesson-header">${renderBrand()}${renderLessonSelector(lessonId)}</header>
    <main id="lesson-main" class="lesson-layout">
      <div class="lesson-intro">
        <p class="eyebrow">FUNDAMENTOS · ${lesson.number}</p>
        <h1>${lesson.title}</h1>
        <p>Esta é uma prévia da navegação entre lições. O exercício musical desta etapa ainda está em preparação.</p>
      </div>
      <div class="lesson-preview-panel">
        <span class="lesson-preview-number">${lesson.number}</span>
        <p class="eyebrow">PRÉVIA</p>
        <h2>A prática vem em breve</h2>
        <p>Estamos definindo as notas, o áudio e a orientação desta lição. Por enquanto, use o seletor ou os links abaixo para experimentar a navegação da trilha.</p>
      </div>
      ${renderLessonPager(lessonId)}
    </main>
  `;
  bindLessonSelector(app);
}
