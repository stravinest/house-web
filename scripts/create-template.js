const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// 템플릿 디렉토리 생성
const templateDir = path.join(__dirname, '../public/templates');
if (!fs.existsSync(templateDir)) {
  fs.mkdirSync(templateDir, { recursive: true });
}

// 빈 템플릿 생성
const emptyTemplate = [
  ['날짜', '유형', '금액', '카테고리', '결제수단', '메모'],
];

const emptyWorkbook = XLSX.utils.book_new();
const emptySheet = XLSX.utils.aoa_to_sheet(emptyTemplate);

// 열 너비 설정
emptySheet['!cols'] = [
  { wch: 12 }, // 날짜
  { wch: 8 }, // 유형
  { wch: 15 }, // 금액
  { wch: 12 }, // 카테고리
  { wch: 12 }, // 결제수단
  { wch: 30 }, // 메모
];

XLSX.utils.book_append_sheet(emptyWorkbook, emptySheet, '거래내역');
XLSX.writeFile(
  emptyWorkbook,
  path.join(templateDir, 'transaction-template.xlsx')
);

console.log('✅ 빈 템플릿 생성 완료: public/templates/transaction-template.xlsx');

// 샘플 데이터 템플릿 생성
const sampleTemplate = [
  ['날짜', '유형', '금액', '카테고리', '결제수단', '메모'],
  ['2026-01-15', '수입', 3000000, '급여', '계좌이체', '1월 급여'],
  ['2026-01-16', '지출', 50000, '식비', '신용카드', '저녁 회식'],
  ['2026-01-17', '지출', 120000, '교통', '체크카드', '주유'],
  ['2026-01-18', '자산', 500000, '저축', '계좌이체', '정기예금'],
];

const sampleWorkbook = XLSX.utils.book_new();
const sampleSheet = XLSX.utils.aoa_to_sheet(sampleTemplate);

// 열 너비 설정
sampleSheet['!cols'] = [
  { wch: 12 },
  { wch: 8 },
  { wch: 15 },
  { wch: 12 },
  { wch: 12 },
  { wch: 30 },
];

XLSX.utils.book_append_sheet(sampleWorkbook, sampleSheet, '거래내역');
XLSX.writeFile(
  sampleWorkbook,
  path.join(templateDir, 'transaction-template-sample.xlsx')
);

console.log(
  '✅ 샘플 템플릿 생성 완료: public/templates/transaction-template-sample.xlsx'
);
