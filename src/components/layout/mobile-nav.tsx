'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart3,
  FileSpreadsheet,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

interface MobileNavProps {
  onSignOut?: () => void;
}

export function MobileNav({ onSignOut }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 상단 헤더 */}
      <div className='lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface-container border-b border-outline-variant'>
        <div className='flex items-center justify-between p-4'>
          <Link href='/dashboard' className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-white'
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

          <div className='flex items-center gap-2'>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='p-2 text-on-surface'
              aria-label='메뉴 열기'
            >
              {isOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && (
        <>
          <div
            className='lg:hidden fixed inset-0 bg-black/50 z-40 top-[60px] animate-fade-in'
            onClick={() => setIsOpen(false)}
          />
          <div className='lg:hidden fixed top-[60px] left-0 right-0 bottom-0 bg-surface-container z-50 overflow-y-auto animate-slide-down'>
            <nav className='p-4 space-y-2'>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-3 px-4 py-4 rounded-xl transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-on-surface hover:bg-surface-container-highest'
                      )}
                    >
                      <Icon className='w-5 h-5' />
                      <span className='text-lg'>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {onSignOut && (
              <div className='p-4 border-t border-outline-variant'>
                <Button
                  variant='ghost'
                  className='w-full justify-start py-4 text-lg'
                  onClick={() => {
                    onSignOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className='w-5 h-5 mr-3' />
                  로그아웃
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
