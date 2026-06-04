import { create } from 'zustand';
import { FinancialReport, SowData } from '../../shared/types';

interface AppState {
  financialData: FinancialReport[];
  sowData: SowData[];
  loading: boolean;
  lastUpdated: Date | null;
  error: string | null;
  fetchFinancialData: () => Promise<void>;
  fetchSowData: () => Promise<void>;
  refreshAllData: () => Promise<void>;
  clearError: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  financialData: [],
  sowData: [],
  loading: false,
  lastUpdated: null,
  error: null,

  fetchFinancialData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/financial');
      if (!response.ok) throw new Error('获取财务数据失败');
      const result = await response.json();
      set({ 
        financialData: result.data, 
        loading: false,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('获取财务数据失败:', error);
      set({ 
        error: error instanceof Error ? error.message : '未知错误',
        loading: false,
      });
    }
  },

  fetchSowData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/sow');
      if (!response.ok) throw new Error('获取母猪数据失败');
      const result = await response.json();
      set({ 
        sowData: result.data, 
        loading: false,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('获取母猪数据失败:', error);
      set({ 
        error: error instanceof Error ? error.message : '未知错误',
        loading: false,
      });
    }
  },

  refreshAllData: async () => {
    set({ loading: true, error: null });
    try {
      // 首先调用服务器端刷新
      await fetch('/api/refresh', { method: 'POST' });
      
      // 然后重新获取数据
      const [financialRes, sowRes] = await Promise.all([
        fetch('/api/financial'),
        fetch('/api/sow'),
      ]);
      
      const financialResult = await financialRes.json();
      const sowResult = await sowRes.json();
      
      set({
        financialData: financialResult.data,
        sowData: sowResult.data,
        loading: false,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('刷新数据失败:', error);
      set({ 
        error: error instanceof Error ? error.message : '刷新失败',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
