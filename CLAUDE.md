# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AiCal is an Outlook add-in that transforms plain-text event descriptions into calendar events using GPT-4o-mini. Users paste event text (e.g., "Team standup every Monday at 9am") into the side panel, the AI parses it, and Outlook's native appointment form opens pre-filled with the details.

**Key Architecture:**
- **Taskpane UI**: React SPA rendered in Outlook's side panel with 4-screen state machine (Input → Loading → Review → Success)
- **Event Parsing**: OpenAI API call with JSON schema validation
- **Integration**: Office.js API to display Outlook's native `displayNewAppointmentForm`
- **Hosting**: Static site on GitHub Pages (Webpack builds + gh-pages deploy)

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server on https://localhost:3000 (HTTPS required for Office.js)
npm run dev-server

# Build for production (webpack + minification)
npm run build

# Build dev artifact (unminified, source maps)
npm run build:dev

# Watch mode (rebuild on file changes)
npm watch

# Lint and fix code style
npm run lint
npm run lint:fix

# Deploy to GitHub Pages (builds + pushes to gh-pages branch)
npm run deploy

# Validate manifest.xml structure
npm run validate

# Office.js tooling (rarely used)
npm run start      # Start Outlook debugging session
npm run stop       # Stop Outlook debugging session
npm run signin     # M365 account login
npm run signout    # M365 account logout
```

## Code Architecture

### File Structure

- **src/taskpane/** — Main UI (Outlook side panel)
  - `App.tsx` — State machine: screen flow, OpenAI API calls, Outlook integration
  - `taskpane.tsx` — React root entry point (instantiates App)
  - `taskpane.html` — DOM root (`<div id="root">`)
  - `taskpane.css` — Styles
  - **components/** — 4 screen components + utility components
    - `InputScreen.tsx` — Event text input + API key storage
    - `LoadingScreen.tsx` — Spinner while parsing
    - `ReviewScreen.tsx` — Edit parsed fields (title, date, time, location, recurrence, notes)
    - `SuccessScreen.tsx` — Confirmation after appointment opens
    - `GlassButton.tsx`, `GlassSurface.tsx`, `Iridescence.tsx`, etc. — Design system (glassmorphism)

- **src/commands/** — Outlook ribbon button handler
  - `commands.js` — Opens the taskpane (minimal, auto-generated from template)
  - `commands.html` — HTML entry for commands

- **manifest.xml** — Outlook add-in manifest (defines UI placement, permissions, hosting URLs)
- **webpack.config.js** — Webpack config: HtmlWebpackPlugin for taskpane/commands, CopyWebpackPlugin for manifest/assets, dev HTTPS
- **tsconfig.json** — TypeScript config (target ES2017, strict: false, office-js types)

### Data Flow

1. **Input Screen** (`InputScreen.tsx`)
   - User enters event text + saves OpenAI API key (stored in localStorage)
   - Calls `App.handleParse(text, apiKey)`

2. **API Call** (`App.tsx`, lines 25-84)
   - Constructs system prompt with today's date + user's timezone
   - Sends to OpenAI with JSON schema for strict parsing
   - Response: structured `EventData` (title, date, startTime, endTime, location, recurrence, notes)

3. **Review Screen** (`ReviewScreen.tsx`)
   - User edits any field (date picker, time inputs, text fields)
   - Calls `App.handleSchedule(event)`

4. **Outlook Integration** (`App.tsx`, lines 86-103)
   - Calls `Office.context.mailbox.displayNewAppointmentForm()` with parsed fields
   - Outlook's native form opens; user clicks Save
   - Transition to Success Screen

5. **Reset** (`SuccessScreen.tsx`)
   - User clicks "Create Another" to loop back to Input Screen

### Key Design Decisions

- **Client-side API key storage**: localStorage holds the OpenAI key for simplicity (no backend needed). Key never leaves the browser except for OpenAI API calls.
- **Timezone handling**: Prompts the LLM with `Intl.DateTimeFormat().resolvedOptions().timeZone` so parsed times are in user's local timezone, not UTC.
- **JSON Schema validation**: Uses OpenAI's `json_schema` response format (strict mode) to guarantee valid `EventData` structure.
- **Outlook's native appointment form**: Leverages `displayNewAppointmentForm` instead of creating events directly—gives users final review/edit before saving.
- **Glassmorphism design**: Custom React components (BorderGlow, Iridescence, ClickSpark) for premium UI feel; no UI library dependency.

## Important Implementation Notes

### Office.js Context

- `Office.onReady()` — Required before any Office API calls; blocks until Outlook loads the add-in context.
- `Office.context.mailbox.displayNewAppointmentForm()` — Opens Outlook's native appointment dialog. The form is modal; control returns after user closes it.
- HTTPS required in all contexts (dev + prod) because Office.js enforces it for security.

### State Management

`App.tsx` uses local React state (not Redux/Context):
- `screen` — Tracks which component to render (input/loading/review/success)
- `parsedEvent` — Holds parsed `EventData` from OpenAI
- `error` — User-facing error messages

Simplicity is intentional: single component, small data model, no async state library needed.

### Webpack Build

- **Development**: `npm run dev-server` runs webpack-dev-server with HTTPS (using office-addin-dev-certs).
- **Production**: `npm run build` outputs to `dist/` folder. Manifest URLs are rewritten from dev (`https://localhost:3000`) to prod (`https://we1chj.github.io/AiCal/`).
- **Deployment**: `npm run deploy` runs webpack build, then gh-pages pushes `dist/` to the `gh-pages` branch.

