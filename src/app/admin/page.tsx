import { redirect } from 'next/navigation';

export default function AdminIndex() {
  // /admin alone always redirects to dashboard. The dashboard does the
  // session check and bounces back to /admin/login if the visitor is
  // not authenticated.
  redirect('/admin/dashboard');
}
