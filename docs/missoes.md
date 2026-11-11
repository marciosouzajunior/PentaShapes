# Missões e leitura de estudo

Uma trilha reúne missões ordenadas. Cada missão trabalha uma ideia musical central com preparação, prática e espaço para experimentar no instrumento. Purple Haze, em `/track/purple-haze/`, é um exemplo de implementação. Suas notas, técnicas, sequência e quantidade de missões pertencem àquela trilha e não definem o conteúdo das demais.

As orientações de autoria abaixo são gerais. Descrições de controles, timbres e navegação registram o comportamento atual da interface compartilhada; não são exigências para incluir determinados assuntos musicais em toda missão.

## Preparar

Preparar abre primeiro e oferece leitura contínua, ilustrada, com papel claro e texto escuro. O percurso abaixo é uma referência de composição, não uma lista obrigatória de blocos. Adapte a ordem e inclua figuras, exemplos e caixas apenas quando contribuírem para o objetivo musical:

1. Título que indique o que perceber ou experimentar.
2. Ilustração simples ligada à escuta.
3. Parágrafo breve situando o exemplo e a tentativa no instrumento.
4. “Ouvir o trecho” com um exemplo sonoro.
5. Explicação da relação musical e diagrama do braço.
6. Uma descoberta ou comparação que permita reaplicar a ideia.
7. Ação de prática que leve a Tocar.

Prefira uma ideia conectada, poucos diagramas e parágrafos curtos. Acrescente subtítulos e caixas quando houver uma mudança de assunto real. Perguntas e balões são opcionais: devem convidar a uma observação concreta. Não repetir a orientação inicial nem acrescentar figuras só como decoração.

Use títulos e corpo legíveis, margens consistentes e legendas discretas junto às figuras. Esboços podem mostrar o contorno ou a sustentação de uma frase; o braço localiza onde tocar. A leitura deve continuar compreensível em uma coluna no celular. Consulte o [tom de voz](tom-de-voz.md).

## Mapas, notas e expressão

Separe eventos tocados, possibilidades de exploração e referências de comparação. Acrescentar uma nota ao desenho não deve inseri-la no áudio.

Escolha o mapa pelo objetivo: uma missão pode trabalhar uma frase, um acorde, um intervalo, um ritmo ou uma escala. Quando uma escala orientar a região, apresente um shape reconhecível e sua relação com o contexto harmônico. Percorrê-lo nos dois sentidos é uma possibilidade para ganhar familiaridade, não um pré-requisito de toda frase ou missão. Não pressupor conhecimento de CAGED; explique o termo quando ele fizer parte da tarefa.

Se o desenho usar tracejado, explique seu significado perto dele e mantenha esse sentido consistente no exemplo. Em Purple Haze, ele pode completar a pentatônica ao redor de uma frase ou indicar notas adicionais em outra missão. São aplicações contextuais, não uma obrigação de usar pentatônica ou tracejado em novos materiais. No desenho de um acorde, distinguir notas tocadas das usadas apenas para comparação.

Conferir afinação, alturas, cordas, casas, região, durações e expressão. Bend muda a altura sem mudar a casa pressionada; slide liga posições por um movimento contínuo. Não mostrar o destino do bend como outro ataque. Prefira figuras estáticas; animação deve esclarecer um gesto e respeitar movimento reduzido.

## Tocar

Tocar concentra prática repetida no painel escuro, com diagramas e controles compartilhados. A pista visual fica próxima de Play/Pausa e Stop e mostra o trecho ativo. Use poucos rótulos e mantenha o mapa disponível durante a resposta.

| Modo | Sequência |
| --- | --- |
| Escuta e resposta | O player demonstra a frase e deixa uma janela com a mesma quantidade de compassos para a pessoa tocar. |
| Tocar junto | O player percorre o acompanhamento e indica cada troca de acorde. |

As rodadas se repetem no mesmo pulso. Contagem inicial é opcional, desmarcada por padrão e aplicada no começo da prática. Na exploração, propor mudar uma chegada, variar o ritmo ou criar uma resposta; não exigir mais notas para demonstrar avanço.

Guitarra clean gravada é o timbre padrão e reproduz as curvas de slides e bends. O piano toca as alturas de partida; demonstrações de bend devem ser ouvidas na guitarra. Os ajustes agrupam exemplo e timbre, metrônomo e contagem, velocidade e volume, e “Mostrar graus”. As duas abas compartilham as preferências persistidas.

## Navegação e conclusão

As abas ficam fixas durante a rolagem e preservam o ponto de leitura. “Ver missões” mostra o percurso, identifica a atual e marca as concluídas. Menus e ajustes fecham com clique externo ou Escape; painéis devem permitir rolagem quando a altura disponível for pequena.

A conclusão é marcada pelo praticante no final de Tocar. A próxima missão fica acessível no mesmo painel. Ao marcar a última, o player pausa e abre uma comemoração com “Parabéns pela prática!” e “Escolher outra trilha”. A mensagem refere-se à última missão, sem afirmar que todas as anteriores foram feitas. Fechar o modal não desfaz o progresso.

No celular e no modo instalado, “Voltar” e o menu do percurso substituem o cabeçalho com marca. No desktop, a marca leva ao início. Validar retrato, paisagem, teclado, foco, menus, modal, movimento reduzido e diagramas sem rolagem lateral da página.

## Autoria e validação

Acrescente conteúdo ao contrato compartilhado, em vez de criar outro player. `src/tracks.ts` define o percurso; `src/study-books.ts` contém leitura; `src/song.ts` e `src/song-missions.ts` executam a experiência. Os estilos de missão ficam em `src/song-missions.css`.

Antes de contribuir, ouça todos os exemplos, toque as posições e verifique a progressão das tarefas. Execute as verificações de [desenvolvimento](arquitetura.md). Novas capacidades devem ser compartilhadas e expressas nos dados da missão, conforme o [contrato de conteúdo](catalogo-e-autoria.md).
