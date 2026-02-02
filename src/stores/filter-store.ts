import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TransactionType } from '@/types';

interface FilterState {
  dateRange: {
    start: Date;
    end: Date;
  };
  type: 'all' | TransactionType;
  categoryIds: string[];
  userIds: string[];
  setDateRange: (start: Date, end: Date) => void;
  setType: (type: 'all' | TransactionType) => void;
  setCategoryIds: (ids: string[]) => void;
  setUserIds: (ids: string[]) => void;
  reset: () => void;
}

// 기본값: 이번 달
const getDefaultDateRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start, end };
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      dateRange: getDefaultDateRange(),
      type: 'all',
      categoryIds: [],
      userIds: [],
      setDateRange: (start, end) => set({ dateRange: { start, end } }),
      setType: (type) => set({ type }),
      setCategoryIds: (categoryIds) => set({ categoryIds }),
      setUserIds: (userIds) => set({ userIds }),
      reset: () =>
        set({
          dateRange: getDefaultDateRange(),
          type: 'all',
          categoryIds: [],
          userIds: [],
        }),
    }),
    {
      name: 'filter-storage',
      partialize: (state) => ({
        dateRange: {
          start: state.dateRange.start.toISOString(),
          end: state.dateRange.end.toISOString(),
        },
        type: state.type,
        categoryIds: state.categoryIds,
        userIds: state.userIds,
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        dateRange: {
          start: new Date(persistedState.dateRange.start),
          end: new Date(persistedState.dateRange.end),
        },
      }),
    }
  )
);
