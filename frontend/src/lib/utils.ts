import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string | null | undefined) {
  const n = Number(value || 0);
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function formatNumber(value: number | string | null | undefined) {
  return new Intl.NumberFormat('en-IN').format(Number(value || 0));
}

export function formatDate(value?: string | Date | null) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));
}

export function percent(value?: number | string | null) {
  return `${Number(value || 0).toFixed(1)}%`;
}

export function humanizeEnum(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
