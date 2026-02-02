import * as XLSX from 'xlsx';
import type { TransactionWithRelations } from '@/types';

export interface ExcelOptions {
  includeStatistics?: boolean;
}

/**
 * Excel 파일 생성
 */
export async function createExcelFile(
  transactions: TransactionWithRelations[],
  options: ExcelOptions = {}
): Promise<Blob> {
  const workbook = XLSX.utils.book_new();

  // 거래 내역 시트
  const transactionData = transactions.map((t) => ({
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

  const transactionSheet = XLSX.utils.json_to_sheet(transactionData);

  // 열 너비 설정
  transactionSheet['!cols'] = [
    { wch: 12 }, // 날짜
    { wch: 8 }, // 유형
    { wch: 15 }, // 금액
    { wch: 12 }, // 카테고리
    { wch: 12 }, // 결제수단
    { wch: 30 }, // 메모
  ];

  XLSX.utils.book_append_sheet(workbook, transactionSheet, '거래내역');

  // 통계 시트 (선택)
  if (options.includeStatistics) {
    const stats = {
      총수입: transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      총지출: transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      총자산: transactions
        .filter((t) => t.type === 'asset')
        .reduce((sum, t) => sum + t.amount, 0),
    };

    const statisticsData = [
      { 항목: '총 수입', 금액: stats.총수입 },
      { 항목: '총 지출', 금액: stats.총지출 },
      { 항목: '총 자산', 금액: stats.총자산 },
      { 항목: '잔액', 금액: stats.총수입 - stats.총지출 },
    ];

    const statisticsSheet = XLSX.utils.json_to_sheet(statisticsData);
    XLSX.utils.book_append_sheet(workbook, statisticsSheet, '통계요약');
  }

  // Blob 생성
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
