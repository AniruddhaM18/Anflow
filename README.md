# Anflow

A visual workflow automation platform. Build automations with a drag-and-drop editor, connect apps via credentials, and run workflows with real-time execution streaming.
## Project Demo
Quality of the video might affect due to upload size limitations.
https://github.com/user-attachments/assets/f178cf6b-1a64-4b21-b531-60123f6bff9d

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169e1?logo=postgresql)
![License](https://img.shields.io/badge/License-ISC-lightgrey)

---

## Features

- **Visual workflow builder** — Design automations with a node-based editor (React Flow)
- **Triggers & actions** — Support for webhooks and actions (e.g. Telegram, Resend)
- **Credentials** — Securely store and reuse API keys (Telegram, Resend)
- **Real-time executions** — Live execution status via Server-Sent Events (SSE)
- **Auth** — JWT-based sign up / sign in with email verification (Resend)
- **Dashboard** — Manage workflows, credentials, and execution history

---

## Tech Stack

| Layer        | Technologies |
|-------------|--------------|
| **Monorepo** | pnpm, Turborepo |
| **Frontend** | React 19, Vite 7, TypeScript, Tailwind CSS 4, Radix UI, shadcn/ui, React Flow (@xyflow/react), Motion |
| **Backend**  | Node.js, Express 5, TypeScript |
| **Database** | PostgreSQL, Prisma |
| **Auth**     | JWT (jsonwebtoken), HTTP-only cookies |
| **Integrations** | Resend (email), Telegram Bot API |
| **Deploy**   | Vercel (client) |

---

## Project Structure

```
Anflow/
├── apps/
│   ├── client/          # React SPA (Vite)
│   └── backend/         # Express API
├── packages/
│   ├── db/              # Prisma schema & client
│   ├── ui/              # Shared React components
│   ├── eslint-config/   # Shared ESLint config
│   └── typescript-config/  # Shared tsconfigs
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Prerequisites

- **Node.js** ≥ 18
- **pnpm** 9.x (`npm install -g pnpm`)
- **PostgreSQL** (local or hosted)

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/Anflow.git
cd Anflow
pnpm install
```

### 2. Environment variables

**Backend** (`apps/backend/`). Create `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
JWT_SECRET="your-jwt-secret"
APP_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"
RESEND_KEY="re_xxxxxxxx"   # For email verification & Resend actions
```

**Client** (`apps/client/`). Create `.env`:

```env
VITE_BACKEND_URL="http://localhost:3000"
```

**Database package** (`packages/db/`). Create `.env` (or use same as backend):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

### 3. Database

From repo root:

```bash
cd packages/db && pnpm prisma generate
pnpm prisma migrate deploy
# Or for dev: pnpm prisma migrate dev
cd ../..
```

### 4. Run development

From repo root:

```bash
pnpm dev
```

- **Client:** http://localhost:5173  
- **Backend:** http://localhost:3000  

To run a single app:

```bash
pnpm dev --filter=client
pnpm dev --filter=backend
```

---

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start all apps in dev mode (Turborepo) |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm check-types` | Type-check all packages |

---

## API Overview

| Base path | Description |
|-----------|-------------|
| `/api/auth` | Sign up, sign in, sign out, session |
| `/api/credentials` | CRUD for credentials (Telegram, Resend) |
| `/api/workflows` | Workflow CRUD |
| `/api/webhook` | Webhook trigger endpoint |
| `/api/execute` | Run workflow / execution status |
| `/api/availableTrigger` | List available triggers |
| `/api/v1/execute/stream` | SSE stream for execution updates |

---

## Deployment

- **Frontend:** Configured for Vercel (`apps/client/vercel.json`). Set `VITE_BACKEND_URL` to your API URL.
- **Backend:** Run on any Node host (e.g. Railway, Render, Fly.io). Set env vars and ensure CORS `allowedOrigins` includes your frontend URL.
- **Database:** Use a hosted PostgreSQL (e.g. Neon, Supabase, Railway) and set `DATABASE_URL` everywhere it’s required.



---

## License

ISC
