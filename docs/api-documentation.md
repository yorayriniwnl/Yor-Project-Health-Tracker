# API Documentation

Base URL: `/api`

Authentication: send `Authorization: Bearer <access_token>` for protected routes.

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Login and receive tokens |
| POST | `/auth/logout` | Logout client-side or invalidate refresh token in production extension |
| POST | `/auth/forgot-password` | Start password reset flow |
| POST | `/auth/reset-password` | Complete password reset flow |
| GET | `/auth/me` | Get current user |

## Users

`GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`

## Departments

`GET /departments`, `GET /departments/:id`, `POST /departments`, `PUT /departments/:id`, `DELETE /departments/:id`

## Projects

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/projects` | List projects with pagination, search, filter, sort |
| GET | `/projects/:id` | Get project detail |
| POST | `/projects` | Create project and calculate health |
| PUT | `/projects/:id` | Update project and recalculate health |
| DELETE | `/projects/:id` | Delete project |
| PATCH | `/projects/:id/status` | Update status |
| PATCH | `/projects/:id/progress` | Update progress percentage |
| GET | `/projects/:id/health` | Read health score and breakdown |
| POST | `/projects/:id/recalculate-health` | Recalculate health score |

Supported query parameters for `GET /projects`:

- `search`
- `departmentId`
- `status`
- `healthStatus`
- `contractorId`
- `location`
- `projectType`
- `minBudget`
- `maxBudget`
- `sortBy`
- `sortOrder`
- `page`
- `limit`

## Contractors

`GET /contractors`, `GET /contractors/:id`, `POST /contractors`, `PUT /contractors/:id`, `DELETE /contractors/:id`, `GET /contractors/:id/projects`, `GET /contractors/:id/performance`

## Brokers

`GET /brokers`, `GET /brokers/:id`, `POST /brokers`, `PUT /brokers/:id`, `DELETE /brokers/:id`, `GET /brokers/:id/projects`, `GET /brokers/:id/risk`

## Milestones

`GET /projects/:projectId/milestones`, `POST /projects/:projectId/milestones`, `PUT /milestones/:id`, `DELETE /milestones/:id`

## Maintenance

`GET /projects/:projectId/maintenance`, `POST /projects/:projectId/maintenance`, `PUT /maintenance/:id`, `DELETE /maintenance/:id`

## Documents

`GET /projects/:projectId/documents`, `POST /projects/:projectId/documents`, `DELETE /documents/:id`

Document upload accepts `multipart/form-data` with a `file` field.

## Dashboard

- `GET /dashboard/summary`
- `GET /dashboard/project-health`
- `GET /dashboard/budget-summary`
- `GET /dashboard/department-performance`
- `GET /dashboard/contractor-performance`
- `GET /dashboard/location-performance`
- `GET /dashboard/delayed-projects`
- `GET /dashboard/critical-projects`

## Reports

- `GET /reports/healthy-projects`
- `GET /reports/critical-projects`
- `GET /reports/delayed-projects`
- `GET /reports/over-budget-projects`
- `GET /reports/contractor-performance`
- `GET /reports/broker-risk`
- `GET /reports/maintenance-heavy-projects`
- `GET /reports/department-performance`
- `GET /reports/export?type=project-health&format=csv|xlsx|pdf`

Report filters:

- `from`
- `to`
- `departmentId`
- `location`
- `contractorId`
- `healthStatus`

## Audit

- `GET /audit-logs`
- `GET /audit-logs/:entityType/:entityId`


## Public transparency endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/public/projects` | Public-safe project list with sensitive broker, audit, and dispute data hidden |
| GET | `/api/public/completed-projects` | Public-safe completed project list |
| GET | `/api/projects/public` | Backward-compatible public-safe project list alias |

## Additional report endpoints

| Method | Endpoint |
|---|---|
| GET | `/api/reports/completed-projects` |
| GET | `/api/reports/budget-utilization` |
| GET | `/api/reports/public-transparency` |
