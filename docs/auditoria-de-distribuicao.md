# Auditoria de distribuição

Antes de preparar uma distribuição, revise código, textos, exemplos musicais, imagens, gravações, dependências e histórico separadamente. O formato do arquivo não define a natureza do material: TypeScript pode conter prosa, partituras e sequências musicais. Autoria, licença de uso e direito de sublicenciar são verificações distintas.

Execute `node scripts/audit-offer.mjs` na cópia local. O comando não altera Git nem publica arquivos; grava `inventory.json` e `files.md` em `.local-docs/content-offer/`, ignorada pelo Git. A primeira execução pode levar alguns minutos. Os relatórios incluem arquivos atuais, tamanhos, hashes, caminhos históricos, escopo das refs, inventário de blobs e alertas sem os valores encontrados.

O script inspeciona todos os objetos Git locais, inclusive objetos sem referência, e identifica padrões de credenciais, emails e caminhos locais. Um alerta exige revisão do contexto; a ausência de alerta não garante ausência de dados sensíveis. Metadados binários, autoria humana e direitos não são certificados pela ferramenta. Não envie os relatórios privados como parte do produto.

As recomendações do inventário são uma triagem específica dos materiais existentes. `CANDIDATO` não significa aprovado. Arquivos mistos exigem revisão por trecho, e avisos de licença não ampliam os direitos do material. Preserve avisos pertinentes e confirme as regras do destinatário antes de empacotar.

Uma lista de exclusões do checkout não remove versões antigas do Git. Evite copiar a pasta `.git` de trabalho: ela pode conter reflogs, configurações locais, hooks e objetos sem referência. Um clone local com `--no-local --single-branch` preserva os commits ancestrais da branch escolhida sem transportar os reflogs e objetos soltos da origem. Isso não elimina materiais problemáticos presentes nos próprios commits preservados. Não reescreva histórico para contornar essa revisão.

Depois de uma decisão sobre o escopo, valide novamente imports, rotas, exemplos, testes e build. Remover um arquivo importado pode impedir a compilação; retirar um asset copiado pelo build pode deixar uma rota sem imagem ou som. Registre decisões específicas de uma oferta em `.local-docs/`, mantendo esta documentação voltada ao processo de contribuição.
