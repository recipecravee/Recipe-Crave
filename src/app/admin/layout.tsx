import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  // Belt-and-braces — never index any /admin URL even if the rest of
  // the site somehow links to one.
  robots: { index: false, follow: false, nocache: true },
  title: 'Admin',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-cream-50">{children}</div>;
}
