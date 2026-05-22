# Better Uptime

Better Uptime is a full-stack, TypeScript-based monorepo designed to monitor website availability using distributed workers. We built this relying on Next.js for the interface, PostgreSQL (via Prisma) for persistence, and Redis Streams to manage background job delivery for worker processes that probe websites in real-time.

Note: This project is in active development. The core monitoring pipeline, authentication APIs, OTP signup flow, database schema, and shared UI packages are wired up and working. The main web dashboard is currently rendering an "Under Development" placeholder while we build out the UI.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Workspace Structure](#workspace-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Running the Project](#running-the-project)
- [Database](#database)
- [Redis Streams](#redis-streams)
- [API Reference](#api-reference)
- [Available Scripts](#available-scripts)
- [Development Notes](#development-notes)

## Overview

Better Uptime is built around a simple monitoring loop:

1. Users sign up via email/password or Google OAuth and add their URLs.
2. These websites are saved to PostgreSQL.
3. A background producer periodically grabs all active websites from the database.
4. The producer drops these site-check jobs into a Redis Stream.
5. Distributed worker processes consume these jobs based on their designated region and worker ID.
6. Workers performs HTTP checks, classify each website as `Up` or `Down`, and persist response time metrics as website ticks.

## Architecture

1. apps/docs: Next.js 16 app handling both App Router pages and API routes.
2. apps/producer: Cron-like background service queuing the checks.
3. apps/worker: Stream consumers that execute the HTTP requests and log results.
4. packages/store: Our single source of truth for the Prisma client and schema.
5. packages/redis: Shared Redis Stream client helpers.
6. packages/ui: Shared React components.
7. Tooling packages: eslint-config, typescript-config, and tailwind-config to keep the monorepo strictly typed and formatted.


### Runtime Components

- `apps/docs`: Next.js 16 app with App Router pages and API routes.
- `apps/producer`: background service that queues website checks every 3 minutes.
- `apps/worker`: background service that reads Redis Stream events, checks websites, and writes ticks.
- `packages/store`: Prisma client and database schema.
- `packages/redis`: Redis Stream helper package.
- `packages/ui`: shared React UI components.
- `packages/eslint-config`, `packages/typescript-config`, `packages/tailwind-config`: shared tooling configuration.

## Tech Stack

- Monorepo: Turborepo, pnpm workspaces
- Language: TypeScript
- Web: Next.js 16, React 19, Tailwind CSS 4
- API: Next.js Route Handlers
- Auth: NextAuth.js, Google OAuth, credentials provider
- Database: PostgreSQL, Prisma 7, `@prisma/adapter-pg`
- Queue: Redis Streams
- Email: Resend
- Validation: Zod
- Password hashing: bcrypt
- HTTP checks: Axios
- Tooling: ESLint, Prettier, strict TypeScript

## Workspace Structure

```text
better-uptime/
|-- apps/
|   |-- docs/                 # Next.js web app and API routes
|   |-- producer/             # Queues website checks into Redis
|   `-- worker/               # Consumes checks and stores uptime ticks
|-- packages/
|   |-- store/                # Prisma schema, migrations, Prisma client export
|   |-- redis/                # Redis Stream client helpers
|   |-- ui/                   # Shared React components
|   |-- tailwind-config/      # Shared Tailwind entrypoint
|   |-- eslint-config/        # Shared ESLint flat configs
|   `-- typescript-config/    # Shared TypeScript configs
|-- turbo.json
|-- pnpm-workspace.yaml
`-- package.json
```

## Prerequisites

Install the following before running the project locally:

- Node.js 18 or newer
- pnpm 9.x
- PostgreSQL
- Redis
- A Google OAuth client for Google sign-in
- A Resend API key for OTP emails

## Environment Variables

Create a `.env` file for local development. The Prisma package and runtime services read environment variables with `dotenv`.

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/better_uptime"

NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
JWT_SECRET="replace-with-a-long-random-secret"

GOOGLE_ID="your-google-oauth-client-id"
GOOGLE_SECRET="your-google-oauth-client-secret"

RESEND_API_KEY="your-resend-api-key"
SALT_ROUNDS="10"

REGION_ID="your-region-id-from-the-region-table"
WORKER_ID="local-worker-1"
```

### Variable Notes

- `DATABASE_URL` is required by Prisma and all services that access the database.
- `NEXTAUTH_SECRET` is required by NextAuth and JWT session decoding.
- `GOOGLE_ID` and `GOOGLE_SECRET` are required at app startup because the auth route validates them immediately.
- `RESEND_API_KEY` is required for `/api/send-otp`.
- `REGION_ID` and `WORKER_ID` are required by `apps/worker`.
- Redis uses the default client configuration from `redis.createClient()`, which expects Redis at `redis://localhost:6379` unless configured through Redis client defaults/environment in your runtime.

## Local Setup

Install dependencies:

```bash
pnpm install
```

Generate the Prisma client:

```bash
pnpm --filter @repo/store generate
```

Apply database migrations from the Prisma package:

```bash
cd packages/store
pnpm exec prisma migrate dev
cd ../..
```

Build shared packages used by the Node services:

```bash
pnpm --filter @repo/store build
pnpm --filter @repo/redis-stream build
```

Start PostgreSQL and Redis before running the app, producer, or workers.

## Running the Project

Run the Next.js app:

```bash
pnpm --filter docs dev
```

The web app runs on:

```text
http://localhost:3001
```

Run the producer:

```bash
pnpm --filter producer dev
```

Run a worker:

```bash
pnpm --filter worker dev
```

Run all workspace dev tasks through Turbo:

```bash
pnpm dev
```

For the background services, make sure `@repo/store` and `@repo/redis-stream` are built first because the services import their compiled package outputs.

## Database

The Prisma schema lives in:

```text
packages/store/prisma/schema.prisma
```

### Main Models

- `User`: registered users from credentials or Google OAuth.
- `Website`: URLs owned by users.
- `Region`: worker regions used to group uptime checks.
- `WebsiteTick`: individual uptime check results with response time and status.
- `Otp`: email verification OTP records.

### Website Status Values

```text
Up
Down
Unknown
```

## Redis Streams

The Redis helper package writes to and reads from:

```text
better-uptime:websites
```

The producer writes events shaped as:

```json
{
  "url": "https://example.com",
  "id": "website-id"
}
```

The worker reads with:

- Consumer group: `REGION_ID`
- Consumer name: `WORKER_ID`
- Batch count: `5`

Before running workers, ensure the Redis Stream consumer group exists for the region id you provide. One way to create it locally is:

```bash
redis-cli XGROUP CREATE better-uptime:websites your-region-id $ MKSTREAM
```

Replace `your-region-id` with the `Region.id` value stored in PostgreSQL and used in `REGION_ID`.

## API Reference

The API routes live under `apps/docs/app/api/(v1)`. The `(v1)` folder is a Next.js route group, so it does not appear in the public URL.

### Authentication

```http
GET|POST /api/auth/[...nextauth]
```

NextAuth endpoint configured with:

- Credentials provider
- Google OAuth provider
- JWT/session callbacks that attach `user.id`

### Signup

```http
POST /api/signup
```

Creates a credentials user.

Request body:

```json
{
  "firstname": "Jane",
  "lastname": "Doe",
  "email": "jane@example.com",
  "password": "secure-password"
}
```

### Send OTP

```http
POST /api/send-otp
```

Sends an email verification OTP through Resend and stores it in PostgreSQL.

Request body:

```json
{
  "data": {
    "email": "jane@example.com"
  }
}
```

### Verify Signup OTP

```http
POST /api/signup/verify-otp
```

Validates the submitted OTP and deletes it after successful verification.

Request body:

```json
{
  "data": {
    "email": "jane@example.com",
    "otp": "123456"
  }
}
```

### Add Website

```http
POST /api/add-website
```

Adds a monitored website for a user.

Request body:

```json
{
  "url": "https://example.com",
  "user_id": "user-id"
}
```

### Get Website Status

```http
GET /api/status/:website
```

Returns website details for the authenticated user when the website belongs to the current session user.

### Add Region

```http
POST /api/region
```

Creates a worker region.

Request body:

```json
{
  "region_name": "India"
}
```

## Available Scripts

Run from the repository root:

```bash
pnpm dev          # Run all dev tasks through Turbo
pnpm build        # Build all apps and packages
pnpm lint         # Run lint tasks
pnpm check-types  # Run type checks
pnpm format       # Format TS, TSX, and MD files with Prettier
```

Useful package-level scripts:

```bash
pnpm --filter docs dev
pnpm --filter docs build
pnpm --filter producer dev
pnpm --filter worker dev
pnpm --filter @repo/store build
pnpm --filter @repo/store generate
pnpm --filter @repo/redis-stream build
```

## Development Notes

- The homepage currently displays an "Under Development" placeholder.
- The signup page implements email OTP, password entry, and name fields using the shared `@repo/ui/input` component.
- OTP verification currently treats OTP records as expired after 5 minutes.
- The email template text says the OTP is valid for 2 minutes, so the product copy and server expiry should be aligned.
- The worker writes one `WebsiteTick` per check and currently treats any Axios error as `Down`.
- The producer enqueues all websites every 3 minutes.
- The worker uses a continuous loop and reads up to 5 stream events per poll.
- No test runner is configured yet.

## Production Considerations

Before deploying this project, consider adding:

- Centralized environment management for each app and worker process.
- Redis consumer group creation as part of infrastructure provisioning.
- Retry and dead-letter handling for failed checks.
- Rate limits and authentication checks on mutating API routes.
- A dashboard for website status history and response time trends.
- Automated tests for API routes, Prisma logic, and worker behavior.
- CI steps for `pnpm lint`, `pnpm check-types`, and `pnpm build`.
