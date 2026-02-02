import Papa from 'papaparse';
import type { ParsedTransaction } from '../excel/parse-excel';

/**
 * CSV 파일 파싱
 */
export async function parseCsvFile(file: File): Promise<ParsedTransaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const transactions: ParsedTransaction[] = results.data.map(
            (row: any, index) => {
              const errors: string[] = [];
              const lineNumber = index + 2;

              // 날짜
              const date = row['날짜'] || row['date'] || row['Date'] || '';
              if (!date) {
                errors.push(`${lineNumber}행: 날짜가 없습니다.`);
              }

              // 유형
              let type: 'income' | 'expense' | 'asset' = 'expense';
              const typeStr = (
                row['유형'] ||
                row['type'] ||
                row['Type'] ||
                ''
              )
                .toString()
                .toLowerCase();
              if (typeStr.includes('수입') || typeStr === 'income') {
                type = 'income';
              } else if (typeStr.includes('자산') || typeStr === 'asset') {
                type = 'asset';
              } else if (!typeStr) {
                errors.push(`${lineNumber}행: 유형이 없습니다.`);
              }

              // 금액
              const amountStr = (
                row['금액'] ||
                row['amount'] ||
                row['Amount'] ||
                '0'
              )
                .toString()
                .replace(/[,\s]/g, '');
              const amount = parseFloat(amountStr);
              if (isNaN(amount) || amount < 0) {
                errors.push(`${lineNumber}행: 금액이 올바르지 않습니다.`);
              }

              return {
                date,
                type,
                amount: isNaN(amount) ? 0 : amount,
                category:
                  row['카테고리'] ||
                  row['category'] ||
                  row['Category'] ||
                  undefined,
                paymentMethod:
                  row['결제수단'] ||
                  row['payment'] ||
                  row['Payment Method'] ||
                  undefined,
                memo: row['메모'] || row['memo'] || row['Memo'] || undefined,
                errors,
              };
            }
          );

          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
