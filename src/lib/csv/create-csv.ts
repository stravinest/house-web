import Papa from 'papaparse';
import type { TransactionWithRelations } from '@/types';

/**
 * CSV 파일 생성 (UTF-8 BOM 포함)
 */
export function createCsvFile(
  transactions: TransactionWithRelations[]
): Blob {
  const data = transactions.map((t) => ({
    날짜: t.date,
    유형:
      t.type === 'income'
        ? '수입'
        : t.type === 'expense'
          ? '지출'
          : '자산',
    금액: t.amount,
    카테고리: t.category?.name || '',
    결제수단: t.payment_method?.name || '',
    메모: t.memo || '',
  }));

  const csv = Papa.unparse(data, {
    quotes: true,
    header: true,
  });

  // UTF-8 BOM 추가 (한글 깨짐 방지)
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csv;

  return new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
}
