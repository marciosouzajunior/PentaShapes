# Arquitetura e desenvolvimento

O app usa Vite, TypeScript, HTML e CSS. A entrada é `index.html`; `src/main.ts` seleciona a landing, as lições e as trilhas pela URL. O catálogo é local. Não há editor público, contas ou serviço remoto de publicação de trilhas.

## Organização

| Local | Responsabilidade |
| --- | --- |
| `src/tracks.ts`, `src/track-model.ts` | Trilhas de repertório e fundamentos, manifests e validação. |
| `src/content-catalog.ts`, `src/content-identity.ts` | Catálogo de navegação e identidade usada pelo progresso. |
| `src/song.ts`, `src/song-missions.ts` | Interface de missões e sequência de escuta, resposta ou acompanhamento. |
| `src/study-books.ts`, `src/study-reader.ts`, `src/study-model.ts` | Conteúdo e renderização da leitura e seus diagramas. |
| `src/lesson*.ts`, `src/minor-pentatonic.ts` | Lições de fundamentos, reprodução e conteúdo da trilha menor. |
| `src/song-audio.ts`, `src/song-expression.ts`, `src/study-samples.ts` | Áudio, curvas expressivas e amostras. |
| `src/progress.ts`, `src/practice-settings.ts` | Progresso e preferências locais. |
| `public/components/` | Motor musical puro e Web Component do braço. |
| `public/lab/` | Laboratório independente do braço. |
| `src/static/` | Arquivos copiados para a raiz do build: favicon, fontes e áudio. |
| `legacy/` | Aplicativo anterior, mantido como arquivo funcional, sem novas funcionalidades. |

Fundamentos ainda tem uma interface própria. A direção de evolução é usar o mesmo contrato declarativo de missões para fundamentos e repertório, evitando novos players por trilha.

## Execução e verificação

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

`check` executa TypeScript e os testes Node. O build repete essas verificações e gera `dist/`. Testes validam alturas, intervalos, durações, relações acorde–mapa, reprodução e progresso. Não substituem ouvir os exemplos, tocar as posições e conferir a interface em diferentes telas.

O laboratório pode ser servido separadamente por `node scripts/serve.mjs`: abra `/lab/` no endereço exibido. Esse servidor atende também `/legacy/` e o favicon compartilhado. Ele não executa o app TypeScript.

## Braço e diagramas

`public/components/music.mjs` calcula alturas, classes de notas, graus e posições. `fretboard.mjs` fornece `<penta-fretboard>` com Shadow DOM. A configuração descreve tônica, escala, região, rótulos, orientação e posições; o componente não controla currículo ou progresso.

`board.configuration` substitui a configuração inteira, valida antes de aplicar e limpa a seleção anterior. Use IDs de corda e alturas reais, sem inferir notas pela posição visual. A orientação canhota inverte o desenho, preservando IDs e alturas. Os eventos `fret-select` e `fret-activate` permitem que a aplicação responda à seleção e ao acionamento das notas.

Em `viewMode: 'natural'`, o mapa independe de tônica e não aceita rótulos de graus. Ligações de semitom são opcionais. As cores podem ser configuradas pelas propriedades CSS do componente; mantenha foco visível e informação que não dependa só da cor.

`src/piano-diagram.ts` fornece `pianoDiagram` e `pianoLayout` para ilustrações estáticas. Preserve alturas MIDI com oitava, use o mesmo recorte ao comparar intervalos e não interprete distância em pixels como distância musical. O componente aceita `from`, `to`, recorte MIDI, grafia e notas selecionadas.

## Publicação

O Firebase Hosting publica `dist/`, com fallback para `index.html` nas rotas do app. O build copia `legacy/` para `dist/legacy/`; arquivos estáticos existentes são servidos diretamente. O novo app fica em `/` e o anterior em `/legacy/`.

Pushes na `main` executam build e deploy de produção. A branch permite pushes normais de pessoas com permissão de escrita, mas bloqueia force push e exclusão. Contribuições externas chegam por fork e pull request, sem conceder escrita no repositório.

Pull requests para `main`, inclusive os de forks, executam a validação de tipos, testes e build em um workflow com permissão apenas de leitura e sem secrets de deploy. Contribuições externas podem exigir aprovação de execução no GitHub antes de rodar. A validação informa o resultado para revisão; não é um check obrigatório que impeça o push direto do mantenedor.

O preview Firebase continua separado e restrito a pull requests internos, pois usa secrets e permissões de escrita para publicar a prévia. Não use `pull_request_target` para executar código de contribuições externas com secrets. Não incluir credenciais, fontes privadas de autoria, caches ou backups no repositório.
