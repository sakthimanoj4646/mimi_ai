import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const baseDir = process.cwd();
const dataDir = path.resolve(process.env.DATABASE_PATH ? path.dirname(process.env.DATABASE_PATH) : path.join(baseDir, 'data'));
const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(baseDir, 'uploads'));
const exportDir = path.resolve(process.env.EXPORT_DIR || path.join(baseDir, 'exports'));

// Ensure required directories exist
[dataDir, uploadDir, exportDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.warn(`Could not create directory ${dir}:`, e);
    }
  }
});

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'mimi_ai_secret_super_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DATABASE_PATH: process.env.DATABASE_PATH || path.join(dataDir, 'mimi_studio.db'),
  UPLOAD_DIR: uploadDir,
  EXPORT_DIR: exportDir,
  MAX_UPLOAD_SIZE_MB: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '100', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
  
  // AI Keys
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  VIDEO_GEN_PROVIDER: process.env.VIDEO_GEN_PROVIDER || 'mock',
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN || '',
  RUNWAY_API_KEY: process.env.RUNWAY_API_KEY || '',
  LUMA_API_KEY: process.env.LUMA_API_KEY || '',
  
  // Mock Mode fallback
  MOCK_MODE: process.env.MOCK_MODE === 'true' || !process.env.GEMINI_API_KEY,
};
