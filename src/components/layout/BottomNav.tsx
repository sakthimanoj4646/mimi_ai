import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Home, Sparkles, Film, Bot, User } from 'lucide-react';
import { ScreenID } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigate } = useSettings();

  // Hide on splash, onboarding, login, register, forgot_password
  const hiddenScreens: ScreenID[] = ['splash', 'onboarding', 'login', 'register', 'forgot_password'];
  if (hiddenScreens.includes(currentScreen)) {
    return null;
  }

  const navItems = [
    { id: 'home' as ScreenID, label: 'Home', icon: Home },
    { id: 'ai_create' as ScreenID, label: 'Create', icon: Sparkles },
    { id: 'editing_workspace' as ScreenID, label: 'Edit', icon: Film },
    { id: 'mimi_chat' as ScreenID, label: 'Mimi', icon: Bot, isSpecial: true },
    { id: 'profile' as ScreenID, label: 'Profile', icon: User },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-ocean-900/95 backdrop-blur-lg border-t border-ocean-800 px-2 py-1.5 shadow-2xl"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="flex flex-col items-center justify-center -mt-5 group"
                aria-label="Mimi AI Assistant"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-ocean-glow transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-tr from-cyan-neon to-ocean-400 scale-110 text-ocean-950 font-bold' 
                    : 'bg-gradient-to-tr from-ocean-500 to-cyan-500 text-white hover:scale-105'
                }`}>
                  <Icon className="w-6 h-6 animate-pulse-subtle" />
                </div>
                <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'text-cyan-neon' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-cyan-neon' : 'text-gray-400 hover:text-gray-200'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-neon stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-cyan-neon font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
