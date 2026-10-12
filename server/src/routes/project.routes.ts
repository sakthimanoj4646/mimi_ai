import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { dbManager } from '../database/db';
import { uploadVideo } from '../middleware/upload';

const router = Router();

// Protect all project endpoints
router.use(authenticateToken);

// List user projects
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const projects = dbManager.prepare(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC'
    ).all(userId);
    return res.json({ projects });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
});

// Create project
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { title, project_type, aspect_ratio, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Project title is required.' });
    }

    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    dbManager.prepare(
      'INSERT INTO projects (id, user_id, title, description, project_type, status, aspect_ratio, thumbnail_url, output_video_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      projectId,
      userId,
      title,
      description || '',
      project_type || 'video_edit',
      'draft',
      aspect_ratio || '16:9',
      '',
      ''
    );

    const project = dbManager.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    return res.status(201).json({ project });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create project.' });
  }
});

// Get single project
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const projectId = req.params.id;

    const project = dbManager.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Authorization check: user can only access their own projects
    if (project.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied. You do not own this project.' });
    }

    const mediaAssets = dbManager.prepare(
      'SELECT * FROM media_assets WHERE project_id = ? ORDER BY order_index ASC'
    ).all(projectId);

    return res.json({ project, mediaAssets });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve project details.' });
  }
});

// Update project
router.put('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const projectId = req.params.id;
    const { title, description, status, aspect_ratio, thumbnail_url, output_video_url } = req.body;

    const project = dbManager.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    if (project.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    dbManager.prepare(
      `UPDATE projects 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           status = COALESCE(?, status),
           aspect_ratio = COALESCE(?, aspect_ratio),
           thumbnail_url = COALESCE(?, thumbnail_url),
           output_video_url = COALESCE(?, output_video_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(title, description, status, aspect_ratio, thumbnail_url, output_video_url, projectId);

    const updated = dbManager.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    return res.json({ project: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update project.' });
  }
});

// Delete project
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const projectId = req.params.id;

    const project = dbManager.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    if (project.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    dbManager.prepare('DELETE FROM projects WHERE id = ?').run(projectId);
    return res.json({ message: 'Project deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
});

// Upload media asset to project
router.post('/:id/media', uploadVideo.single('video'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const projectId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No video file provided.' });
    }

    const project = dbManager.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    if (!project || project.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied or project not found.' });
    }

    const assetId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const publicUrl = `/uploads/${file.filename}`;

    dbManager.prepare(
      'INSERT INTO media_assets (id, project_id, user_id, file_name, storage_path, public_url, mime_type, size_bytes, duration_seconds, width, height, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      assetId,
      projectId,
      userId,
      file.originalname,
      file.path,
      publicUrl,
      file.mimetype,
      file.size,
      10.0, // default or probed duration
      1920,
      1080,
      0
    );

    return res.status(201).json({
      asset: {
        id: assetId,
        project_id: projectId,
        file_name: file.originalname,
        public_url: publicUrl,
        size_bytes: file.size,
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to upload video asset.' });
  }
});

export default router;
