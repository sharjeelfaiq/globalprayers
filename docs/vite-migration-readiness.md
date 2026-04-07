# Vite Migration Readiness

## Current state

- The app is still built with Create React App via `react-scripts`.
- Most application code is plain React and already portable to Vite.
- Prayer domain logic now lives under `src/features/prayers/`, which reduces migration risk by isolating application code from bundler concerns.

## CRA-specific assumptions to clean up first

- `public/index.html` currently owns Bootstrap CDN assets and Google Analytics tags.
- Asset and manifest references should be reviewed during migration because Vite handles HTML entrypoints and public assets differently.
- If environment variables are introduced later, they will need `VITE_` prefixes after migration.
- [SPECIFY_TIMELINE] for when bundler modernization should happen relative to feature delivery.

## Recommended migration order

1. Keep the feature architecture stable and complete current refactors.
2. Move any runtime-critical HTML/script assumptions out of `public/index.html` where practical.
3. Confirm static asset paths and analytics bootstrapping strategy.
4. Create a Vite branch and port scripts, HTML entry, and env conventions.
5. Run parity checks for local dev, production build, and deployed asset loading.
