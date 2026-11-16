# Curadoria de Purple Haze

A trilha apresenta recortes e arranjos de estudo, não uma transcrição integral da gravação nem a comprovação de cada digitação original. A composição é de Jimi Hendrix; autoria do material didático e direitos sobre a obra musical são separados.

Este documento descreve escolhas específicas dessa trilha. Notas, tempos, amplitudes de bend e adaptações aqui registrados não são padrões para outras músicas; cada material precisa de curadoria própria.

## Fontes e dados

- [MIDI World — arquivo usado como apoio de autoria](https://www.midiworld.com/files/1056/).
- [Guitar Control — abertura](https://guitarcontrol.com/page/Guitarcontrol-com/guitarcontrol.com/chords-rhythm-guitar/how-to-play-purple-haze-by-jimi-hendrix/index.html).
- [Guitar Lesson World — tablatura](https://www.guitarlessonworld.com/tablature/purple.htm).
- [Guitar Club — acordes e solo](https://www.guitarclub.io/blog/purple-haze-jimi-hendrix-guitar-lesson-chords-solo).
- [Partitura compartilhada no MuseScore](https://musescore.org/sites/musescore.org/files/2019-02/Purple%20Haze.pdf).

Os eventos curados ficam em `src/data/purple-haze.json`. Os metadados `sourceEdits`, `fingeringReview` e `transcriptionScope` registram alterações, fontes e limitações. `sourceTicks: -1` identifica eventos reconstruídos para estudo, sem correspondência literal de ticks no MIDI de origem.

O MIDI completo não é distribuído com o projeto. O app não precisa dele para funcionar. `npm run prepare:hendrix -- <caminho-do-midi-privado>` refaz a preparação quando uma fonte privada estiver disponível; o comando regrava o JSON e exige revisão do diff. A proveniência histórica não deve ser confundida com um caminho de arquivo necessário à execução.

## Escolhas por trecho

| Trecho | Material e adaptação |
| --- | --- |
| `intro-a`, `intro-b` | Oito ataques alternados de Si♭ em oitavas. Um Mi♭ simultâneo no último ataque da fonte MIDI foi omitido por não ser sustentado pelas referências didáticas da abertura. Tempos e durações dos Si♭ foram preservados. |
| `riff-a` | Si–Ré–Sol–Lá, slide de entrada e bend leve no Sol, com valores rítmicos da partitura de referência. |
| `riff-b` | Sol–Ré solto–Mi grave–Mi na quinta corda, com slide Ré–Mi como um evento contínuo. |
| `riff-variation` | Sol–Lá–Lá–Sol. Ataques e durações de origem preservados; bend de um tom no segundo Lá é uma aproximação de estudo. |
| `solo-a`, `solo-b` | Motivos repetidos em duas regiões, com slides e bends leves conforme a referência. O Mi agudo posterior não integra o recorte. |
| `solo-explore` | Mi–Sol–Lá–Sol–Mi–Sol. As possibilidades adicionais do mapa são separadas dos eventos reproduzidos. |
| `solo-c`, `solo-d` | Material interno de ligação Fá♯–Sol–Fá♯ e chegada a Mi–Ré, com ritmo e slides adaptados para estudo. Não define o percurso atual de missões. |
| Acordes | E7♯9–G–A, com duração de 4–2–2 tempos. Voicings e batidas regulares são escolhas didáticas, não reprodução completa da levada original. |

Uma mesma altura pode usar cordas e casas diferentes conforme a frase. Não aplicar uma tabela global de altura para posição. Uma tablatura ASCII que apenas indica bend não comprova sua amplitude exata; registre aproximações como tais.

Testes conferem alturas, regiões, tempos, curvas expressivas, montagem dos recortes e correspondência entre leitura e reprodução. Eles não certificam a transcrição da gravação. Preserve o histórico de edições nos dados ao revisar notas ou expressão, sem inserir detalhes técnicos desnecessários na leitura do praticante.
