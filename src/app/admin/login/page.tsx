import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, verifySession } from '@/lib/admin/auth';
import { AdminLoginForm } from './AdminLoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  // If you are already signed in, skip the form and jump straight to
  // the dashboard.
  const c = await cookies();
  const tok = c.get(ADMIN_COOKIE_NAME)?.value;
  if (verifySession(tok).ok) redirect('/admin/dashboard');

  return (
    <div className="container flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-terracotta-500">
          Owner area
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Sign in to RecipeCrave Admin</h1>
        <p className="mt-2 text-sm text-ink-muted">
          This dashboard is restricted to the site owner. Three failed attempts
          and the route is rate-limited for the rest of the session.
        </p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
        <p className="mt-6 text-xs text-ink-subtle">
          Forgot the password? It is set via the <code>ADMIN_PASSWORD</code>{' '}
          environment variable in Vercel.
        </p>
      </div>
    </div>
  );
}
