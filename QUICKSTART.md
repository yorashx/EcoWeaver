# Quickstart

This guide gets EcoWeaver AI running locally and takes you through the product's main workflow.

## 1. Prerequisites

- Node.js 18 or newer
- npm
- A PostgreSQL database reachable from your machine

Check your Node and npm versions:

```bash
node --version
npm --version
```

## 2. Install Dependencies

From the repository root:

```bash
npm install
```

## 3. Configure the Database

Create a local `.env.local` file with a PostgreSQL connection string:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/ecoweaver
```

The application reads `DATABASE_URL` at runtime. Keep `.env.local` out of version control and use a separate database for local work, staging, and production.

The Drizzle CLI reads the same `DATABASE_URL` from `.env.local` through `drizzle.config.ts`, so the application and schema commands use one connection setting.

Push the current schema:

```bash
npx drizzle-kit push
```

Seed the synthetic Cubbon Park records after the development server is running. The seed route writes users, projects, species, trees, relationships, and corridor data to PostgreSQL.

## 4. Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/seed
```

On Windows PowerShell, the equivalent seed request is:

```powershell
Invoke-WebRequest -Method POST -Uri http://localhost:3000/api/seed
```

The health endpoint should return `{"ok":true}` when `DATABASE_URL` is valid.

## 5. Take the Guided Tour

Start with the simulator preset:

```text
http://localhost:3000/simulator?demo=cubbon-park
```

Then follow this sequence:

1. Open **Map** and select a tree to inspect its profile.
2. Return to **Simulator** and run the featured tree-removal scenario.
3. Compare the connectivity, canopy, corridor, and risk metrics.
4. Open **Bioacoustic AI** (`/bioacoustics`) to inspect urban bird and nocturnal audio recordings.
5. Open **Impact Reports** to generate an environmental impact statement.

### Key routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page and project overview |
| `/map` | Interactive tree inventory and corridor map |
| `/species` | Catalogue of documented tree species |
| `/simulator` | Scenario modeling and connectivity changes |
| `/bioacoustics` | Bioacoustic AI and real-time sensor streams |
| `/canopy-guardian` | Network metrics and health monitoring |
| `/reports` | Printable environmental impact statements |

## 6. Verify Changes

Use the repository's checks before opening a pull request or deploying:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

`npm start` requires a successful `npm run build` first.

## Troubleshooting

### `DATABASE_URL is required`

Confirm that `.env.local` exists at the repository root and contains a valid `DATABASE_URL`. Restart the development server after changing environment variables.

### The health check returns 500

Confirm PostgreSQL is running, the database exists, the credentials are correct, and the host is reachable from the machine running Next.js.

### The seed route fails

Push the schema before seeding. The seed operation is additive and is intended for a fresh demo database; repeated runs can create duplicate demo records.

### The map is blank

Check the browser console and network connection. Leaflet loads map tiles from OpenStreetMap, so the map also needs outbound access to the tile service.

### A tree change disappears after restart

That is expected in the current MVP. Interactive tree mutations use the process-local demo store; they are not persisted to PostgreSQL yet.

## Data and Accuracy Note

The included records are synthetic demonstration data inspired by Cubbon Park. The simulation engine uses a simplified graph of tree nodes and canopy connections. Results are useful for demonstrating the workflow, not for approving construction, estimating biodiversity loss, or replacing a professional environmental assessment.