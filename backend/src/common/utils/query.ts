export function pagination(query: Record<string, unknown>) {
  const page = Math.max(Number(query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function sort(query: Record<string, unknown>, defaultField = 'createdAt') {
  const allowed = new Set(['createdAt', 'updatedAt', 'budgetAllocated', 'budgetSpent', 'expectedCompletionDate', 'progressPercentage', 'healthScore', 'successRate', 'contractorName', 'brokerName']);
  const requested = String(query.sortBy ?? query.sort ?? defaultField);
  const sortBy = allowed.has(requested) ? requested : defaultField;
  const sortOrder = String(query.sortOrder ?? query.direction ?? 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
  return { [sortBy]: sortOrder };
}

export function toNumber(value: unknown, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function daysBetween(start: Date | string, end: Date | string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000));
}
