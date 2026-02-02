'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 마운트 후에만 테마 UI를 렌더링 (hydration mismatch 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className='w-10 h-10 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center'
        aria-label='테마 전환'
      >
        <div className='w-5 h-5' />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='w-10 h-10 rounded-xl bg-surface-container border border-outline-variant hover:bg-surface-container-highest transition-colors flex items-center justify-center'
      aria-label='테마 전환'
    >
      {theme === 'dark' ? (
        <Sun className='w-5 h-5 text-on-surface' />
      ) : (
        <Moon className='w-5 h-5 text-on-surface' />
      )}
    </button>
  );
}
