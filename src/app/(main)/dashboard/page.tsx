'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuthStore } from '@/stores/auth-store';
import { getDefaultLedger } from '@/lib/supabase/ledger-repository';
import { MainLayout } from '@/components/layout';
import {
  getMonthSummary,
  getMonthlyTrend,
  getCategoryBreakdown,
  getRecentTransactions,
} from '@/lib/supabase/statistics-repository';
import { MonthlyTrendChart } from '@/components/charts/monthly-trend-chart';
import { CategoryDonutChart } from '@/components/charts/category-donut-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [currentDate] = useState(() => new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // 가계부 조회
  const { data: ledger } = useQuery({
    queryKey: ['ledger', user?.id],
    queryFn: () => getDefaultLedger(user!.id),
    enabled: !!user,
  });

  // 월별 요약 조회
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['monthSummary', ledger?.id, currentYear, currentMonth],
    queryFn: () => getMonthSummary(ledger!.id, currentYear, currentMonth),
    enabled: !!ledger,
  });

  // 월별 추이 조회
  const { data: monthlyTrend } = useQuery({
    queryKey: ['monthlyTrend', ledger?.id, currentYear, currentMonth],
    queryFn: () => getMonthlyTrend(ledger!.id, currentYear, currentMonth),
    enabled: !!ledger,
  });

  // 카테고리 분석 조회
  const { data: categoryData } = useQuery({
    queryKey: ['categoryBreakdown', ledger?.id, currentYear, currentMonth],
    queryFn: () => getCategoryBreakdown(ledger!.id, currentYear, currentMonth),
    enabled: !!ledger,
  });

  // 최근 거래 조회
  const { data: recentTransactions } = useQuery({
    queryKey: ['recentTransactions', ledger?.id],
    queryFn: () => getRecentTransactions(ledger!.id, 10),
    enabled: !!ledger,
  });

  // 금액 포맷팅
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  // 증감률 포맷팅
  const formatTrend = (trend: number) => {
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className='bg-surface p-8 min-h-screen'>
          <div className='max-w-7xl mx-auto'>
            {/* 헤더 */}
            <div className='mb-8'>
              <h1 className='text-3xl font-semibold text-on-surface'>
                대시보드
              </h1>
              <p className='text-on-surface-variant mt-1'>
                {ledger?.name || '가계부'} • {currentYear}년 {currentMonth}월
              </p>
            </div>

            {/* 로딩 상태 */}
              {summaryLoading && (
              <div className='flex items-center justify-center py-12'>
                <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin' />
              </div>
            )}

            {/* 요약 카드 */}
            {!summaryLoading && summary && (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              {/* 수입 카드 */}
              <div className='bg-gradient-to-br from-income/10 to-income/5 rounded-2xl p-6 border border-income/20'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-income/20 rounded-xl flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-income'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                      />
                    </svg>
                  </div>
                  <h3 className='font-medium text-on-surface'>이번 달 수입</h3>
                </div>
                <p className='text-3xl font-bold text-income'>
                  {formatAmount(summary.income)}
                </p>
                <p className='text-sm text-on-surface-variant mt-2'>
                  전월 대비 {formatTrend(summary.incomeTrend)}
                </p>
              </div>

              {/* 지출 카드 */}
              <div className='bg-gradient-to-br from-expense/10 to-expense/5 rounded-2xl p-6 border border-expense/20'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-expense/20 rounded-xl flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-expense'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
                      />
                    </svg>
                  </div>
                  <h3 className='font-medium text-on-surface'>이번 달 지출</h3>
                </div>
                <p className='text-3xl font-bold text-expense'>
                  {formatAmount(summary.expense)}
                </p>
                <p className='text-sm text-on-surface-variant mt-2'>
                  전월 대비 {formatTrend(summary.expenseTrend)}
                </p>
              </div>

              {/* 저축 카드 */}
              <div className='bg-gradient-to-br from-asset/10 to-asset/5 rounded-2xl p-6 border border-asset/20'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 bg-asset/20 rounded-xl flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-asset'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                      />
                    </svg>
                  </div>
                  <h3 className='font-medium text-on-surface'>이번 달 저축</h3>
                </div>
                <p className='text-3xl font-bold text-asset'>
                  {formatAmount(summary.asset)}
                </p>
                <p className='text-sm text-on-surface-variant mt-2'>
                  전월 대비 {formatTrend(summary.assetTrend)}
                </p>
              </div>
            </div>
            )}

            {/* 차트 영역 */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
            {/* 월별 추이 차트 */}
            <div className='lg:col-span-2 bg-surface-container rounded-2xl p-6 border border-outline-variant'>
              <h3 className='font-semibold text-on-surface mb-4'>월별 추이</h3>
              <div className='h-80'>
                {monthlyTrend && monthlyTrend.length > 0 ? (
                  <MonthlyTrendChart data={monthlyTrend} />
                ) : (
                  <div className='h-full flex items-center justify-center text-on-surface-variant'>
                    데이터가 없습니다
                  </div>
                )}
              </div>
            </div>

            {/* 카테고리 도넛 차트 */}
            <div className='bg-surface-container rounded-2xl p-6 border border-outline-variant'>
              <h3 className='font-semibold text-on-surface mb-4'>
                카테고리별 지출
              </h3>
              <div className='h-80'>
                {categoryData && categoryData.length > 0 ? (
                  <CategoryDonutChart data={categoryData} />
                ) : (
                  <div className='h-full flex items-center justify-center text-on-surface-variant'>
                    데이터가 없습니다
                  </div>
                )}
              </div>
            </div>
            </div>

            {/* 최근 거래 */}
            <div className='bg-surface-container rounded-2xl p-6 border border-outline-variant'>
            <h3 className='font-semibold text-on-surface mb-4'>최근 거래</h3>
            {recentTransactions ? (
              <RecentTransactions transactions={recentTransactions} />
            ) : (
              <div className='py-12 flex items-center justify-center text-on-surface-variant'>
                로딩 중...
              </div>
            )}
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
