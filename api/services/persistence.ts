import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FinancialReport, SowData } from '../../shared/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.join(__dirname, '../data/backup');

export interface BackupData {
  financial: FinancialReport[];
  sow: SowData[];
  timestamp: string;
  version: string;
}

export class DataPersistence {
  private static ensureBackupDir(): void {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
  }

  private static getBackupFileName(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    return `muyuan-data-${dateStr}.json`;
  }

  static saveBackup(data: BackupData): string {
    this.ensureBackupDir();
    const fileName = this.getBackupFileName();
    const filePath = path.join(BACKUP_DIR, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`数据已备份到: ${filePath}`);
    
    this.cleanupOldBackups();
    return filePath;
  }

  static loadBackup(): BackupData | null {
    this.ensureBackupDir();
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('muyuan-data-') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length === 0) {
      return null;
    }

    const latestFile = files[0];
    const filePath = path.join(BACKUP_DIR, latestFile);
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('读取备份文件失败:', error);
      return null;
    }
  }

  static loadBackupByDate(date: string): BackupData | null {
    this.ensureBackupDir();
    const fileName = `muyuan-data-${date}.json`;
    const filePath = path.join(BACKUP_DIR, fileName);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`读取备份文件失败: ${date}`, error);
      return null;
    }
  }

  private static cleanupOldBackups(): void {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('muyuan-data-') && f.endsWith('.json'))
      .sort();

    if (files.length > 30) {
      const filesToDelete = files.slice(0, files.length - 30);
      for (const file of filesToDelete) {
        const filePath = path.join(BACKUP_DIR, file);
        fs.unlinkSync(filePath);
        console.log(`删除旧备份: ${file}`);
      }
    }
  }
}
