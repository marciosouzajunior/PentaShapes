# Catálogo e autoria de trilhas

Fundamentos e repertório devem usar o mesmo contrato declarativo, com autoria, metadados de descoberta, identidade estável e progresso independente. Uma trilha nova deve acrescentar conteúdo ao player e ao leitor compartilhados.

## Implementação atual

`src/track-model.ts` define `TrackManifest`, `TrackContent` e `validateTrack`. `src/tracks.ts` reúne trilhas, enquanto `src/content-catalog.ts` combina suas lições com o catálogo anterior de fundamentos para navegação e retomada. Parte da landing e o fluxo de fundamentos ainda têm código específico.

O manifesto contém versão do esquema, ID, slug, título, resumo, dono, autor, origem, idioma, propósito, instrumentos, estilos, assuntos, técnicas, pré-requisitos e revisão de publicação. Uma obra musical é opcional e identifica título e artista, separados de quem criou o material didático. Os tipos do código são a referência exata dos campos aceitos.

`TrackContent` reúne manifesto, pulso, lições ordenadas, blocos musicais, leitura e fontes. Um bloco descreve notas, tempo e duração, expressão, região e mapa. Referências visuais e notas disponíveis para improvisação não participam automaticamente da reprodução.

`validateTrack` verifica identidade, pulso, duplicação de IDs, regiões, alturas, tempos, referências a blocos e leituras, coerência entre mapa/acorde e identidade do progresso. Use a mesma validação para exercícios próprios e repertório adaptado. Testes adicionais precisam conferir a intenção musical, não apenas a validade estrutural.

## Identidade e progresso

IDs não são títulos nem posições na sequência. Alterar nome, slug ou ordem não deve apagar progresso. Ao renomear rotas, preserve aliases existentes. Purple Haze usa `hendrix-purple-haze-missions` como identidade, mesmo que a URL ou o título mudem.

`src/content-identity.ts` distingue referências oficiais (`system`, trilha e lição) e de usuário (`user`, dono e lição). Esse é um contrato existente, não uma implementação de contas ou publicação comunitária. Antes de ampliar conteúdo de usuário, resolver explicitamente o agrupamento atual por dono e a identidade de várias trilhas do mesmo autor. Migrações precisam mapear chaves antigas.

O progresso pertence a quem pratica; não vai no arquivo compartilhado da trilha. Uma revisão com exercício diferente não deve herdar conclusão silenciosamente. Preferências de prática são separadas da autoria e da publicação do conteúdo.

## Autoria e fontes

Separe propósito (fundamentos ou repertório), assuntos (pentatônica, ritmo, blues) e autoria. Artista da composição, criador da trilha e curador do catálogo são papéis diferentes. Descreva pré-requisitos concretos e não invente dificuldade ou duração para preencher um card.

Contribuições devem informar fontes, autoria e permissões dos exemplos e assets. MIDI é uma fonte possível de preparação, não uma dependência obrigatória de uma trilha. Registre adaptações e preserve proveniência sem incluir arquivos privados, legendas integrais ou dados pessoais. Veja [referências musicais](referencias-musicais.md) e [termos de conteúdo](../THIRD_PARTY_NOTICES.md).

## Evolução do catálogo

Editor, contas, rascunhos privados, uploads e pesquisa remota ainda não estão implementados. A evolução deve separar:

1. Metadados leves de descoberta e cards.
2. Conteúdo completo da trilha e das missões.
3. Publicação, revisões e permissões.
4. Progresso individual.

Um futuro editor deve produzir o mesmo formato usado pelas trilhas oficiais, sem executar JavaScript ou HTML enviados por usuários. Importações precisam validar estrutura, limites musicais e referências de assets. Origem oficial e permissão de edição devem vir do serviço autenticado, não de campos livremente enviados.

Pesquisa futura combina texto e filtros por dados independentes da interface, com limite, cursor e ordenação estável. Separar metadados de exemplos e áudio evita baixar todo o catálogo para pesquisar. Começar com o adaptador local e poucos filtros; a interface não deve pressupor que um backend ou editor já existe.
