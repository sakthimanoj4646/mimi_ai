export interface User {
  id: string;
  email: string;
  display_name: string;
  password_hash?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export type ProjectType = 'ai_generated' | 'video_edit' | 'multi_clip' | 'enhancement';
export type ProjectStatus = 'draft' | 'processing' | 'ready' | 'failed' | 'completed';

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  project_type: ProjectType;
  status: ProjectStatus;
  aspect_ratio: '16:9' | '9:16' | '1:1' | '4:3';
  thumbnail_url?: string;
  output_video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  project_id: string;
  user_id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  duration_seconds: number;
  width: number;
  height: number;
  order_index: number;
  created_at: string;
}

export interface EditingOperation {
  id: string;
  type: 
    | 'trim' 
    | 'split' 
    | 'speed' 
    | 'color_adjust' 
    | 'filter' 
    | 'text_overlay' 
    | 'transition' 
    | 'audio_mix' 
    | 'crop' 
    | 'aspect_ratio'
    | 'enhance';
  label: string;
  description: string;
  target_clip_id?: string;
  parameters: Record<string, any>;
  applied: boolean;
}

export interface StructuredEditingPlan {
  version: number;
  project_id: string;
  title: string;
  summary: string;
  operations: EditingOperation[];
  estimated_duration_sec?: number;
  output_settings: {
    resolution: '720p' | '1080p' | '4k';
    aspect_ratio: '16:9' | '9:16' | '1:1';
    fps: number;
    format: 'mp4' | 'webm';
  };
  validation_status: 'valid' | 'warning' | 'invalid';
  validation_errors?: string[];
  created_at: string;
}

export interface ExportJob {
  id: string;
  project_id: string;
  user_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  settings: Record<string, any>;
  output_url?: string;
  file_size?: number;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'mimi' | 'system';
  content: string;
  language_detected?: 'en' | 'ta' | 'tanglish';
  editing_plan?: StructuredEditingPlan;
  created_at: string;
}

export interface VideoGenJob {
  id: string;
  prompt: string;
  negative_prompt?: string;
  aspect_ratio: string;
  duration_sec: number;
  style: string;
  status: 'queued' | 'generating' | 'completed' | 'failed';
  video_url?: string;
  error_message?: string;
  created_at: string;
}
