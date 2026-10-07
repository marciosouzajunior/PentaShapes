# PentaShapes — diagnóstico e plano de evolução

Data: 6 de outubro de 2026. Base examinada: commit `e4be80a` (`custom shape labels`).

Esta documentação começou pelo diagnóstico do legado e planejamento do novo produto. A versão antiga agora está em `legacy/`; a nova entrada, ainda inicial, usa Vite e TypeScript. O laboratório visual permanece em `public/lab/` e o componente musical em `public/components/`. Currículo, progresso e gamificação continuam planejados, ainda sem implementação.

## Direção recomendada

Transformar o visualizador em uma prática guiada de improvisação para **quem já toca acordes e quer começar a improvisar**, público confirmado pelo autor. A primeira experiência deve levar a uma pequena frase musical com acompanhamento e objetivo claro.

Começar com um recorte da pentatônica menor de Lá, ritmo, pausas e resolução. Expandir a mesma ideia para uma posição inteira, uma posição vizinha e notas dos acordes. Introduzir CAGED como mapa de relações entre acordes e posições. Alternar escalas vem depois de aprender a usar uma delas musicalmente.

## Documentos

| Documento | Conteúdo |
| --- | --- |
| [01 — Funcionamento atual](01-estado-atual.md) | Arquitetura real, inventário, algoritmos, catálogo musical, regras, limitações e riscos do legado |
| [02 — Método e currículo](02-metodo-e-curriculo.md) | Pesquisa com fontes, raciocínio pedagógico, primeira trilha e critérios de aprendizagem |
| [03 — Produto e MVP](03-produto-e-mvp.md) | Escopo, jornada, estrelas, desbloqueios, persistência e critérios de aceite |
| [04 — Arquitetura e execução](04-arquitetura-e-execucao.md) | Modelo de domínio, reaproveitamento, etapas do refactor, testes e decisões pendentes |
| [05 — Experiência e direção visual](05-experiencia-e-direcao-visual.md) | Telas, hierarquia, comportamento do braço, linguagem, cores e acessibilidade |
| [06 — Braço reutilizável](06-braco-reutilizavel.md) | Nova implementação independente, execução local, contrato, testes e validação visual pendente |
| [07 — Prontidão para implementação](07-prontidao-implementacao.md) | Decisões congeladas, configurações, localização, mobile, privacidade, QA e ordem de construção |
| [08 — Início da implementação](08-inicio-da-implementacao.md) | Estrutura do mesmo repositório, legado isolado, nova entrada, execução e próximo incremento |
| [09 — Lições oficiais e dos usuários](09-licoes-oficiais-e-dos-usuarios.md) | Identidade, autoria, categorias, revisões e separação do progresso para um futuro editor |
| [Auditoria reproduzível](tools/audit-legacy.cjs) | Conferência das notas, intervalos e estrutura dos presets existentes |

## O que já está estabelecido

- Preservar a ideia musical central e o conhecimento útil do braço; redesenhar a experiência e reorganizar a implementação.
- Construir em etapas sem publicar a nova interface antes de concluir a primeira trilha.
- Público inicial: praticante com acordes básicos, iniciando improvisação.
- Guitarra e violão; visual moderno, leve, arredondado e sofisticado.
- Progresso sem conta no MVP; autenticação pode entrar depois.

## Propostas centrais para discussão

- Uma trilha Fundamentos de 12 lições curtas, com áudio de referência e acompanhamento simples; depois, múltiplas trilhas por objetivo e dificuldade.
- Prática no instrumento com autoavaliação explícita e exercícios visuais verificáveis na tela. Reconhecimento de áudio fica fora do primeiro MVP.
- Até três estrelas por lição; pontos derivados das estrelas, sem pontuação infinita por repetição.
- `localStorage` para progresso entre visitas, com exportação/importação. `sessionStorage` não atende sozinho a esse objetivo.
- Interface centrada em “Continuar prática”; explorador de escalas como ferramenta secundária.
- Primeira entrega de construção: três lições completas para validar a experiência; depois ampliar às 12.

## Evidência e limites

A auditoria por Node conferiu 102 notas do braço, 301 entradas de intervalos e a estrutura de 12 presets (1.224 células de HTML). Não encontrou divergências nas notas do braço nem nos intervalos checados. Encontrou classes de tônica e inatividade coexistindo nos presets, comportamento coerente com problemas de estado descritos no diagnóstico.

Essas verificações não validam ergonomia de digitação, correspondência pedagógica dos nomes CAGED, animações ou experiência mobile. A primeira revisão do legado foi baseada em HTML/CSS/JS; a nova entrada recebe validação separada no navegador local.

Para reproduzir, na raiz do repositório:

```powershell
rtk proxy node docs/tools/audit-legacy.cjs --summary
```

O comando sem `--summary` mostra o catálogo completo. O script somente lê os arquivos do legado e avalia seus objetos locais; não é um parser para arquivos de terceiros nem uma suíte completa de testes do aplicativo.
