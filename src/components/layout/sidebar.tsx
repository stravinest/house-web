'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart3,
  FileSpreadsheet,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

interface SidebarProps {
  onSignOut?: () => void;
}

export function Sidebar({ onSignOut }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      label: '대시보드',
      icon: LayoutDashboard,
    },
    {
      href: '/statistics',
      label: '통계',
      icon: BarChart3,
    },
    {
      href: '/import-export',
      label: '파일 관리',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <nav className='flex flex-col h-full bg-surface-container border-r border-outline-variant' aria-label='메인 네비게이션'>
      {/* 로고 */}
      <div className='p-6 border-b border-outline-variant'>
        <Link href='/dashboard' className='flex items-center gap-3' aria-label='대시보드로 이동'>
          <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
            <svg
              className='w-6 h-6 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <span className='font-semibold text-on-surface'>공유 가계부</span>
        </Link>
      </div>

      {/* 네비게이션 */}
      <div className='flex-1 p-4 space-y-2'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} aria-current={isActive ? 'page' : undefined}>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-on-surface hover:bg-surface-container-highest'
                )}
              >
                <Icon className='w-5 h-5' aria-hidden='true' />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 하단 액션 */}
      <div className='p-4 border-t border-outline-variant space-y-3'>
        <div className='flex items-center justify-center'>
          <ThemeToggle />
        </div>
        {onSignOut && (
          <Button
            variant='ghost'
            className='w-full justify-start'
            onClick={onSignOut}
          >
            <LogOut className='w-5 h-5 mr-3' />
            로그아웃
          </Button>
        )}
      </div>
    </nav>
  );
}
