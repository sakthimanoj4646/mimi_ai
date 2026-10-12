import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { 
  User, 
  Mail, 
  HardDrive, 
  FolderKanban, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  Settings,
  HelpCircle,
  Film
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { navigate, addToast } = useSettings();
  const { projects } = useProject();

  const handleLogout = () => {
    logout();
    addToast('Signed out of MIMI AI Studio.', 'info');
    navigate('login');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">User Profile & Account</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage your creator profile, studio storage footprint, and subscription preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Card */}
        <div className="md:col-span-5 bg-ocean-900 border border-ocean-800 rounded-3xl p-6 shadow-xl space-y-5 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-ocean-500 via-cyan-neon to-lavender-400 p-[2px] shadow-ocean-glow">
            <div className="w-full h-full bg-ocean-950 rounded-[22px] flex items-center justify-center text-2xl font-black text-white">
              {user ? user.display_name.charAt(0).toUpperCase() : 'C'}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {user ? user.display_name : 'Studio Creator'}
            </h3>
            <p className="text-xs text-cyan-300 font-mono">
              {user ? user.email : 'creator@mimi-ai.studio'}
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold px-3 py-0.5 rounded-full bg-cyan-950 text-cyan-neon border border-cyan-500/40">
              CREATOR PRO TIER
            </span>
          </div>

          <div className="w-full pt-4 border-t border-ocean-800 space-y-2">
            <button
              onClick={() => navigate('settings')}
              className="w-full py-2.5 px-4 rounded-xl bg-ocean-800 hover:bg-ocean-750 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors border border-ocean-700"
            >
              <Settings className="w-4 h-4 text-ocean-300" />
              <span>Studio Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors border border-rose-900/40"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Studio Stats & Storage Details */}
        <div className="md:col-span-7 space-y-4">
          {/* Storage Meter */}
          <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-cyan-neon" />
                <h4 className="text-sm font-bold text-white">Local Studio Storage</h4>
              </div>
              <span className="text-xs font-mono text-cyan-300">18.4 MB / 5.0 GB</span>
            </div>

            <div className="w-full h-2 bg-ocean-950 rounded-full overflow-hidden border border-ocean-800">
              <div className="w-[12%] h-full bg-gradient-to-r from-ocean-500 to-cyan-neon rounded-full" />
            </div>

            <p className="text-[11px] text-gray-400">
              Video media assets and drafts are securely cached in your local environment.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-ocean-900 border border-ocean-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] text-gray-400">Total Projects</span>
              <p className="text-xl font-black text-white font-mono">{projects.length}</p>
            </div>

            <div className="bg-ocean-900 border border-ocean-800 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] text-gray-400">Active AI Sessions</span>
              <p className="text-xl font-black text-cyan-300 font-mono">1 Session</p>
            </div>
          </div>

          {/* Shortcuts */}
          <div className="bg-ocean-900 border border-ocean-800 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Quick Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => navigate('projects')}
                className="p-2.5 rounded-xl bg-ocean-950 hover:bg-ocean-850 text-left text-gray-300 flex items-center justify-between transition-colors"
              >
                <span>My Projects</span>
                <FolderKanban className="w-4 h-4 text-ocean-400" />
              </button>

              <button
                onClick={() => navigate('help_support')}
                className="p-2.5 rounded-xl bg-ocean-950 hover:bg-ocean-850 text-left text-gray-300 flex items-center justify-between transition-colors"
              >
                <span>Help & Guides</span>
                <HelpCircle className="w-4 h-4 text-ocean-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
