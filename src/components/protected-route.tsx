'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSession, onAuthStateChange } from '@/lib/supabase/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { session, setUser, setSession, setLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 초기 세션 확인
    const checkSession = async () => {
      const { session, error } = await getSession();

      if (error || !session) {
        router.push('/login');
        setLoading(false);
        setIsChecking(false);
        return;
      }

      setSession(session);
      setUser(session.user);
      setLoading(false);
      setIsChecking(false);
    };

    checkSession();

    // 세션 변경 감지
    const subscription = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
      } else if (session) {
        setSession(session);
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, setUser, setSession, setLoading]);

  // 세션 확인 중
  if (isChecking || !session) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin' />
          <p className='text-on-surface-variant'>로딩 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
