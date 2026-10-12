import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, MediaClip, ProjectType } from '../types';
import { StorageService } from '../services/storageService';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  clips: MediaClip[];
  canUndo: boolean;
  canRedo: boolean;
  setCurrentProject: (project: Project | null) => void;
  createNewProject: (title: string, type?: ProjectType, aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3') => Project;
  loadProject: (projectId: string) => void;
  addClip: (clip: MediaClip) => void;
  updateClip: (clipId: string, updates: Partial<MediaClip>) => void;
  removeClip: (clipId: string) => void;
  reorderClips: (fromIndex: number, toIndex: number) => void;
  setClips: (clips: MediaClip[]) => void;
  undo: () => void;
  redo: () => void;
  saveProject: (projectToSave?: Project) => void;
  deleteProject: (projectId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [clips, setClipsState] = useState<MediaClip[]>([]);
  
  // Undo / Redo history stack
  const [history, setHistory] = useState<MediaClip[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Load projects from storage on mount
  useEffect(() => {
    const loaded = StorageService.getProjects();
    setProjects(loaded);

    // If active project is stored, load it
    const activeId = StorageService.getActiveProjectId();
    if (activeId) {
      const active = loaded.find(p => p.id === activeId);
      if (active) {
        setCurrentProject(active);
        setClipsState(active.clips || []);
        setHistory([active.clips || []]);
        setHistoryIndex(0);
      }
    }
  }, []);

  const pushHistory = (newClips: MediaClip[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newClips);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const setClips = (newClips: MediaClip[]) => {
    setClipsState(newClips);
    pushHistory(newClips);
    if (currentProject) {
      const updated = { ...currentProject, clips: newClips, updated_at: new Date().toISOString() };
      setCurrentProject(updated);
      StorageService.saveProject(updated);
    }
  };

  const createNewProject = (
    title: string,
    type: ProjectType = 'video_edit',
    aspectRatio: '16:9' | '9:16' | '1:1' | '4:3' = '16:9'
  ): Project => {
    const newProj: Project = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: user?.id || 'usr_guest',
      title,
      project_type: type,
      status: 'draft',
      aspect_ratio: aspectRatio,
      clips: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    setCurrentProject(newProj);
    setClipsState([]);
    setHistory([[]]);
    setHistoryIndex(0);

    StorageService.saveProject(newProj);
    StorageService.setActiveProjectId(newProj.id);
    return newProj;
  };

  const loadProject = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      setCurrentProject(proj);
      setClipsState(proj.clips || []);
      setHistory([proj.clips || []]);
      setHistoryIndex(0);
      StorageService.setActiveProjectId(proj.id);
    }
  };

  const addClip = (clip: MediaClip) => {
    const updated = [...clips, clip];
    setClips(updated);
  };

  const updateClip = (clipId: string, updates: Partial<MediaClip>) => {
    const updated = clips.map(c => (c.id === clipId ? { ...c, ...updates } : c));
    setClips(updated);
  };

  const removeClip = (clipId: string) => {
    const updated = clips.filter(c => c.id !== clipId);
    setClips(updated);
  };

  const reorderClips = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= clips.length || toIndex >= clips.length) return;
    const reordered = [...clips];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setClips(reordered);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setClipsState(prev);
      if (currentProject) {
        const updated = { ...currentProject, clips: prev };
        setCurrentProject(updated);
        StorageService.saveProject(updated);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setClipsState(next);
      if (currentProject) {
        const updated = { ...currentProject, clips: next };
        setCurrentProject(updated);
        StorageService.saveProject(updated);
      }
    }
  };

  const saveProject = (projectToSave?: Project) => {
    const target = projectToSave || currentProject;
    if (target) {
      const updated = { ...target, clips, updated_at: new Date().toISOString() };
      StorageService.saveProject(updated);
      setProjects(StorageService.getProjects());
    }
  };

  const deleteProject = (projectId: string) => {
    StorageService.deleteProject(projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
      setClipsState([]);
      StorageService.setActiveProjectId(null);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        clips,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        setCurrentProject,
        createNewProject,
        loadProject,
        addClip,
        updateClip,
        removeClip,
        reorderClips,
        setClips,
        undo,
        redo,
        saveProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
