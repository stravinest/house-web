'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { UserComparisonData } from '@/lib/supabase/statistics-repository';

interface UserComparisonChartProps {
  data: UserComparisonData[];
  userColors?: Record<string, string>;
}

const DEFAULT_COLORS = [
  '#A8D8EA',
  '#FFB6A3',
  '#B8E6C9',
  '#D4A5D4',
  '#FFCBA4',
];

export function UserComparisonChart({
  data,
  userColors = {},
}: UserComparisonChartProps) {
  if (data.length === 0) {
    return (
      <div className='h-full flex items-center justify-center text-on-surface-variant'>
        데이터가 없습니다
      </div>
    );
  }

  // 사용자 ID 추출
  const userIds = Object.keys(data[0] || {}).filter(
    (key) => key !== 'month' && key !== 'monthLabel'
  );

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
      <BarChart
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
          iconType='rect'
        />
        {userIds.map((userId, index) => (
          <Bar
            key={userId}
            dataKey={userId}
            stackId='a'
            fill={userColors[userId] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            radius={index === userIds.length - 1 ? [4, 4, 0, 0] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
