import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSession, onAuthStateChange, signOut as signOutFn } from '../lib/auth';

type AuthState = {
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const s = await getSession();
        if (isMounted) setSession(s);
      } catch (e) {
        console.error('Failed to load session', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    const unsubscribe = onAuthStateChange((s) => {
      setSession(s);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value: AuthState = useMemo(
    () => ({
      isLoading,
      session,
      user: session?.user ?? null,
      signOut: async () => {
        await signOutFn();
        setSession(null);
      },
    }),
    [isLoading, session]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
