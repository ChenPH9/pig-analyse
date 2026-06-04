import axios from 'axios';
import { FinancialReport } from '../../../shared/types.js';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'http://www.cninfo.com.cn/',
};

export interface CninfoResult {
  success: boolean;
  financialData: FinancialReport[];
  announcements: any[];
  message?: string;
}

export class CninfoScraper {
  static async fetchAnnouncements(): Promise<any[]> {
    try {
      console.log('正在从巨潮资讯获取公告...');
      
      const searchUrl = 'http://www.cninfo.com.cn/new/fulltextSearch/full';
      const params = {
        searchkey: '牧原股份',
        sf: 'title',
        sdate: '',
        edate: '',
        'order_Asc': 'false',
        'order_by': 'undefined',
        showTitle: 'false',
        isNewTitle: 'true',
        secid: '',
        plate: '',
        category: '',
        trade: '',
        column: 'szse',
        pageNum: 1,
        pageSize: 10,
        tabName: 'fulltext',
        sortName: '',
        sortType: '',
        flag: 'true',
      };

      const response = await axios.get(searchUrl, {
        headers,
        params,
        timeout: 15000,
      });

      if (response.data && response.data.announcements) {
        console.log(`从巨潮资讯获取到 ${response.data.announcements.length} 条公告`);
        return response.data.announcements;
      }
    } catch (error) {
      console.error('巨潮资讯数据获取失败:', error instanceof Error ? error.message : '未知错误');
    }
    return [];
  }

  static async fetchFinancialFromAnnouncements(): Promise<FinancialReport[]> {
    try {
      const announcements = await this.fetchAnnouncements();
      const results: FinancialReport[] = [];

      for (const announcement of announcements.slice(0, 5)) {
        const title = announcement.announcementTitle || '';
        if (title.includes('季度报告') || title.includes('年度报告') || title.includes('财务')) {
          console.log('发现财务相关公告:', title);
        }
      }

      return results;
    } catch (error) {
      console.error('从巨潮资讯解析财务数据失败:', error);
      return [];
    }
  }

  static async fetchAll(): Promise<CninfoResult> {
    try {
      const [announcements, financialData] = await Promise.all([
        this.fetchAnnouncements(),
        this.fetchFinancialFromAnnouncements(),
      ]);

      return {
        success: true,
        financialData,
        announcements,
      };
    } catch (error) {
      return {
        success: false,
        financialData: [],
        announcements: [],
        message: error instanceof Error ? error.message : '未知错误',
      };
    }
  }
}
