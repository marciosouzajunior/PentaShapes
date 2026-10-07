# 05 — Experiência e direção visual

Brief de redesign. A demonstração do braço em `/lab/` foi aprovada como referência visual pelo autor; as telas de lição e progresso ainda são propostas. Direção confirmada: leveza, formas arredondadas, minimalismo e acabamento sofisticado.

## 1. Princípio de interface

O ponto de entrada será uma ação musical clara: “Crie sua primeira frase com três notas”. Mostrar objetivo e próxima ação antes de apresentar opções de escala. A complexidade fica disponível conforme a tarefa pede. Na prática, título, instrução curta, braço e ação principal devem dominar a tela; controles avançados e conteúdo complementar ficam recolhidos ou em tela própria.

Manter uma aparência acolhedora e adulta: boa tipografia, espaço, superfícies claras, contraste e detalhes de cor. Evitar excesso de medalhas, confetes, gradientes, painéis e indicadores competindo com o braço.

## 2. Arquitetura de informação

| Área | Pergunta respondida | Prioridade |
| --- | --- | --- |
| Praticar | “O que faço agora?” | Entrada padrão com continuar/primeira lição |
| Minha trilha | “O que aprendi e o que vem depois?” | Módulos e lições com objetivo, estrelas e pré-requisitos |
| Explorar | “Posso experimentar por conta própria?” | Ferramenta secundária, fora do caminho obrigatório |
| Progresso e ajustes | “Está salvo? Como retomo?” | Backup, preferências, conquistas e redefinição |

O mapa da trilha deve ser uma lista progressiva legível, com grupos compactos. Um caminho sinuoso decorativo não pode dificultar encontrar a lição. Em celular, navegação curta e botão de continuar próximo do polegar; em desktop, aproveitar largura para texto e braço sem esticar excessivamente as casas.

Na landing page, as trilhas serão apresentadas como cards de escolha. Cada card responde rapidamente: “o que vou aprender?”, “para quem é?” e “qual o nível?”. Mostrar título, uma frase de promessa, nível (`Fundamentos`, `Intermediário` ou `Avançado`), duração aproximada da primeira sessão e ação principal. A trilha Fundamentos fica em primeiro lugar e recebe o tratamento de recomendação para quem ainda não iniciou; as demais permanecem visíveis para revelar possibilidades, com pré-requisitos claros.

Exemplo de card:

```text
FUNDAMENTOS                                      Iniciante
Crie suas primeiras frases
Aprenda a encontrar notas, usar pausas e resolver no acorde.
12 lições · 5–10 min por sessão
[ Começar ]
```

Os cards não devem exibir estrelas, árvores de desbloqueio, muitas tags ou uma lista de escalas. Ao abrir um card, a pessoa vê a promessa da trilha, o que precisa saber, uma amostra da primeira lição e o botão para começar. Em telas estreitas, usar uma coluna com cards compactos; se houver carrossel, ele deve permitir perceber o próximo card e funcionar com teclado e leitor de tela.

## 3. Telas essenciais

### Início / retorno

Card principal: “Continue sua primeira frase”, etapa e duração aproximada, botão “Continuar”. Abaixo: módulo atual e uma revisão sugerida. Primeira visita troca esse conteúdo por uma promessa curta e “Começar”. Não pedir cadastro, estilo, tom, escala e shape antes da primeira experiência.

Na tela de lição, manter uma navegação curta e persistente: voltar para a trilha, lição anterior e próxima lição. O botão seguinte deve mostrar o estado (“Próxima lição”, “Revisar lição” ou “Bloqueada: conclua L02”). A pessoa pode voltar para consultar uma explicação ou repetir um exercício sem perder o ponto salvo. Em celular, essas ações ficam próximas do polegar e não competem com o botão principal da prática.

O progresso salvo deve ser discreto e verificável: “Salvo neste navegador”. Falha recebe estado persistente com ação de exportar; não uma notificação que desaparece antes de ser lida.

O rodapé da landing page e a tela de configurações terão um link **Sobre o método**. Ele abre uma página curta com a promessa, as referências pedagógicas e os créditos. Na lição, referências específicas aparecem apenas dentro do painel opcional de teoria, sob o rótulo **Contexto e referências**. Não colocar bibliografia na área principal da prática.

### Lições

Título orientado a ação, objetivo em uma frase, prévia sonora, duração aproximada e materiais necessários. “Tocar em Lá menor” pode aparecer como contexto secundário, com explicação acessível. Mostrar requisitos quando a lição não estiver disponível, junto de um link para a anterior.

Cada lição terá uma camada opcional de teoria, aberta por um controle como **“Entender esta ideia”** ou **“Por que isso funciona?”**. A prática continua sendo o caminho principal; o conteúdo explicativo não aparece expandido por padrão durante a execução. Ao abrir, o praticante encontra um texto curto, um mapa mental visual e, quando fizer sentido, um exemplo sonoro lento. O primeiro nível deve caber em poucos segundos de leitura; links ou um segundo painel podem aprofundar a teoria sem interromper a lição.

