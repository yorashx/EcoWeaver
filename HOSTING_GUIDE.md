# Hosting Guide

EcoWeaver AI is a Next.js Node application with a PostgreSQL dependency. The web process and database can run on the same infrastructure or on separate services, but the deployed application must be able to reach PostgreSQL through `DATABASE_URL`.

## Deployment Requirements

- A Node.js host that supports Next.js 16 and the `npm run build` / `npm start` lifecycle
- PostgreSQL 14 or newer
- `DATABASE_URL` configured as a server-side secret
- A deployment build that runs `npm install` and `npm run build`
- A start command of `npm start`
- `NEXT_PUBLIC_CARTO_API_KEY` configured for the browser map tiles

Do not commit `.env.local`, database URLs, or provider credentials.

## Recommended Topology

For a preview or demonstration:

```text
Git repository -> Vercel or another Next.js host
                         |
                         +-> Managed PostgreSQL
```

For a small always-on installation, Railway, Render, DigitalOcean, or a comparable Node host can run the application beside a managed PostgreSQL service. Choose a region close to the database to reduce latency.

## Before You Deploy

Run the same checks locally that the deployment will run:

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

Review the build output for missing environment variables or server-only imports. The application requires `DATABASE_URL` when the database module is loaded.

## Vercel Deployment

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into Vercel.
3. Keep the framework preset as **Next.js** and the root directory at the repository root.
4. Add `DATABASE_URL` and `NEXT_PUBLIC_CARTO_API_KEY` under the project environment variables for Preview and Production as appropriate.
5. Deploy with the default build settings, or use:

   ```text
   Build command: npm run build
   Install command: npm install
   Output: Next.js default
   ```

6. Provision PostgreSQL through a supported provider and copy its connection string into `DATABASE_URL`.
7. Apply the schema from a trusted machine, then redeploy if necessary.
8. Seed only a fresh demo or staging database.

The map uses CARTO raster tiles in the browser. Create a CARTO API key and add it as `NEXT_PUBLIC_CARTO_API_KEY`; because it is sent to the browser, configure the key's allowed domains/referrers in CARTO when that restriction is available. Redeploy after adding or changing this variable because Next.js embeds public environment variables during the build.

Vercel's database product offerings change over time. The app does not require a provider-specific PostgreSQL integration; it requires a standard PostgreSQL connection string.

## Other Node Hosts

The same application settings work on Railway, Render, DigitalOcean App Platform, and similar services:

```text
Build:  npm install && npm run build
Start:  npm start
Port:   3000, or the platform-provided PORT when supported
Secret: DATABASE_URL=<managed PostgreSQL connection string>
Public: NEXT_PUBLIC_CARTO_API_KEY=<CARTO browser API key>
```

Use the provider's private database URL when the web service and database share a private network. Use the public URL only when the platform requires it.

## Schema and Seed Workflow

The Drizzle CLI configuration in `drizzle.config.ts` reads `DATABASE_URL`, matching the running application. For a hosted database, provide the intended connection string in the shell or a secure local environment file before applying the schema.

Apply the schema:

```bash
npx drizzle-kit push
```

Check the deployed database connection:

```bash
curl https://your-domain.example/api/health
```

Seed synthetic demo data only when required:

```bash
curl -X POST https://your-domain.example/api/seed
```

The seed operation inserts demo users, a project, species, trees, tree-species relationships, and a corridor. It is not an idempotent production migration, so do not run it repeatedly against a live application database without reviewing the seed code and existing records.

## Post-Deployment Verification

Check the following in the deployed environment:

```text
GET  /                         Home page renders
GET  /map                      Map page renders
GET  /species                  Species page renders
GET  /simulator                Simulator loads
GET  /api/health               PostgreSQL connection returns {"ok":true}
GET  /api/trees                Tree data is returned
GET  /api/corridors            Corridor data is returned
GET  /api/simulations          Presets are returned
POST /api/simulations          A small test action returns results
```

Also open `/simulator?demo=cubbon-park` and confirm that the featured scenario can be completed from selection through results.

## Security and Operations

Before exposing the application to real users, address these items:

- Restrict database credentials to the server environment; never use a `NEXT_PUBLIC_` variable for secrets.
- Add authentication and authorization to mutation and seed routes.
- Protect or disable `/api/seed` outside a controlled demo environment.
- Add rate limiting and request validation to public API routes.
- Use database backups, monitoring, structured logs, and an error-reporting service.
- Configure a separate database for production and staging.
- Confirm that the database provider accepts connections from the deployment platform.
- Establish a migration process instead of applying schema changes ad hoc.
- Review OpenStreetMap tile usage and choose an appropriate tile provider for sustained traffic.

## Current Production Boundary

The PostgreSQL schema and seed pipeline are present, but the interactive tree and simulation APIs currently read from a process-local in-memory store. Changes made through those APIs are not durable and may diverge across multiple instances. Treat the current deployment as a single-instance demonstration or preview until the data store is backed by PostgreSQL and mutations are protected.

## Custom Domains and HTTPS

Configure the domain through your hosting provider, then add the provider's DNS records. Managed platforms generally provision HTTPS automatically after DNS verification. After the certificate is active, verify both the main URL and `/api/health` over HTTPS.

## Rollbacks

Keep deployments tied to immutable commits. If a release fails:

1. Roll back the web deployment to the previous known-good commit.
2. Review application and database logs.
3. Avoid rolling back database schema changes blindly; restore or migrate data deliberately.
4. Re-run `/api/health` and the simulator workflow after recovery.