# PentaShapes

Aplicativo web para praticar improvisação na guitarra e no violão. Reúne exemplos sonoros, diagramas do braço e trilhas guiadas para relacionar acordes, escalas e frases musicais.

O projeto está em desenvolvimento. A proposta é permitir que a comunidade contribua com o aplicativo e crie novas trilhas usando a mesma estrutura de conteúdo.

## Executar localmente

Com Node.js e npm instalados:

```sh
npm ci
npm run dev
```

Abra o endereço exibido no terminal. A trilha de referência está em `/track/purple-haze/`.

```sh
npm run check    # Verificação de tipos e testes
npm run build    # Verificação e build de produção
npm run preview  # Prévia do build local
```

A aplicação usa TypeScript e Vite. O build inclui o código anterior em `dist/legacy/`, acessível por `/legacy/`. Pushes na `main` publicam `dist/` no [Firebase Hosting](https://pentashapes.web.app).

## Contribuir

Sugestões, relatos de uso, correções e propostas de trilhas são bem-vindos por issues e pull requests.

Antes de criar conteúdo, consulte a [documentação do projeto](docs/README.md), o [modelo de missões](docs/missoes.md) e o [tom de voz](docs/tom-de-voz.md). Informe a autoria, as fontes e as permissões dos materiais enviados.

## Licença

O código autoral, incluindo o legado, usa [AGPL-3.0-only](LICENSE). Uso comercial é permitido; versões derivadas devem cumprir as obrigações de compartilhamento de código previstas na licença, inclusive quando oferecidas pela rede.

Documentação e materiais de terceiros têm termos próprios, descritos em [créditos e escopo das licenças](THIRD_PARTY_NOTICES.md).
