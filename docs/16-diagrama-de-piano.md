# 16 — Diagrama de piano para intervalos

Criado em 14 de outubro de 2026. Componente implementado em `src/piano-diagram.ts`, com estilos próprios em `src/piano-diagram.css`. Os exemplos de intervalos do caderno de Purple Haze usam o teclado no lugar das antigas barras de semitons.

## Uso pedagógico

Mostrar a partida, a chegada e as notas entre elas em um teclado com disposição real de teclas brancas e pretas. Cada passagem para a tecla vizinha é um semitom, incluindo Mi–Fá e Si–Dó, que não têm tecla preta entre si. Duas passagens formam um tom.

Somente partida e chegada recebem um destaque suave; as demais teclas mantêm as cores naturais do teclado. Todas têm nomes em letras, como no braço da guitarra; a descrição acessível usa nomes em português e informa as oitavas. O par de notas, o nome do intervalo e a contagem aparecem centralizados abaixo de cada teclado. A legenda explicativa também fica centralizada abaixo dos exemplos. Comparações usam o mesmo recorte do teclado, para que os destinos possam ser comparados diretamente.

É uma ilustração de leitura: não adiciona áudio, cliques de exercício ou controles. Diagramas maiores permitem rolagem horizontal no celular para preservar a legibilidade. O teclado ajuda a compreender relações; a prática continua na guitarra.

## Contrato reutilizável

`pianoDiagram(options)` retorna a marcação SVG dentro de um contêiner responsivo. `pianoLayout(options)` fornece os dados de posição das teclas, também usados na verificação musical.

| Opção | Uso |
| --- | --- |
| `from`, `to` | Alturas MIDI da partida e da chegada; aceita subida e descida |
| `startMidi`, `endMidi` | Recorte opcional, contendo os dois extremos; por padrão, inclui as oitavas correspondentes |
| `spelling` | Nomes com sustenidos ou bemóis, conforme o exemplo |
| `label` | Descrição acessível opcional, com escape de texto |
| `selectedNotes` | Alturas MIDI de uma coleção para destacar apenas suas notas, mantendo as demais como contexto |

O teclado da pentatônica na lição 2 foi experimentado e retirado a pedido do autor: não ajudou a visualizar as relações dessa coleção. A pentatônica permanece somente no braço. O suporte a `selectedNotes` continua disponível no componente para futuros exemplos; os teclados usados nas comparações de intervalos permanecem.

Exemplo: `pianoDiagram({from:40,to:46,endMidi:47,spelling:'flat'})` mostra Mi–Si♭. Usar o mesmo recorte com `to:47` mostra Mi–Si, uma tecla depois. Para nonas, conservar as alturas MIDI: Mi 52 até Fá♯ 66 ou Sol 67. Não reduzir esses valores à classe da nota, pois isso apagaria a oitava.

As posições das teclas seguem a geometria do piano, não uma régua de segmentos iguais. A distância em semitons vem das teclas percorridas, não da largura em pixels. O exemplo não implica que todas as notas intermediárias sejam tocadas na música.

## Verificação

Testes conferem as sete teclas brancas e cinco pretas de uma oitava, as posições das teclas pretas, a diferença Mi–Si♭/Mi–Si, nonas sem perda da oitava, intervalos descendentes, descrição acessível e ausência de controles interativos.
