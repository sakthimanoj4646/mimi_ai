import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { 
  Home, 
  Sparkles, 
  Film, 
  Layers, 
  Wand2, 
  Bot, 
  FolderKanban, 
  Settings, 
  HelpCircle,
  LogOut,
  Sliders
} from 'lucide-react';
import { ScreenID } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { currentScreen, navigate } = useSettings();
  const { user, logout } = useAuth();

  const hiddenScreens: ScreenID[] = ['splash', 'onboarding', 'login', 'register', 'forgot_password'];
  if (hiddenScreens.includes(currentScreen)) {
    return null;
  }

  const primaryNav = [
    { id: 'home' as ScreenID, label: 'Dashboard', icon: Home },
    { id: 'ai_create' as ScreenID, label: 'Create with AI', icon: Sparkles, badge: 'AI' },
    { id: 'editing_workspace' as ScreenID, label: 'Video Studio', icon: Film },
    { id: 'multi_clip' as ScreenID, label: 'Combine Clips', icon: Layers },
    { id: 'enhancement' as ScreenID, label: 'Enhance Video', icon: Wand2 },
    { id: 'mimi_chat' as ScreenID, label: 'Ask Mimi', icon: Bot, isMimi: true },
    { id: 'projects' as ScreenID, label: 'My Projects', icon: FolderKanban },
  ];

  const secondaryNav = [
    { id: 'settings' as ScreenID, label: 'Settings', icon: Settings },
    { id: 'help_support' as ScreenID, label: 'Help & Guide', icon: HelpCircle },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-ocean-900 border-r border-ocean-800 shrink-0 h-[calc(100vh-61px)] sticky top-[61px] p-4 justify-between">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-ocean-300 uppercase tracking-wider mb-2">
            Studio Workflows
          </p>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? item.isMimi
                      ? 'bg-gradient-to-r from-ocean-500/20 to-lavender-500/20 text-cyan-neon border border-cyan-neon/30 shadow-ocean-glow'
                      : 'bg-ocean-800 text-white border border-ocean-700 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-ocean-850'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? (item.isMimi ? 'text-cyan-neon' : 'text-ocean-400') : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-ocean-500/20 text-cyan-300 border border-ocean-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* System & Support */}
        <div className="space-y-1 pt-4 border-t border-ocean-800">
          <p className="px-3 text-[11px] font-semibold text-ocean-300 uppercase tracking-wider mb-2">
            Preferences & Help
          </p>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-ocean-800 text-white' : 'text-gray-400 hover:text-white hover:bg-ocean-850'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User profile & session footer */}
      <div className="pt-4 border-t border-ocean-800">
        <div className="flex items-center justify-between p-2 rounded-xl bg-ocean-850/60 border border-ocean-800">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ocean-500 to-cyan-neon flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user ? user.display_name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-white truncate">
                {user ? user.display_name : 'Guest Creator'}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {user ? user.email : 'Local Session'}
              </p>
            </div>
          </div>
          {user && (
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-ocean-750 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
