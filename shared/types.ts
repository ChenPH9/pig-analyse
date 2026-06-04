export interface FinancialReport {
  year: number;
  quarter: number;
  date: string;
  netProfit: number;
  revenue: number;
  debtRatio: number;
  grossMargin: number;
  cashFlow: number;
  peRatio: number;
  roe: number;
  pbRatio: number;
}

export interface SowData {
  year: number;
  month: number;
  date: string;
  count: number;
  change: number;
}

export interface FinancialResponse {
  success: boolean;
  data: FinancialReport[];
  updatedAt: string;
}

export interface SowResponse {
  success: boolean;
  data: SowData[];
  updatedAt: string;
}
