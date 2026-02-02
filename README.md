# 🏠 공유 가계부 웹 통계 플랫폼

Flutter 공유 가계부 앱과 연동되는 고급 통계 및 데이터 관리 웹 플랫폼입니다.

> **관련 프로젝트**: [house-hold-account](https://github.com/stravinest/house-hold-account) (Flutter 모바일 앱)

## 🛠 기술 스택

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5.9+
- **Styling**: Tailwind CSS 4.x
- **Charts**: Recharts 3.7
- **Data Fetching**: TanStack Query 5.90
- **State Management**: Zustand 5.0
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **File Processing**: xlsx, papaparse
- **Theme**: next-themes (Dark Mode)
- **Deployment**: Vercel

## ✨ 핵심 기능

### 인증 및 계정 관리
- ✅ 모바일 앱과 동일한 Supabase 계정 사용
- ✅ 로그인 / 회원가입 / 비밀번호 재설정
- ✅ 세션 관리 및 자동 갱신

### 대시보드
- ✅ 월별 수입/지출/자산 요약
- ✅ 월간 추세 라인 차트 (6개월)
- ✅ 카테고리별 도넛 차트
- ✅ 최근 거래 내역 테이블

### 고급 통계
- ✅ 결제수단별 분석 (가로 막대 차트)
- ✅ 사용자별 비교 (누적 막대 차트)
- ✅ 연도별 추세 (수입/지출/잔액 복합 차트)
- ✅ 예산 진행률 (프로그레스 바)
- ✅ 날짜 범위 및 거래 타입 필터

### 파일 관리
- ✅ Excel/CSV 파일 업로드 (드래그 앤 드롭)
- ✅ 거래 데이터 미리보기 및 검증
- ✅ Excel/CSV 다운로드 (통계 포함)
- ✅ 템플릿 파일 제공

### UI/UX
- ✅ 반응형 디자인 (Mobile/Tablet/Desktop)
- ✅ 다크모드 지원 (시스템 설정 자동 감지)
- ✅ Material Design 3 디자인 토큰
- ✅ Flutter 앱과 일관된 디자인

## 시작하기

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 Supabase 정보를 입력하세요:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
house-web/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # 인증 라우트
│   │   │   ├── login/           # 로그인 페이지
│   │   │   └── register/        # 회원가입 페이지
│   │   ├── (main)/               # 메인 앱 라우트
│   │   │   ├── dashboard/       # 대시보드
│   │   │   ├── statistics/      # 고급 통계
│   │   │   └── import-export/   # 파일 관리
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   ├── page.tsx             # 홈 페이지 (리다이렉트)
│   │   └── globals.css          # 글로벌 스타일 + 디자인 토큰
│   ├── components/               # UI 컴포넌트
│   │   ├── charts/              # Recharts 차트 컴포넌트
│   │   ├── dashboard/           # 대시보드 컴포넌트
│   │   ├── import-export/       # 파일 관리 컴포넌트
│   │   ├── statistics/          # 통계 컴포넌트
│   │   ├── providers/           # Provider 컴포넌트
│   │   ├── theme-provider.tsx   # next-themes Provider
│   │   ├── theme-toggle.tsx     # 다크모드 토글 버튼
│   │   └── protected-route.tsx  # 인증 가드
│   ├── lib/                      # 유틸리티 및 헬퍼
│   │   ├── supabase/            # Supabase 클라이언트 및 레포지토리
│   │   │   ├── client.ts       # 클라이언트 컴포넌트용
│   │   │   ├── server.ts       # 서버 컴포넌트용
│   │   │   ├── auth.ts         # 인증 함수
│   │   │   ├── ledger-repository.ts
│   │   │   └── statistics-repository.ts
│   │   ├── excel/               # Excel 파싱/생성
│   │   ├── csv/                 # CSV 파싱/생성
│   │   └── utils.ts             # 공통 유틸리티
│   ├── stores/                   # Zustand 상태 관리
│   │   ├── auth-store.ts        # 인증 상태
│   │   └── filter-store.ts      # 필터 상태
│   └── types/                    # TypeScript 타입 정의
│       └── index.ts
├── public/                       # 정적 파일
│   └── templates/               # Excel/CSV 템플릿
├── scripts/                      # 유틸리티 스크립트
│   └── create-template.js       # 템플릿 생성 스크립트
├── .env.local                    # 환경 변수 (gitignore)
├── .env.local.example           # 환경 변수 예시
├── package.json
├── tsconfig.json
├── tailwind.config.ts           # Tailwind CSS 설정 + 디자인 토큰
├── postcss.config.mjs           # PostCSS 설정
└── next.config.ts               # Next.js 설정
```

## 빌드 및 배포

### 로컬 빌드

```bash
npm run build
npm run start
```

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

환경 변수는 Vercel 대시보드에서 설정하세요.

## 개발 가이드

### 디자인 시스템

앱의 디자인 시스템을 웹에 적용했습니다:

- **색상**: `globals.css`의 CSS 변수 사용
- **간격**: `spacing` 토큰 (xs/sm/md/lg/xl/xxl)
- **모서리**: `borderRadius` 토큰
- **타이포그래피**: Material Design 3 기반

### 유틸리티 함수

```typescript
import { formatCurrency, formatDate, cn } from '@/lib/utils';

formatCurrency(15000); // ₩15,000
formatDate(new Date(), 'short'); // 2026. 2. 1.
cn('bg-primary', 'text-white'); // Tailwind 클래스 병합
```

### Supabase 클라이언트

```typescript
// 클라이언트 컴포넌트
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

// 서버 컴포넌트
import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();
```

## 📚 개발 문서

프로젝트 계획 및 설계 문서는 [house-hold-account](https://github.com/stravinest/house-hold-account) 리포지토리의 `docs/` 폴더를 참고하세요.

## 🔗 관련 링크

- **Flutter 앱**: [house-hold-account](https://github.com/stravinest/house-hold-account)
- **디자인 파일**: house.pen (Pencil 프로젝트)
- **백엔드**: Supabase Cloud

## 📝 라이센스

Private

---

**Made with ❤️ using Next.js and Supabase**