O mapa mental deve conectar poucos elementos concretos: `acorde → notas-alvo → escala/coleção → frase → resolução`. Em uma lição de ii–V–I, por exemplo, pode mostrar `Dm7 → G7 → Cmaj7`, destacar a terça e a sétima de cada acorde e apontar o movimento `F → B` ou `F → E`. Evitar um glossário aberto com dezenas de termos, fórmulas e exceções na mesma tela. A explicação deve usar os nomes locais e as cifras internacionais que já aparecem no braço.

Essa camada pode usar recursos gráficos nativos e interativos quando eles reduzirem a carga de explicação:

- tabelas pequenas para comparar acorde, grau e função;
- diagramas de fluxo para mostrar tensão → movimento → resolução;
- miniaturas do braço com apenas as notas da lição;
- linhas do tempo para pulso, pausa e entrada da frase;
- setas de condução, como `F → E`, e conexões entre notas comuns;
- mapas mentais compactos para relacionar escala, acorde e frase;
- gráficos simples de progressão, como `ii → V → I` e o ciclo de quartas.

Cada visual deve ter uma pergunta que responde e aparecer no momento certo da lição. O braço continua sendo a representação principal quando a pergunta é “onde toco?”. Tabelas e diagramas explicam relações; não devem duplicar todas as notas do braço. Usar HTML/SVG acessível e texto equivalente, sem depender apenas de cor, animação ou imagem rasterizada.

**Direção gráfica aprovada:** os SVGs usados nos cards da landing page servem de inspiração para os elementos das lições. Eles comunicam uma ideia musical com formas simples, poucos elementos, espaço livre e cor contida. Novos diagramas devem seguir essa linguagem leve e intuitiva, adaptando o desenho à pergunta da lição em vez de repetir a mesma ilustração como decoração. Priorizar SVGs nítidos em qualquer escala, com rótulos legíveis, contraste adequado e descrição textual. Movimento curto pode guiar a atenção para uma relação ou sequência; a compreensão não deve depender da animação.

O estado aberto/fechado é preferência de interface, não evidência de aprendizagem. A lição não deve exigir a leitura do painel para avançar, mas pode sugerir sua abertura depois de uma tentativa: **“Quer entender o que acabou de ouvir?”** Em celular, o painel abre abaixo da prática; em desktop, pode ocupar uma coluna secundária sem reduzir o braço a alvos pequenos.

### Prática

Wireframe de conteúdo para L03:

```text
← Minha trilha                       Lição 3 de 12

Crie uma resposta com três notas
Use Lá, Dó e Mi. Termine sua frase em Lá.

[ Ouvir exemplo ]       Etapa 2 de 4: pratique

       Braço: apenas região das casas 5–8
       Laterais com notas das cordas + Lá / Dó / Mi no braço
       Lá destacado por cor, aro e rótulo

Agora é sua vez · 2 compassos
Pulso: 1  2  3  4       Acorde: Am (Lá menor)

[ Pausar ] [ Repetir ]           60 BPM   [ Ajustar ]

Ajuda: Onde coloco os dedos? / O que significa Am?
```

Durante execução, a ação principal é Pausar. Concluir/autoavaliar aparece ao final da rodada, com possibilidade de repetir. Não disputar atenção entre animação do braço e movimento contínuo de estrelas. O guia indica “escute” ou “sua vez”, permitindo tocar sem olhar cada segundo.

### Resultado

Apresentar o objetivo praticado, estrelas obtidas e a evidência correspondente. Exemplo: “Você concluiu a prática e confirmou que conseguiu terminar em Lá”. Ação principal: “Próxima lição”. Secundárias: “Repetir mais devagar” e “Ver minha trilha”.

Se a pessoa reportar dificuldade, oferecer recorte menor ou andamento menor; não exibir “fracassou”. Não dizer que “tocou perfeitamente” com base em tempo ou clique.

### Explorador

Oferecer tônica e família separadas da região do braço. Mostrar nome da nota ao lado do grau ou permitir alternância explícita. Disponibilidade dos desenhos é derivada dos dados atuais; não herdada de estado anterior. Sua função será descoberta e aplicação livre, sem necessidade de pontos.

## 4. Novo comportamento do braço

