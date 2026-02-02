import { createClient } from './client';
import type {
  MonthSummary,
  MonthlyTrendData,
  CategoryChartData,
  TransactionWithRelations,
  TransactionType,
} from '@/types';

// 결제수단 통계 타입
export interface PaymentMethodStats {
  id: string;
  name: string;
  icon: string;
  amount: number;
  percentage: number;
}

// 사용자 비교 통계 타입
export interface UserComparisonData {
  month: string;
  monthLabel: string;
  [userId: string]: number | string;
}

// 연도별 통계 타입
export interface YearlyTrendData {
  year: number;
  income: number;
  expense: number;
  balance: number;
}

// 예산 진행률 타입
export interface BudgetProgressData {
  id: string;
  categoryName: string;
  categoryIcon: string;
  budgetAmount: number;
  spentAmount: number;
  percentage: number;
  status: 'safe' | 'warning' | 'danger';
}

/**
 * 월별 요약 조회 (수입/지출/자산 합계 및 전월 대비)
 */
export async function getMonthSummary(
  ledgerId: string,
  year: number,
  month: number
): Promise<MonthSummary> {
  const supabase = createClient();

  // 현재 월 시작일과 종료일
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  // 전월 시작일과 종료일
  const prevStartDate = new Date(year, month - 2, 1)
    .toISOString()
    .split('T')[0];
  const prevEndDate = new Date(year, month - 1, 0)
    .toISOString()
    .split('T')[0];

  // 현재 월 데이터
  const { data: currentData } = await supabase
    .from('transactions')
    .select('type, amount')
    .eq('ledger_id', ledgerId)
    .gte('date', startDate)
    .lte('date', endDate);

  // 전월 데이터
  const { data: prevData } = await supabase
    .from('transactions')
    .select('type, amount')
    .eq('ledger_id', ledgerId)
    .gte('date', prevStartDate)
    .lte('date', prevEndDate);

  // 현재 월 집계
  const current = {
    income: 0,
    expense: 0,
    asset: 0,
  };

  currentData?.forEach((t) => {
    if (t.type === 'income') current.income += t.amount;
    else if (t.type === 'expense') current.expense += t.amount;
    else if (t.type === 'asset') current.asset += t.amount;
  });

  // 전월 집계
  const prev = {
    income: 0,
    expense: 0,
    asset: 0,
  };

  prevData?.forEach((t) => {
    if (t.type === 'income') prev.income += t.amount;
    else if (t.type === 'expense') prev.expense += t.amount;
    else if (t.type === 'asset') prev.asset += t.amount;
  });

  // 증감률 계산
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    income: current.income,
    expense: current.expense,
    asset: current.asset,
    balance: current.income - current.expense,
    incomeTrend: calculateTrend(current.income, prev.income),
    expenseTrend: calculateTrend(current.expense, prev.expense),
    assetTrend: calculateTrend(current.asset, prev.asset),
  };
}

/**
 * 월별 추이 데이터 조회 (최근 6개월)
 */
export async function getMonthlyTrend(
  ledgerId: string,
  year: number,
  month: number
): Promise<MonthlyTrendData[]> {
  const supabase = createClient();
  const result: MonthlyTrendData[] = [];

  // 최근 6개월 데이터
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(year, month - 1 - i, 1);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth() + 1;

    const startDate = new Date(targetYear, targetMonth - 1, 1)
      .toISOString()
      .split('T')[0];
    const endDate = new Date(targetYear, targetMonth, 0)
      .toISOString()
      .split('T')[0];

    const { data } = await supabase
      .from('transactions')
      .select('type, amount')
      .eq('ledger_id', ledgerId)
      .gte('date', startDate)
      .lte('date', endDate);

    const monthData = {
      income: 0,
      expense: 0,
      asset: 0,
    };

    data?.forEach((t) => {
      if (t.type === 'income') monthData.income += t.amount;
      else if (t.type === 'expense') monthData.expense += t.amount;
      else if (t.type === 'asset') monthData.asset += t.amount;
    });

    result.push({
      month: `${targetYear}-${String(targetMonth).padStart(2, '0')}`,
      monthLabel: `${targetMonth}월`,
      income: monthData.income,
      expense: monthData.expense,
      asset: monthData.asset,
    });
  }

  return result;
}

