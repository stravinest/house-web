'use client';

import type { BudgetProgressData } from '@/lib/supabase/statistics-repository';

interface BudgetProgressChartProps {
  data: BudgetProgressData[];
}

export function BudgetProgressChart({ data }: BudgetProgressChartProps) {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(value);
  };

  const getStatusColor = (status: 'safe' | 'warning' | 'danger') => {
    switch (status) {
      case 'safe':
        return 'bg-income';
      case 'warning':
        return 'bg-[#FFC107]';
      case 'danger':
        return 'bg-expense';
    }
  };

  if (data.length === 0) {
    return (
      <div className='h-full flex items-center justify-center text-on-surface-variant'>
        예산이 설정되지 않았습니다
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {data.map((budget) => (
        <div key={budget.id} className='space-y-2'>
          {/* 카테고리 헤더 */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-lg'>{budget.categoryIcon}</span>
              <span className='font-medium text-on-surface'>
                {budget.categoryName}
              </span>
            </div>
            <div className='text-right'>
              <p className='text-sm font-medium text-on-surface'>
                {formatAmount(budget.spentAmount)} /{' '}
                {formatAmount(budget.budgetAmount)}
              </p>
              <p
                className={`text-xs ${
                  budget.status === 'danger'
                    ? 'text-expense'
                    : budget.status === 'warning'
                      ? 'text-[#FFC107]'
                      : 'text-income'
                }`}
              >
                {budget.percentage.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* 진행률 바 */}
          <div className='h-3 bg-surface-container-highest rounded-full overflow-hidden'>
            <div
              className={`h-full transition-all duration-300 ${getStatusColor(budget.status)}`}
              style={{
                width: `${Math.min(budget.percentage, 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
