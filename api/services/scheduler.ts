import cron from 'node-cron';
import { refreshCache } from './scraper.js';

export interface SchedulerStatus {
  isRunning: boolean;
  nextRun: Date | null;
  lastRun: Date | null;
  lastRunSuccess: boolean;
}

export class DataScheduler {
  private static instance: DataScheduler;
  private task: cron.ScheduledTask | null = null;
  private status: SchedulerStatus = {
    isRunning: false,
    nextRun: null,
    lastRun: null,
    lastRunSuccess: false,
  };

  private constructor() {}

  static getInstance(): DataScheduler {
    if (!DataScheduler.instance) {
      DataScheduler.instance = new DataScheduler();
    }
    return DataScheduler.instance;
  }

  start(): void {
    if (this.task) {
      console.log('定时任务已在运行中');
      return;
    }

    console.log('启动定时调度器，每天8:30更新数据');
    
    this.task = cron.schedule('30 8 * * *', async () => {
      console.log('定时任务触发，开始更新数据...');
      await this.runUpdate();
    }, {
      timezone: 'Asia/Shanghai',
    });

    this.status.isRunning = true;
    this.updateNextRun();
    
    console.log('定时任务已启动');
  }

  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      this.status.isRunning = false;
      this.status.nextRun = null;
      console.log('定时任务已停止');
    }
  }

  private async runUpdate(): Promise<void> {
    const startTime = new Date();
    console.log('开始数据更新:', startTime.toISOString());

    try {
      await refreshCache();
      this.status.lastRun = startTime;
      this.status.lastRunSuccess = true;
      console.log('数据更新完成');
    } catch (error) {
      this.status.lastRun = startTime;
      this.status.lastRunSuccess = false;
      console.error('数据更新失败:', error);
    }

    this.updateNextRun();
  }

  async triggerManualUpdate(): Promise<void> {
    console.log('触发手动数据更新');
    await this.runUpdate();
  }

  private updateNextRun(): void {
    if (this.task) {
      // 暂时不处理nextRun时间，保持null
      this.status.nextRun = null;
    }
  }

  getStatus(): SchedulerStatus {
    return { ...this.status };
  }
}
