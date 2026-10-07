# 01 — Funcionamento atual

Nota histórica: os caminhos `public/index.html`, `public/js/`, `public/css/`, `public/images/` e `public/presets/` abaixo descrevem a estrutura examinada antes do início da implementação. Esses arquivos agora estão em `legacy/` com os mesmos nomes internos; o Firebase foi ajustado para continuar publicando essa versão.

Diagnóstico em 6 de outubro de 2026, base `e4be80a`. Evidências: código do repositório e auditoria de dados executada com Node 22.18.0. Comportamentos de interface abaixo foram reconstruídos a partir do código; não houve validação no navegador nesta sessão.

## 1. O produto que existe

O PentaShapes é uma página estática para visualizar intervalos e posições de escalas no braço de guitarra/violão em afinação padrão. O usuário escolhe uma família de escala e clica em uma posição do braço para definir a tônica e a referência espacial. Pode ativar desenhos disponíveis, guardar configurações numa lista e alternar entre elas manualmente ou por tempo.

O programa **não calcula quais escalas são adequadas a uma harmonia fornecida**. A escolha musical é feita pelo usuário. Não recebe progressão de acordes, não infere tonalidade, não ouve o instrumento e não distingue intenção harmônica. “Scale Progression” é uma sequência de configurações visuais, não uma progressão harmônica ou curricular.

Não existem lições, metas, níveis, pontuação, autenticação, persistência, metrônomo, reprodução de notas, backing tracks, detecção de áudio ou validação da execução instrumental.

## 2. Inventário técnico

| Arquivo | Responsabilidade atual |
| --- | --- |
| `public/index.html` | Página única, opções de escala, cinco seletores de shapes, braço, tabela de progressão, reprodução, presets, SEO e Analytics |
| `public/js/jquery-2.1.3.js` | Dependência local do jQuery, carregada como script global |
| `public/js/scales.js` | Cinco objetos de famílias de escalas, com posições relativas e rótulos de intervalos |
| `public/js/main.js` | Matriz de notas, geração das células, seleção de tônica, renderização e seleção dos shapes |
| `public/js/scale-progression.js` | Estado da lista, snapshots de HTML, tabela, crossfade, timer e atalho de espaço |
| `public/presets/circle_of_fourths_minor.js` | Um preset com 12 snapshots completos do braço |
| `public/css/main.css` | Layout, desenho do braço e aparência dos estados |
| `public/css/utilities.css` | Checkboxes customizados e utilitários de espaçamento |
| `public/images/` | Favicon e fotografia usada na referência de compartilhamento social |
| `firebase.json` e `.firebaserc` | Hosting estático de `public/`, projeto padrão `pentashapes` |
| `.github/workflows/firebase-hosting-pull-request.yml` | Preview Firebase para PR do mesmo repositório |
| `.github/workflows/firebase-hosting-merge.yml` | Deploy no canal live em push para `main` |
| `README.md` e `LICENSE` | Apresentação em inglês, autoria e declaração de licença CC BY 4.0 |

Não há `package.json`, compilação, módulos ES, TypeScript, lint ou suíte de testes no legado. Os workflows fazem checkout e deploy, sem etapa de build/test. Sua presença não prova que credenciais e deploy remoto estejam operacionais hoje.

Ordem dos scripts: jQuery → escalas → interação principal → progressão → preset. Há dependências globais entre arquivos e handlers `onclick` gerados em strings. A página usa Google Analytics via `gtag`; não há eventos pedagógicos específicos. Firebase é usado como hospedagem, não como banco ou autenticação.

## 3. Representação do braço

- Seis cordas: `e_low`, `a`, `d`, `g`, `b`, `e_high`.
- Afinação grave → agudo: E–A–D–G–B–E. No desenho, Mi agudo fica em cima.
- Cada corda possui 17 entradas fixas: casas 1 a 17; `index = casa - 1`.
- Há 102 células clicáveis (`li`), criadas por concatenação de HTML.
- Corda solta aparece apenas como rótulo; não é uma célula selecionável.
- Notas usam letras e sustenidos. Não há bemóis enarmônicos, oitavas, MIDI, frequência ou afinação configurável.
- As classes `low-e`/`high-e` dos rótulos de cordas soltas estão invertidas em relação às cordas do container de notas; o texto E igual nas duas esconde essa inconsistência nominal.
- Cada célula tem `data-index`, `data-note`, `data-shape`, classes de estado e `onclick="renderShapes(corda,index)"`.

