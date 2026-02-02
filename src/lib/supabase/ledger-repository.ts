import { createClient } from './client';
import type { Ledger } from '@/types';

/**
 * 사용자의 가계부 목록 조회
 */
export async function getUserLedgers(userId: string): Promise<Ledger[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('ledger_members')
    .select(
      `
      ledgers (
        id,
        name,
        created_at
      )
    `
    )
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to fetch ledgers:', error);
    return [];
  }

  return (data || [])
    .map((item: any) => item.ledgers)
    .filter((ledger: any) => ledger !== null);
}

/**
 * 사용자의 첫 번째 가계부 조회 (기본 가계부)
 */
export async function getDefaultLedger(userId: string): Promise<Ledger | null> {
  const ledgers = await getUserLedgers(userId);
  return ledgers.length > 0 ? ledgers[0] : null;
}
