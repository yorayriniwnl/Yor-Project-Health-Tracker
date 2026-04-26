# Product Requirements Document

## Product name

Government Project Health Tracker

## Goal

Create a secure system for government officials, auditors, project managers, contractors, and the public to monitor government-funded projects and automatically classify each project as Healthy, Watchlist, or Critical.

## Users and permissions

| Role | Key capabilities |
|---|---|
| Super Admin | Manage all users and departments, view/edit all projects, view audit logs, export all reports |
| Government Admin | Create/manage department projects, assign contractors, add brokers/consultants, update budget/timeline, view department dashboard |
| Project Manager | Update progress, milestones, documents, delays, issues, and maintenance costs |
| Auditor | View all details, review budgets, broker involvement, contractor performance, add audit remarks, flag suspicious projects |
| Contractor | View assigned projects, update progress, upload completion reports, view milestone requirements |
| Public Viewer | View public-safe project summary and completed projects only |

## Main functional areas

1. Authentication and role-based access control
2. Department administration
3. Project lifecycle tracking
4. Contractor performance management
5. Broker/consultant risk management
6. Milestone tracking
7. Maintenance cost tracking
8. Document upload and review
9. Health scoring and risk classification
10. Dashboard analytics
11. Reports and exports
12. Audit logging
13. Public transparency portal

## Project fields

Each project tracks project code, project name, department, ministry, location, type, description, budget allocated, budget released, budget spent, budget remaining, start date, expected completion date, actual completion date, expected duration, progress percentage, contractor, broker/consultant, maintenance cost, risk level, health score, health status, documents, risks, milestones, and activity/audit trail.

## Dashboard cards

- Total projects
- Completed projects
- In-progress projects
- Delayed projects
- Over-budget projects
- Critical projects
- Total healthy projects
- Total budget allocated
- Total budget spent
- Total maintenance cost
- Average contractor success rate

## Dashboard charts

- Project health distribution
- Budget allocated vs spent
- Projects by department
- Projects by location
- Projects by status
- Contractor performance ranking
- Monthly project completion trend
- Delayed projects trend

## Health score formula

| Dimension | Weight |
|---|---:|
| Budget performance | 25 |
| Timeline performance | 25 |
| Physical progress | 20 |
| Contractor track record | 15 |
| Maintenance sustainability | 10 |
| Broker/compliance risk | 5 |

Classification:

- 80 to 100: Healthy
- 60 to 79: Watchlist
- Below 60: Critical

## Public portal allow-list

Public users can view project name, department, location, budget allocated, progress percentage, status, expected completion date, health status, and completed project summaries.

Public users cannot view broker commission, sensitive contractor disputes, internal audit notes, internal risk investigation notes, IP addresses, device data, or private documents.

## Non-functional requirements

- Responsive desktop, tablet, and mobile UI
- Secure authentication with JWT and refresh tokens
- Password hashing with bcrypt
- Input validation on frontend and backend
- SQL injection protection through Prisma parameterization
- XSS prevention through escaping, secure headers, and safe rendering
- Rate limiting
- File validation
- Audit logging for sensitive actions
- Environment-based configuration
- Backup and disaster recovery plan
- Export support for CSV, Excel, and PDF