As matrizes conferem com a afinação padrão nas 102 posições. Isso foi verificado calculando `(classeDaCordaSolta + casa) mod 12`.

## 4. Catálogo musical implementado

“Âncora” abaixo é a corda na qual o clique inicial é aceito; não limita as cordas nas quais o desenho terá notas.

| Opção | Âncoras aceitas | Shapes retornados | Conteúdo |
| --- | --- | --- | --- |
| Roots | Todas | Sem shapes | Destaca ocorrências da nota escolhida |
| Chromatic | Mi grave | 1 | Um padrão cromático de 30 posições |
| Pentatonic Minor | Mi grave / Lá / Ré | 1 e 5 / 3 e 4 / 1 e 2 | Graus 1, ♭3, 4, 5, ♭7 |
| Pentatonic Major | Mi grave / Lá / Ré | 1 e 5 / 3 e 4 / 1 e 2 | Graus 1, 2, 3, 5, 6 |
| Blues | Mi grave | 1, 2 e 3 | Pattern 1, Albert King Box e BB King Box |
| Ionian | Mi grave / Lá / Ré | 1 e 5 / 3 e 4 / 1 e 2 | Graus 1, 2, 3, 4, 5, 6, 7 |

`Roots` é um tratamento especial em `main.js`, não um objeto de `scales`. Major, Minor, Dorian, Phrygian, Lydian, Mixolydian, Aeolian e Locrian aparecem desabilitados e não têm implementação própria. Ionian já representa a estrutura intervalar da escala maior, apesar da opção “Major” desabilitada.

Nas pentatônicas, os rótulos são Shape 1 (E), 2 (D), 3 (C), 4 (A), 5 (G). São referências de desenho; não são notas tônicas, digitação de dedos ou uma sequência de ensino. Não existe camada que desenhe acordes CAGED ou explique sua relação com os padrões.

### Estrutura dos dados

```text
scales[scaleId][anchorString][shapeId] = [
  { string: targetString, offset: deslocamentoEmCasas, label: grau }
]
```

Exemplo: pentatônica menor, âncora Mi grave na casa 5 (A), índice 4. A entrada `{string: 'b', offset: 3, label: '♭7'}` seleciona Si na casa 8, nota G, sétima menor de A.

O mesmo shape pode ter uma segunda descrição para outra âncora. Há 22 arrays de desenhos, totalizando 301 entradas: cromática 30; pentatônica menor 72; maior 72; blues 26; Ionian 101. A soma conta descrições repetidas de posições, não 301 notas únicas.

Os offsets vão de −4 a +8 no catálogo. Se a casa resultante não tiver célula no DOM, a seleção jQuery fica vazia e a posição desaparece silenciosamente. Não há reposicionamento por oitava ou aviso de shape cortado nas bordas.

### Particularidades importantes

- A cromática usa `p4`, `p5`, `∆2`, `∆3`, `∆6`, `∆7`, `♭2` etc.; as outras famílias usam números simples e bemóis. Falta legenda.
- Os graus `1` e `8` recebem destaque de tônica. O rótulo `8` não cria uma identidade de oitava no modelo.
- O blues Pattern 1 contém a pentatônica menor com ♭5. Albert King Box é um recorte de seis posições. BB King Box contém **1, 2, ♭3, 4, 5 e 6**, não o mesmo conjunto da escala blues de seis notas. Deve ser tratado como vocabulário/box estilístico, não como fórmula canônica da escala blues.
- A auditoria confirmou a coerência de semitons dos 301 rótulos em relação às âncoras. Não certifica que os nomes estilísticos/CAGED sejam os mais adequados ou que uma digitação seja confortável.

## 5. Fluxos e regras efetivas

### Inicialização

O script cria as notas e registra a troca de escala. Seleciona automaticamente `penta_min`, mas não escolhe tônica. Os cinco checkboxes e Reset começam desabilitados. O comando de reset da seleção automática é disparado antes de seu handler ser registrado; o estado inicial depende do HTML e das células criadas.

### Trocar escala

O evento chama Reset e, caso existam `shape_labels`, atualiza os cinco textos e esconde os que não tenham rótulo. Se não houver `shape_labels`, não restaura textos nem visibilidade. Assim, trocar de Blues para Ionian pode deixar nomes de boxes e shapes ocultos da seleção anterior.

### Clicar no braço

