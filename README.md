# Global Prayers

Global Prayers is a client-side React dashboard for daily Islamic prayer times. It fetches a monthly prayer calendar from the public AlAdhan API, derives the current day's schedule in the browser, highlights the active and next prayer, and displays a random Asma ul Husna entry.

The application is a single-page Create React App project. It has no backend, no authentication, and no required environment variables.

## Features

- Daily prayer schedule for the configured city and country
- Gregorian and Hijri date display from AlAdhan calendar data
- Live current-time card with prayer-window progress
- Current prayer row highlighting and next-prayer badge
- Toggleable remaining/elapsed prayer timing display
- Prayer settings modal for city, country, calculation method, juristic school, higher-latitude adjustment, and midnight calculation
- Browser persistence for prayer settings with `localStorage`
- Language switcher with persisted language choice and RTL document direction support
- 20 configured locales in `src/i18n/config.js`
- Random Asma ul Husna entry loaded from AlAdhan
- Static SEO metadata, favicon manifest, robots.txt, sitemap, and Google tag in `public/`

## Tech Stack

- React 18
- Create React App / `react-scripts`
- JavaScript
- Axios
- i18next, react-i18next, and i18next-browser-languagedetector
- Bootstrap 5 styles/scripts loaded from `public/index.html`
- Font Awesome package CSS imported in `src/index.js`
- Jest and React Testing Library via Create React App
- Global CSS in `src/App.css`

## Architecture Overview

The active application flow is:

```text
src/index.js
  -> PrayersProvider
  -> src/App.js
  -> src/pages/PrayerDashboardPage.js
  -> src/features/prayers/components/PrayerDashboard.js
  -> Header, PrayersTable, AsmaUlHusna
```

State and data fetching are centralized in `src/features/prayers/context/PrayersContext.js`. The provider loads default settings from `src/features/prayers/config/config.js`, merges saved browser settings from `localStorage`, fetches prayer data when settings change, and exposes settings, loading/error state, date metadata, and refresh helpers through context hooks.

Prayer-specific calculations live in `src/features/prayers/utils/prayerTimes.js`. Feature hooks under `src/features/prayers/hooks/` derive the current day, prayer rows, timeline state, next-prayer data, and Asma ul Husna loading state.

Files under `src/Components/`, `src/api/`, and `src/context/` are compatibility re-exports that point to the feature-module implementation. New prayer work should normally go under `src/features/prayers/`.

## Folder Structure

```text
globalprayers/
|-- public/
|   |-- favicon_io/
|   |-- index.html
|   |-- robots.txt
|   `-- sitemap.xml
|-- src/
|   |-- api/                         # compatibility API re-export
|   |-- Components/                  # compatibility component re-exports
|   |-- context/                     # compatibility context re-export
|   |-- features/
|   |   `-- prayers/
|   |       |-- api/                 # AlAdhan API client
|   |       |-- components/          # active prayer UI components
|   |       |-- config/              # default settings and option lists
|   |       |-- context/             # React context and context hooks
|   |       |-- hooks/               # prayer feature hooks
|   |       `-- utils/               # pure prayer-time helpers
|   |-- i18n/                        # i18next setup, locale metadata, resources
|   |-- Images/
|   |-- pages/
|   |-- shared/
|   |-- App.css
|   |-- App.js
|   |-- index.js
|   `-- setupTests.js
|-- package-lock.json
|-- package.json
`-- README.md
```

## Installation

Prerequisite: install Node.js and npm. The project uses `package-lock.json` lockfile version 3, so a modern npm version is recommended.

```bash
npm install
```

## Environment Variables

No environment variables are required by the current codebase.

There is no `.env.example` file and no `process.env` or `import.meta.env` usage in `src/` or `public/`. Local `.env.*.local` files are ignored by `.gitignore`, but the application does not currently read any custom environment values.

## Local Development

```bash
npm start
```

Create React App starts the development server, typically at `http://localhost:3000`.

## Available Scripts

Scripts are defined in `package.json`:

- `npm start` - run the Create React App development server
- `npm run build` - create an optimized production build in `build/`
- `npm test` - run the Jest test runner in interactive mode
- `npm run eject` - eject Create React App configuration

For a one-time non-watch test run:

```bash
npm test -- --watchAll=false
```

## Build Instructions

```bash
npm run build
```

The generated static output is written to `build/`. The current package does not define a `homepage` field, so Create React App builds assuming the app is hosted at `/`.

## Deployment Instructions

This repository does not include deployment-provider configuration such as Docker, Vercel, Netlify, or CI/CD workflow files.

Deploy the contents of `build/` to any static hosting service that can serve a Create React App build. If hosting from a subpath instead of `/`, configure the Create React App `homepage` setting in `package.json` before building.

To preview a production build locally, one option is:

```bash
npx serve -s build
```

## Testing Instructions

The test setup uses Jest, React Testing Library, and `@testing-library/jest-dom` through Create React App. Test initialization lives in `src/setupTests.js`.

Run the full test suite once:

```bash
npm test -- --watchAll=false
```

Current test coverage includes:

- prayer-time utility behavior
- prayer dashboard/page structure
- header language and settings interactions
- prayer table timing, progress, and row states
- i18n configuration and locale metadata
- public metadata, manifest, robots, and sitemap checks
- global CSS layout expectations

## API Overview

The app uses the public AlAdhan API through `src/features/prayers/api/api.js`.

Prayer calendar request:

```text
GET https://api.aladhan.com/v1/calendarByCity/{year}/{month}
```

Query parameters are derived from the current settings:

- `city`
- `country`
- `method`
- `school`
- `latitudeAdjustment`
- `midnightCalculation`

Asma ul Husna request:

```text
GET https://api.aladhan.com/v1/asmaAlHusna/{number}
```

The number is randomly selected from `1` through `99` when the Asma hook loads.

There are no internal backend services or application API routes in this repository.

## Configuration

Default prayer settings live in `src/features/prayers/config/config.js`:

- Country: `Pakistan`
- City: `Rawalpindi`
- Method: `1`
- School: `0`
- Higher latitude adjustment: `Middle of the Night Method`
- Midnight calculation: `Standard (Mid Sunset to Sunrise)`

Persisted browser storage keys:

- `prayerSettings` - prayer settings JSON from `PrayersContext`
- `globalprayers.language` - selected i18n language

## Known Limitations

- The app is fully client-side; AlAdhan API failures directly affect prayer and Asma data.
- Prayer calculations use the browser's current date and time.
- There are no dedicated lint or typecheck scripts beyond Create React App's built-in checks during test/build.
- Deployment target, license, and maintainer policy are not defined in the repository.
- Google Analytics tag `G-YERG4EGZ7C` is embedded directly in `public/index.html`; there is no environment-specific analytics configuration.
