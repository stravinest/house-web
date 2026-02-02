'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuthStore } from '@/stores/auth-store';
import { getDefaultLedger } from '@/lib/supabase/ledger-repository';
import { getRecentTransactions } from '@/lib/supabase/statistics-repository';
import { FileDropzone } from '@/components/import-export/file-dropzone';
import { PreviewTable } from '@/components/import-export/preview-table';
import { DownloadOptions } from '@/components/import-export/download-options';
import { parseExcelFile, type ParsedTransaction } from '@/lib/excel/parse-excel';
import { parseCsvFile } from '@/lib/csv/parse-csv';
import { createExcelFile } from '@/lib/excel/create-excel';
import { createCsvFile } from '@/lib/csv/create-csv';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ImportExportPage() {
  const { user } = useAuthStore();
  const [parsedData, setParsedData] = useState<ParsedTransaction[] | null>(
    null
  );
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 가계부 조회
  const { data: ledger } = useQuery({
    queryKey: ['ledger', user?.id],
    queryFn: () => getDefaultLedger(user!.id),
    enabled: !!user,
  });

  // 파일 업로드 처리
  const handleFileAccepted = async (file: File) => {
    setError('');
    setParsedData(null);
    setIsUploading(true);

    try {
      let transactions: ParsedTransaction[];

      if (file.name.endsWith('.xlsx')) {
        transactions = await parseExcelFile(file);
      } else if (file.name.endsWith('.csv')) {
        transactions = await parseCsvFile(file);
      } else {
        throw new Error('지원하지 않는 파일 형식입니다.');
      }

      setParsedData(transactions);
    } catch (err: any) {
      setError(err.message || '파일 파싱 실패');
    } finally {
      setIsUploading(false);
    }
  };

  // 업로드 확인
  const handleConfirmUpload = async () => {
    if (!parsedData || !ledger || !user) return;

    setIsUploading(true);
    const supabase = createClient();

    try {
      // 오류가 없는 거래만 업로드
      const validTransactions = parsedData.filter((t) => t.errors.length === 0);

      const transactions = validTransactions.map((t) => ({
        ledger_id: ledger.id,
        user_id: user.id,
        type: t.type,
        amount: t.amount,
        date: t.date,
        memo: t.memo || null,
        category_id: null, // TODO: 카테고리 매칭
        payment_method_id: null, // TODO: 결제수단 매칭
      }));

      const { error } = await supabase.from('transactions').insert(transactions);

      if (error) throw error;

      alert(`${validTransactions.length}개의 거래가 업로드되었습니다.`);
      setParsedData(null);
    } catch (err: any) {
      setError(err.message || '업로드 실패');
    } finally {
      setIsUploading(false);
    }
  };

  // 다운로드 처리
  const handleDownload = async (
    fileType: 'excel' | 'csv',
    startDate: Date,
    endDate: Date,
    includeStatistics: boolean
  ) => {
    if (!ledger) return;

    const supabase = createClient();

    try {
      const { data } = await supabase
        .from('transactions')
        .select(
          `
          *,
          categories (*),
          payment_methods (*)
        `
        )
        .eq('ledger_id', ledger.id)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: false });

      if (!data || data.length === 0) {
        alert('다운로드할 데이터가 없습니다.');
        return;
      }

      const transactions = data.map((t: any) => ({
        id: t.id,
        ledger_id: t.ledger_id,
        user_id: t.user_id,
        type: t.type,
        amount: t.amount,
        category_id: t.category_id,
        payment_method_id: t.payment_method_id,
        date: t.date,
        memo: t.memo,
        created_at: t.created_at,
        updated_at: t.updated_at,
        category: t.categories,
        payment_method: t.payment_methods,
      }));

      let blob: Blob;
      let filename: string;

      if (fileType === 'excel') {
        blob = await createExcelFile(transactions, { includeStatistics });
        filename = `거래내역_${format(startDate, 'yyyyMMdd')}-${format(endDate, 'yyyyMMdd')}.xlsx`;
      } else {
        blob = createCsvFile(transactions);
        filename = `거래내역_${format(startDate, 'yyyyMMdd')}-${format(endDate, 'yyyyMMdd')}.csv`;
      }

      // 다운로드
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || '다운로드 실패');
    }
  };

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-surface p-8'>
        <div className='max-w-7xl mx-auto'>
          {/* 헤더 */}
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-semibold text-on-surface'>
                파일 관리
              </h1>
              <p className='text-on-surface-variant mt-1'>
                Excel/CSV 업로드 및 다운로드
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <ThemeToggle />
              <Link
                href='/dashboard'
                className='px-6 py-3 bg-surface-container border border-outline rounded-xl hover:bg-surface-container-highest transition-colors text-on-surface'
              >
                대시보드로
              </Link>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className='mb-6 p-4 bg-expense/10 border border-expense/20 rounded-xl text-expense'>
              {error}
            </div>
          )}

          {/* 2분할 레이아웃 */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* 왼쪽: 파일 업로드 */}
            <div className='bg-surface-container rounded-2xl p-6 border border-outline-variant'>
              <h2 className='text-xl font-semibold text-on-surface mb-6'>
                파일 업로드
              </h2>

              {!parsedData ? (
                <FileDropzone
                  onFileAccepted={handleFileAccepted}
                  onFileRejected={setError}
                />
              ) : (
                <PreviewTable
                  transactions={parsedData}
                  onConfirm={handleConfirmUpload}
                  onCancel={() => setParsedData(null)}
                />
              )}

              {isUploading && (
                <div className='mt-6 flex items-center justify-center'>
                  <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
                  <span className='ml-3 text-on-surface-variant'>
                    처리 중...
                  </span>
                </div>
              )}
            </div>

            {/* 오른쪽: 파일 다운로드 */}
            <div className='bg-surface-container rounded-2xl p-6 border border-outline-variant'>
              <h2 className='text-xl font-semibold text-on-surface mb-6'>
                파일 다운로드
              </h2>

              <DownloadOptions onDownload={handleDownload} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
