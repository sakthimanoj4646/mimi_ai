import { Project, User } from '../types';

const STORAGE_KEYS = {
  USER: 'mimi_user',
  TOKEN: 'mimi_auth_token',
  PROJECTS: 'mimi_projects',
  ACTIVE_PROJECT: 'mimi_active_project_id',
  ONBOARDING_DONE: 'mimi_onboarding_completed',
  SETTINGS: 'mimi_settings',
  CHAT_HISTORY: 'mimi_chat_history',
};

export class StorageService {
  static getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  static setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  static removeAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  static getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: User | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  }

  static isOnboardingCompleted(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true';
  }

  static setOnboardingCompleted(completed = true): void {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, completed ? 'true' : 'false');
  }

  static getProjects(): Project[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveProjects(projects: Project[]): void {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  static saveProject(project: Project): void {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      projects[idx] = { ...project, updated_at: new Date().toISOString() };
    } else {
      projects.unshift({ ...project, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    this.saveProjects(projects);
  }

  static deleteProject(projectId: string): void {
    const projects = this.getProjects().filter(p => p.id !== projectId);
    this.saveProjects(projects);
  }

  static getActiveProjectId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT);
  }

  static setActiveProjectId(id: string | null): void {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT);
    }
  }
}