1. Lê a escala do select e busca a nota na matriz pela corda/índice.
2. Atualiza imediatamente o texto Root.
3. Em Roots, chama `activateNotes` e encerra.
4. Nas demais escalas, verifica se a corda está entre as chaves do objeto.
5. Se inválida, mostra `alert` e retorna, após já ter alterado Root.
6. Se válida, remove o estado de instrução, habilita Reset, limpa marcações e oculta todas as notas.
7. Para cada shape da âncora, habilita/marca seu checkbox e aplica seus offsets.
8. Troca o nome de nota pelo intervalo, define classe/cor, torna a célula visível e registra os shapes associados a ela.

As notas compartilhadas acumulam IDs separados por vírgula. O último rótulo aplicado vence no texto; não há tratamento de conflito. Todas as posições desenhadas continuam acionando a mesma seleção de tônica quando clicadas.

### Selecionar shapes

`shapeClick` percorre células e considera a nota ativa quando pelo menos um dos IDs de `data-shape` está marcado. Isso implementa a união dos shapes selecionados. Desmarcar não oculta a nota: altera suas classes para o estado inativo. A classe `active-root` não é removida nesse fluxo, permitindo coexistência de tônica e inatividade.

### Reset

Restaura nomes de notas, remove classes de atividade/tônica, limpa `data-shape`, mostra todas as células, desmarca/desabilita checkboxes e volta à instrução de escolher tônica. Não limpa a progressão, não interrompe rotação, não reinicia seu índice e não normaliza labels ocultos dos shapes.

### Roots

Destaca todas as células cujo `data-note` coincide com a nota clicada. Não limpa a seleção anterior. Clicar A e depois C acumula ambos os destaques, embora Root passe a indicar somente C.

### Adicionar à progressão

O único requisito validado é Root não ter a classe `info-message`. O objeto adicionado contém:

```text
{ index, scaleId, scaleName, root, shapeIds, html }
```

`shapeIds` é uma string separada por `, `; `html` é o `innerHTML` completo de `.notes`. O array fica apenas na memória da página. Permite duplicatas e configuração sem shapes marcados. Não guarda âncora, índice de tônica ou dados musicais suficientes para reconstituir o desenho sem HTML.

### Tabela e seleção de item

`updateProgressionTable` apaga/recria o `tbody` e registra handlers de remover e selecionar. A numeração exibida é calculada pela posição atual; `item.index` não é usado para renderizar e pode ficar desatualizado após exclusões.

Selecionar uma linha marca `selected`, faz crossfade para o HTML salvo, altera escala e Root sem disparar `change`, e só habilita os shapes salvos como marcados. Shapes disponíveis mas desmarcados na captura não ficam reativáveis nessa restauração. Nomes e visibilidade dos labels podem ficar incompatíveis com o item carregado.

`crossfadeNotes` cria uma `div` temporária dentro de `.notes`, desvanece filhos antigos em 500 ms e mantém a nova `div` como wrapper após remover sua classe temporária. Capturas posteriores podem guardar wrappers aninhados. A lógica não serializa cliques rápidos nem cancela animações anteriores.

Remover usa `splice` e redesenha a tabela. Após remover o último item, a mensagem inicial de vazio não é reconstruída. Não há edição, reordenação, confirmação ou desfazer.

### Rotação automática e espaço

- Play exige pelo menos dois itens; Stop encerra o `setInterval` e o círculo de progresso.
- Duração padrão: cinco segundos. Campo HTML: mínimo um. Leitura real: `parseFloat(valor) || 5`, sem clamp.
- Zero/vazio retornam ao padrão; valores negativos continuam possíveis na lógica. O atributo `min` não valida o valor antes da chamada.
- O primeiro item do cursor é mostrado imediatamente; os seguintes usam intervalo fixo em segundos.
- `currentIndex` é global e não reinicia no Stop, no carregamento de preset ou na remoção.
- Clique manual em uma linha não sincroniza `currentIndex`.
- Editar Interval durante a reprodução não atualiza o timer já criado; passa a valer ao iniciar outra rotação.
- A barra de espaço chama diretamente `playCurrentRow`, inclusive em campos, com lista vazia ou rotação parada. Não equivale a Play/Pause.
- Sem linhas, o cálculo do próximo índice usa módulo zero e produz `NaN`. Com a linha inicial vazia, o espaço pode avançar o indicador sem tocar nada. Alterações na lista durante execução não revalidam tamanho/índice.
- O círculo é uma transição CSS com raio 7, sincronizada por duração; não representa batidas ou compassos. O código declara um timeout de animação que não chega a agendar.

