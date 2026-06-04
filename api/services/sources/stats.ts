import axios from 'axios';
import { SowData } from '../../../shared/types.js';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'http://www.stats.gov.cn/',
};

export interface StatsResult {
  success: boolean;
  sowData: SowData[];
  macroData: any;
  message?: string;
}

export class StatsScraper {
  static async fetchMacroData(): Promise<any> {
    try {
      console.log('正在从国家统计局获取宏观数据...');
      
      const statsUrl = 'http://www.stats.gov.cn/sj/zxfb/index.html';
      
      const response = await axios.get(statsUrl, {
        headers,
        timeout: 15000,
      });

      if (response.data) {
        console.log('国家统计局页面获取成功');
        return {
          source: 'stats.gov.cn',
          fetchedAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error('国家统计局数据获取失败:', error instanceof Error ? error.message : '未知错误');
    }
    return null;
  }

  static async fetchSowData(): Promise<SowData[]> {
    try {
      console.log('正在从国家统计局获取生猪存栏数据...');
      
      const dataUrl = 'http://www.stats.gov.cn/sj/';
      
      const response = await axios.get(dataUrl, {
        headers,
        timeout: 15000,
      });

      if (response.data) {
        console.log('国家统计局数据页面获取成功，需要解析');
      }
    } catch (error) {
      console.error('国家统计局母猪数据获取失败:', error instanceof Error ? error.message : '未知错误');
    }
    
    return [];
  }

  static async fetchAll(): Promise<StatsResult> {
    try {
      const [macroData, sowData] = await Promise.all([
        this.fetchMacroData(),
        this.fetchSowData(),
      ]);

      return {
        success: true,
        sowData,
        macroData,
      };
    } catch (error) {
      return {
        success: false,
        sowData: [],
        macroData: null,
        message: error instanceof Error ? error.message : '未知错误',
      };
    }
  }
}
