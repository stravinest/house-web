'use client';

import type { ParsedTransaction } from '@/lib/excel/parse-excel';

interface PreviewTableProps {
  transactions: ParsedTransaction[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function PreviewTable({
  transactions,
  onConfirm,
  onCancel,
}: PreviewTableProps) {
  const hasErrors = transactions.some((t) => t.errors.length > 0);
  const errorCount = transactions.filter((t) => t.errors.length > 0).length;

  return (
    <div className='space-y-4'>
      {/* 요약 */}
      <div className='flex items-center justify-between p-4 bg-surface-container rounded-xl border border-outline-variant'>
        <div>
          <p className='text-sm text-on-surface-variant'>
            총 {transactions.length}개 거래
          </p>
          {hasErrors && (
            <p className='text-sm text-expense mt-1'>
              {errorCount}개 오류 발견
            </p>
          )}
        </div>
        <div className='flex gap-3'>
          <button
            onClick={onCancel}
            className='px-6 py-2 bg-surface-container border border-outline rounded-xl hover:bg-surface-container-highest transition-colors text-on-surface'
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={hasErrors}
            className='px-6 py-2 bg-primary hover:bg-primary/90 disabled:bg-surface-container disabled:text-on-surface-variant text-white rounded-xl transition-colors font-medium'
          >
            확인
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className='overflow-x-auto bg-surface-container rounded-xl border border-outline-variant'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-outline-variant'>
              <th className='text-left py-3 px-4 text-sm font-medium text-on-surface-variant'>
                #
              </th>
              <th className='text-left py-3 px-4 text-sm font-medium text-on-surface-variant'>
                날짜
              </th>
              <th className='text-left py-3 px-4 text-sm font-medium text-on-surface-variant'>
                유형
              </th>
              <th className='text-right py-3 px-4 text-sm font-medium text-on-surface-variant'>
                금액
              </th>
              <th className='text-left py-3 px-4 text-sm font-medium text-on-surface-variant'>
                카테고리
              </th>
              <th className='text-left py-3 px-4 text-sm font-medium text-on-surface-variant'>
                결제수단
              </th>
              <th className='text-left py-3 px-4 text-sm font-medium text-on-surface-variant'>
                메모
              </th>
              <th className='text-left py-3 px-4 text-sm font-medium text-on-surface-variant'>
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, index) => (
              <tr
                key={index}
                className={`border-b border-outline-variant ${
                  t.errors.length > 0
                    ? 'bg-expense/5'
                    : 'hover:bg-surface-container-highest'
                }`}
              >
                <td className='py-3 px-4 text-sm text-on-surface'>
                  {index + 1}
                </td>
                <td className='py-3 px-4 text-sm text-on-surface'>{t.date}</td>
                <td className='py-3 px-4 text-sm text-on-surface'>
                  {t.type === 'income'
                    ? '수입'
                    : t.type === 'expense'
                      ? '지출'
                      : '자산'}
                </td>
                <td className='py-3 px-4 text-sm text-right font-medium text-on-surface'>
                  {new Intl.NumberFormat('ko-KR').format(t.amount)}원
                </td>
                <td className='py-3 px-4 text-sm text-on-surface'>
                  {t.category || '-'}
                </td>
                <td className='py-3 px-4 text-sm text-on-surface'>
                  {t.paymentMethod || '-'}
                </td>
                <td className='py-3 px-4 text-sm text-on-surface'>
                  {t.memo || '-'}
                </td>
                <td className='py-3 px-4 text-sm'>
                  {t.errors.length > 0 ? (
                    <div className='flex items-center gap-2'>
                      <span className='text-expense'>오류</span>
                      <div className='group relative'>
                        <svg
                          className='w-4 h-4 text-expense cursor-help'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                        <div className='hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 p-2 bg-surface-container border border-outline rounded-lg shadow-lg whitespace-nowrap'>
                          {t.errors.map((err, i) => (
                            <p key={i} className='text-xs text-expense'>
                              {err}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className='text-income'>정상</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
