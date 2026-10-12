import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config';

// Robust DB interface that works seamlessly with better-sqlite3 or provides an in-memory/JSON fallback
export class DatabaseManager {
  private db: any = null;
  private isFallback = false;
  private memoryStore: Record<string, any[]> = {
    users: [],
    projects: [],
    media_assets: [],
    editing_plans: [],
    export_jobs: [],
    conversations: [],
    chat_messages: []
  };
  private memoryFilePath: string;

  constructor() {
    this.memoryFilePath = path.join(path.dirname(CONFIG.DATABASE_PATH), 'mimi_store_fallback.json');
    this.init();
  }

  private init() {
    try {
      // Attempt dynamic require of better-sqlite3
      const Database = require('better-sqlite3');
      const dbDir = path.dirname(CONFIG.DATABASE_PATH);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      this.db = new Database(CONFIG.DATABASE_PATH);
      this.db.pragma('journal_mode = WAL');

      // Initialize schema
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        this.db.exec(schema);
      }
      console.log('✅ SQLite Database connected successfully at:', CONFIG.DATABASE_PATH);
    } catch (err: any) {
      console.warn('⚠️ Native better-sqlite3 unavailable, using persistent JSON/In-Memory database adapter:', err.message);
      this.isFallback = true;
      this.loadMemoryStore();
    }
  }

  private loadMemoryStore() {
    try {
      if (fs.existsSync(this.memoryFilePath)) {
        const data = fs.readFileSync(this.memoryFilePath, 'utf8');
        this.memoryStore = JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read fallback store, initializing clean:', e);
    }
  }

  private saveMemoryStore() {
    if (!this.isFallback) return;
    try {
      const dir = path.dirname(this.memoryFilePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.memoryFilePath, JSON.stringify(this.memoryStore, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to save fallback store:', e);
    }
  }

  public prepare(sql: string) {
    if (!this.isFallback && this.db) {
      return this.db.prepare(sql);
    }

    // Fallback SQL-like emulator for basic CRUD
    const self = this;
    return {
      run(...params: any[]) {
        self.handleFallbackRun(sql, params);
        return { changes: 1, lastInsertRowid: Date.now() };
      },
      get(...params: any[]) {
        return self.handleFallbackGet(sql, params);
      },
      all(...params: any[]) {
        return self.handleFallbackAll(sql, params);
      }
    };
  }

  private handleFallbackRun(sql: string, params: any[]) {
    const s = sql.trim().toLowerCase();
    if (s.startsWith('insert into users')) {
      const [id, email, display_name, password_hash, avatar_url, created_at, updated_at] = params;
      this.memoryStore.users.push({ id, email, display_name, password_hash, avatar_url, created_at: created_at || new Date().toISOString(), updated_at });
    } else if (s.startsWith('insert into projects')) {
      const [id, user_id, title, description, project_type, status, aspect_ratio, thumbnail_url, output_video_url] = params;
      this.memoryStore.projects.push({ id, user_id, title, description, project_type, status, aspect_ratio, thumbnail_url, output_video_url, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    } else if (s.startsWith('insert into media_assets')) {
      const [id, project_id, user_id, file_name, storage_path, public_url, mime_type, size_bytes, duration_seconds, width, height, order_index] = params;
      this.memoryStore.media_assets.push({ id, project_id, user_id, file_name, storage_path, public_url, mime_type, size_bytes, duration_seconds, width, height, order_index, created_at: new Date().toISOString() });
    } else if (s.startsWith('insert into editing_plans')) {
      const [id, project_id, version, title, summary, structured_plan_json, validation_status] = params;
      this.memoryStore.editing_plans.push({ id, project_id, version, title, summary, structured_plan_json, validation_status, created_at: new Date().toISOString() });
    } else if (s.startsWith('insert into export_jobs')) {
      const [id, project_id, user_id, status, progress, settings_json, output_url, file_size, error_message] = params;
      this.memoryStore.export_jobs.push({ id, project_id, user_id, status, progress, settings_json, output_url, file_size, error_message, created_at: new Date().toISOString() });
    } else if (s.startsWith('insert into chat_messages')) {
      const [id, conversation_id, sender, content, language_detected, editing_plan_json] = params;
      this.memoryStore.chat_messages.push({ id, conversation_id, sender, content, language_detected, editing_plan_json, created_at: new Date().toISOString() });
    } else if (s.startsWith('delete from projects where id = ?')) {
      const [id, userId] = params;
      this.memoryStore.projects = this.memoryStore.projects.filter(p => p.id !== id);
    }
    this.saveMemoryStore();
  }

  private handleFallbackGet(sql: string, params: any[]) {
    const s = sql.trim().toLowerCase();
    if (s.includes('from users where email = ?')) {
      return this.memoryStore.users.find(u => u.email === params[0]) || null;
    }
    if (s.includes('from users where id = ?')) {
      return this.memoryStore.users.find(u => u.id === params[0]) || null;
    }
    if (s.includes('from projects where id = ?')) {
      return this.memoryStore.projects.find(p => p.id === params[0]) || null;
    }
    if (s.includes('from export_jobs where id = ?')) {
      return this.memoryStore.export_jobs.find(e => e.id === params[0]) || null;
    }
    return null;
  }

  private handleFallbackAll(sql: string, params: any[]) {
    const s = sql.trim().toLowerCase();
    if (s.includes('from projects where user_id = ?')) {
      return this.memoryStore.projects.filter(p => p.user_id === params[0]);
    }
    if (s.includes('from media_assets where project_id = ?')) {
      return this.memoryStore.media_assets.filter(m => m.project_id === params[0]);
    }
    if (s.includes('from chat_messages where conversation_id = ?')) {
      return this.memoryStore.chat_messages.filter(c => c.conversation_id === params[0]);
    }
    return [];
  }
}

export const dbManager = new DatabaseManager();