/**
 * 카테고리별 지출 분석 (상위 5개 + 기타)
 */
export async function getCategoryBreakdown(
  ledgerId: string,
  year: number,
  month: number
): Promise<CategoryChartData[]> {
  const supabase = createClient();

  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  // 카테고리별 지출 조회 (JOIN)
  const { data } = await supabase
    .from('transactions')
    .select(
      `
      amount,
      category_id,
      categories (
        id,
        name,
        color
      )
    `
    )
    .eq('ledger_id', ledgerId)
    .eq('type', 'expense')
    .gte('date', startDate)
    .lte('date', endDate)
    .not('category_id', 'is', null);

  // 카테고리별 집계
  const categoryMap = new Map<string, { name: string; color: string; amount: number }>();
  let total = 0;

  data?.forEach((t: any) => {
    if (t.categories) {
      const existing = categoryMap.get(t.categories.id) || {
        name: t.categories.name,
        color: t.categories.color,
        amount: 0,
      };
      existing.amount += t.amount;
      categoryMap.set(t.categories.id, existing);
      total += t.amount;
    }
  });

  // 금액 기준 정렬
  const sorted = Array.from(categoryMap.entries())
    .map(([id, data]) => ({
      id,
      name: data.name,
      value: data.amount,
      color: data.color,
      percentage: (data.amount / total) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  // 상위 5개 + 기타
  if (sorted.length <= 5) {
    return sorted;
  }

  const top5 = sorted.slice(0, 5);
  const others = sorted.slice(5);
  const othersTotal = others.reduce((sum, item) => sum + item.value, 0);

  if (othersTotal > 0) {
    top5.push({
      id: 'others',
      name: '기타',
      value: othersTotal,
      color: '#9E9E9E',
      percentage: (othersTotal / total) * 100,
    });
  }

  return top5;
}

/**
 * 최근 거래 목록 조회
 */
export async function getRecentTransactions(
  ledgerId: string,
  limit: number = 10
): Promise<TransactionWithRelations[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      *,
      categories (*),
      payment_methods (*),
      profiles (*)
    `
    )
    .eq('ledger_id', ledgerId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch recent transactions:', error);
    return [];
  }

  return (data || []).map((t: any) => ({
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
    user: t.profiles
      ? {
          id: t.profiles.id,
          email: t.profiles.email || '',
          display_name: t.profiles.display_name,
          color: t.profiles.color,
          created_at: t.profiles.created_at,
        }
      : undefined,
  }));
}

/**
 * 결제수단별 통계 조회
 */
export async function getPaymentMethodStats(
  ledgerId: string,
  startDate: string,
  endDate: string,
  type?: 'all' | TransactionType
): Promise<PaymentMethodStats[]> {
  const supabase = createClient();

  let query = supabase
    .from('transactions')
    .select(
      `
      amount,
      payment_method_id,
      payment_methods (
        id,
        name,
        icon
      )
    `
    )
    .eq('ledger_id', ledgerId)
    .gte('date', startDate)
    .lte('date', endDate)
    .not('payment_method_id', 'is', null);

  if (type && type !== 'all') {
    query = query.eq('type', type);
  }

  const { data } = await query;

  const paymentMethodMap = new Map<
    string,
    { name: string; icon: string; amount: number }
  >();
  let total = 0;

  data?.forEach((t: any) => {
    if (t.payment_methods) {
      const existing = paymentMethodMap.get(t.payment_methods.id) || {
        name: t.payment_methods.name,
        icon: t.payment_methods.icon,
        amount: 0,
      };
      existing.amount += t.amount;
      paymentMethodMap.set(t.payment_methods.id, existing);
      total += t.amount;
    }
  });

  return Array.from(paymentMethodMap.entries())
    .map(([id, data]) => ({
      id,
      name: data.name,
      icon: data.icon,
      amount: data.amount,
      percentage: (data.amount / total) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * 사용자별 비교 통계 (최근 6개월)
 */
export async function getUserComparisonStats(
  ledgerId: string,
  year: number,
  month: number
): Promise<UserComparisonData[]> {
  const supabase = createClient();
  const result: UserComparisonData[] = [];

  // 사용자 목록 조회
  const { data: members } = await supabase
    .from('ledger_members')
    .select(
      `
      user_id,
      profiles (
        id,
        display_name,
        email
      )
    `
    )
    .eq('ledger_id', ledgerId);

  const users =
    members?.map((m: any) => ({
      id: m.user_id,
      name: m.profiles?.display_name || m.profiles?.email || 'Unknown',
    })) || [];

  // 최근 6개월 데이터
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(year, month - 1 - i, 1);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth() + 1;

    const startDate = new Date(targetYear, targetMonth - 1, 1)
      .toISOString()
      .split('T')[0];
    const endDate = new Date(targetYear, targetMonth, 0)
      .toISOString()
      .split('T')[0];

    const { data } = await supabase
      .from('transactions')
      .select('user_id, amount')
      .eq('ledger_id', ledgerId)
      .eq('type', 'expense')
      .gte('date', startDate)
      .lte('date', endDate);

    const monthData: UserComparisonData = {
      month: `${targetYear}-${String(targetMonth).padStart(2, '0')}`,
      monthLabel: `${targetMonth}월`,
    };

    users.forEach((user) => {
      monthData[user.id] = 0;
    });

    data?.forEach((t: any) => {
      if (monthData[t.user_id] !== undefined) {
        monthData[t.user_id] =
          (monthData[t.user_id] as number) + t.amount;
      }
    });

    result.push(monthData);
  }

  return result;
}

/**
 * 연도별 추이 (최근 3년)
 */
export async function getYearlyTrend(
  ledgerId: string,
  currentYear: number
): Promise<YearlyTrendData[]> {
  const supabase = createClient();
  const result: YearlyTrendData[] = [];

  for (let i = 2; i >= 0; i--) {
    const year = currentYear - i;
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data } = await supabase
      .from('transactions')
      .select('type, amount')
      .eq('ledger_id', ledgerId)
      .gte('date', startDate)
      .lte('date', endDate);

    const yearData = {
      income: 0,
      expense: 0,
    };

    data?.forEach((t: any) => {
      if (t.type === 'income') yearData.income += t.amount;
      else if (t.type === 'expense') yearData.expense += t.amount;
    });

    result.push({
      year,
      income: yearData.income,
      expense: yearData.expense,
      balance: yearData.income - yearData.expense,
    });
  }

  return result;
}

/**
 * 예산 진행률 조회
 */
export async function getBudgetProgress(
  ledgerId: string,
  year: number,
  month: number
): Promise<BudgetProgressData[]> {
  const supabase = createClient();

  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  // 예산 조회
  const { data: budgets } = await supabase
    .from('budgets')
    .select(
      `
      id,
      category_id,
      amount,
      categories (
        id,
        name,
        icon
      )
    `
    )
    .eq('ledger_id', ledgerId)
    .eq('year', year)
    .eq('month', month);

  if (!budgets || budgets.length === 0) {
    return [];
  }

  const result: BudgetProgressData[] = [];

  for (const budget of budgets) {
    const category = budget.categories as any;
    if (!category) continue;

    // 해당 카테고리의 지출 조회
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount')
      .eq('ledger_id', ledgerId)
      .eq('category_id', budget.category_id)
      .eq('type', 'expense')
      .gte('date', startDate)
      .lte('date', endDate);

    const spentAmount =
      transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
    const percentage = (spentAmount / budget.amount) * 100;

    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (percentage >= 100) status = 'danger';
    else if (percentage >= 80) status = 'warning';

    result.push({
      id: budget.id,
      categoryName: category.name,
      categoryIcon: category.icon,
      budgetAmount: budget.amount,
      spentAmount,
      percentage,
      status,
    });
  }

  return result.sort((a, b) => b.percentage - a.percentage);
}
