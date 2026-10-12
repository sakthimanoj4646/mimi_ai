import express from 'express';
import cors from 'cors';
import path from 'path';
import { CONFIG } from './config';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import videoRoutes from './routes/video.routes';
import mimiRoutes from './routes/mimi.routes';
import aiRoutes from './routes/ai.routes';

const app = express();

// Security & Cross-Origin Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl) or matched origins
    if (!origin || CONFIG.CORS_ORIGIN.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(null, true); // Dev-friendly permissive
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving for uploads and exports
app.use('/uploads', express.static(CONFIG.UPLOAD_DIR));
app.use('/exports', express.static(CONFIG.EXPORT_DIR));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'MIMI AI Creative Studio API',
    version: '1.0.0',
    mode: CONFIG.NODE_ENV,
    mockMode: CONFIG.MOCK_MODE,
    videoProvider: CONFIG.VIDEO_GEN_PROVIDER,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/mimi', mimiRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(CONFIG.PORT, () => {
    console.log(`
🌊 ======================================================== 🌊
   MIMI AI — YOUR CREATIVE VIDEO STUDIO SERVER
   "Imagine It. Describe It. Create It."
🌊 ======================================================== 🌊
   🚀 Server listening on: http://localhost:${CONFIG.PORT}
   📂 Uploads: ${CONFIG.UPLOAD_DIR}
   🎬 Exports: ${CONFIG.EXPORT_DIR}
   🤖 AI Provider Mode: ${CONFIG.MOCK_MODE ? '⚡ Mock/Fallback (Safe Dev Mode)' : '🌐 Production AI APIs'}
   💙 Assistant: Mimi ("Your Creative AI Buddy")
============================================================
    `);
  });
}

export default app;
