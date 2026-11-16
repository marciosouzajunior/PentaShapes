import { ui, localeHome, type Locale } from './locale';
export function renderBrand(locale:Locale='en'): string {
  return `<a class="brand" href="${localeHome(locale)}" aria-label="${ui(locale,'PentaShapes, home')}">
    <span class="brand-mark" aria-hidden="true">p</span>
    <span class="brand-name">Penta<span class="brand-name-light">Shapes</span></span>
  </a>`;
}
