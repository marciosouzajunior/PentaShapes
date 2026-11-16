import { lessons } from './lesson-content';
export const foundationLessons = lessons;

export type FoundationLessonId = (typeof foundationLessons)[number]['id'];

export function renderLessonSelector(currentId: FoundationLessonId): string {
  return `<label class="lesson-picker">Lições da trilha
    <select id="lesson-select" aria-label="Lições da trilha">
      ${foundationLessons.map(lesson => `<option value="${lesson.href}" ${lesson.id === currentId ? 'selected' : ''}>${lesson.number} · ${lesson.title}${'preview' in lesson ? ' · prévia' : ''}</option>`).join('')}
    </select>
  </label>`;
}

export function renderLessonPager(currentId: FoundationLessonId): string {
  const index = foundationLessons.findIndex(lesson => lesson.id === currentId);
  const next = foundationLessons[index + 1];
  if (!next) return '';
  return `<nav class="lesson-pager" aria-label="Navegação entre lições">
    <a href="${next.href}" rel="next"><span>Próxima →</span><strong>${next.number} · ${next.title}</strong></a>
  </nav>`;
}

export function bindLessonSelector(app: HTMLElement): void {
  app.querySelector<HTMLSelectElement>('#lesson-select')?.addEventListener('change', event => {
    const select = event.currentTarget as HTMLSelectElement;
    if (foundationLessons.some(lesson => lesson.href === select.value)) window.location.assign(select.value);
  });
}
