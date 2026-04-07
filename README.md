# Global Prayers

Global Prayers is a client-side React application that displays daily Islamic prayer times for a selected city and country. It retrieves a monthly prayer calendar from the AlAdhan API, highlights the current prayer, shows the countdown to the next prayer, and surfaces a randomly selected name from Asma ul Husna.

The app is built as a single-screen dashboard with local, browser-based persistence for prayer calculation preferences. It is intended to be simple to run, easy to customize, and deployable as a static frontend.

## Overview

### What the app does

- Fetches monthly prayer times by city and country from the AlAdhan API
- Displays today's Gregorian and Hijri dates
- Shows the current local time
- Calculates and displays the time remaining until the next prayer
- Highlights the currently active prayer row
- Lets users change calculation method, juristic school, and location settings
- Persists prayer settings in `localStorage`
- Displays a random Asma ul Husna entry on load

### Current scope

- Frontend-only application
- No authentication
- No backend or internal API routes
- No environment-specific configuration currently required

## Tech Stack

- React 18
- Create React App (`react-scripts`)
- Axios
- Bootstrap 5
- Font Awesome
- Browser `localStorage`
- AlAdhan public API

## Architecture

This project follows a lightweight client-side architecture:

1. `src/index.js` bootstraps React and wraps the app in `PrayersProvider`.
2. `src/features/prayers/context/PrayersContext.js` stores user settings, persists them to `localStorage`, fetches prayer-time data, and exposes derived values such as today's dates.
3. `src/features/prayers/api/api.js` centralizes requests to the AlAdhan API and normalizes settings before requests are sent.
4. Feature components under `src/features/prayers/components/` consume hooks/context and render the UI.
5. Legacy paths under `src/context/`, `src/api/`, and `src/Components/` remain as thin compatibility wrappers while the feature module becomes the default place for new work.

### Data flow

1. Default settings are loaded from `src/features/prayers/config/config.js`.
2. If saved settings exist in `localStorage`, they override the defaults.
3. When settings change, the provider stores the new values and refetches the monthly prayer calendar.
4. Utilities and hooks derive today's timings from the fetched month-level response and render live countdown/time-based UI on the client.

### Architectural notes

- Prayer settings are managed globally through React Context rather than prop drilling.
- The app fetches the entire month and then selects the current day locally.
- Time-sensitive UI such as the clock and active prayer row is calculated in the browser with shared hooks.
- Bootstrap is loaded from CDN in `public/index.html` for styling and dropdown behavior.

## Project Structure

```text
globalprayers/
|-- docs/
|   `-- vite-migration-readiness.md
|-- public/
|   |-- favicon_io/
|   `-- index.html
|-- src/
|   |-- api/
|   |   `-- api.js
|   |-- Components/
|   |   `-- ...
|   |-- context/
|   |   `-- prayersContext.js
|   |-- features/
|   |   `-- prayers/
|   |       |-- api/
|   |       |   `-- api.js
|   |       |-- components/
|   |       |   `-- ...
|   |       |-- config/
|   |       |   `-- config.js
|   |       |-- context/
|   |       |   |-- hooks.js
|   |       |   `-- PrayersContext.js
|   |       |-- hooks/
|   |       |   `-- ...
|   |       `-- utils/
|   |           |-- prayerTimes.js
|   |           `-- prayerTimes.test.js
|   |-- Images/
|   |   `-- mosque-bg.jpg
|   |-- pages/
|   |   `-- PrayerDashboardPage.js
|   |-- shared/
|   |   `-- hooks/
|   |       `-- useCurrentTime.js
|   |-- App.css
|   |-- App.js
|   `-- index.js
|-- package-lock.json
|-- package.json
`-- README.md
```

## Key Modules

### `src/features/prayers/context/PrayersContext.js`

Central application state for:

- Active prayer settings
- Saved settings persistence
- Monthly prayer time data
- Async state such as loading, errors, and last refresh time
- Derived display values such as Gregorian and Hijri dates

### `src/features/prayers/api/api.js`

API abstraction for:

- `getData.prayerTimes(params)` to fetch the prayer calendar by city
- `getData.asmaUlHusma()` to fetch a random Asma ul Husna entry
- settings normalization before external API requests

### `src/features/prayers/utils/prayerTimes.js`

Pure domain helpers for:

- selecting today's data from the monthly response
- filtering the display prayer list
- formatting prayer times
- calculating the next prayer and active prayer window

### `src/features/prayers/hooks/`

Feature hooks for:

- current-day prayer selection
- next-prayer countdown derivation
- display-row derivation
- Asma ul Husna async state

### `src/Components/Header/Header.js`

Settings UI for:

- Calculation method
- City
- Country
- Juristic school
- Higher latitude adjustment
- Midnight calculation mode

### `src/Components/NextPrayer/NextPrayer.js`

Computes the next upcoming prayer and updates the countdown every minute.

### `src/Components/PrayersTable/PrayersTable.js`

Builds a display table from the current day's timings and highlights the active prayer window.

## External APIs

This project depends on the [AlAdhan API](https://aladhan.com/prayer-times-api).

### Prayer times

- Base endpoint: `https://api.aladhan.com/v1/calendarByCity/{year}/{month}`
- Used for monthly prayer times filtered by:
  - `city`
  - `country`
  - `method`
  - `school`
  - `latitudeAdjustment`
  - `midnightCalculation`

