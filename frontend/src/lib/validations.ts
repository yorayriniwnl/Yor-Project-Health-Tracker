import { z } from 'zod';

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export const projectFormSchema = z.object({
  projectName: z.string().min(3, 'Project name is required'),
  departmentId: z.string().min(1, 'Department is required'),
  ministry: z.string().optional(),
  location: z.string().min(2),
  projectType: z.string().min(2),
  description: z.string().optional(),
  budgetAllocated: z.coerce.number().positive(),
  budgetReleased: z.coerce.number().min(0).default(0),
  budgetSpent: z.coerce.number().min(0).default(0),
  overrunApproved: z.coerce.boolean().default(false),
  startDate: z.string().min(1),
  expectedCompletionDate: z.string().min(1),
  expectedDurationDays: z.coerce.number().positive().optional(),
  progressPercentage: z.coerce.number().min(0).max(100).default(0),
  contractorId: z.string().optional(),
  brokerId: z.string().optional(),
  expectedMaintenanceCost: z.coerce.number().min(0).default(0),
  actualMaintenanceCost: z.coerce.number().min(0).default(0),
  annualMaintenanceCost: z.coerce.number().min(0).default(0),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'DELAYED', 'COMPLETED', 'SUSPENDED', 'CANCELLED']).default('PLANNED'),
  riskNotes: z.string().optional()
}).refine((v) => v.overrunApproved || v.budgetSpent <= v.budgetAllocated, {
  message: 'Budget spent cannot exceed budget allocated unless overrun is approved',
  path: ['budgetSpent']
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
