'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/supabase/auth';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setSession } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, session, error } = await signIn(email, password);

      if (error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      if (user && session) {
        setUser(user);
        setSession(session);
        router.push('/dashboard');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* 왼쪽 패널 - 브랜딩 */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-primary/20 items-center justify-center p-12'>
        <div className='max-w-md space-y-8'>
          {/* 로고 */}
          <div className='w-32 h-32 bg-primary rounded-3xl flex items-center justify-center mx-auto'>
            <svg
              className='w-16 h-16 text-white'
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

          {/* 제목 */}
          <div className='text-center space-y-2'>
            <h1 className='text-5xl font-bold text-on-surface'>공유 가계부</h1>
            <p className='text-xl text-on-surface-variant'>
              웹에서 더 강력한 통계와 분석을
            </p>
          </div>

          {/* 기능 목록 */}
          <div className='space-y-4 text-on-surface-variant'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
                📊
              </div>
              <span>6가지 상세 차트</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
                📁
              </div>
              <span>Excel/CSV 파일 관리</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
                🔍
              </div>
              <span>강력한 필터 및 검색</span>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 패널 - 로그인 폼 */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center lg:text-left'>
            <h2 className='text-3xl font-semibold text-on-surface mb-2'>
              로그인
            </h2>
            <p className='text-on-surface-variant'>
              계정에 로그인하여 시작하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* 에러 메시지 */}
            {error && (
              <div className='p-4 bg-expense/10 border border-expense/20 rounded-xl text-expense text-sm'>
                {error}
              </div>
            )}

            {/* 이메일 입력 */}
            <div className='space-y-2'>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-on-surface'
              >
                이메일
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full h-[52px] px-4 bg-surface-container-highest rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-on-surface'
                placeholder='your@email.com'
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className='space-y-2'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-on-surface'
              >
                비밀번호
              </label>
              <div className='relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='w-full h-[52px] px-4 pr-12 bg-surface-container-highest rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-on-surface'
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors'
                >
                  {showPassword ? (
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                      />
                    </svg>
                  ) : (
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full h-[52px] bg-primary hover:bg-primary/90 disabled:bg-surface-container disabled:text-on-surface-variant text-white font-medium rounded-xl transition-colors'
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>

            {/* 회원가입 링크 */}
            <div className='text-center'>
              <span className='text-on-surface-variant'>
                계정이 없으신가요?{' '}
              </span>
              <Link
                href='/register'
                className='text-primary hover:underline font-medium'
              >
                회원가입
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
