export type UserRole = 'SUPER_ADMIN' | 'GOVERNMENT_ADMIN' | 'PROJECT_MANAGER' | 'AUDITOR' | 'CONTRACTOR' | 'PUBLIC_VIEWER';

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  departmentId?: string | null;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
};
