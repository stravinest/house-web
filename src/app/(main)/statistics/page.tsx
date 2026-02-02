'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuthStore } from '@/stores/auth-store';
import { useFilterStore } from '@/stores/filter-store';
import { getDefaultLedger } from '@/lib/supabase/ledger-repository';
import {
  getPaymentMethodStats,
  getUserComparisonStats,
  getYearlyTrend,
  getBudgetProgress,
} from '@/lib/supabase/statistics-repository';
import { StatisticsFilters } from '@/components/statistics/statistics-filters';
import { PaymentMethodChart } from '@/components/charts/payment-method-chart';
import { UserComparisonChart } from '@/components/charts/user-comparison-chart';
import { YearlyTrendChart } from '@/components/charts/yearly-trend-chart';
import { BudgetProgressChart } from '@/components/charts/budget-progress-chart';
import { format } from 'date-fns';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function StatisticsPage() {
  const { user } = useAuthStore();
  const { dateRange, type } = useFilterStore();
  const [currentDate] = useState(() => new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // 가계부 조회
  const { data: ledger } = useQuery({
    queryKey: ['ledger', user?.id],
    queryFn: () => getDefaultLedger(user!.id),
    enabled: !!user,
  });

  // 결제수단별 통계
  const { data: paymentMethodData } = useQuery({
    queryKey: [
      'paymentMethodStats',
      ledger?.id,
      format(dateRange.start, 'yyyy-MM-dd'),
      format(dateRange.end, 'yyyy-MM-dd'),
      type,
    ],
    queryFn: () =>
      getPaymentMethodStats(
        ledger!.id,
        format(dateRange.start, 'yyyy-MM-dd'),
        format(dateRange.end, 'yyyy-MM-dd'),
        type
      ),
    enabled: !!ledger,
  });

  // 사용자별 비교
  const { data: userComparisonData } = useQuery({
    queryKey: ['userComparison', ledger?.id, currentYear, currentMonth],
    queryFn: () => getUserComparisonStats(ledger!.id, currentYear, currentMonth),
    enabled: !!ledger,
  });

  // 연도별 추이
  const { data: yearlyTrendData } = useQuery({
    queryKey: ['yearlyTrend', ledger?.id, currentYear],
    queryFn: () => getYearlyTrend(ledger!.id, currentYear),
    enabled: !!ledger,
  });

  // 예산 진행률
  const { data: budgetProgressData } = useQuery({
    queryKey: ['budgetProgress', ledger?.id, currentYear, currentMonth],
    queryFn: () => getBudgetProgress(ledger!.id, currentYear, currentMonth),
    enabled: !!ledger,
  });

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-surface p-8'>
        <div className='max-w-7xl mx-auto'>
          {/* 헤더 */}
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-semibold text-on-surface'>
                상세 통계
              </h1>
              <p className='text-on-surface-variant mt-1'>
                {ledger?.name || '가계부'}
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <ThemeToggle />
              <Link
                href='/dashboard'
                className='px-6 py-3 bg-surface-container border border-outline rounded-xl hover:bg-surface-container-highest transition-colors text-on-surface'
              >
                대시보드로
              </Link>
            </div>
          </div>

          {/* 필터 */}
          <StatisticsFilters />

          {/* 차트 그리드 */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* 결제수단별 분석 */}
            <div className='lg:col-span-2 bg-surface-container rounded-2xl p-6 border border-outline-variant'>
              <h3 className='font-semibold text-on-surface mb-4'>
                결제수단별 분석
              </h3>
              <div className='h-80'>
                {paymentMethodData && paymentMethodData.length > 0 ? (
                  <PaymentMethodChart data={paymentMethodData} />
                ) : (
                  <div className='h-full flex items-center justify-center text-on-surface-variant'>
                    데이터가 없습니다
                  </div>
                )}
              </div>
            </div>

            {/* 사용자별 비교 */}
            <div className='bg-surface-container rounded-2xl p-6 border border-outline-variant'>
              <h3 className='font-semibold text-on-surface mb-4'>
                사용자별 비교
              </h3>
              <div className='h-80'>
                {userComparisonData && userComparisonData.length > 0 ? (
                  <UserComparisonChart data={userComparisonData} />
                ) : (
                  <div className='h-full flex items-center justify-center text-on-surface-variant'>
                    데이터가 없습니다
                  </div>
                )}
              </div>
            </div>

            {/* 연도별 추이 */}
            <div className='lg:col-span-2 bg-surface-container rounded-2xl p-6 border border-outline-variant'>
              <h3 className='font-semibold text-on-surface mb-4'>
                연도별 추이 (최근 3년)
              </h3>
              <div className='h-80'>
                {yearlyTrendData && yearlyTrendData.length > 0 ? (
                  <YearlyTrendChart data={yearlyTrendData} />
                ) : (
                  <div className='h-full flex items-center justify-center text-on-surface-variant'>
                    데이터가 없습니다
                  </div>
                )}
              </div>
            </div>

            {/* 예산 진행률 */}
            <div className='bg-surface-container rounded-2xl p-6 border border-outline-variant'>
              <h3 className='font-semibold text-on-surface mb-4'>
                예산 진행률
              </h3>
              <div className='h-80 overflow-y-auto'>
                {budgetProgressData && budgetProgressData.length > 0 ? (
                  <BudgetProgressChart data={budgetProgressData} />
                ) : (
                  <div className='h-full flex items-center justify-center text-on-surface-variant'>
                    예산이 설정되지 않았습니다
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
