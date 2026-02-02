'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { PaymentMethodStats } from '@/lib/supabase/statistics-repository';

interface PaymentMethodChartProps {
  data: PaymentMethodStats[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--income))',
  'hsl(var(--asset))',
  'hsl(142, 35%, 50%)',
  'hsl(142, 35%, 60%)',
];

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
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
      <BarChart
        data={data}
        layout='vertical'
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--outline-variant))' />
        <XAxis
          type='number'
          stroke='hsl(var(--on-surface-variant))'
          style={{ fontSize: '12px' }}
          tickFormatter={formatAmount}
        />
        <YAxis
          type='category'
          dataKey='name'
          stroke='hsl(var(--on-surface-variant))'
          style={{ fontSize: '12px' }}
          width={90}
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
              ? [
                  new Intl.NumberFormat('ko-KR', {
                    style: 'currency',
                    currency: 'KRW',
                  }).format(value),
                  '금액',
                ]
              : ['', '']
          }
        />
        <Bar dataKey='amount' radius={[0, 8, 8, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
