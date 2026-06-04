import axios from 'axios';
import { FinancialReport, SowData } from '../../../shared/types.js';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

export interface EastMoneyResult {
  success: boolean;
  financialData: FinancialReport[];
  sowData: SowData[];
  message?: string;
}

export class EastMoneyScraper {
  static async fetchFinancialData(): Promise<FinancialReport[]> {
    try {
      console.log('正在从东方财富获取财务数据...');
      
      const financeApiUrl = 'https://datacenter-web.eastmoney.com/api/data/v1/get';
      
      const params = {
        reportName: 'RPT_DMSK_FN_MAIN',
        columns: 'REPORT_DATE,NETPROFIT,OPERATE_REVENUE,ASSET_LIAB_RATIO,WEIGHTAVG_ROE,GROSS_MARGIN,BASIC_EPS',
        filter: '(SECURITY_CODE="002714")',
        pageNumber: 1,
        pageSize: 50,
        sortTypes: '-1',
        sortColumns: 'REPORT_DATE',
        source: 'WEB',
        client: 'WEB',
      };

      const response = await axios.get(financeApiUrl, {
        headers,
        params,
        timeout: 10000,
      });

      if (response.data && response.data.result && response.data.result.data) {
        const rawData = response.data.result.data;
        console.log(`从东方财富获取到 ${rawData.length} 条财务数据`);
        
        return rawData.map((item: any) => {
          const reportDate = new Date(item.REPORT_DATE);
          const year = reportDate.getFullYear();
          const month = reportDate.getMonth() + 1;
          const quarter = Math.ceil(month / 3);

          return {
            year,
            quarter,
            date: `${year}-Q${quarter}`,
            netProfit: item.NETPROFIT ? parseFloat(item.NETPROFIT) / 100000000 : 0,
            revenue: item.OPERATE_REVENUE ? parseFloat(item.OPERATE_REVENUE) / 100000000 : 0,
            debtRatio: item.ASSET_LIAB_RATIO ? parseFloat(item.ASSET_LIAB_RATIO) : 0,
            grossMargin: item.GROSS_MARGIN ? parseFloat(item.GROSS_MARGIN) : 0,
            cashFlow: 0,
            peRatio: 0,
            roe: item.WEIGHTAVG_ROE ? parseFloat(item.WEIGHTAVG_ROE) : 0,
            pbRatio: 0,
          };
        });
      }
    } catch (error) {
      console.error('东方财富财务数据获取失败:', error instanceof Error ? error.message : '未知错误');
    }
    return [];
  }

  static async fetchSowData(): Promise<SowData[]> {
    try {
      console.log('正在从东方财富获取母猪数据...');
      
      const researchUrl = 'https://datacenter-web.eastmoney.com/api/data/v1/get';
      const params = {
        reportName: 'RPT_RESEARCH_REPORT',
        columns: 'REPORT_DATE,TITLE,CONTENT',
        filter: '(SECURITY_CODE="002714")',
        pageNumber: 1,
        pageSize: 20,
        sortTypes: '-1',
        sortColumns: 'REPORT_DATE',
      };

      const response = await axios.get(researchUrl, {
        headers,
        params,
        timeout: 10000,
      });

      if (response.data && response.data.result && response.data.result.data) {
        console.log('从东方财富获取到研报数据，尝试解析母猪数据...');
        return this.parseSowFromResearch(response.data.result.data);
      }
    } catch (error) {
      console.error('东方财富母猪数据获取失败:', error instanceof Error ? error.message : '未知错误');
    }
    return [];
  }

  private static parseSowFromResearch(reports: any[]): SowData[] {
    const results: SowData[] = [];
    for (const report of reports) {
      const title = report.TITLE || '';
      const content = report.CONTENT || '';
      const combined = (title + ' ' + content).toLowerCase();
      
      const sowPattern = /母猪.*?(\d+\.?\d*).*?(万头|万)/i;
      const match = combined.match(sowPattern);
      
      if (match) {
        const count = parseFloat(match[1]);
        const reportDate = new Date(report.REPORT_DATE);
        results.push({
          year: reportDate.getFullYear(),
          month: reportDate.getMonth() + 1,
          date: `${reportDate.getFullYear()}-${String(reportDate.getMonth() + 1).padStart(2, '0')}`,
          count,
          change: 0,
        });
      }
    }
    return results;
  }

  static async fetchAll(): Promise<EastMoneyResult> {
    try {
      const [financialData, sowData] = await Promise.all([
        this.fetchFinancialData(),
        this.fetchSowData(),
      ]);

      return {
        success: true,
        financialData,
        sowData,
      };
    } catch (error) {
      return {
        success: false,
        financialData: [],
        sowData: [],
        message: error instanceof Error ? error.message : '未知错误',
      };
    }
  }
}
