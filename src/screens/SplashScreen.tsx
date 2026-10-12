import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { StorageService } from '../services/storageService';
import { Sparkles, ArrowRight } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { navigate } = useSettings();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (StorageService.isOnboardingCompleted()) {
        navigate('home');
      } else {
        navigate('onboarding');
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-ocean-950 flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      {/* Ocean Ambient Glow Backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-ocean-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-neon/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Animated Assistant Icon */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm">
        <div className="relative animate-float">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-ocean-500 via-cyan-400 to-lavender-400 p-[2px] shadow-ocean-glow">
            <div className="w-full h-full bg-ocean-900 rounded-[22px] flex items-center justify-center">
              <span className="text-4xl font-black bg-gradient-to-r from-white via-cyan-100 to-cyan-neon bg-clip-text text-transparent">
                M
              </span>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-cyan-neon text-ocean-950 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 fill-ocean-950" />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-3xl font-black tracking-tight text-white">MIMI AI</h1>
            <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-ocean-500/20 text-cyan-neon border border-cyan-neon/30">
              STUDIO
            </span>
          </div>
          <p className="text-sm font-medium text-cyan-200/90 tracking-wide">
            "Imagine It. Describe It. Create It."
          </p>
          <p className="text-xs text-gray-400 pt-1">
            Your Creative AI Buddy • Multilingual Studio
          </p>
        </div>

        {/* Subtle Ocean Loading Indicator */}
        <div className="w-44 h-1.5 bg-ocean-850 rounded-full overflow-hidden border border-ocean-750">
          <div className="w-full h-full bg-gradient-to-r from-ocean-500 via-cyan-neon to-lavender-400 rounded-full animate-pulse-subtle" />
        </div>

        {/* Skip button if user wants to tap immediately */}
        <button
          onClick={() => navigate(StorageService.isOnboardingCompleted() ? 'home' : 'onboarding')}
          className="text-xs text-gray-400 hover:text-cyan-neon flex items-center space-x-1 pt-4 transition-colors"
        >
          <span>Tap to launch studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
