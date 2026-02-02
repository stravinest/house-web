'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { MobileNav } from './mobile-nav';
import { signOut } from '@/lib/supabase/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { clear } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    clear();
    router.push('/login');
  };

  return (
    <div className='min-h-screen flex'>
      {/* 데스크톱 사이드바 */}
      <aside className='hidden lg:block w-64 fixed left-0 top-0 bottom-0'>
        <Sidebar onSignOut={handleSignOut} />
      </aside>

      {/* 모바일 네비게이션 */}
      <MobileNav onSignOut={handleSignOut} />

      {/* 메인 컨텐츠 */}
      <main className='flex-1 lg:ml-64 pt-[60px] lg:pt-0'>
        {children}
      </main>
    </div>
  );
}
