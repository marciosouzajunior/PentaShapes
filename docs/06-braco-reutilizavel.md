# 06 — Nova base do braço: implementação e verificação

Atualização de 7 de outubro de 2026. A versão original foi movida para `legacy/index.html`; a demonstração do braço continua em `public/lab/index.html`, e a nova entrada está em `index.html`. Não houve deploy.

## Decisão: reaproveitar a ideia e as referências musicais

O desenho antigo não foi reaproveitado como componente. Sua geometria fixa, dependência de jQuery, handlers inline e estado em HTML exigiriam alterações substanciais para sustentar lições. As notas e intervalos auditados continuam úteis como referência de regressão.

Foi criado um motor musical puro e uma visualização independente. A interface recebe configuração musical e emite seleção de nota. Não controla escala escolhida pelo aluno, progresso, pontuação, áudio ou regras de lição.

Para esta fatia foi usado um Web Component nativo, sem dependências ou build. Isso permite experimentá-lo na hospedagem estática atual e integrá-lo ao shell Vite + TypeScript decidido para a primeira fatia. Uma futura adoção de React ou outra stack continua possível porque o componente não depende dela.

## Arquivos

| Arquivo | Papel |
| --- | --- |
| `public/components/music.mjs` | Afinação, altura MIDI, nome, grau, geração de posições e validação |
| `public/components/fretboard.mjs` | `<penta-fretboard>`, estilos isolados, seleção e navegação de teclado |
| `public/lab/index.html` | Demonstração com exercício de três notas e exploração |
| `public/lab/lab.mjs` | Configuração de duas instâncias independentes e controles |
| `public/lab/lab.css` | Layout responsivo e direção visual aplicada à demonstração |
| `tests/music.test.mjs` | Doze grupos de testes do domínio, incluindo comparação com 301 entradas do legado e mapa de notas naturais |
| `scripts/serve.mjs` | Servidor local sem dependências, restrito a `public/`, `legacy/` e loopback |

## Como abrir

Na raiz do repositório, usando Node:

```powershell
rtk proxy node scripts/serve.mjs
```

