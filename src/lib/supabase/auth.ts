import { createClient } from './client';
import type { AuthError, User, Session } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

/**
 * 이메일과 비밀번호로 로그인
 */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * 새 계정 생성
 */
export async function signUp(
  email: string,
  password: string
): Promise<AuthResponse> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * 현재 세션 조회
 */
export async function getSession(): Promise<{
  session: Session | null;
  error: AuthError | null;
}> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

/**
 * 현재 로그인한 사용자 조회
 */
export async function getCurrentUser(): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}

/**
 * 세션 변경 감지 (클라이언트에서 사용)
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  const supabase = createClient();
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}
