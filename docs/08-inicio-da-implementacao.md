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

A nova landing apresenta o propósito, as trilhas previstas e um exemplo visual do braço: [esta frase](https://www.jazzguitar.be/blog/the-lick/) em Ré menor, D–E–F–G–E–C–D, destaca cinco posições entre as casas 5 e 8, sem áudio automático ou controles de lição. O botão “Começar agora” abre a L01; após iniciar, passa a “Continuar lição”, usando `localStorage` versionado. A L01 já tem exemplo sonoro sintetizado, pulso em Am, destaque da nota Lá e registro simples de prática. Ainda faltam uma sequência completa de lições, estrelas, backup e avaliações musicais. Os cartões usam ilustrações vetoriais originais e exibem nível, título, resumo e link. O primeiro abre L01; os outros abrem páginas temporárias que avisam que o conteúdo está em preparação.

O Firebase publica `legacy/`, agora na raiz do domínio, mantendo a experiência antiga até a nova fatia vertical ser validada. Os workflows executam a checagem e o build da nova interface antes da publicação do legado. A troca da pasta de hospedagem para `dist/` será uma decisão explícita de lançamento, após L01–L03, progresso e revisão de mobile/acessibilidade.

## Executar

```powershell
npm ci
npm run dev
npm run check
npm run build
node scripts/serve.mjs
```

O servidor Vite abre a nova interface; o último comando abre `/lab/` e `/legacy/` em `http://127.0.0.1:4173`. `npm run check` inclui TypeScript e 12 testes musicais. A auditoria do legado continua disponível com `node docs/tools/audit-legacy.cjs --summary`.

## Próximo incremento

Extrair a L01 para um contrato de conteúdo reutilizável, completar sua avaliação musical e criar L02–L03. O som atual é uma referência simples para a primeira nota; a microfrase A–C–E, o transporte de áudio reutilizável, estrelas, backup e navegação entre lições vêm nos próximos incrementos.