### Testing & Debugging

- No automated test suite (component logic is thin; E2E testing would require Outlook + Office.js, not feasible in CI).
- **Manual testing**: Run `npm run dev-server`, use [Microsoft's Office Add-ins local sideload test](https://aka.ms/olksideload) URL with `https://localhost:3000/manifest.xml`.
- **Debugging**: Open browser DevTools in the taskpane to inspect React state, console logs, network requests.

## OpenAI Integration

**Model**: gpt-4o-mini (cost-effective, supports JSON schema)

**Prompt strategy**:
- System message includes today's date + user's timezone (allows LLM to infer dates like "next Monday" and times in correct timezone).
- User message is the raw event text.
- Response: JSON object matching `EventData` interface.

**Error handling**: If OpenAI API fails (network, rate limit, auth), error message is shown; user stays on Input Screen to retry.

## Linting & Style

- **Linter**: `office-addin-lint` (enforces Office.js best practices, TS strict checks)
- **Formatter**: `prettier` (configured by `office-addin-prettier-config`)
- **Run fixes**: `npm run lint:fix`

## Dependency Notes

- **React 19** — Latest; uses React 18+ API (createRoot, JSX transform).
- **TypeScript 6** — Latest; strict mode disabled in tsconfig (not strictly necessary for this project size).
- **Office.js types** — `@types/office-js` (1.0.377) provides intellisense for Outlook API.
- **Webpack 5** — Modern bundler; handles asset loading, dev server, minification.
- **No external UI library** — Design system built with custom React components and CSS (intentional minimalism).

## Deployment & Hosting

- **Live URL**: https://we1chj.github.io/AiCal/
- **Manifest URL for Outlook sideload**: https://we1chj.github.io/AiCal/manifest.xml
- **Host**: GitHub Pages (static, free, no backend).

When deploying:
1. Update version in `manifest.xml` if needed.
2. Run `npm run deploy` (builds + pushes to `gh-pages` branch).
3. Changes go live immediately (no cache busting—consider manifest version bump if users see stale assets).

## Deployment Rule

After any major change, always push to both branches:
1. Commit and `git push origin main`
2. `npm run deploy` (builds + pushes to `gh-pages`)
