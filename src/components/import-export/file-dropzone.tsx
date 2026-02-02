'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  onFileRejected?: (error: string) => void;
}

export function FileDropzone({
  onFileAccepted,
  onFileRejected,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          onFileRejected?.('파일 크기는 10MB 이하여야 합니다.');
        } else if (error.code === 'file-invalid-type') {
          onFileRejected?.('Excel(.xlsx) 또는 CSV 파일만 업로드 가능합니다.');
        } else {
          onFileRejected?.('파일 업로드 실패');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted, onFileRejected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-outline-variant hover:border-primary hover:bg-surface-container'
      }`}
    >
      <input {...getInputProps()} />

      {/* 아이콘 */}
      <div className='mb-6 flex justify-center'>
        <svg
          className={`w-16 h-16 ${isDragActive ? 'text-primary' : 'text-on-surface-variant'}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
          />
        </svg>
      </div>

      {/* 텍스트 */}
      <div className='space-y-2'>
        <p className='text-lg font-medium text-on-surface'>
          {isDragActive
            ? '파일을 놓으세요'
            : '파일을 드래그하거나 클릭하여 업로드'}
        </p>
        <p className='text-sm text-on-surface-variant'>
          Excel (.xlsx) 또는 CSV 파일 (최대 10MB)
        </p>
      </div>

      {/* 버튼 */}
      <button
        type='button'
        className='mt-6 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium'
        onClick={(e) => e.stopPropagation()}
      >
        파일 선택
      </button>
    </div>
  );
}
