import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { CONFIG } from '../config';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, CONFIG.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueId = crypto.randomBytes(12).toString('hex');
    cb(null, `clip_${uniqueId}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext) || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported video format (${ext}). Supported formats: MP4, MOV, WEBM, MKV.`));
  }
};

export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: CONFIG.MAX_UPLOAD_SIZE_MB * 1024 * 1024, // e.g. 100MB
  },
  fileFilter,
});
