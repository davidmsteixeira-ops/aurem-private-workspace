// src/components/AuthProvider.tsx
import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase.ts";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center bg-white text-black">Aurem...</div>;

  if (!session) {
    // Redireciona para a página de login se não houver sessão
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
};