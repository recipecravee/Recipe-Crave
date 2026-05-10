'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      <LogOut className="mr-1.5 h-4 w-4" />
      Sign out
    </Button>
  );
}
