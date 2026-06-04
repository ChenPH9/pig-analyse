import { FinancialReport, SowData } from '../../shared/types.js';

export interface DataSourcePriority {
  [key: string]: number; 
}

export const financialDataSourcePriority: DataSourcePriority = {
  'eastmoney': 1,
  'cninfo': 2,
  'sina': 3,
};

export const sowDataSourcePriority: DataSourcePriority = {
  'moa': 1,
  'stats': 2,
  'eastmoney': 3,
};

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
}

export class DataValidator {
  static validateFinancialReport(report: Partial<FinancialReport>): ValidationResult {
    const issues: string[] = [];
    
    if (!report.year || report.year < 2010 || report.year > 2030) {
      issues.push('年份无效');
    }
    if (!report.quarter || ![1, 2, 3, 4].includes(report.quarter)) {
      issues.push('季度无效');
    }
    if (report.netProfit !== undefined && Math.abs(report.netProfit) > 1000) {
      issues.push('净利润异常');
    }
    if (report.revenue !== undefined && report.revenue < 0) {
      issues.push('营业收入不能为负');
    }
    if (report.debtRatio !== undefined && (report.debtRatio < 0 || report.debtRatio > 100)) {
      issues.push('资产负债率范围异常');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  static validateSowData(data: Partial<SowData>): ValidationResult {
    const issues: string[] = [];
    
    if (!data.year || data.year < 2010 || data.year > 2030) {
      issues.push('年份无效');
    }
    if (!data.month || data.month < 1 || data.month > 12) {
      issues.push('月份无效');
    }
    if (data.count !== undefined && (data.count < 0 || data.count > 1000)) {
      issues.push('母猪数量异常');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  static mergeFinancialData(
    dataBySource: { [source: string]: FinancialReport[] },
    priority: DataSourcePriority
  ): FinancialReport[] {
    const mergedMap = new Map<string, FinancialReport>();
    const sortedSources = Object.keys(dataBySource).sort(
      (a, b) => (priority[a] || 999) - (priority[b] || 999)
    );

    for (const source of sortedSources) {
      const reports = dataBySource[source] || [];
      for (const report of reports) {
        const key = `${report.year}-Q${report.quarter}`;
        if (!mergedMap.has(key)) {
          const validation = this.validateFinancialReport(report);
          if (validation.isValid) {
            mergedMap.set(key, { ...report });
          }
        } else {
          const existing = mergedMap.get(key)!;
          mergedMap.set(key, this.fillMissingFields(existing, report));
        }
      }
    }

    return Array.from(mergedMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.quarter - b.quarter;
    });
  }

  static mergeSowData(
    dataBySource: { [source: string]: SowData[] },
    priority: DataSourcePriority
  ): SowData[] {
    const mergedMap = new Map<string, SowData>();
    const sortedSources = Object.keys(dataBySource).sort(
      (a, b) => (priority[a] || 999) - (priority[b] || 999)
    );

    for (const source of sortedSources) {
      const dataList = dataBySource[source] || [];
      for (const data of dataList) {
        const key = `${data.year}-${String(data.month).padStart(2, '0')}`;
        if (!mergedMap.has(key)) {
          const validation = this.validateSowData(data);
          if (validation.isValid) {
            mergedMap.set(key, { ...data });
          }
        } else {
          const existing = mergedMap.get(key)!;
          mergedMap.set(key, this.fillMissingFields(existing, data));
        }
      }
    }

    return Array.from(mergedMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }

  private static fillMissingFields<T extends object>(target: T, source: Partial<T>): T {
    const result = { ...target };
    for (const [key, value] of Object.entries(source)) {
      if (result[key as keyof T] === undefined || result[key as keyof T] === null) {
        result[key as keyof T] = value as any;
      }
    }
    return result;
  }
}
