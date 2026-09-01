import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/common/QueryProvider';

export const metadata: Metadata = {
  title: 'YOR // Project Health Tracker',
  description: 'Evidence-led monitoring for project budget, progress, contractors, maintenance, and health.'
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
