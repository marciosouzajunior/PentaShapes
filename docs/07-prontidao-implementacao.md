# 07 — Prontidão para implementação

Atualização de 6 de outubro de 2026. Este documento congela as decisões necessárias para começar a primeira fatia funcional sem transformar o MVP em um produto maior do que conseguimos validar.

## 1. Decisão de escopo

Estamos prontos para implementar uma **fatia vertical** com landing page, início/retomada, L01–L03, prática sonora, resultado, progresso local e configurações essenciais. Ainda não estamos comprometendo a construção das outras trilhas, reconhecimento pelo microfone, contas ou aplicativo nativo.

A primeira entrega precisa permitir que uma pessoa que já toca acordes:

1. entenda a promessa na landing page;
2. comece sem escolher escala, shape ou tom;
3. ouça uma microfrase sobre um acompanhamento;
4. localize as notas no braço;
5. toque a própria tentativa;
6. conclua a sessão e saiba qual é o próximo passo;
7. feche o navegador e retome o progresso depois.

Se essa sequência não funcionar em celular e desktop, não ampliar o currículo.

## 2. Decisões técnicas congeladas para a primeira fatia

| Tema | Decisão |
| --- | --- |
| Aplicação | Vite + TypeScript, com módulos de domínio puros e o Web Component `penta-fretboard` reaproveitado |
| UI | Componentes de tela simples, acessíveis e orientados a estado; nenhuma regra musical em template ou CSS |
| Áudio | Web Audio API, transporte por batidas, microfrases como eventos MIDI/tempo e samples ou síntese autoral |
| Armazenamento | `localStorage` versionado; exportação/importação JSON desde a primeira fatia |
| Conta | Não há autenticação no MVP |
| Microfone | Não solicitar nem analisar no MVP |
| Idioma inicial | `pt-BR`, com chaves de tradução desde o primeiro componente |
| Plataforma | Web responsiva; PWA e wrapper nativo só depois da validação do fluxo |
| Hospedagem | Manter hosting estático existente até o build novo passar pelo preview |
| Conteúdo | L01–L03 autorais, com áudio, revisão musical e licença registrados |

O motor musical e o braço não podem depender de React, armazenamento ou navegador. Isso mantém aberta a possibilidade de usar os mesmos módulos em uma PWA, Capacitor ou outro cliente no futuro.

## 3. Telas e estados necessários

### Landing page

Apresenta a promessa, a trilha Fundamentos como recomendação e cards das trilhas futuras. A ação principal é **Começar** ou **Continuar prática**. Não pede cadastro nem configuração musical antes da primeira tentativa.

### Início / progresso

Mostra a próxima lição, progresso de 0–12, última conquista e uma revisão sugerida. Inclui acesso discreto a configurações, backup e ajuda.

### Lição / prática

Tem objetivo em uma frase, áudio de referência, contagem, braço, instrução de uma etapa, controles de repetir/pausar/BPM/volume e navegação anterior/próxima. A teoria fica em **Entender esta ideia**, fechada inicialmente.

### Resultado

Mostra o que foi praticado, estrelas possíveis, autoavaliação, repetir e próxima lição. Não apresenta uma nota falsa de precisão instrumental.

### Configurações

O MVP terá uma tela curta, separada das opções de uma lição:

- idioma (`pt-BR` inicialmente; estrutura pronta para `en`);
- preferência de nomes de notas, quando houver alternativa relevante (`Lá (A)` ou `A`);
- mão/orientação do braço (destro/canhoto);
- volume e BPM padrão, sem substituir os controles temporários da lição;
- movimento reduzido;
- exportar progresso, importar backup e redefinir somente os dados do PentaShapes;
- versão do currículo, estado do armazenamento e link para privacidade/ajuda.

O mesmo bloco oferece o link **Sobre o método**, com referências pedagógicas e créditos separados. Ele não deve aparecer como requisito para começar uma lição.

Não incluir tema escuro, equalizador, afinações alternativas ou personalização extensa antes de observar uso real.

## 4. Localização e internacionalização

Todo texto de interface, feedback, acessibilidade e estado de erro usará chaves semânticas, por exemplo `lesson.l03.goal`, e não strings espalhadas nos componentes. O conteúdo musical terá ID estável e traduções separadas para título, instrução, dica e teoria.

Regras:

- `pt-BR` é a fonte editorial inicial;
- cifras internacionais (`Am7`, `Dm7`) permanecem como notação musical;
- nomes locais (`Lá`, `Dó`) são uma camada de apresentação;
- datas, números e duração usam `Intl`;
- texto de acessibilidade recebe tradução própria, não concatenação improvisada;
- idioma escolhido é salvo em preferências e aplicado sem apagar progresso;
- uma tradução ausente usa `pt-BR` e registra o fallback em desenvolvimento.

Adicionar inglês depois será uma tarefa de conteúdo e revisão, não uma mudança no domínio musical.

## 5. Estratégia mobile e possível migração para app

O primeiro cliente será web responsivo, com as mesmas regras para celular e desktop. O layout deve:

- impedir overflow horizontal da página;
- manter o braço em um recorte legível com navegação interna;
- preservar alvos de toque de aproximadamente 44 px;
- respeitar safe areas e orientação vertical/horizontal;
- funcionar com teclado, toque e leitor de tela;
- iniciar áudio somente após gesto do usuário;
- pausar ao perder visibilidade e retomar com contagem;
- não depender de hover, mouse ou APIs exclusivas de desktop.

Desde o começo, evitar dependências que impeçam uma PWA. Depois do piloto, a ordem recomendada é:

