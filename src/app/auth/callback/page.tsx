'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase handles the token from the URL hash automatically.
    // Wait briefly for the session to be established, then redirect.
    supabase.auth.getSession().then(({ data: { session } }) => {
      router.replace(session ? '/' : '/login');
    });
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Confirming your account...</p>
      </div>
    </div>
  );
}
