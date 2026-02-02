'use client';

import type { TransactionWithRelations } from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface RecentTransactionsProps {
  transactions: TransactionWithRelations[];
}

export function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  // 금액 포맷팅
  const formatAmount = (amount: number, type: string) => {
    const formatted = new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);

    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd (EEE)', { locale: ko });
  };

  // 데이터가 없을 때
  if (transactions.length === 0) {
    return (
      <div className='py-12 text-center text-on-surface-variant'>
        아직 거래 내역이 없습니다
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead>
          <tr className='border-b border-outline-variant'>
            <th className='text-left py-3 px-4 text-sm font-medium text-on-surface-variant'>
              날짜
            </th>
            <th className='text-left py-3 px-4 text-sm font-medium text-on-surface-variant'>
              카테고리
            </th>
            <th className='text-left py-3 px-4 text-sm font-medium text-on-surface-variant'>
              메모
            </th>
            <th className='text-left py-3 px-4 text-sm font-medium text-on-surface-variant'>
              결제수단
            </th>
            <th className='text-right py-3 px-4 text-sm font-medium text-on-surface-variant'>
              금액
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className='border-b border-outline-variant hover:bg-surface-container-highest transition-colors'
            >
              <td className='py-3 px-4 text-sm text-on-surface'>
                {formatDate(transaction.date)}
              </td>
              <td className='py-3 px-4'>
                {transaction.category ? (
                  <div className='flex items-center gap-2'>
                    <span
                      className='w-6 h-6 rounded-lg flex items-center justify-center text-xs'
                      style={{
                        backgroundColor: `${transaction.category.color}20`,
                        color: transaction.category.color,
                      }}
                    >
                      {transaction.category.icon}
                    </span>
                    <span className='text-sm text-on-surface'>
                      {transaction.category.name}
                    </span>
                  </div>
                ) : (
                  <span className='text-sm text-on-surface-variant'>미분류</span>
                )}
              </td>
              <td className='py-3 px-4 text-sm text-on-surface'>
                {transaction.memo || '-'}
              </td>
              <td className='py-3 px-4 text-sm text-on-surface'>
                {transaction.payment_method?.name || '-'}
              </td>
              <td
                className={`py-3 px-4 text-sm font-medium text-right ${
                  transaction.type === 'income'
                    ? 'text-income'
                    : transaction.type === 'expense'
                      ? 'text-expense'
                      : 'text-asset'
                }`}
              >
                {formatAmount(transaction.amount, transaction.type)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