1. adicionar manifest, service worker e cache dos assets estáticos;
2. medir uso instalado e comportamento de áudio offline;
3. somente então avaliar Capacitor ou outro wrapper para lojas, se houver benefício real de distribuição, notificações ou integração nativa.

O domínio musical, o catálogo de lições, o armazenamento e o transporte de áudio devem continuar independentes da camada de instalação. Assim, migrar para um app não exige reescrever o currículo.

## 6. Dados, privacidade e recuperação

O MVP não coleta áudio, não pede conta e não envia respostas musicais. O progresso local guarda apenas preferências, tentativas, marcos, datas e versão do currículo. Exportação e importação são explícitas e validam versão, tamanho, IDs, datas e dependências antes de mesclar.

Analytics só entra depois de definir finalidade, consentimento quando necessário, retenção e nomes de eventos. Não registrar conteúdo de áudio nem usar o legado de Analytics como padrão.

Falhas de `localStorage`, navegação privada, limpeza do navegador, troca de domínio e uso em outro aparelho precisam produzir uma mensagem clara e acesso ao backup; nunca apagar silenciosamente o estado anterior.

## 7. Conteúdo necessário antes de codificar L01–L03

Cada lição precisa de um pacote revisado:

- objetivo e critério de observação;
- notas, posições e graus validados pelo motor;
- microfrase com eventos `midi`, `startBeat` e `durationBeats`;
- acompanhamento autoral e BPM inicial;
- roteiro de ouvir, imitar, praticar e variar;
- dica, feedback e autoavaliação;
- texto opcional de teoria e descrição acessível;
- responsável, origem e licença de cada áudio/imagem.

Sem esse pacote, construir a tela criaria uma casca visual sem conteúdo verificável.

## 8. Portões de qualidade

Antes de considerar a fatia pronta:

| Portão | Evidência |
| --- | --- |
| Domínio | Testes de notas, afinação, intervalos, transposição, casa zero e recortes inválidos |
| Conteúdo | IDs únicos, pré-requisitos sem ciclos, graus e posições conferidos por revisão musical |
| Áudio | Contagem, pausa, retomada, repetição, BPM, aba oculta e sincronização do braço verificados em navegadores reais |
| Persistência | Recarregar, fechar, importar, mesclar duas abas, falhar armazenamento e redefinir dados |
| Interface | 320, 375, 390, 768 e 1.280 px; toque, teclado, zoom 200%, orientação e canhoto |
| Acessibilidade | Foco, contraste medido, nomes acessíveis, movimento reduzido e alternativa quando áudio falhar |
| Produto | Uma pessoa do público conclui L01 sem explicação externa e sabe o próximo passo |

## 9. Ordem de implementação

Estado em 7 de outubro de 2026: o primeiro passo foi iniciado. O legado foi isolado em `legacy/`; a nova entrada Vite/TypeScript, a landing, uma prévia interativa do braço e a prática inicial de L01 já existem. A L01 usa áudio sintetizado, contagem curta e progresso local simples. O domínio musical reutilizável continua nos módulos `.mjs` testados. Ainda faltam o contrato de lição reutilizável, L02–L03, estrelas, backup e revisão pedagógica/visual completa. O Firebase continua publicando `legacy/` até essa fatia estar pronta.

1. Criar o esqueleto Vite/TypeScript e mover o domínio musical para módulos testáveis.
2. Integrar o braço aprovado em uma tela de prática real.
3. Criar o contrato de conteúdo e os pacotes L01–L03.
4. Implementar transporte Web Audio e uma microfrase autoral.
5. Construir landing, início, prática e resultado.
6. Implementar progresso, estrelas, retomada, configurações e backup.
7. Fazer QA de teclado, mobile, áudio e armazenamento.
8. Observar o primeiro piloto e só então ampliar para L04–L12.

As decisões de nome definitivo, identidade final, timbre de guitarra e futura autenticação permanecem abertas, mas não bloqueiam essa fatia.

## 10. Como saberemos se o praticante está avançando

O primeiro piloto não deve perguntar apenas se a pessoa gostou da interface ou acumulou estrelas. Aplicar uma tarefa curta antes da trilha, repetir uma versão equivalente após L03 e observar novamente depois de uma revisão. A rubrica deve verificar:

- mantém um pulso básico;
- usa ao menos uma pausa intencional;
- repete ou transforma um motivo;
- encontra uma nota de repouso;
- consegue tocar uma variação em outro contexto;
- explica, com suas palavras, o que tentou fazer.

O produto deve registrar esses resultados como observação de validação, não como uma pontuação automática de talento. Se o participante conclui telas mas não consegue realizar a tarefa musical fora da animação, revisar a lição antes de adicionar conteúdo.

## 11. Escuta, repertório e direitos

Vale incluir uma ação discreta **Ouça em contexto** ao final de algumas lições. Ela pode abrir:

- uma microfrase autoral do PentaShapes, gravada sobre o acompanhamento da lição;
- uma melodia tradicional ou composição comprovadamente em domínio público, com arranjo e gravação próprios;
- uma recomendação externa de escuta, com artista, obra, o que observar e link para uma fonte legítima.

Não tratar “a música é antiga” como prova de domínio público. Composição e gravação são direitos diferentes; uma melodia pode estar livre e uma gravação específica continuar protegida. Cada item terá território, situação de direitos, fonte e responsável registrados antes de entrar no produto. No Brasil, a regra geral de direitos patrimoniais é de 70 anos após a morte do autor, mas a confirmação deve ser feita caso a caso e conforme o território de distribuição.

As recomendações externas serão referências de escuta, não arquivos incorporados ou baixados pelo app. Para exercícios tocáveis dentro do sistema, preferir material autoral, licenciado ou de domínio público com nova gravação própria.
