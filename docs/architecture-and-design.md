# Architecture and Design

## Frontend page structure

- `/login`: email/password login and role-based redirect
- `/dashboard`: executive project health dashboard
- `/projects`: searchable, filterable, export-ready project table
- `/projects/new`: project creation form
- `/projects/[id]`: project overview, budget, timeline, contractor, broker, maintenance, milestones, documents, risk, and audit notes
- `/projects/[id]/edit`: authorized project update screen
- `/contractors`: contractor experience and performance management
- `/brokers`: broker/consultant compliance and risk management
- `/maintenance`: expected, actual, annual, vendor, and risk details
- `/reports`: health, budget, delay, contractor, broker, maintenance, department, and public transparency reports
- `/audit-logs`: who changed what, old/new value, IP address, and timestamp
- `/public-portal`: public-safe transparency view

## Component architecture

- `layout`: sidebar, top navigation, app shell, role-aware menu
- `dashboard`: stat cards, health distribution, budget chart, contractor ranking
- `projects`: project table, forms, health badges, timeline chart, progress ring
- `contractors`: contractor form, contractor performance cards/table
- `brokers`: broker form, broker risk cards/table
- `reports`: report generator and audit log table
- `common`: search bar, filter panel, file uploader, modal, toast, skeleton, empty state

## Backend modules

NestJS modules isolate auth, users, departments, projects, contractors, brokers, milestones, maintenance, documents, dashboard, reports, and audit logs. Prisma handles PostgreSQL persistence and protects database queries from SQL injection through parameterization.

## Scalability pattern

Start with a modular monolith. Later split reporting, document processing, and audit/event ingestion into separate workers or services if usage grows.