Não há som nem relógio musical. “Play” significa trocar a visualização, não executar música.

### Preset de quartas

O único preset disponível é `circleOfFourthsMinor`, com a sequência:

```text
A → D → G → C → F → A# → D# → G# → C# → F# → B → E → A ...
```

Todos usam pentatônica menor. Shapes salvos: 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3. O ciclo progride em quartas justas por classe de altura; uma escrita contextual poderia preferir Bb, Eb e Ab em parte do percurso.

Load substitui toda a lista em memória por uma cópia superficial do array do preset. Não seleciona a primeira linha, não para a reprodução e não redefine o cursor. A existência de qualquer seleção não vazia faz carregar esse mesmo array; não existe registro genérico de presets. O preset maior aparece desabilitado.

O arquivo tem 184.827 bytes no checkout examinado; cada item embute as 102 células, incluindo estados e estilos. A auditoria leu 12 × 102 células e verificou os intervalos das células com classes de atividade. Há células com `active-root` e `inactive` simultâneas em 11 dos 12 itens. Esse formato transporta estado visual antigo, não apenas a intenção musical.

## 6. Problemas encontrados e impacto

Todos os problemas desta tabela foram identificados por inspeção do código; as evidências de dados foram verificadas também pelo script. As sequências são propostas de reprodução para a futura checagem no navegador.

| Prioridade | Problema / reprodução | Efeito provável ou determinado pelo código |
| --- | --- | --- |
| Alta | Selecionar opção vazia e clicar uma nota | `Object.keys(undefined)` interrompe renderização |
| Alta | Escolher tônica válida, depois clicar corda inválida | Root muda, desenho anterior permanece; pode salvar identificação musical incorreta |
| Alta | Escolher uma casa perto das extremidades | Parte do desenho some sem explicação |
| Alta | Alternar famílias com/sem labels ou selecionar item da lista | Controles com nomes/visibilidade herdados da escala anterior |
| Alta | Remover/carregar lista durante rotação; espaço com lista vazia | Cursor inválido, ausência de parada automática e indicador desacoplado do conteúdo |
| Média | Roots: escolher duas notas em sequência | Destaques acumulam; Root descreve somente a última |
| Média | Desmarcar shape ou abrir preset | Coexistência de tônica e inatividade; distinção visual depende da cascata CSS |
| Média | Salvar item com parte dos shapes desmarcados e reabrir | Não consegue reativar todos os desenhos disponíveis pela restauração |
| Média | Seleções rápidas durante crossfade | Risco de disputa entre callbacks e estado transitório capturado em HTML; requer teste de navegador |
| Média | Reabrir a página | Perda integral da lista e das escolhas |
| Média | Usar teclado | Células `li` sem semântica interativa; checkboxes com `display:none`; espaço global interfere em campos |
| Média | Usar tela pequena | Braço fixo em 1.200 px, margens de 100 px e painel de 600 px; sem adaptação responsiva encontrada |

Não foram feitas medições de performance, contraste ou latência. O relato de experiência “pesada” é compatível com a carga de escolhas, notação sem explicação e largura rígida; não há evidência suficiente para atribuí-lo a lentidão computacional.

## 7. O que aproveitar

| Ativo | Reaproveitamento recomendado |
| --- | --- |
| Ideia de mostrar graus no braço | Núcleo visual e musical das futuras lições |
| Afinação e intervalos auditados | Fixtures para comparar o novo motor |
| Padrões pentatônicos e suas relações espaciais | Converter para dados normalizados, com revisão musical/digitação |
| Conceito de sequência e ciclo de quartas | Exercícios futuros de transposição e prática livre |
| Tônica com destaque | Manter com rótulo/forma, além de cor |
| Hosting estático e domínio | Candidatos a permanecer; adaptar pipeline se houver build |
| Autoria e referências | Preservar atribuições; registrar origem de novos áudios e diagramas |

Substituir a persistência de HTML, o estado inferido por classes, os timers desacoplados, handlers inline, duplicações de dados e layout fixo. Bugs conhecidos não devem virar requisitos de compatibilidade.

Os comentários em `scales.js` citam diagramas de Rob Silver, Jazz Guitar Licks, Guitar Tricks e Discover Guitar Online. São referências registradas no legado; não foram auditadas como currículo nem estabelecem qual foi o vídeo tutorial original informado pelo autor.