- Iniciar com recorte de 4–6 casas e poucas posições relevantes; ampliar quando a lição exigir.
- Numerar casas; na lateral, mostrar apenas as notas das cordas, como na referência aprovada. Usar números e nomes completos nas descrições acessíveis.
- Usar tamanho adaptável; em telas pequenas, navegar por regiões ou usar modo ampliado. Não encolher um braço de 17 casas até as notas virarem alvos minúsculos.
- Manter corda solta como casa 0 real no modelo, mesmo que a primeira trilha não a use.
- Notas com rótulos legíveis; tônica com aro e marca textual, notas do acorde com tratamento adicional consistente.
- Distinguir “nota fora do exercício”, “nota permitida”, “alvo atual” e “nota selecionada”. Não tratar todas as notas não usadas como erros musicais.
- Alternar nome/grau com explicação: `Lá (A)` e `1 — tônica`. Evitar `∆3` e outros símbolos sem legenda no início.
- Indicar dedos sugeridos somente quando útil e como informação distinta do grau musical. O número 1 não pode significar tônica e indicador no mesmo código visual.
- Modo canhoto muda apresentação, sem alterar alturas reais, IDs das cordas ou avaliações.
- Se houver animação de nota, fazê-la acompanhar a referência sonora. A tela não deve fingir rastrear o instrumento do usuário.
- Na primeira rodada, o botão **Ouvir exemplo** ilumina a sequência de notas junto com o áudio. Na rodada de imitação, a indicação visual pode ser reduzida depois de uma repetição. Em **Praticar com acompanhamento**, o braço permanece como mapa e os compassos como guia; não iluminar uma nota em tempo real sem reconhecimento de áudio.

## 5. Paleta e formas propostas

Paleta candidata para protótipo; validar contraste nas combinações reais, estados de foco e dispositivos antes da implementação final.

| Papel | Cor candidata | Uso |
| --- | --- | --- |
| Fundo | `#F7F8FC` | Base clara, sem branco agressivo em toda a página |
| Superfície | `#FFFFFF` | Cards e área de prática |
| Texto principal | `#182239` | Instruções, títulos e notas |
| Texto secundário | `#536078` | Contexto, descrições e metadados |
| Ação principal | `#5145CD` | Botão continuar, foco de percurso |
| Progresso | `#087F72` | Estados concluídos, com ícone/texto |
| Tônica / destaque | `#3156E8` | Destaque azul adotado no braço aprovado |
| Fundo suave de destaque | `#EEEAFE` | Apoio visual e trechos explicativos |
| Borda | `#D8DEEA` | Divisores decorativos; controles exigem contraste próprio |

Botões arredondados, cards com raio de aproximadamente 16–24 px e espaçamento baseado em múltiplos de 4/8 px. Evitar sombras no braço. Notas circulares com contorno firme preservam o reconhecimento do instrumento; regiões podem usar fundos suaves, sem textura pesada de madeira.

Tipografia inicial com pilha de fontes do sistema para rapidez e consistência. Corpo a partir de 16 px; títulos com hierarquia clara; evitar excesso de caixa alta ou espaçamento entre letras. Os símbolos musicais precisam de fonte fallback adequada.

## 6. Acessibilidade e ergonomia

- Alvos de toque de aproximadamente 44 × 44 px como meta de design, inclusive área acionável ao redor da nota quando o desenho for menor.
- Botões semânticos, labels associados, foco visível e navegação de teclado no braço. Descrever posição: “Primeira corda, casa 5, Lá, tônica”.
- Contraste de texto normal de pelo menos 4,5:1 e texto grande de 3:1, conforme [WCAG 2.2 — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Não considerar uma paleta validada antes de medir as combinações.
- Cor nunca é o único sinal de tônica, conclusão, erro ou bloqueio.
- Respeitar preferência de movimento reduzido; transições curtas e sem flashes. Estado não depende de animação terminar.
- Áudio controlável, com instruções e notação visual equivalentes. Exercícios auditivos devem explicar sua natureza; oferecer atividades visuais quando o som estiver indisponível sem afirmar equivalência de treinamento auditivo.
- Atalhos apenas no contexto de prática, nunca interceptando digitação ou controles nativos indiscriminadamente.
- Estados de carregamento, erro sonoro, progresso não salvo, vazio e offline recebem conteúdo explícito. Offline integral não é promessa do MVP sem estratégia de cache implementada.
- Conferir uso com zoom de 200%, teclado, orientação canhota, telas estreitas e celular apoiado enquanto a pessoa segura o instrumento.

## 7. O que validar no próximo protótipo

Produzir três telas com conteúdo real: início, L03 e resultado. Testar se o praticante entende o objetivo sem conhecer CAGED ou o nome dos shapes, encontra a posição, inicia o áudio e sabe quando é sua vez.

Comparar a legibilidade de notas por nome versus grau; testar o recorte do braço em celular vertical; observar alcance dos controles e distração das recompensas. Validar depois a tela da trilha e o painel de backup.

A demonstração do braço e a linha visual geral foram aprovadas pelo autor. A página `/lab/` continua sendo uma demonstração; seu conteúdo foi reduzido para deixar objetivo, modos e braço em primeiro plano. As telas de lição, resultado e progresso ainda precisam ser construídas e avaliadas.
