# 14 — Revisão das posições de Purple Haze

Revisão de 9 de outubro de 2026. Foram comparadas as oito frases selecionadas do MIDI local com referências de tablatura. O objetivo foi corrigir cordas e casas, preservando as alturas, ataques e durações do arranjo existente.

## Referências e alcance

- [Guitar Control — abertura](https://guitarcontrol.com/page/Guitarcontrol-com/guitarcontrol.com/chords-rhythm-guitar/how-to-play-purple-haze-by-jimi-hendrix/index.html): confirma as oitavas iniciais.
- [Guitar Lesson World — riff e solo](https://www.guitarlessonworld.com/tablature/purple.htm): referência para o riff e a descida do solo.
- [Cifra Club — Purple Haze](https://www.cifraclub.com/jimi-hendrix/purple-haze/): referência para a passagem que prepara a entrada do solo e a frase mais aguda.

São referências de ensino/transcrição, não prova de cada movimento da execução original de Hendrix. Há diferenças entre as versões. Desde 14 de outubro, os trechos das lições 2–4 são arranjos de estudo organizados pelas referências, com status `reference-curated-study-arrangement`; a abertura mantém o MIDI corrigido com status `reference-reviewed-midi-adaptation`. Nenhum desses status significa transcrição integral da gravação.

## Resultado por trecho

| Trecho | Revisão |
| --- | --- |
| intro-a | Oitavas mantidas na região já revisada |
| intro-b | Oitavas mantidas; Mi♭ simultâneo do MIDI retirado em 14 de outubro conforme as referências da abertura |
| riff-a | Si–Ré–Sol–Lá na região 5–9, com slide de entrada e bend leve no Sol; valores rítmicos da partitura de referência |
| riff-b | Sol–Ré solto–Mi grave–Mi na 5ª corda/casa 7; slide Ré–Mi como evento contínuo, sem novo ataque de Ré |
| solo-a | Dó♯–Mi–Si repetido duas vezes, slide de entrada e bend leve no Si |
| solo-b | Mi–Sol–Sol agudo repetido duas vezes; bend e retorno no Sol agudo; Mi agudo posterior retirado deste recorte |
| solo-c | Sol sustentado seguido da ligação Fá♯–Sol; ritmo adaptado para estudo |
| solo-d | Retorno por slide a Fá♯, seguido de Mi–Ré; completa a ligação Fá♯–Sol–Fá♯ |

A escolha agora depende do trecho. Não usar uma tabela global que coloca toda ocorrência de uma altura na mesma corda/casa: o Mi da aproximação e o Mi da frase mais alta pertencem a regiões diferentes.

## Diferenças preservadas

### Nova conferência da abertura — 14 de outubro de 2026

A abertura foi comparada novamente com a [tablatura do Guitar Lesson World](https://www.guitarlessonworld.com/tablature/purple.htm) e com a [aula de Jed Cutler no Guitar Club](https://www.guitarclub.io/blog/purple-haze-jimi-hendrix-guitar-lesson-chords-solo). Ambas apresentam quatro alternâncias de Si♭ na 6ª corda/casa 6 e Si♭ na 4ª corda/casa 8, sem um Mi♭ junto do último Si♭. A descrição da [aula do Guitar Control](https://guitarcontrol.com/page/Guitarcontrol-com/guitarcontrol.com/chords-rhythm-guitar/how-to-play-purple-haze-by-jimi-hendrix/index.html) também orienta alternar apenas essas duas alturas.

A leitura direta da pista 1 do MIDI local confirmou nove eventos nos primeiros oito tempos: oito ataques alternados de MIDI 46 e 58, mais MIDI 63 (Mi♭4, nomeado D♯4 pelo leitor) simultâneo ao último 58 no tempo de índice 7, ticks 3360. Portanto, essa nota vem do arquivo fornecido; não é um erro de cálculo de corda/casa nem uma nota introduzida pelo gerador.

Conclusão da revisão: há uma divergência pontual entre o arranjo MIDI e as referências didáticas consultadas. Essas transcrições não provam a ausência de todo som adicional na gravação, mas não sustentam ensinar Mi♭ como parte da frase inicial de oitavas. Após autorização do autor, o evento foi omitido da versão de estudo em 14 de outubro. O gerador registra a exclusão por altura MIDI e ticks em `sourceEdits`, com motivo e fontes; os dados foram regenerados. O mapa, o áudio e os destaques passam a conter somente os oito ataques de Si♭, com os tempos e durações originais. A leitura foi ajustada para falar apenas da prática das oitavas. O MIDI original permanece intacto. Não há evidência verificada sobre como esse arquivo foi produzido; não atribuir a divergência a geração automática como fato.

O Lá ausente no riff foi restaurado. A chamada termina em Lá na 4ª corda/casa 7; a resposta começa com Sol na casa 5, usa Ré solto e Mi grave e chega a Mi na 5ª corda/casa 7. O último Mi recebe um slide a partir de Ré. O gerador usa os valores rítmicos da [partitura de referência compartilhada no MuseScore](https://musescore.org/sites/musescore.org/files/2019-02/Purple%20Haze.pdf), em vez de copiar os eventos incorretos do MIDI.

A passagem de aproximação recebe os slides de entrada e bends leves de um quarto de tom indicados nessa partitura, tanto no Si do primeiro card quanto no Sol agudo do segundo. Essa indicação corrige a hipótese anterior de um bend inteiro até a casa 14: não assumir a amplitude de um bend quando uma tab ASCII só mostra `^`. O Mi agudo isolado ao final do MIDI foi retirado para delimitar o estudo às duas repetições do motivo; sua ausência neste recorte não implica que Mi nunca apareça na continuação da música.

A descida restaura a ligação Fá♯–Sol–Fá♯ da referência do Guitar Lesson World. Mantém um Sol inicial sustentado e termina em Mi–Ré, dentro dos quatro tempos de estudo. A tab ASCII não determina os tempos exatos, por isso esses valores são explicitamente uma adaptação de estudo. Slides e bends são agora sintetizados por curvas de altura; vibrato, timbre e expressão completa da gravação permanecem fora do escopo.

O gerador registra a substituição integral desses seis blocos com `sourceEdits.action = replace-block`, fontes, data e base rítmica. Seus eventos usam `sourceTicks = -1`: não se apresentam como eventos extraídos literalmente do MIDI. O arquivo MIDI original permanece intacto.

As fontes e limitações estão nos metadados internos de cada bloco, em `src/data/purple-haze.json`, gerados por `scripts/prepare-hendrix.mjs`. Não há um novo elemento no rodapé da interface.

## Validação

### Conferência das demais lições — 14 de outubro de 2026

Achados da comparação que antecedeu os ajustes autorizados pelo autor. Foram consultados Guitar Lesson World e Guitar Club; a consulta direta ao Cifra Club retornou 403. Os ajustes das lições 2–4 descritos acima foram implementados após essa conferência; a lição 5 conserva seu arranjo didático.

| Lição | Constatação e encaminhamento |
| --- | --- |
| 2 — Riff | O MIDI passa de Sol agudo diretamente para Sol grave e não inclui o Lá na 4ª corda/casa 7, presente nas duas referências entre esses pontos. Também redistribui a duração e repete Sol na fronteira dos cards. Prioridade de correção: reconstruir a sequência e o ritmo do recorte pela referência, em vez de apenas inserir uma nota em um tempo arbitrário. As versões diferem em alguns lugares de execução da resposta; cordas diferentes com a mesma altura não são automaticamente erro de nota. |
| 3 — Motivo | As referências mostram expressão na chegada à 2ª corda/casa 12, incluindo bend, que não está no áudio atual. A parte aguda e o Mi na 1ª corda/casa 12 ao final exigem delimitação do recorte: a aula do Guitar Club descreve esse Mi numa continuação com Ré na 2ª corda/casa 15, enquanto o MIDI o acrescenta isoladamente ao final do bloco anterior. Não declarar esse Mi uma nota errada nem substituí-lo sem confirmar a fronteira da frase. |
| 4 — Descida | Guitar Lesson World mostra a ligação Fá♯–Sol–Fá♯ na 3ª corda (11/12/11), seguida de Mi–Ré na 4ª. O recorte atual sustenta/repete Sol e repete Fá♯ antes de Mi–Ré. A região e as alturas de destino conferem, mas ataques, conexão e durações são uma simplificação; reconstrução pela tab deve preservar a ligação, não apenas as quatro classes de notas. |
| 5 — Acordes | Não é extraída do MIDI. E7♯9–G–A e a divisão de um compasso/dois tempos/dois tempos conferem com a aula do Guitar Club. G/A abertos e batidas regulares são escolhas didáticas; não são transcrição da levada e dos voicings completos de Hendrix. |

Direção editorial: usar as referências como fonte da frase estudada e o MIDI como apoio, com correções ou simplificações registradas. Distinguir erro confirmado, nota omitida, delimitação da frase e técnica expressiva. A revisão dos dedos feita em 9 de outubro não equivalia a validar a transcrição de todas as notas e ritmos.

O gerador confere alturas, região e limites temporais. Os testes comparam a abertura com o MIDI, excluindo apenas MIDI 63 em ticks 3360. Para os blocos substituídos, conferem as frases de referência, curvas expressivas, tempos válidos e metadados de edição. A retomada dentro de slides e bends começa na altura correspondente ao ponto pausado, sem reiniciar a curva. A verificação no navegador confere as frequências agendadas, marcações no braço, modo de graus e Stop. São 57 testes automatizados aprovados.

## Apresentação das lições

As lições 1 e 4 mostram cada frase completa em um único card estático. A abertura reúne oito tempos; a descida reúne quatro. As lições 2 e 3 mantêm dois cards. A última lição foi substituída por um estudo dos acordes da base do verso, com um card fixo para E7♯9, um para G e um para A. Os oito blocos de origem continuam preservados nos dados internos.
