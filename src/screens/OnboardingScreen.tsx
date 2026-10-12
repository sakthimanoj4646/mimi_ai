import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { StorageService } from '../services/storageService';
import { Sparkles, Film, Bot, ArrowRight, ChevronRight, Check } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { navigate } = useSettings();
  const [step, setStep] = useState<number>(0);

  const screens = [
    {
      title: 'Create Videos with AI',
      description: 'Turn your ideas into videos with the help of AI.',
      subtitle: 'Type a prompt in English, Tamil, or Tanglish, and watch high-definition video scenes come alive.',
      icon: Sparkles,
      color: 'from-ocean-500 to-cyan-neon',
      badge: 'Workflow A',
    },
    {
      title: 'Edit Videos Your Way',
      description: 'Upload clips, describe your vision, and simplify your editing workflow.',
      subtitle: 'Trim, combine, grade colours, and generate structured editing plans without complex editing skills.',
      icon: Film,
      color: 'from-cyan-neon to-ocean-400',
      badge: 'Workflow B',
    },
    {
      title: 'Meet Mimi',
      description: 'Get creative ideas, editing tips, and AI-powered assistance whenever you need it.',
      subtitle: 'Your friendly creative buddy. Ask questions, optimize transitions, or say "make it cinematic".',
      icon: Bot,
      color: 'from-ocean-400 to-lavender-400',
      badge: 'Assistant',
    },
  ];

  const handleComplete = () => {
    StorageService.setOnboardingCompleted(true);
    navigate('home');
  };

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const current = screens[step];
  const Icon = current.icon;

  return (
    <div className="relative min-h-screen bg-ocean-950 flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top Bar with Skip */}
      <div className="flex items-center justify-between max-w-lg mx-auto w-full pt-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-ocean-500 to-cyan-neon flex items-center justify-center text-xs font-bold text-white">
            M
          </div>
          <span className="text-xs font-bold tracking-wider text-ocean-300">MIMI AI STUDIO</span>
        </div>

        <button
          onClick={handleComplete}
          className="text-xs font-semibold text-gray-400 hover:text-white px-3 py-1 rounded-full bg-ocean-900 border border-ocean-800 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Illustration & Content Card */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center py-8">
        {/* Animated Badge & Hero Graphic */}
        <div className="relative mb-8">
          <div className={`w-32 h-32 rounded-3xl bg-gradient-to-tr ${current.color} p-[2px] shadow-ocean-glow animate-float`}>
            <div className="w-full h-full bg-ocean-900 rounded-[22px] flex items-center justify-center">
              <Icon className="w-14 h-14 text-white" />
            </div>
          </div>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-ocean-950 border border-ocean-700 text-cyan-300 shadow-sm">
            {current.badge}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
          {current.title}
        </h2>
        <p className="text-base font-semibold text-cyan-200/90 mb-2">
          {current.description}
        </p>
        <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
          {current.subtitle}
        </p>

        {/* Step Indicators */}
        <div className="flex items-center space-x-2 mt-8">
          {screens.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-cyan-neon shadow-ocean-glow' : 'w-2 bg-ocean-800 hover:bg-ocean-700'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="max-w-md mx-auto w-full pb-6 space-y-3">
        {step < screens.length - 1 ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleComplete}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-ocean-900 hover:bg-ocean-850 border border-ocean-800 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-ocean-950 bg-gradient-to-r from-ocean-400 to-cyan-neon hover:from-ocean-300 hover:to-cyan-200 shadow-ocean-glow flex items-center justify-center space-x-1.5 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleComplete}
            className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-ocean-950 bg-gradient-to-r from-ocean-400 via-cyan-neon to-lavender-400 hover:opacity-95 shadow-ocean-glow flex items-center justify-center space-x-2 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Get Started with Mimi</span>
          </button>
        )}
      </div>
    </div>
  );
};
