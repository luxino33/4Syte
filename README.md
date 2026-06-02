# 4Syte — Supplier Registration & B-BBEE Validation Platform

A production-ready Next.js 14 (App Router) application for South African supplier self-registration, B-BBEE document validation, and procurement onboarding.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + Poppins Bold 700 headings |
| Forms | React Hook Form + Zod (shared client/server) |
| Database | PostgreSQL via Prisma ORM v7 |
| Auth | Auth.js v5 (credentials + JWT) |
| Storage | S3-compatible (MinIO for dev, AWS S3 for prod) |
| Email | Pluggable (console / Resend / SMTP) |
| AI | Anthropic API — B-BBEE document extraction only |
| Jobs | DB-backed job queue (swap for BullMQ/Redis in prod) |

---

## Prerequisites

- Node.js 20+
- Docker + Docker Compose (for Postgres + MinIO)
- Anthropic API key (for B-BBEE validation — get one at console.anthropic.com)

---

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
# Edit .env.local — set NEXTAUTH_SECRET and ANTHROPIC_API_KEY at minimum
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Start infrastructure

```bash
docker-compose up -d
# Postgres: localhost:5432  |  MinIO API: localhost:9000  |  MinIO Console: localhost:9001
```

### 4. Database setup

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run

```bash
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Min 32-char random string |
| `NEXTAUTH_URL` | Yes | App base URL |
| `S3_ENDPOINT` | Yes | MinIO/S3 endpoint |
| `S3_REGION` | Yes | e.g. `us-east-1` |
| `S3_BUCKET` | Yes | Bucket name |
| `S3_ACCESS_KEY_ID` | Yes | Access key |
| `S3_SECRET_ACCESS_KEY` | Yes | Secret key |
| `S3_FORCE_PATH_STYLE` | Dev | Set `true` for MinIO |
| `EMAIL_PROVIDER` | Yes | `console` / `resend` / `smtp` |
| `EMAIL_FROM` | Yes | Sender address |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key |

---

## Commands

```bash
npm run dev              # Development server
npm run build            # Production build
npm run lint             # ESLint
npm run test             # Vitest unit tests
npm run test:e2e         # Playwright E2E
npx prisma studio        # DB GUI
npx prisma migrate dev   # New migration
```

---

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/register` | Create account |
| `/login` | Sign in |
| `/app/register/step-1` | Wizard: Company Information |
| `/app/register/step-2` | Wizard: Address & Contacts |
| `/app/register/step-3` | Wizard: B-BBEE Practices |
| `/app/register/step-4` | Wizard: Products & Bank |
| `/app/register/step-5` | Wizard: Supporting Documents |
| `/app/register/step-6` | Wizard: B-BBEE Validation submission |
| `/app/bee/template` | Affidavit draft review & re-upload |
| `/app` | Supplier status dashboard |
| `/admin` | Admin queue |
| `/admin/suppliers/[id]` | Supplier detail + review |
| `/admin/onboarding` | Onboarding pipeline |
| `/admin/dashboard` | Reporting dashboard |

---

## B-BBEE Validation Engine Architecture

Three-layer pipeline in `src/lib/bee-validation/`:

**Layer A — Extraction (AI):** Anthropic API extracts structured JSON (level, ownership %, sector, dates, issuing body, confidence) from uploaded PDFs/scans. Output is Zod-validated; low-confidence fields route to INDETERMINATE.

**Layer B — Rules Engine (deterministic):** Data-driven rules check cross-consistency, document-type correctness (affidavit vs. certificate by classification), SANAS accreditation, validity window, ownership logic. Returns VALID / INVALID / INDETERMINATE. The LLM never makes this decision.

**Layer C — Outcome:** VALID → onboarding. INVALID → pre-populated affidavit PDF generated → supplier notified → re-upload loop. INDETERMINATE → admin review queue.

---

## Swappable Integrations (`src/lib/integrations/`)

| Interface | Swap target |
|---|---|
| `ocr.ts` | AWS Textract, Google Vision |
| `email.ts` | Resend, SendGrid, SMTP |
| `sanas.ts` | Live SANAS registry API |
| `cipc.ts` | CIPC company registry API |
| `erp.ts` | SAP, Oracle, custom ERP |
| `vetting.ts` | Transunion, Experian |
