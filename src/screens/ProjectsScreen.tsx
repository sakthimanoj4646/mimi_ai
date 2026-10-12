import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { 
  FolderKanban, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Play, 
  Edit3, 
  Copy, 
  Download, 
  Clock, 
  Film,
  MoreVertical
} from 'lucide-react';
import { ProjectType } from '../types';

export const ProjectsScreen: React.FC = () => {
  const { navigate, addToast } = useSettings();
  const { projects, loadProject, deleteProject, createNewProject } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || p.project_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleOpen = (id: string) => {
    loadProject(id);
    navigate('editing_workspace');
  };

  const handleDuplicate = (id: string) => {
    const original = projects.find(p => p.id === id);
    if (!original) return;
    const dup = createNewProject(`${original.title} (Copy)`, original.project_type, original.aspect_ratio);
    dup.clips = [...(original.clips || [])];
    addToast('Project duplicated successfully!', 'success');
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setDeleteConfirmId(null);
    addToast('Project deleted.', 'info');
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">My Projects</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Your persistent library of draft, edited, enhanced, and completed studio videos.
          </p>
        </div>

        <button
          onClick={() => {
            createNewProject('Untitled Project', 'video_edit');
            navigate('video_upload');
          }}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-xs shadow-ocean-glow flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-ocean-900 border border-ocean-800 rounded-2xl p-3 shadow-md">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ocean-950 border border-ocean-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-neon"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'ai_generated', label: 'AI Generated' },
            { id: 'video_edit', label: 'Edited' },
            { id: 'multi_clip', label: 'Combined' },
            { id: 'enhancement', label: 'Enhanced' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === f.id
                  ? 'bg-ocean-700 text-cyan-neon shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-ocean-850'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-ocean-900 border border-dashed border-ocean-800 rounded-3xl p-12 text-center space-y-3">
          <FolderKanban className="w-12 h-12 mx-auto text-ocean-400 opacity-60" />
          <h3 className="text-base font-bold text-white">No Projects Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery
              ? `No projects match "${searchQuery}". Try another search term.`
              : 'Create your first project to start editing videos with Mimi AI.'}
          </p>
          <button
            onClick={() => {
              createNewProject('New Studio Project', 'video_edit');
              navigate('video_upload');
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold text-xs shadow-ocean-glow"
          >
            Create Video Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-ocean-900 border border-ocean-800 hover:border-cyan-500/40 rounded-3xl p-4 shadow-lg hover:shadow-ocean-glow transition-all flex flex-col justify-between space-y-3 group"
            >
              {/* Thumbnail Viewport */}
              <div
                onClick={() => handleOpen(proj.id)}
                className="w-full h-36 rounded-2xl bg-ocean-950 border border-ocean-850 overflow-hidden relative cursor-pointer flex items-center justify-center group-hover:border-cyan-500/40 transition-colors"
              >
                {proj.clips?.[0]?.url ? (
                  <video src={proj.clips[0].url} className="w-full h-full object-cover pointer-events-none" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-ocean-500/20 to-cyan-500/10 flex items-center justify-center">
                    <Film className="w-8 h-8 text-cyan-neon opacity-70" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-cyan-neon text-ocean-950 flex items-center justify-center font-bold shadow-ocean-glow">
                    <Play className="w-5 h-5 ml-0.5 fill-ocean-950" />
                  </div>
                </div>

                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-ocean-900/90 text-cyan-300 border border-ocean-750">
                  {proj.aspect_ratio}
                </span>

                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-ocean-900/90 text-gray-300 border border-ocean-750">
                  {proj.status}
                </span>
              </div>

              {/* Info */}
              <div>
                <h4 className="text-sm font-bold text-white truncate">{proj.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1 font-mono">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(proj.updated_at).toLocaleDateString()}</span>
                  </span>
                  <span>{proj.clips?.length || 0} clip(s)</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-ocean-800">
                <button
                  onClick={() => handleOpen(proj.id)}
                  className="px-3 py-1.5 rounded-lg bg-ocean-800 hover:bg-ocean-750 text-cyan-300 text-xs font-semibold transition-colors"
                >
                  Open in Studio
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDuplicate(proj.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-ocean-800 transition-colors"
                    title="Duplicate Project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(proj.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-ocean-800 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Project?</h3>
            <p className="text-xs text-gray-300">
              Are you sure you want to delete this project? This will remove all associated timeline history and local drafts.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-ocean-800 hover:bg-ocean-750 text-gray-300 font-medium text-xs border border-ocean-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
