# 09 — Lições oficiais e lições dos usuários

Decisão de arquitetura em 7 de outubro de 2026. O editor e a publicação de lições pessoais são futuros; este documento define limites que já devem orientar o contrato de conteúdo e o progresso.

## Identidade e organização

**Origem não é categoria musical.** Uma lição tem origem `system` ou `user`, identidade estável e uma revisão de conteúdo. Trilha, categoria, estilo e dificuldade são metadados de navegação e podem mudar sem trocar a identidade da lição.

| Campo | Lição oficial | Lição de usuário |
| --- | --- | --- |
| Origem | `system` | `user` |
| Dono do conteúdo | Produto | `ownerId` da conta criadora |
| ID estável | `system:<trackId>:<lessonId>` | `user:<ownerId>:<lessonId>` |
| Coleção na interface | Trilhas oficiais | Minhas lições / coleções pessoais |
| Edição | Publicada por versão do produto | Rascunho do dono; revisão publicada separada |
| Progresso | De quem pratica | De quem pratica, que pode não ser o criador |

O `ownerId` nunca deve ser inferido do progresso: **autoria e participação são relações diferentes**. Mover uma lição pessoal de uma categoria para outra não altera o ID nem apaga o progresso. Duplicar uma lição oficial cria um novo ID de usuário e registra a origem/atribuição; não modifica a lição oficial.

Modelo alvo, a refinar quando houver editor e autenticação:

```typescript
type LessonRef =
  | { source: 'system'; trackId: string; lessonId: string }
  | { source: 'user'; ownerId: string; lessonId: string };

type LessonManifest = {
  ref: LessonRef;
  contentRevision: number;
  collectionId: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  visibility: 'private' | 'unlisted' | 'public';
  attribution?: { sourceRef?: LessonRef; authorLabel: string; license?: string };
};
```

Lições oficiais serão lidas de um catálogo versionado com o app. Um repositório de conteúdo deverá expor operações como `listCollections`, `getLesson` e `getRevision`. No futuro, um adaptador para conteúdo do usuário poderá acrescentar `saveDraft` e `publish`, sem ramificações de autoria espalhadas pela tela da lição, pelo braço ou pelo áudio. Ambos os tipos usam o mesmo validador de passos, notas, tempos e assets.

## Progresso e revisões

O progresso pertence ao **praticante**, referenciado pelo ID estável da lição e pela revisão praticada. A revisão publicada não é sobrescrita enquanto houver pessoas com progresso nela. Uma edição substancial gera nova revisão; o histórico anterior permanece, e o app sinaliza que há material novo sem transferir automaticamente estrelas ou conclusão para competências diferentes.

No MVP sem conta, o progresso fica no dispositivo. A implementação inicial já usa chaves com origem explícita e armazena entradas separadas por lição, com migração do antigo `L01` local. Quando houver login, o usuário decide associar o progresso local à conta. A mesclagem deve ser idempotente, preservar conquistas e mostrar conflitos; não substituir silenciosamente o estado da conta. Um ID anônimo local não vira `ownerId` de conteúdo publicado.

## Permissões e apresentação

- **Trilhas oficiais** e **Minhas lições** serão áreas distintas na navegação; dentro de Minhas lições, o dono poderá criar coleções próprias. Uma futura área de lições compartilhadas é separada das duas.
- Somente o dono edita rascunhos pessoais; uma lição compartilhada pode ser praticada por outros sem lhes conceder edição. Publicação, exclusão e transferência de propriedade exigem regras explícitas no serviço futuro.
- O primeiro editor poderá ser local e privado. Compartilhamento público requer contas, armazenamento, moderação/denúncia, limites de mídia e checagem de autoria/licenças.
- Conteúdo do usuário é dado declarativo validado. Não se aceita HTML/JavaScript executável, links ou arquivos incorporados sem tratamento seguro.

## Possível backend com Firebase

Firebase é uma opção compatível com este modelo, mas Hosting, autenticação e banco de dados são serviços distintos. A implantação atual do projeto usa Hosting para o app legado; ainda não há Authentication nem Cloud Firestore integrados ao novo app.

- **Authentication:** fornece o `uid` estável que pode representar o dono das lições pessoais e o praticante que acumula progresso. O progresso local deve ser mesclado quando a pessoa vincular uma conta, sem sobrescrever conquistas silenciosamente.
- **Cloud Firestore:** pode guardar metadados de trilhas e coleções, rascunhos e revisões publicadas de lições pessoais, além do progresso por praticante e lição. Uma estrutura inicial possível é `users/{uid}/lessons/{lessonId}`, `users/{uid}/collections/{collectionId}` e `users/{uid}/progress/{lessonKey}`. O ID lógico com origem (`system:` ou `user:`) continua sendo a referência entre conteúdo e progresso, independentemente do caminho físico no banco.
- **Security Rules:** devem limitar edição de conteúdo pessoal ao dono e leitura/escrita de progresso ao respectivo praticante. Compartilhamento público exigirá uma política explícita de leitura, publicação e moderação; a interface sozinha não controla permissões.
- **Cloud Storage:** só será necessário se o editor aceitar arquivos enviados por usuários, como imagens ou áudio. Notas, passos e temporização permanecem como dados estruturados. Antes de adotar uploads, verificar plano, custos, limites e regras de acesso.

O catálogo oficial pode continuar versionado com o app no início. Se passar para Firestore, preservar IDs e revisões e migrar por um adaptador de repositório de conteúdo, sem alterar o componente do braço ou o motor de áudio. Firebase é uma opção de infraestrutura, não uma dependência do formato da lição.

Referências: [modelo de dados do Firestore](https://firebase.google.com/docs/firestore/data-model), [Authentication para web](https://firebase.google.com/docs/auth/web/start), [condições das Security Rules](https://firebase.google.com/docs/firestore/security/rules-conditions) e [Cloud Storage](https://firebase.google.com/docs/storage/manage-stored-files).

## Sequência de implementação

1. Antes de L02, consolidar o contrato de lição e o catálogo oficial com IDs e revisões estáveis. Remover textos, áudio e posições musicais codificados diretamente na tela.
2. Manter a camada de progresso independente da origem do conteúdo; testar migração, colisões de ID e mudanças de revisão.
3. Validar as trilhas oficiais com praticantes. Só então prototipar rascunhos locais com prévia e exportação.
4. Decidir autenticação, sincronização e regras de publicação antes de oferecer lições pessoais compartilhadas.

**Não implementado agora:** editor, conta, coleções pessoais, publicação e backend de lições. A separação de IDs no progresso é preparação estrutural, não uma promessa de disponibilidade dessas funções no MVP.
