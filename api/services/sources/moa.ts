import axios from 'axios';
import { SowData } from '../../../shared/types.js';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'http://www.moa.gov.cn/',
};

export interface MoaResult {
  success: boolean;
  sowData: SowData[];
  industryData: any;
  message?: string;
}

export class MoaScraper {
  static async fetchIndustryData(): Promise<any> {
    try {
      console.log('正在从农业农村部获取行业数据...');
      
      const moaUrl = 'http://www.moa.gov.cn/';
      
      const response = await axios.get(moaUrl, {
        headers,
        timeout: 15000,
      });

      if (response.data) {
        console.log('农业农村部页面获取成功');
        return {
          source: 'moa.gov.cn',
          fetchedAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error('农业农村部数据获取失败:', error instanceof Error ? error.message : '未知错误');
    }
    return null;
  }

  static async fetchSowData(): Promise<SowData[]> {
    try {
      console.log('正在从农业农村部获取能繁母猪数据...');
      
      const dataUrl = 'http://www.moa.gov.cn/nybgb/';
      
      const response = await axios.get(dataUrl, {
        headers,
        timeout: 15000,
      });

      if (response.data) {
        console.log('农业农村部数据页面获取成功');
      }
    } catch (error) {
      console.error('农业农村部母猪数据获取失败:', error instanceof Error ? error.message : '未知错误');
    }
    
    return [];
  }

  static async fetchAll(): Promise<MoaResult> {
    try {
      const [industryData, sowData] = await Promise.all([
        this.fetchIndustryData(),
        this.fetchSowData(),
      ]);

      return {
        success: true,
        sowData,
        industryData,
      };
    } catch (error) {
      return {
        success: false,
        sowData: [],
        industryData: null,
        message: error instanceof Error ? error.message : '未知错误',
      };
    }
  }
}
