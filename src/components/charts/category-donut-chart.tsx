'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryChartData } from '@/types';

interface CategoryDonutChartProps {
  data: CategoryChartData[];
}

export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  // 총 금액 계산
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // 금액 포맷팅
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(value);
  };

  // 데이터가 없을 때
  if (data.length === 0) {
    return (
      <div className='h-full flex items-center justify-center text-on-surface-variant'>
        데이터가 없습니다
      </div>
    );
  }

  return (
    <div className='relative h-full'>
      {/* 도넛 차트 */}
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius='60%'
            outerRadius='80%'
            dataKey='value'
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--surface-container))',
              border: '1px solid hsl(var(--outline-variant))',
              borderRadius: '12px',
              padding: '12px',
            }}
            formatter={(
              value: number | undefined,
              _name: string | undefined,
              props: any
            ) => [
              value !== undefined
                ? `${formatAmount(value)} (${props.payload.percentage.toFixed(1)}%)`
                : '',
              props.payload.name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* 중앙 총 금액 */}
      <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
        <p className='text-sm text-on-surface-variant mb-1'>총 지출</p>
        <p className='text-2xl font-bold text-on-surface'>
          {formatAmount(total)}
        </p>
      </div>

      {/* 범례 */}
      <div className='mt-6 space-y-2'>
        {data.map((item, index) => (
          <div key={index} className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div
                className='w-3 h-3 rounded-full'
                style={{ backgroundColor: item.color }}
              />
              <span className='text-sm text-on-surface'>{item.name}</span>
            </div>
            <div className='text-right'>
              <p className='text-sm font-medium text-on-surface'>
                {formatAmount(item.value)}
              </p>
              <p className='text-xs text-on-surface-variant'>
                {item.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
