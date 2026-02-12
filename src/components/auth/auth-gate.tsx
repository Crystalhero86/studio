'use client';

import { useUser, useAuth, initiateAnonymousSignIn } from '@/firebase';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Initializing session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
