# 12 — Piloto: Purple Haze por dentro

Atualizado em 14 de outubro de 2026. Entrada local: /track/purple-haze-por-dentro/.
Nome público aprovado: **Purple Haze por dentro**. Os cabeçalhos das lições não exibem “Piloto”. A rota acompanha o nome público; acessos ao antigo caminho rock-em-movimento são encaminhados à rota correspondente, preservando parâmetros e âncoras. Os identificadores de progresso são mantidos para preservar as conclusões existentes.

O card da página inicial identifica Jimi Hendrix e usa um retrato artístico gerado dele em performance, em tons suaves. A capa substitui o gráfico ilustrativo de notas; não é uma fotografia de arquivo. Origem e prompt: [capa da trilha](../src/assets/track-purple-haze.prompt.md). Os quatro cards usam a mesma chamada “Ver lições”.
O primeiro piloto de notas em movimento foi substituído pelo estudo em braço estático.

## Experiência

Cinco lições de Purple Haze: abertura, riff, motivo do solo, descida e acordes da base do verso.
Os cartões mantêm sua posição e seus mapas durante toda a sequência. Só o trecho ativo recebe borda azul e fundo discreto. Cada cartão contém apenas o título e o braço; em telas pequenas, ficam um abaixo do outro.

O braço usa nomes ou graus relativos a Mi. Destaques e contagem acompanham o áudio. Notas do braço podem ser ouvidas por clique. Há quatro tempos de preparação, pausa/retomada, BPM, metrônomo, silêncio da guitarra, navegação por bloco, busca e repetição da sequência. A última lição mostra três cards fixos: E7♯9 → G → A, com duração de 4–2–2 tempos. Play toca a sequência completa; clicar em um card toca somente aquele acorde. O E7♯9 usa x7678x; G e A usam posições abertas. As batidas regulares são uma simplificação didática e não vêm da extração do MIDI. Não há seletor de acorde nem checkbox de E7♯9. A referência da harmonia é Guitar Club: https://www.guitarclub.io/blog/purple-haze-jimi-hendrix-guitar-lesson-chords-solo. Essa base é do verso, não de todas as partes da música.

## Fonte e curadoria

Arquivos fornecidos pelo usuário em midi/, obtidos em https://www.midiworld.com/files/1056/.
Purple Haze: PPQ 480, tempo aproximadamente 112 BPM, compasso 4/4, duração aproximadamente 165 segundos. A pista de notas 1 (canal 0, distortion guitar) contém a guitarra principal; pistas vazias de metadados também aparecem no arquivo.
O início alterna Si♭2 / Si♭3 na guitarra. A referência Mi2 / Mi3 está na pista de baixo 5. O mapa inicial mostra somente as notas selecionadas da guitarra.

Blocos em beats desde zero: 0–4, 4–8, 8–12, 12–16, 128–132, 132–136, 148–150 e 150–152.
A abertura preserva os tempos do MIDI, omitindo MIDI 63 (Mi♭4) em ticks 3360 conforme as referências: oito ataques alternados de Si♭2 na 6ª corda/casa 6 e Si♭3 na 4ª corda/casa 8. Desde 14 de outubro, os seis blocos das lições 2–4 são versões de estudo revisadas por tablatura, em vez de cópias dos eventos do MIDI. O riff restaura Lá; a aproximação recebe slides e bends leves e termina antes do Mi agudo posterior; a descida restaura Fá♯–Sol–Fá♯. Riff e aproximação usam valores rítmicos da partitura consultada; a descida usa uma adaptação em quatro tempos. Curvas de altura sintetizam slides e bends e preservam a posição na retomada. As técnicas têm pequenas indicações no braço. Fontes, edições e limites estão em [14 — Revisão das posições](14-revisao-digitacao-purple-haze.md) e nos metadados internos. Vibrato e timbre da gravação não são reproduzidos. O MIDI original permanece intacto.

Voodoo Child também foi inspecionado: PPQ 384, aproximadamente 86 BPM e 126 segundos; 31 pistas, incluindo duplicações da guitarra e programas separados das pistas com notas. Não foi incluído nas lições: exige outra seleção e revisão de digitação.

## Estrutura e reprodução

