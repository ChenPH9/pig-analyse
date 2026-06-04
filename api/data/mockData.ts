import { FinancialReport, SowData } from '../../shared/types';

export const generateFinancialData = (): FinancialReport[] => {
  const data: FinancialReport[] = [];
  let baseNetProfit = 5;
  let baseRevenue = 30;
  let baseDebtRatio = 45;
  let baseGrossMargin = 25;
  let baseCashFlow = 8;
  let basePeRatio = 20;
  let baseRoe = 12;
  let basePbRatio = 3;

  for (let year = 2014; year <= 2025; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      const trend = Math.sin((year - 2014) * 0.5 + quarter * 0.3);
      const randomness = (Math.random() - 0.5) * 0.3;
      
      baseNetProfit *= (1 + trend * 0.08 + randomness);
      baseRevenue *= (1 + trend * 0.05 + randomness * 0.5);
      baseDebtRatio += (Math.random() - 0.45) * 2;
      baseGrossMargin += (Math.random() - 0.5) * 1.5;
      baseCashFlow *= (1 + (Math.random() - 0.4) * 0.15);
      basePeRatio *= (1 + (Math.random() - 0.5) * 0.1);
      baseRoe += (Math.random() - 0.45) * 1;
      basePbRatio *= (1 + (Math.random() - 0.5) * 0.08);

      baseNetProfit = Math.max(1, baseNetProfit);
      baseRevenue = Math.max(10, baseRevenue);
      baseDebtRatio = Math.max(20, Math.min(70, baseDebtRatio));
      baseGrossMargin = Math.max(10, Math.min(45, baseGrossMargin));
      baseCashFlow = Math.max(1, baseCashFlow);
      basePeRatio = Math.max(5, Math.min(60, basePeRatio));
      baseRoe = Math.max(2, Math.min(35, baseRoe));
      basePbRatio = Math.max(1, Math.min(10, basePbRatio));

      data.push({
        year,
        quarter,
        date: `${year}-Q${quarter}`,
        netProfit: parseFloat(baseNetProfit.toFixed(2)),
        revenue: parseFloat(baseRevenue.toFixed(2)),
        debtRatio: parseFloat(baseDebtRatio.toFixed(2)),
        grossMargin: parseFloat(baseGrossMargin.toFixed(2)),
        cashFlow: parseFloat(baseCashFlow.toFixed(2)),
        peRatio: parseFloat(basePeRatio.toFixed(2)),
        roe: parseFloat(baseRoe.toFixed(2)),
        pbRatio: parseFloat(basePbRatio.toFixed(2)),
      });
    }
  }
  return data;
};

export const generateSowData = (): SowData[] => {
  const data: SowData[] = [];
  let baseCount = 50;

  for (let year = 2018; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      const seasonalTrend = Math.sin((month - 1) * Math.PI / 6) * 5;
      const growthTrend = (year - 2018) * 15;
      const randomness = (Math.random() - 0.5) * 8;
      
      const prevCount = baseCount;
      baseCount = 50 + growthTrend + seasonalTrend + randomness;
      baseCount = Math.max(30, Math.min(300, baseCount));
      
      const change = prevCount > 0 ? ((baseCount - prevCount) / prevCount) * 100 : 0;

      data.push({
        year,
        month,
        date: `${year}-${String(month).padStart(2, '0')}`,
        count: parseFloat(baseCount.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
      });
    }
  }
  return data;
};

export const financialData = generateFinancialData();
export const sowData = generateSowData();