- Nova demonstração: [http://127.0.0.1:4173/lab/](http://127.0.0.1:4173/lab/).
- Legado: [http://127.0.0.1:4173/legacy/](http://127.0.0.1:4173/legacy/).
- Uma porta alternativa pode ser passada como argumento: `rtk proxy node scripts/serve.mjs 4174`.

Usar HTTP local, não abrir o HTML diretamente via `file:`, pois os módulos precisam ser servidos pelo navegador.

## Contrato do componente

```html
<script type="module" src="/components/fretboard.mjs"></script>
<penta-fretboard id="board"></penta-fretboard>
```

Depois de o módulo ter sido carregado:

```javascript
await customElements.whenDefined('penta-fretboard');
const board = document.querySelector('#board');
board.configuration = {
  tonic: 9,                    // classe de altura: C=0, A=9
  scaleId: 'minorPentatonic',  // ou majorPentatonic, roots
  startFret: 5,
  endFret: 8,
  labelMode: 'name',          // name, letter, degree
  handedness: 'right',        // right, left
  positions: [               // null = todas as notas da escala no recorte
    { stringId: 'e_high', fret: 5 },
    { stringId: 'e_high', fret: 8 },
    { stringId: 'b', fret: 5 }
  ]
};
board.addEventListener('fret-select', ({ detail }) => {
  // detail contém corda, casa, MIDI, pitchClass, nome, letra, grau e isRoot.
  // A aplicação decide como responder; o braço não muda a tônica ao clicar.
  console.log(detail);
});
```

`configuration` substitui a configuração inteira, com defaults para campos omitidos; não faz merge implícito. Uma configuração inválida lança erro antes de substituir a anterior. O getter devolve uma cópia. O chamador deve tratar erros caso receba conteúdo externo.

`tuning` opcional recebe cordas com `{id, number, midi, name}`. A ordem da lista define a ordem vertical, normalmente agudo acima. Permite recortar cordas e usar outra afinação. A demonstração usa EADGBE, e uma segunda instância mostra só as cordas 1–3 em C maior pentatônica.

Casas suportadas: 0–24; a casa 0 é corda solta real. Os offsets duplicados do legado foram substituídos por cálculo de notas. Uma posição explícita fora da região ou da escala é rejeitada; não some silenciosamente. Uma região sem posições válidas apresenta mensagem vazia. Trocar configuração limpa seleção anterior.

Limites atuais do domínio: nomes cromáticos com sustenidos e graus genéricos; não há grafia contextual completa de bemóis, catálogo CAGED, arpejos ou boxes estilísticos. Para acrescentar novas famílias, ampliar fórmulas e testes; não reintroduzir snapshots HTML.

## Layout e interação implementados

- Região padrão de quatro casas, sem largura fixa de 1.200 px.
- Células com pelo menos 44 px de largura e 44 px de altura; notas de 28 px com toda a célula acionável. A largura fica limitada a 64 px por casa para não esticar recortes curtos.
- Recortes longos têm rolagem interna no braço, preservando o tamanho das notas.
- Controles quebram linha; telas estreitas usam fluxo vertical. Consultas de container adaptam também a prévia de 390 px.
- Orientação canhota inverte a ordem visual das casas e a lateral das etiquetas, sem trocar IDs ou alturas das cordas.
- Notas acionadas por botões, nomes acessíveis, Enter/Espaço nativos e setas/Home/End dentro do braço.
- Tônica tem aro e identificação textual acessível além de cor.
- Rótulos em nomes locais, cifras ou graus.
- Seleção atualizada por evento; textos dinâmicos inseridos com `textContent`, sem serialização de estado em HTML.
- Estilos internos isolados por Shadow DOM. Cores principais podem ser ajustadas por propriedades CSS `--fretboard-ink`, `--fretboard-surface`, `--fretboard-note`, `--fretboard-note-ink` e `--fretboard-link`.

## Referência visual incorporada

**Ajuste posterior solicitado pelo autor:** remover as faixas suaves entre notas e o halo de seleção da demonstração; compactar o braço. As ligações de semitom permanecem como capacidade opcional do componente, desativada por padrão e na demonstração. A descrição abaixo registra a origem visual; o exemplo com `showSemitoneLinks: true` serve apenas para ativar essa opção explicitamente.

Após a imagem enviada pelo autor, o componente passou a usar fundo branco, notas circulares brancas com borda cinza, texto escuro, cordas cinza com espessura progressiva, trastes claros, pestana escura e números de casas abaixo do braço. Os destaques usam azul; a marca e os textos do material de referência não foram reproduzidos.

A demonstração inicia em **Conheça o braço**, com notas naturais até a casa 12. Em telas de até 600 px, o recorte inicial vai das soltas à casa 4; as demais regiões e o mapa completo continuam disponíveis no seletor. A seleção de “Largura mobile” também oferece esse recorte menor. Nos modos de escala/frase, a tônica agora usa aro azul.

Configuração adicional para o mapa da referência:

```javascript
board.configuration = {
  viewMode: 'natural',
  labelMode: 'letter',
  startFret: 0,
  endFret: 12,
  focusStrings: ['a', 'e_low'],
  showSemitoneLinks: true
};
```

`viewMode: 'natural'` mostra as classes C/D/E/F/G/A/B independentemente da tônica configurada. Nesse modo não há destaque de tônica nem graus tonais; `labelMode: 'degree'` é rejeitado. `focusStrings` define quais cordas recebem círculos azuis. `showSemitoneLinks` liga apenas notas visíveis, adjacentes na mesma corda, dos pares B–C e E–F, inclusive através da oitava e em orientação canhota. As ligações param nos limites do recorte.

O mapa de 0–12 em afinação padrão contém 48 posições naturais, 16 nas duas cordas destacadas e 12 ligações de semitom. Esses números e a inversão canhota foram conferidos pelos três novos grupos de testes. A validação visual em navegador continua pendente pelo bloqueio já registrado.

A prévia “Largura mobile” reduz o container a 390 px; não emula um aparelho, viewport, zoom, toque ou comportamento de navegador móvel. O layout implementado ainda precisa da validação visual abaixo.

## O que foi verificado e o que não foi

Executado:

```powershell
rtk proxy node --test tests/music.test.mjs
```

Doze grupos passaram: os nove originais de afinação/oitavas, pentatônicas nos 12 centros, A/C/E da lição, rejeição de recorte inválido, orientação canhota, relativas com graus distintos, não acumulação de tônicas, afinações/cordas parciais, entradas inválidas e comparação com 301 entradas antigas (alguns temas compartilham um grupo); mais três grupos para conteúdo, ligações e validação do mapa natural.

Também foram verificadas sintaxe dos módulos e entrega dos arquivos pelo servidor HTTP local. Isso não executa nem comprova o comportamento do componente no DOM.

A tentativa inicial de automação do navegador falhou com erro de conexão/confiança do cliente (`privileged native pipe bridge is not available; browser-client is not trusted`). Posteriormente, a nova entrada foi verificada no navegador local por outra interface de automação. O laboratório anterior ainda não recebeu a mesma revisão visual completa.

**Não concluído:** teste por cliques, screenshots, leitura por tecnologia assistiva, contraste renderizado, overflow real, zoom e celular real. Os problemas do legado seguem classificados como achados de código, não como reproduções confirmadas no navegador.

## Roteiro de aceitação visual pendente

| Cenário | Resultado esperado |
| --- | --- |
| 320, 375, 390, 768 e 1.280 px | Página sem overflow horizontal; texto e controles utilizáveis |
| Conheça o braço | Naturais; duas cordas graves azuis; ligações B–C e E–F; casas abaixo; sem tônica atribuída |
| Primeira frase | Somente A5 e C8 na primeira corda, E5 na segunda; aro azul em A |
| Clique em C8 | Feedback: Dó, primeira corda, casa 8, grau ♭3; contexto continua Am |
| Alterar rótulos | Mesmo conjunto de posições, agora com cifras ou graus corretos |
| Alterar orientação | Casas invertidas e etiquetas na outra lateral; alturas preservadas |
| Explorar / trocar centro e família | Render novo sem resíduos de tônicas anteriores |
| Soltas até casa 4 | Casa 0 identificada; soltas calculadas corretamente |
| Braço até casa 17 | Rolagem dentro do braço e ajuda para reduzir recorte; página não se alarga |
| Duas instâncias | Selecionar nota numa delas não altera a outra |
| Tab, setas, Home/End, Enter | Foco visível e seleção coerente; nenhum atalho global captura campos |
| Zoom 200% e dispositivo móvel | Legibilidade, foco e áreas de toque preservados |
| Legado | Validar separadamente os casos do diagnóstico 01, sem afirmar que foram corrigidos pela nova demonstração |

Esta fatia entrega somente a nova base visual/musical. Não implementa áudio, trilha, estrelas, progresso ou autenticação, e não modifica os controles antigos. A próxima integração deve usar o componente em uma lição completa e passar por validação visual antes de substituir a entrada principal.