### Asma ul Husna

- Base endpoint: `https://api.aladhan.com/v1/asmaAlHusna/:number`
- A random number from `1` to `99` is selected on load

## Installation

### Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended

### Setup

```bash
npm install
```

## Running the Project

### Development

```bash
npm start
```

This starts the Create React App development server, typically at [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Serve the production build locally

One common option is:

```bash
npx serve -s build
```

## Environment Variables

No environment variables are currently required by the codebase.

If you later need configurable API endpoints, analytics IDs, or deployment-specific options, add them here:

```env
[SPECIFY_ENV_VAR_NAME]=[SPECIFY_VALUE]
```

## Available Scripts

Defined in `package.json`:

- `npm start` - Runs the app in development mode
- `npm run build` - Creates a production build
- `npm test` - Runs the test runner
- `npm run eject` - Exposes Create React App configuration

## Configuration

Default app settings live in `src/features/prayers/config/config.js`.

Current defaults:

- Country: `Pakistan`
- City: `Rawalpindi`
- Method: `1`
- School: `0`
- Higher latitude adjustment: `Middle of the Night Method`
- Midnight calculation: `Standard (Mid Sunset to Sunrise)`

User changes are saved in browser `localStorage` under the key:

```text
prayerSettings
```

## UI and User Experience

- Background image and global styles are defined in `src/App.css`
- Bootstrap dropdown behavior is provided via CDN scripts in `public/index.html`
- Font Awesome is used for the settings icon
- Google Analytics is embedded directly in `public/index.html`

## API / Route Surface

There are no internal application routes or backend API endpoints in this repository.

The frontend uses:

- `GET https://api.aladhan.com/v1/calendarByCity/{year}/{month}`
- `GET https://api.aladhan.com/v1/asmaAlHusna/:number`

## Testing

Prayer-domain utility coverage lives in `src/features/prayers/utils/prayerTimes.test.js`.

Run tests with:

```bash
npm test
```

## Deployment Notes

- The app builds successfully with `npm run build`
- The generated output is static and can be deployed to any static hosting platform
- The current build assumes the app is hosted at `/`
- If deploying under a subpath, set `homepage` in `package.json` as needed

## Limitations and Trade-offs

- The app is fully client-side, so external API availability directly affects functionality
- Async loading and failure states are lightweight and intentionally minimal
- Prayer times are derived from the current browser date/time rather than a server-synchronized source
- Test coverage currently focuses on pure prayer-domain logic rather than UI integration

## Development Notes

- Add prayer business logic under `src/features/prayers/utils/`
- Add prayer-specific hooks under `src/features/prayers/hooks/`
- Add shared cross-feature hooks under `src/shared/hooks/`
- Add new prayer UI in `src/features/prayers/components/`
- Keep legacy wrapper files only for compatibility while the feature module becomes the default place for new changes

## Modernization Notes

Bundler migration prep is tracked in `docs/vite-migration-readiness.md`.

## Missing or Unclear Context

The following areas are not fully defined in the current codebase and should be confirmed if this project is being prepared for broader use:

- Intended deployment target: `[SPECIFY_HOSTING_PLATFORM]`
- Supported browsers/devices: `[SPECIFY_BROWSER_SUPPORT_POLICY]`
- Ownership/maintainer details: `[SPECIFY_TEAM_OR_OWNER]`
- License: `[SPECIFY_LICENSE]`
- Whether Google Analytics tracking ID `G-YERG4EGZ7C` is production-approved for all environments: `[CONFIRM_ANALYTICS_POLICY]`

## Contributing

Basic contribution flow:

1. Fork or branch from the main code line.
2. Install dependencies with `npm install`.
3. Run the app locally with `npm start`.
4. Make focused changes and verify they build with `npm run build`.
5. Add or update tests where applicable.
6. Open a pull request with a clear summary of the change.

## License

[SPECIFY_LICENSE]
