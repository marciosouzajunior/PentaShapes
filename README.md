# PentaShapes

A web app for practising improvisation on electric and acoustic guitar. It brings together audio examples, fretboard diagrams and guided learning tracks to connect chords, scales and musical phrases.

The project is under development. The aim is to let the community contribute to the app and create new tracks using the same content structure. English is the default authoring language; the current tracks and interface also support Portuguese.

## Run locally

With Node.js and npm installed:

```sh
npm ci
npm run dev
```

Open the URL shown in the terminal. The English Purple Haze track is available at `/en/track/purple-haze/`. The home page follows your browser's language preferences; you can change the language in the header.

```sh
npm run check    # Type checking and tests
npm run build    # Checks and production build
npm run preview  # Preview the local build
```

The app uses TypeScript and Vite. The build includes the legacy app in `dist/legacy/`, accessible at `/legacy/`. Pushes to `main` deploy `dist/` to [Firebase Hosting](https://pentashapes.web.app).

## Contribute

Suggestions, feedback, fixes and track proposals are welcome through issues and pull requests.

Before creating content, read the [English-first authoring guide](docs/localization.md), the [project documentation](docs/README.md), the [mission model](docs/missoes.md) and the [tone of voice guidelines](docs/tom-de-voz.md). Most of the detailed documentation is currently in Portuguese. Include authorship, sources and permissions for the materials you submit.

## License

Project-authored code, including the legacy app, is licensed under [AGPL-3.0-only](LICENSE). Commercial use is permitted; derivative versions must comply with the license's source-sharing obligations, including when made available over a network.

Documentation and third-party materials have their own terms, described in the [licensing scope and third-party notices](THIRD_PARTY_NOTICES.md).
