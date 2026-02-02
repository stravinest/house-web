'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyTrendData } from '@/types';

interface MonthlyTrendChartProps {
  data: MonthlyTrendData[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  // 금액 포맷팅
  const formatAmount = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--outline-variant))' />
        <XAxis
          dataKey='monthLabel'
          stroke='hsl(var(--on-surface-variant))'
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke='hsl(var(--on-surface-variant))'
          style={{ fontSize: '12px' }}
          tickFormatter={formatAmount}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--surface-container))',
            border: '1px solid hsl(var(--outline-variant))',
            borderRadius: '12px',
            padding: '12px',
          }}
          labelStyle={{ color: 'hsl(var(--on-surface))' }}
          formatter={(value: number | undefined) =>
            value !== undefined
              ? new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                }).format(value)
              : ''
          }
        />
        <Legend
          wrapperStyle={{
            paddingTop: '20px',
          }}
          iconType='circle'
        />
        <Line
          type='monotone'
          dataKey='income'
          name='수입'
          stroke='hsl(var(--income))'
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--income))' }}
          activeDot={{ r: 6 }}
        />
        <Line
          type='monotone'
          dataKey='expense'
          name='지출'
          stroke='hsl(var(--expense))'
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--expense))' }}
          activeDot={{ r: 6 }}
        />
        <Line
          type='monotone'
          dataKey='asset'
          name='저축'
          stroke='hsl(var(--asset))'
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--asset))' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
