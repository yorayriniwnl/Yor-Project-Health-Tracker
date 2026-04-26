# Deployment Guide

## Recommended environments

- Frontend: Vercel, Netlify, AWS Amplify, or static Next.js hosting
- Backend: Render, Railway, AWS ECS/Fargate, DigitalOcean App Platform, Fly.io, or Kubernetes
- Database: Supabase, Neon, AWS RDS, Google Cloud SQL, Azure PostgreSQL, or self-managed PostgreSQL
- Storage: AWS S3, MinIO, Cloudflare R2, or Azure Blob Storage

## Environment variables

Backend:

```text
DATABASE_URL=postgresql://user:password@host:5432/government_project_health?schema=public
JWT_SECRET=replace-with-long-random-secret
JWT_REFRESH_SECRET=replace-with-another-long-random-secret
PORT=4000
CORS_ORIGIN=https://your-frontend-domain.gov
UPLOAD_DIR=uploads
```

Frontend:

```text
NEXT_PUBLIC_API_URL=https://your-api-domain.gov/api
```

## Backend deployment steps

1. Provision PostgreSQL.
2. Configure environment variables.
3. Install dependencies.
4. Run `npx prisma generate`.
5. Run `npx prisma migrate deploy`.
6. Run `npm run build`.
7. Start with `npm run start:prod`.
8. Configure HTTPS, CORS, secure headers, rate limiting, and log retention.

## Frontend deployment steps

1. Configure `NEXT_PUBLIC_API_URL`.
2. Run `npm run build`.
3. Deploy `.next` output through your selected host.
4. Enable HTTPS.
5. Configure strict Content Security Policy in production.

## Security hardening checklist

- Use strong JWT secrets.
- Rotate credentials regularly.
- Enable database encryption at rest.
- Enable automated database backups and point-in-time recovery.
- Restrict database network access.
- Validate uploaded file MIME type, size, and extension.
- Send logs to a secure log management system.
- Monitor failed login attempts and high-risk audit events.
- Run dependency scanning in CI.
- Run database migrations through controlled release pipeline.

## Backup strategy

- Daily full database backup.
- Point-in-time recovery for production.
- Separate document storage backups.
- Monthly restore drill.
- Keep audit logs immutable and retained according to policy.

## Scaling plan

- Start with one API instance and managed PostgreSQL.
- Move uploaded documents to object storage before public launch.
- Add Redis for caching dashboard aggregates and rate-limit counters.
- Add read replica for reporting workloads.
- Add queue workers for PDF/Excel generation at high volume.
- Add data warehouse export for long-term analytics.

## Future improvements

- GIS map dashboard
- AI-assisted anomaly detection
- Procurement integration
- E-signature workflow
- Contractor self-service onboarding
- Public grievance module
- Mobile app for field inspections
- Offline milestone updates
- SMS/email alerts for critical projects
