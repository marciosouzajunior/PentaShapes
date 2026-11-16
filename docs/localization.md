# English-first authoring

English is the default language of the public catalog, shared renderers, UI message keys and new contributions. Portuguese is a supported localization. The interface still follows the saved language choice or the browser preferences; unsupported preferences fall back to English.

## Content and identifiers

Author new tracks as declarative `TrackContent` objects with `manifest.language: 'en'`. Use stable English IDs and slugs for tracks, missions and musical blocks. Use the shared reader and player; register native English imports in `englishTracks` in `src/track-locales.ts`. New English content does not need a Portuguese source object. Optional translated content must use the same musical events and stable mission IDs, with separate progress references for each language.

`src/tracks.ts` exposes the default English catalog. The two existing tracks retain an adapter over their earlier musical definitions in `src/legacy-track-content.ts`; their English editorial content is in `src/english-content.ts`. This compatibility path is for existing material, not the template for new contributions.

Use English UI message keys from `src/locale.ts`. Keep translated labels out of playback decisions: use phase identifiers such as `along` and `answer`. Pass the locale explicitly when rendering a translation; shared renderers default to English. Use letter note names and explicit `[[note:...]]`, `[[chord:...]]` and `[[degree:...]]` markup in either language.

## URLs and progress

Current English URLs use `/en/track/<english-track-slug>/<english-mission-id>/`. Portuguese uses the same canonical slugs and mission IDs without `/en`. For example:

- `/en/track/minor-pentatonic-part-1/another-starting-point/`
- `/track/minor-pentatonic-part-1/another-starting-point/`

Only current catalog URLs are supported; old URLs have no aliases or redirects. A display ID or route rename must not silently change the progress identity: existing stored lesson references are preserved, including historical Portuguese keys. Use English progress identities for new content. Archived tracks, `/lesson` and `/legacy/` retain their historical identities.

Validate structural integrity with `validateTrack`, musical equivalence across translations, current routes and saved progress compatibility. Run `npm run build` before submitting changes. Follow the pedagogical and editorial guidelines in [mission authoring](missoes.md) and [tone of voice](tom-de-voz.md).
