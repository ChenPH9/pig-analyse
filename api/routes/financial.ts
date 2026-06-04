import { Router } from 'express';
import { 
  fetchFinancialData, 
  fetchSowData, 
  refreshCache, 
  getCacheStatus 
} from '../services/scraper.js';

const router = Router();

router.get('/financial', async (req, res) => {
  try {
    console.log('收到财务数据请求');
    const data = await fetchFinancialData();
    res.json({
      success: true,
      data,
      updatedAt: new Date().toISOString(),
      source: '牧原股份财务数据 (002714.SZ)',
    });
  } catch (error) {
    console.error('财务数据API错误:', error);
    res.status(500).json({
      success: false,
      error: '获取财务数据失败',
    });
  }
});

router.get('/sow', async (req, res) => {
  try {
    console.log('收到母猪数据请求');
    const data = await fetchSowData();
    res.json({
      success: true,
      data,
      updatedAt: new Date().toISOString(),
      source: '牧原股份能繁母猪存栏数据',
    });
  } catch (error) {
    console.error('母猪数据API错误:', error);
    res.status(500).json({
      success: false,
      error: '获取母猪数据失败',
    });
  }
});

// 手动刷新缓存接口
router.post('/refresh', async (req, res) => {
  try {
    console.log('收到刷新缓存请求');
    const result = await refreshCache();
    res.json({
      success: true,
      result,
      message: '缓存刷新完成',
    });
  } catch (error) {
    console.error('刷新缓存API错误:', error);
    res.status(500).json({
      success: false,
      error: '刷新缓存失败',
    });
  }
});

// 获取缓存状态接口
router.get('/cache-status', (req, res) => {
  try {
    const status = getCacheStatus();
    res.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error('缓存状态API错误:', error);
    res.status(500).json({
      success: false,
      error: '获取缓存状态失败',
    });
  }
});

export default router;
