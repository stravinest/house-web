import * as XLSX from 'xlsx';
import type { Transaction } from '@/types';

export interface ParsedTransaction {
  date: string;
  type: 'income' | 'expense' | 'asset';
  amount: number;
  category?: string;
  paymentMethod?: string;
  memo?: string;
  errors: string[];
}

/**
 * Excel 파일 파싱
 */
export async function parseExcelFile(
  file: File
): Promise<ParsedTransaction[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('파일을 읽을 수 없습니다.'));
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(firstSheet, { header: 1 });

        if (rows.length < 2) {
          reject(new Error('데이터가 없습니다.'));
          return;
        }

        // 헤더 행 제거
        const headers = rows[0] as string[];
        const dataRows = rows.slice(1);

        // 헤더 인덱스 찾기
        const getColumnIndex = (name: string) =>
          headers.findIndex(
            (h) =>
              h &&
              h
                .toString()
                .toLowerCase()
                .includes(name.toLowerCase())
          );

        const dateIdx = getColumnIndex('날짜') !== -1 ? getColumnIndex('날짜') : getColumnIndex('date');
        const typeIdx = getColumnIndex('유형') !== -1 ? getColumnIndex('유형') : getColumnIndex('type');
        const amountIdx = getColumnIndex('금액') !== -1 ? getColumnIndex('금액') : getColumnIndex('amount');
        const categoryIdx = getColumnIndex('카테고리') !== -1 ? getColumnIndex('카테고리') : getColumnIndex('category');
        const paymentMethodIdx = getColumnIndex('결제수단') !== -1 ? getColumnIndex('결제수단') : getColumnIndex('payment');
        const memoIdx = getColumnIndex('메모') !== -1 ? getColumnIndex('메모') : getColumnIndex('memo');

        const transactions: ParsedTransaction[] = dataRows
          .filter((row) => row && row.length > 0)
          .map((row, index) => {
            const errors: string[] = [];
            const lineNumber = index + 2;

            // 날짜
            let date = '';
            if (dateIdx !== -1 && row[dateIdx]) {
              const rawDate = row[dateIdx];
              if (typeof rawDate === 'number') {
                // Excel 날짜 시리얼 번호
                const excelDate = XLSX.SSF.parse_date_code(rawDate);
                date = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`;
              } else {
                date = String(rawDate);
              }
            } else {
              errors.push(`${lineNumber}행: 날짜가 없습니다.`);
            }

            // 유형
            let type: 'income' | 'expense' | 'asset' = 'expense';
            if (typeIdx !== -1 && row[typeIdx]) {
              const typeStr = String(row[typeIdx]).toLowerCase();
              if (typeStr.includes('수입') || typeStr === 'income') {
                type = 'income';
              } else if (typeStr.includes('자산') || typeStr === 'asset') {
                type = 'asset';
              }
            } else {
              errors.push(`${lineNumber}행: 유형이 없습니다.`);
            }

            // 금액
            let amount = 0;
            if (amountIdx !== -1 && row[amountIdx]) {
              const amountStr = String(row[amountIdx]).replace(/[,\s]/g, '');
              amount = parseFloat(amountStr);
              if (isNaN(amount) || amount < 0) {
                errors.push(`${lineNumber}행: 금액이 올바르지 않습니다.`);
                amount = 0;
              }
            } else {
              errors.push(`${lineNumber}행: 금액이 없습니다.`);
            }

            return {
              date,
              type,
              amount,
              category: categoryIdx !== -1 ? String(row[categoryIdx] || '') : undefined,
              paymentMethod: paymentMethodIdx !== -1 ? String(row[paymentMethodIdx] || '') : undefined,
              memo: memoIdx !== -1 ? String(row[memoIdx] || '') : undefined,
              errors,
            };
          });

        resolve(transactions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };

    reader.readAsBinaryString(file);
  });
}
