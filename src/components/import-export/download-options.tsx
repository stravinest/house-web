'use client';

import { useState } from 'react';
import { format } from 'date-fns';

interface DownloadOptionsProps {
  onDownload: (
    fileType: 'excel' | 'csv',
    startDate: Date,
    endDate: Date,
    includeStatistics: boolean
  ) => void;
}

export function DownloadOptions({ onDownload }: DownloadOptionsProps) {
  const [fileType, setFileType] = useState<'excel' | 'csv'>('excel');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [includeStatistics, setIncludeStatistics] = useState(true);

  const handleDownload = () => {
    onDownload(fileType, startDate, endDate, includeStatistics);
  };

  return (
    <div className='space-y-6'>
      {/* 파일 형식 */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-on-surface'>
          파일 형식
        </label>
        <div className='flex gap-3'>
          <button
            onClick={() => setFileType('excel')}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
              fileType === 'excel'
                ? 'bg-primary text-white'
                : 'bg-surface-container border border-outline text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            Excel (.xlsx)
          </button>
          <button
            onClick={() => setFileType('csv')}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
              fileType === 'csv'
                ? 'bg-primary text-white'
                : 'bg-surface-container border border-outline text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            CSV (.csv)
          </button>
        </div>
      </div>

      {/* 기간 선택 */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-on-surface'>
          기간 선택
        </label>
        <div className='flex items-center gap-3'>
          <input
            type='date'
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className='flex-1 px-4 py-3 bg-surface-container-highest rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-on-surface'
          />
          <span className='text-on-surface-variant'>~</span>
          <input
            type='date'
            value={format(endDate, 'yyyy-MM-dd')}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className='flex-1 px-4 py-3 bg-surface-container-highest rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-on-surface'
          />
        </div>
      </div>

      {/* 통계 포함 (Excel만) */}
      {fileType === 'excel' && (
        <div className='flex items-center gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant'>
          <input
            type='checkbox'
            id='includeStats'
            checked={includeStatistics}
            onChange={(e) => setIncludeStatistics(e.target.checked)}
            className='w-5 h-5 rounded border-outline-variant text-primary focus:ring-2 focus:ring-primary/20'
          />
          <label
            htmlFor='includeStats'
            className='text-sm text-on-surface cursor-pointer'
          >
            통계 요약 시트 포함
          </label>
        </div>
      )}

      {/* 다운로드 버튼 */}
      <button
        onClick={handleDownload}
        className='w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium'
      >
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
            d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
          />
        </svg>
        다운로드
      </button>

      {/* 템플릿 다운로드 */}
      <div className='pt-6 border-t border-outline-variant'>
        <p className='text-sm text-on-surface-variant mb-3'>
          빈 템플릿 다운로드
        </p>
        <a
          href='/templates/transaction-template.xlsx'
          download
          className='flex items-center gap-2 text-primary hover:underline text-sm'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          transaction-template.xlsx
        </a>
      </div>
    </div>
  );
}
