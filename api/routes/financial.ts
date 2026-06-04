import { Router } from 'express';
import { financialData, sowData } from '../data/mockData.js';

const router = Router();

router.get('/financial', (req, res) => {
  res.json({
    success: true,
    data: financialData,
    updatedAt: new Date().toISOString(),
  });
});

router.get('/sow', (req, res) => {
  res.json({
    success: true,
    data: sowData,
    updatedAt: new Date().toISOString(),
  });
});

export default router;
