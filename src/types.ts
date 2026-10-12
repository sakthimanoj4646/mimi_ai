export type ScreenID =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'forgot_password'
  | 'home'
  | 'ai_create'
  | 'video_upload'
  | 'multi_clip'
  | 'editing_workspace'
  | 'enhancement'
  | 'mimi_chat'
  | 'plan_review'
  | 'video_preview'
  | 'export'
  | 'projects'
  | 'project_details'
  | 'profile'
  | 'settings'
  | 'help_support';

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
}

export type ProjectType = 'ai_generated' | 'video_edit' | 'multi_clip' | 'enhancement';
export type ProjectStatus = 'draft' | 'processing' | 'ready' | 'failed' | 'completed';

export interface MediaClip {
  id: string;
  name: string;
  url: string;
  file?: File;
  duration: number; // in seconds
  width: number;
  height: number;
  trimStart: number;
  trimEnd: number;
  speed: number;
  volume: number;
  brightness: number; // -1 to 1 (0 default)
  contrast: number;   // 0.5 to 2 (1 default)
  saturation: number; // 0 to 2 (1 default)
  temperature: number; // -1 to 1 (0 default)
  sharpen: boolean;
  filter: 'none' | 'cinematic' | 'warm' | 'cool' | 'vintage' | 'cyberpunk';
  textOverlays: TextOverlay[];
}

export interface TextOverlay {
  id: string;
  text: string;
  position: 'top' | 'center' | 'bottom';
  fontSize: number;
  fontColor: string;
  startTime: number;
  endTime: number;
}

export interface TransitionSetting {
  type: 'none' | 'fade' | 'dissolve' | 'wipe' | 'slide' | 'zoom';
  durationSec: number;
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
  targetClipId?: string;
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

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  project_type: ProjectType;
  status: ProjectStatus;
  aspect_ratio: '16:9' | '9:16' | '1:1' | '4:3';
  clips: MediaClip[];
  activePlan?: StructuredEditingPlan;
  thumbnail_url?: string;
  output_video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ExportSettings {
  resolution: '720p' | '1080p' | '4k';
  aspect_ratio: '16:9' | '9:16' | '1:1';
  format: 'mp4' | 'webm';
  fps: 24 | 30 | 60;
  quality: 'standard' | 'high' | 'maximum';
  includeAudio: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mimi' | 'system';
  content: string;
  timestamp: string;
  language?: 'en' | 'ta' | 'tanglish';
  editingPlan?: StructuredEditingPlan;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}
