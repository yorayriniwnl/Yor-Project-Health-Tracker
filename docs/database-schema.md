# Database Schema

The canonical schema is implemented in `backend/src/prisma/schema.prisma`.

## Tables

### users

Stores platform users and role assignments.

Fields: id, full_name, email, password_hash, role, department_id, status, created_at, updated_at.

### departments

Stores government department and ministry data.

Fields: id, name, ministry_name, region, created_at, updated_at.

### projects

Main public-sector project table.

Fields: id, project_code, project_name, description, department_id, location, project_type, status, budget_allocated, budget_released, budget_spent, budget_remaining, start_date, expected_completion_date, actual_completion_date, expected_duration_days, progress_percentage, contractor_id, broker_id, expected_maintenance_cost, actual_maintenance_cost, annual_maintenance_cost, health_score, health_status, risk_level, created_by, created_at, updated_at.

### contractors

Contractor profile and performance history.

Fields: id, contractor_name, company_name, registration_number, years_experience, past_projects_handled, total_projects_delivered, completed_on_time, completed_within_budget, success_rate, quality_rating, blacklisted, dispute_history, created_at, updated_at.

### brokers

Broker or consultant profile and compliance data.

Fields: id, broker_name, organization, role, fee_amount, commission_percentage, compliance_status, conflict_of_interest, risk_level, remarks, created_at, updated_at.

### milestones

Project milestone plan and progress.

Fields: id, project_id, milestone_name, description, planned_start_date, planned_end_date, actual_start_date, actual_end_date, progress_percentage, status, created_at, updated_at.

### maintenance_records

Project maintenance records and vendor details.

Fields: id, project_id, maintenance_type, expected_cost, actual_cost, vendor_name, maintenance_date, next_due_date, risk_level, remarks, created_at, updated_at.

### project_documents

Uploaded project document metadata.

Fields: id, project_id, document_name, document_type, file_url, uploaded_by, created_at.

### audit_logs

Immutable sensitive-action history.

Fields: id, user_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent, created_at.

### project_risks

Risk register for project issues and audit flags.

Fields: id, project_id, risk_title, risk_description, risk_level, reported_by, status, resolution_notes, created_at, updated_at.

## Indexing strategy

- Unique indexes: users.email, projects.project_code, contractors.registration_number
- Filter indexes: projects.department_id, projects.status, projects.health_status, projects.location, projects.contractor_id, projects.broker_id
- Audit indexes: audit_logs.entity_type + entity_id, audit_logs.user_id, audit_logs.created_at
- Search extension recommended in production: PostgreSQL trigram index on project_name, project_code, location, contractor_name, broker_name

## Data integrity rules

- Project budget allocated must be positive.
- Budget spent cannot be negative.
- Expected completion date must be after start date.
- Progress percentage must be 0 to 100.
- Delivered contractor projects cannot exceed past projects handled.
- Broker conflict-of-interest status must be explicitly stored.
