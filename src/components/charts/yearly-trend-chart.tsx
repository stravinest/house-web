'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { YearlyTrendData } from '@/lib/supabase/statistics-repository';

interface YearlyTrendChartProps {
  data: YearlyTrendData[];
}

export function YearlyTrendChart({ data }: YearlyTrendChartProps) {
  const formatAmount = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  if (data.length === 0) {
    return (
      <div className='h-full flex items-center justify-center text-on-surface-variant'>
        데이터가 없습니다
      </div>
    );
  }

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <ComposedChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--outline-variant))' />
        <XAxis
          dataKey='year'
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
        />
        <Bar dataKey='income' name='수입' fill='hsl(var(--income))' radius={[4, 4, 0, 0]} />
        <Bar dataKey='expense' name='지출' fill='hsl(var(--expense))' radius={[4, 4, 0, 0]} />
        <Line
          type='monotone'
          dataKey='balance'
          name='잔액'
          stroke='hsl(var(--primary))'
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))', r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
