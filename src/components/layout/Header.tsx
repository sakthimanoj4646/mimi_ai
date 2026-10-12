import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { Sparkles, Bell, User, Film } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentScreen, navigate, mockMode } = useSettings();
  const { user } = useAuth();
  const { currentProject } = useProject();

  // Hide header on splash or onboarding
  if (currentScreen === 'splash' || currentScreen === 'onboarding') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-ocean-900/90 backdrop-blur-md border-b border-ocean-800 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Active project */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('home')}
            className="flex items-center space-x-2 text-left group transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ocean-500 to-cyan-neon flex items-center justify-center shadow-ocean-glow group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-lg tracking-wider">M</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-white font-bold tracking-tight text-lg">MIMI AI</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-ocean-500/20 text-cyan-neon border border-cyan-neon/30">
                  STUDIO
                </span>
              </div>
              <p className="text-[10px] text-ocean-300 tracking-wide hidden sm:block">
                Imagine It. Describe It. Create It.
              </p>
            </div>
          </button>

          {currentProject && (
            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-ocean-700 text-xs">
              <Film className="w-3.5 h-3.5 text-ocean-400" />
              <span className="text-gray-400">Project:</span>
              <span className="text-white font-medium truncate max-w-[150px]">{currentProject.title}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-ocean-800 text-ocean-300 border border-ocean-700 uppercase">
                {currentProject.aspect_ratio}
              </span>
            </div>
          )}
        </div>

        {/* Status badges & Quick actions */}
        <div className="flex items-center space-x-3">
          {mockMode && (
            <div 
              title="Mock/Offline Mode is active. Safe deterministic fallbacks enabled with zero required credentials."
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-neon animate-pulse" />
              <span>DEV SAFE MODE</span>
            </div>
          )}

          {/* Ask Mimi Quick Button */}
          <button
            onClick={() => navigate('mimi_chat')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-ocean-500/20 to-lavender-500/20 hover:from-ocean-500/30 hover:to-lavender-500/30 text-cyan-neon border border-cyan-neon/30 text-xs font-medium transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-neon" />
            <span className="hidden xs:inline">Ask Mimi</span>
          </button>

          {/* Notifications button */}
          <button
            onClick={() => navigate('help_support')}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-ocean-800 transition-colors relative"
            title="Help & System Status"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-neon" />
          </button>

          {/* User Profile Pill */}
          <button
            onClick={() => navigate(user ? 'profile' : 'login')}
            className="flex items-center space-x-2 pl-2 pr-2.5 py-1 rounded-full bg-ocean-800 hover:bg-ocean-750 border border-ocean-700 transition-colors"
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.display_name} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-ocean-600 flex items-center justify-center text-xs text-white font-bold">
                {user ? user.display_name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5 text-gray-300" />}
              </div>
            )}
            <span className="text-xs text-gray-200 font-medium max-w-[80px] truncate hidden sm:inline">
              {user ? user.display_name : 'Sign In'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
