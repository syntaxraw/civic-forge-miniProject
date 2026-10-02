# CivicForge – Crowdsourced Civic Issue Reporting & Resolution

CivicForge is a React (Vite) frontend with a Node.js/Express API. The API stores users and reports in process memory, so there is no database service or database model layer. Session credentials are signed and held in an HTTP-only cookie; the browser does not persist auth tokens in localStorage.

## Run locally

Requirements: Node.js 18+

```bash
npm run install:all
npm run dev
```

The API runs on `http://localhost:5000` and the web app runs on `http://localhost:5173`.

Demo accounts (password: `password123`):

- Citizen: `asha@demo.dev`
- Authority: `authority@civicforge.dev`
- NGO: `ngo@civicforge.dev`

The server recreates demo users and issues each time it starts. All registrations and changes are lost when the API process stops. Staff self-registration uses `STAFF_CODE` (defaults to `civicforge-staff`). Set `JWT_SECRET` before deployment.

## Features

- Civic issue reporting with map pins, optional photos, and duplicate merging
- Community upvotes, issue status history, priority ranking, and staff actions
- Live issue map with WebSocket updates
- Community leaderboard and status/category stats
- Optional translation through `ANTHROPIC_API_KEY`

## Build

```bash
npm run build
```

The client output is written to `client/dist`.
