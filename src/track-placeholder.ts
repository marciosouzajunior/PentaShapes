const tracks: Record<string, { level: string; title: string; description: string }> = {
  '/track/frases': {
    level: 'INTERMEDIÁRIO',
    title: 'Frases com intenção',
    description: 'Esta trilha está em preparação. Em breve, você poderá praticar motivos, pausas e variações com acompanhamento.',
  },
  '/track/harmonia': {
    level: 'AVANÇADO',
    title: 'Harmonia jazzística',
    description: 'Esta trilha está em preparação. Ela vai explorar conexão entre acordes, tensão e resolução com prática guiada.',
  },
};

export function renderTrackPlaceholder(app: HTMLDivElement, pathname: string): void {
  const track = tracks[pathname.replace(/\/+$/, '')];
  app.innerHTML = `
    <a class="skip-link" href="#main">Ir para o conteúdo</a>
    <header class="header"><a class="brand" href="/" aria-label="PentaShapes, início"><span class="brand-mark" aria-hidden="true">p</span><span>PentaShapes</span></a></header>
    <main id="main" class="placeholder-page">
      <p class="eyebrow">${track?.level ?? 'TRILHAS'}</p>
      <h1>${track?.title ?? 'Trilha não encontrada'}</h1>
      <p>${track?.description ?? 'Volte à página inicial para ver as trilhas disponíveis.'}</p>
      <div class="placeholder-actions"><a class="start-link" href="/#tracks">Voltar às trilhas <span aria-hidden="true">←</span></a><a class="placeholder-secondary" href="/lesson/">Praticar a primeira lição</a></div>
    </main>
  `;
}
