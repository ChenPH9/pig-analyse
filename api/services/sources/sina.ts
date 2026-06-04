import axios from 'axios';
import { FinancialReport } from '../../../shared/types.js';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://finance.sina.com.cn/',
};

export interface SinaResult {
  success: boolean;
  stockData: { currentPrice: number; peRatio: number; pbRatio: number } | null;
  message?: string;
}

export class SinaScraper {
  static async fetchStockData(): Promise<SinaResult['stockData']> {
    try {
      console.log('正在从新浪财经获取股价数据...');
      const sinaUrl = 'https://hq.sinajs.cn/list=sz002714';

      const response = await axios.get(sinaUrl, {
        headers,
        timeout: 8000,
      });

      if (response.data) {
        const dataStr = response.data.match(/"([^"]+)"/)?.[1];
        if (dataStr) {
          const dataArr = dataStr.split(',');
          const result = {
            currentPrice: parseFloat(dataArr[3]) || 0,
            peRatio: parseFloat(dataArr[38]) || 20,
            pbRatio: parseFloat(dataArr[46]) || 3,
          };
          console.log('新浪财经股价数据获取成功:', result);
          return result;
        }
      }
    } catch (error) {
      console.error('新浪财经数据获取失败:', error instanceof Error ? error.message : '未知错误');
    }
    return null;
  }

  static async updateFinancialWithStock(financialData: FinancialReport[]): Promise<FinancialReport[]> {
    const stockData = await this.fetchStockData();
    if (!stockData || financialData.length === 0) {
      return financialData;
    }

    const updatedData = [...financialData];
    const latest = updatedData[updatedData.length - 1];
    if (latest) {
      latest.peRatio = stockData.peRatio;
      latest.pbRatio = stockData.pbRatio;
    }

    return updatedData;
  }

  static async fetchAll(): Promise<SinaResult> {
    try {
      const stockData = await this.fetchStockData();
      return {
        success: stockData !== null,
        stockData,
      };
    } catch (error) {
      return {
        success: false,
        stockData: null,
        message: error instanceof Error ? error.message : '未知错误',
      };
    }
  }
}
