import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/common/QueryProvider';

export const metadata: Metadata = {
  title: 'Government Project Health Tracker',
  description: 'Monitor budget, progress, contractors, brokers, maintenance, and project health.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
