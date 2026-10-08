# 08 — Início da implementação

Data: 7 de outubro de 2026. Decisão: continuar no mesmo repositório. O histórico, a auditoria musical e o componente de braço seguem úteis; não há motivo técnico para abrir outro repositório agora.

## Estrutura atual

| Local | Papel |
| --- | --- |
| `legacy/` | App anterior completo, preservado para consulta e para a publicação atual |
| `public/components/` | Cálculo musical e braço reutilizável, com testes |
| `public/lab/` | Demonstração visual aprovada do braço |
| `src/` e `index.html` | Nova experiência Vite/TypeScript em construção |
| `dist/` | Saída local do build; não é publicada ainda |

A nova landing apresenta o propósito, as trilhas previstas e um exemplo visual do braço: [esta frase](https://www.jazzguitar.be/blog/the-lick/) em Ré menor, D–E–F–G–E–C–D, destaca cinco posições entre as casas 5 e 8, sem áudio automático ou controles de lição. O botão “Começar agora” abre a L01; após iniciar, passa a “Continuar lição”, usando `localStorage` versionado. A L01 tem um player com BPM de 40 a 200, 1 a 16 compassos, indicador de quatro pulsos, exemplo sonoro com Lá no primeiro tempo e modo de prática com base e pulso. Clicar na nota do braço toca e anima o Lá; apenas a L01 registra progresso. Ainda faltam uma sequência completa de lições, estrelas, backup e avaliações musicais. Os cartões usam ilustrações vetoriais originais e exibem nível, título, resumo e link. O primeiro abre L01; os outros abrem páginas temporárias que avisam que o conteúdo está em preparação.

O Firebase publica `legacy/`, agora na raiz do domínio, mantendo a experiência antiga até a nova fatia vertical ser validada. Os workflows executam a checagem e o build da nova interface antes da publicação do legado. A troca da pasta de hospedagem para `dist/` será uma decisão explícita de lançamento, após L01–L03, progresso e revisão de mobile/acessibilidade.

## Executar

```powershell
npm ci
npm run dev
npm run check
npm run build
node scripts/serve.mjs
```

O servidor Vite abre a nova interface; o último comando abre `/lab/` e `/legacy/` em `http://127.0.0.1:4173`. `npm run check` inclui TypeScript e 17 testes. A auditoria do legado continua disponível com `node docs/tools/audit-legacy.cjs --summary`.

## Próximo incremento

### Atualização de 8 de outubro: L10–L12 e fechamento do catálogo de Fundamentos

As 12 lições estão implementadas no catálogo, com rotas, seletor, exemplos, prática, explicação opcional de graus, uma pergunta opcional por lição e conclusão manual. Isso fecha a implementação do conteúdo previsto, não a revisão para publicação.

- L10 alterna Am7 e Dm7 a cada dois compassos. A/C são alvos comuns. F, na 2ª corda/casa 6, aparece somente sobre Dm7 com os papéis context/chord/target; não é incorporado à pentatônica. O centro do mapa permanece A, e o texto distingue ♭6 de A de ♭3 de D.
- L11 compara Am7 e C em blocos separados. O mapa mantém as mesmas cinco posições, enquanto centro, graus, tônica e papéis mudam: A menor pentatônica e C maior pentatônica. O exemplo termina em A ou C conforme o trecho; não apresenta a relação como mero início de uma sequência por outra nota.
- L12 reúne motivo, variação, pausa, alvos comuns e conexão com a casa 10 numa jam autoral de 16 compassos. Am7/Dm7 alternam a cada dois compassos. O exemplo utiliza F uma vez sobre Dm7; a prática toca somente base/pulso e mantém F e a conexão de posição como opções. Após revisão visual do usuário, a partitura usa quatro compassos por linha quando o player tem ao menos 700 px disponíveis, ampliando a largura da pauta e do container; com menos espaço, usa dois compassos por linha para preservar o tamanho das notas. A mudança acompanha o redimensionamento e preserva o destaque da nota atual. As sessões respeitam blocos de 16 compassos, começando com 32.

O planejamento de frase valida cada posição contra o mapa do acorde ativo, permitindo F apenas no trecho declarado. Mudanças visuais, áudio e indicação do acorde usam a mesma sequência harmônica. As alturas interpretadas pelo abcjs são comparadas aos eventos da frase, inclusive armaduras, pausas e a jam inteira.

Validação automatizada: TypeScript, build e 33 testes. Cobertura nova: F contextual em Dm7, rejeição do F no trecho de Am7, notas comuns, mesmas alturas com novos graus, alvos relativos, sequência da jam e identidade/rotas das 12 lições. A tentativa de conexão automatizada ao navegador falhou porque o processo encerrou durante a inicialização.

Antes de publicar: revisar visualmente desktop/celular, ouvir o acompanhamento e todas as frases, conferir a execução das posições no instrumento e testar o percurso com praticantes. Depois dessa revisão, avaliar a clareza das tarefas, conforto, qualidade sonora, retomada e progresso. As trilhas de pentatônicas/CAGED e blues continuam propostas separadas; não estão implementadas por esse fechamento.

### Atualização de 8 de outubro: L09

L09, “Uma cor a mais no acorde”, compara a mesma frase terminando em G sobre Am e Am7, dois compassos de cada. A prática oferece a sequência de acompanhamento e pulso sem simular a execução do aluno. O mapa mantém A/C/E/G nas duas cordas agudas e A como tônica; G recebe o alvo nos dois trechos e o papel de nota do acorde apenas sobre Am7. A bolinha e sua legenda aparecem porque o alvo não coincide com a tônica.

O conteúdo declara uma sequência harmônica repetida com a duração da frase. `planHarmony` calcula tempos, durações, acordes e mapas; o player usa o mesmo plano para o acompanhamento, o nome do acorde ativo e os papéis no braço. O switch de graus preserva o mapa do acorde ativo. Ao parar, a lição retorna ao primeiro acorde. As mudanças desta fatia ocorrem no início de compassos.

A explicação associa G a ♭7 de A e distingue Am (1/♭3/5) de Am7 (1/♭3/5/♭7), sem prometer que chegar ao Sol tenha a mesma sensação de repouso que chegar à tônica. A pergunta opcional identifica a nota acrescentada. Validação: TypeScript, build e 30 testes, incluindo repetição harmônica, recortes de duração, papéis do Sol e correspondência entre partitura e áudio. Revisão visual/auditiva permanece pendente. Próximo conteúdo: L10, Am7–Dm7 com notas comuns A/C e F contextual sobre Dm7.

### Atualização de 8 de outubro: L08

L08, “Leve sua frase a outro tom”, transpõe o motivo de L03 de Am para Gm, duas casas em direção à pestana. O recorte tem cinco posições nas casas 3–6; notas, tônica, papéis e acompanhamento correspondem a Gm. O exemplo mantém os tempos e pausas de L03, com G–B♭–D em lugar de A–C–E. Na prática, dois compassos de exemplo alternam com dois para resposta, com chegada ao Sol.

O motor aceita a preferência de grafia `spelling: 'flat'`, usada nesta lição para mostrar B♭/Si♭ no braço e nos nomes acessíveis. Trata-se de uma preferência cromática, não de um sistema completo de grafia por tonalidade. Graus e alturas permanecem independentes dessa preferência. A partitura declara Gm e sua armadura; o aviso da resposta vem do conteúdo de cada lição, sem presumir sempre um final em Lá.

Validação: TypeScript, build e 29 testes. A transposição é comparada com L03 em posições, alturas, acompanhamento e tempos. O teste de partitura usa a interpretação MIDI do abcjs para respeitar armaduras e alterações. A revisão visual e auditiva permanece pendente. Próximo conteúdo: L09, comparação Am/Am7 com G como sétima menor e alvo contextual ao acorde.

### Atualização de 8 de outubro: L07

L07, “Uma ponte no braço”, conecta dois recortes nas duas cordas agudas: E5/E8/E10 e B5/B8/B10. C e G na casa 8 são pontos de passagem; D na 1ª corda/casa 10 e A na 2ª corda/casa 10 ampliam as posições, preservando a pentatônica de Am. O texto orienta deslocar a mão, sem exigir extensão entre casas 5 e 10. O mapa tem seis posições, com destaques de acorde e tônica calculados pelas alturas.

O exemplo demonstra as duas conexões e termina no A da 2ª corda/casa 10. A prática oferece somente base/pulso e uma tarefa de frase com passagem, pausa e chegada. A explicação de graus distingue mudança de posição de mudança de tom e esclarece que os dois As das cordas agudas têm a mesma altura. A checagem opcional reforça essa distinção.

Validação: TypeScript, build e 28 testes, incluindo classes de notas, pontes, posições, altura comum das tônicas e correspondência da partitura com o áudio. Revisão visual/auditiva permanece pendente. Próximo conteúdo: L08, transposição de uma frase para Gm com acompanhamento correspondente.

### Atualização de 8 de outubro: L06

L06, “Um box inteiro”, mostra a pentatônica de Am nas seis cordas entre as casas 5–8: 12 posições, cinco classes de notas e três posições de A. Os destaques de acorde são recalculados em todos os registros; as três tônicas também são alvos.

O exemplo repete A–C–E–A uma oitava abaixo, com o mesmo ritmo e pausas. Na prática há apenas acompanhamento e pulso. O seletor “Praticar em” recorta 1ª–3ª, 3ª–5ª ou 4ª–6ª cordas, além do box completo; cada grupo contém um Lá. O exemplo restaura todas as cordas, e a escolha de grupo fica desativada durante a reprodução. O switch de graus respeita o recorte escolhido. Há uma pergunta opcional sobre registro e manutenção de notas/graus.

Validação: TypeScript, build e 27 testes. Os novos testes verificam notas, papéis, grupos, tônicas e repetição de oitava; a correspondência entre partitura e áudio inclui L06. Revisão visual e auditiva da nova lição permanece pendente. Próximo conteúdo: L07, ponte para uma região vizinha.

### Atualização de 8 de outubro: L04–L05

Graus foram introduzidos progressivamente num painel opcional “Entenda os graus”: L01 relaciona tônica e grau 1; L02 apresenta ♭3; L03 associa a tríade aos graus 1/♭3/5; L04 completa 1–♭3–4–5–♭7; L05 relaciona o motivo aos graus. O texto distingue alteração do grau de nome da nota. O controle “Mostrar graus” troca os rótulos do braço, com nomes como padrão, preservando o mapa da etapa e a posição destacada. Não é requisito para concluir a lição.

L04 completa o pequeno mapa com G (2ª corda, casa 8) e D (3ª corda, casa 7). O exemplo usa as cinco notas e retorna a A com pausa; a prática oferece somente base e pulso. Somente A/C/E recebem o papel de notas de Am; D/G ampliam a pentatônica sem esse destaque.

L05 mantém o mesmo mapa e demonstra um motivo seguido de uma variação rítmica, preservando a sequência A–C–E–A. Na prática, quatro compassos de exemplo alternam com quatro compassos para criar e variar um motivo. Os avisos de escuta/resposta usam a duração de cada lição. Ambas possuem uma pergunta opcional, aberta pelo link abaixo da conclusão manual; a pergunta não condiciona o progresso.

A navegação e as rotas usam o catálogo, incluindo L01–L05. As sessões começam com 32 compassos, ajustáveis até 128, respeitando blocos completos. Validação: TypeScript, build e 26 testes; um teste interpreta a partitura ABC e compara alturas, pausas e durações com os eventos de áudio de todas as cinco lições. A revisão visual e auditiva das novas lições no navegador e no instrumento permanece pendente. Próximo conteúdo: L06, expansão por grupos de cordas para o box inteiro.

### Atualização de 8 de outubro: contrato e L02–L03

O catálogo em `src/lesson-content.ts` agora define identidade/revisão, textos, partitura, acorde, mapas de exemplo/prática e eventos da frase. `src/lesson-playback.ts` calcula os eventos de som e destaque a partir das mesmas posições. `src/lesson.ts` renderiza L01–L03 com esse conteúdo; L02–L03 substituem suas prévias nas rotas existentes.

L02 usa A/C e um motivo de dois compassos. L03 acrescenta E e, no modo de prática, toca uma pergunta de dois compassos e deixa os dois seguintes para resposta livre. L01–L02 têm somente base e pulso na prática, sem simular a execução do participante. Compassos respeitam blocos completos da tarefa. Conclusão permanece uma declaração manual, com progresso independente por lição e identidade da L01 preservada.

O braço aceita papéis simultâneos `chord`, `target` e `context` por posição. Tônica continua derivada da escala, com aro azul; fundo verde suave indica nota do acorde e bolinha neutra abaixo indica alvo, com legenda e descrições acessíveis. Em cores forçadas, borda dupla também identifica notas do acorde. O braço das lições usa largura preferida de 536 px em telas a partir de 768 px, limitada ao espaço disponível, mantendo o recorte e o tamanho das notas. Uma posição externa à escala só aparece por papel contextual explícito. O mapa completo pode ser substituído por etapa, recalculando tônica/coleção/papéis no mesmo intervalo de casas. Ainda não há controles de camadas, comparação de escalas, catálogo de formas CAGED ou ciclo nos 12 tons.

Validação automatizada: TypeScript e 22 testes, incluindo alturas reais das frases, silêncio durante respostas, atualização de mapas, posições contextuais e progresso independente de L01–L03. O botão de continuar da landing retoma a última lição salva do catálogo. A conexão automatizada ao navegador falhou ao iniciar; revisão visual e auditiva em desktop/celular ainda é necessária. Próximo incremento: checagem visual de localização, rubrica instrumental, retomada por etapa e validação das três lições com praticantes.

O texto abaixo registra a situação anterior à extração acima:

Extrair a L01 para um contrato de conteúdo reutilizável, completar sua avaliação musical e criar L02–L03. O som atual é uma referência simples para a primeira nota. O seletor navega entre L01 e as prévias L02–L03; a microfrase A–C–E, o transporte de áudio reutilizável, estrelas, backup e conteúdo real das próximas lições vêm nos próximos incrementos.