- scripts/prepare-hendrix.mjs lê o Purple Haze local com @tonejs/midi e gera src/data/purple-haze.json. Execute npm run prepare:hendrix após alterar a curadoria.
- song-content.ts define lições, mapas de nomes/graus, montagem dos blocos e fronteiras de transição.
- song.ts reutiliza penta-fretboard; o mesmo relógio do AudioContext controla a sequência sonora e os destaques. O movimento do braço foi removido.
- content-catalog.ts mantém os dois tipos de conteúdo e a retomada.
- O progresso usa system:hendrix-purple-haze:s01 etc.; conclusões do piloto antigo não marcam estas novas lições.
- Os MIDIs locais são material de referência separado da licença do código. Antes de disponibilizar um catálogo público, verificar a autorização para cada arranjo.

## Validação

Em 14 de outubro de 2026, o autor aprovou o piloto **Purple Haze por dentro** para registro em commit e envio ao repositório. A versão reúne cinco lições, mapas estáticos, player com ajustes persistidos e caderno compartilhado. A revisão editorial deixa a localização das notas nos desenhos e concentra o texto nas relações musicais, sem narrar cada casa e corda. O registro e os critérios do formato aprovado estão em [15 — Leitura de estudo](15-leitura-de-estudo.md). A aprovação do piloto não constitui uma avaliação da execução no instrumento; não houve novo relato de teste prático.

Testes comparam os dados didáticos ao MIDI real: alturas, PPQ, tempo, início, duração, posições e notas simultâneas. Testam também as fronteiras da sequência, nomes/graus e identidade do progresso.
Ainda é necessário experimentar as posições no instrumento e revisar as técnicas expressivas para uma transcrição mais fiel.


### Player e reprodução de um trecho

O player usa um único botão para Play e Pausa: durante a reprodução, o ícone e o nome acessível mudam para Pausa. Pausar preserva a posição; Stop encerra o áudio e volta ao início da sequência, antes da preparação. Clicar no cartão inicia somente aquele bloco, sem avançar para o seguinte. O título é um botão acessível pelo teclado. As notas do braço continuam permitindo ouvir uma nota isolada.

Play inicia os trechos da lição ou o acorde escolhido na lição da base. “Repetir” respeita o que está sendo ouvido: apenas o cartão escolhido ou a sequência completa. A barra de posição usa os mesmos limites, e notas e metrônomo são agendados somente até o fim desse intervalo.

A barra de espaço alterna Play/Pausa em qualquer ponto da página, inclusive com foco nos cards, controles de ajustes ou no caderno aberto. Não rola a página nem aciona o elemento focado. Manter a tecla pressionada não alterna repetidamente; combinações com Ctrl, Alt ou Meta preservam seus atalhos. O botão Play informa o atalho por `aria-keyshortcuts`. A pausa e a retomada usam o mesmo estado do botão, sem reiniciar a preparação.

Repetir, Ouvir guitarra e Metrônomo são preferências compartilhadas entre as lições da trilha, salvas no navegador por `practice-settings.ts`. Permanecem após navegação, recarga e reabertura. Mostrar graus e Velocidade não são persistidos: cada entrada na página começa com nomes de notas e 80 BPM. O painel de ajustes continua recolhido por padrão. Dados inválidos ou armazenamento indisponível não impedem a prática; cada preferência ausente usa seu padrão.

O player apresenta Play/Pausa e Stop centralizados, com um ícone de ajustes ao lado. Cada cartão mostra sua posição em uma linha fina na borda inferior, sem uma barra geral fora dos cartões. A linha permite ajustar a posição com mouse ou teclado; durante a sequência, os trechos concluídos ficam preenchidos, e a reprodução individual atualiza apenas o cartão escolhido. Repetição, áudio da guitarra, metrônomo, graus e velocidade ficam recolhidos por padrão. O ícone tem nome acessível “Ajustes da prática”, indica seu estado com aria-expanded e é operável pelo teclado. Abrir ou fechar essa área preserva os ajustes e a reprodução.

A antiga lição “Combine os trechos” foi descartada. A rota s05 foi mantida, mas sua identidade de progresso é s05-acordes para não herdar a conclusão da atividade anterior. O modelo em song-chords.ts define acordes, cordas tocadas e limites de duração; o player usa a mesma síntese de áudio das outras lições.

As cinco lições têm explicações opcionais em “Explorar notas e relações”. A revisão didática das lições 2–5 apresenta a pentatônica menor no riff, o Dó♯ e as mudanças de região no motivo, os passos da descida e os acordes da base. As introduções permanecem breves; os exemplos de escuta ligam os conceitos ao instrumento, sem alterar notas, ritmos ou digitações.
