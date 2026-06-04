import { create } from 'zustand';
import { FinancialReport, SowData } from '../../shared/types';

interface AppState {
  financialData: FinancialReport[];
  sowData: SowData[];
  loading: boolean;
  fetchFinancialData: () => Promise<void>;
  fetchSowData: () => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  financialData: [],
  sowData: [],
  loading: false,
  fetchFinancialData: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/financial');
      const data = await response.json();
      set({ financialData: data.data, loading: false });
    } catch (error) {
      console.error('Error fetching financial data:', error);
      set({ loading: false });
    }
  },
  fetchSowData: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/sow');
      const data = await response.json();
      set({ sowData: data.data, loading: false });
    } catch (error) {
      console.error('Error fetching sow data:', error);
      set({ loading: false });
    }
  },
}));
