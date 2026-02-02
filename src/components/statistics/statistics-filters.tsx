'use client';

import { useFilterStore } from '@/stores/filter-store';
import type { TransactionType } from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function StatisticsFilters() {
  const { dateRange, type, setDateRange, setType, reset } = useFilterStore();

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    setDateRange(newStart, dateRange.end);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    setDateRange(dateRange.start, newEnd);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as 'all' | TransactionType);
  };

  return (
    <div className='bg-surface-container rounded-2xl p-6 border border-outline-variant mb-6'>
      <div className='flex flex-wrap items-center gap-4'>
        {/* 기간 선택 */}
        <div className='flex items-center gap-2'>
          <svg
            className='w-5 h-5 text-on-surface-variant'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <input
            type='date'
            value={format(dateRange.start, 'yyyy-MM-dd')}
            onChange={handleStartDateChange}
            className='px-4 py-2 bg-surface-container-highest rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-on-surface text-sm'
          />
          <span className='text-on-surface-variant'>~</span>
          <input
            type='date'
            value={format(dateRange.end, 'yyyy-MM-dd')}
            onChange={handleEndDateChange}
            className='px-4 py-2 bg-surface-container-highest rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-on-surface text-sm'
          />
        </div>

        {/* 타입 선택 */}
        <div className='flex items-center gap-2'>
          <svg
            className='w-5 h-5 text-on-surface-variant'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
            />
          </svg>
          <select
            value={type}
            onChange={handleTypeChange}
            className='px-4 py-2 bg-surface-container-highest rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-on-surface text-sm'
          >
            <option value='all'>전체</option>
            <option value='income'>수입</option>
            <option value='expense'>지출</option>
            <option value='asset'>자산</option>
          </select>
        </div>

        {/* 리셋 버튼 */}
        <button
          onClick={reset}
          className='ml-auto px-4 py-2 bg-surface-container border border-outline rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface text-sm'
        >
          초기화
        </button>
      </div>
    </div>
  );
}
