# Government Project Health Tracker

A production-ready full-stack scaffold for monitoring government-funded projects, contractor performance, broker/consultant risk, budget usage, timelines, maintenance cost, audit trails, and automated project health classification.

The platform implements role-based access, dashboard analytics, project tracking, health-score logic, reports, public transparency portal, backend APIs, PostgreSQL schema, Prisma seed data, and deployment documentation.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Recharts, React Hook Form, Zod
- Backend: NestJS, TypeScript, Prisma ORM, PostgreSQL, JWT, bcrypt, Multer, ExcelJS, PDFKit
- Database: PostgreSQL
- Storage: local uploads in development; S3-compatible storage recommended in production

## Apps

```text
government-project-health-tracker/
  frontend/   Next.js dashboard and public portal
  backend/    NestJS REST API and Prisma schema
  docs/       PRD, API documentation, database schema, deployment guide
```

## Quick start

### 1. Start PostgreSQL

```bash
docker compose up -d db
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run start:dev
```

Backend runs on `http://localhost:4000/api`.

Default seeded login:

```text
Email: admin@govtrack.local
Password: Admin@1234
Role: SUPER_ADMIN
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Core features

- Role-based access control for Super Admin, Government Admin, Project Manager, Auditor, Contractor, and Public Viewer
- Project tracking with budget allocated, released, spent, remaining, timeline, progress, maintenance cost, contractor, broker, risk notes, and documents
- Automatic health score: Healthy, Watchlist, or Critical
- Contractor performance profile with success rate, delivered projects, on-time delivery, within-budget delivery, disputes, and blacklisting
- Broker/consultant risk profile with fees, compliance, conflict of interest, risk level, and linked projects
- Maintenance cost tracking and maintenance-heavy project reporting
- Dashboard analytics and charts
- CSV, Excel, and PDF report export endpoints
- Audit logs for sensitive actions
- Public transparency portal that hides broker fees, audit notes, internal risk notes, and sensitive contractor dispute data

## Health scoring summary

The backend computes a score out of 100:

| Dimension | Points |
|---|---:|
| Budget performance | 25 |
| Timeline performance | 25 |
| Physical progress | 20 |
| Contractor track record | 15 |
| Maintenance sustainability | 10 |
| Broker/compliance risk | 5 |

Classification:

- `HEALTHY`: 80 to 100
- `WATCHLIST`: 60 to 79
- `CRITICAL`: below 60

The formula lives in `backend/src/common/utils/health-score.ts` and is reused by project create/update/recalculate flows plus the seed script.

## Production notes

- Use HTTPS and a real reverse proxy in production.
- Move uploaded documents to object storage such as AWS S3, MinIO, or Cloudflare R2.
- Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET` values.
- Configure database backups, point-in-time recovery, and audit log retention.
- Add a WAF or API gateway for public deployments.
- Keep public portal fields explicitly allow-listed.
