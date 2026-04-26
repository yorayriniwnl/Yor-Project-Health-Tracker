# Security Model

## Authentication

- JWT access tokens
- Refresh token support through configured refresh secret
- Password hashing with bcrypt
- Role-based access control guards

## Role access

- Super Admin: all users, departments, projects, audit logs, and reports
- Government Admin: department project management
- Project Manager: project progress, milestones, maintenance, and documents
- Auditor: read all details, review risks, add audit remarks, export reports
- Contractor: assigned project and milestone updates
- Public Viewer: public portal only

## Protection controls

- Helmet secure headers
- CORS allow-list
- Rate limiting through NestJS throttler
- ValidationPipe with whitelist and transformation
- Prisma parameterized queries for SQL injection protection
- File upload MIME and size validation
- Audit log capture for sensitive actions
- Public portal uses explicit field allow-list
