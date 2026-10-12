import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { useMimi } from '../context/MimiContext';
import { MockVideoGenerator } from '../services/mockVideoGenerator';
import { 
  Sparkles, 
  Film, 
  Layers, 
  Wand2, 
  Bot, 
  FolderKanban, 
  Mic, 
  MicOff, 
  Send, 
  ArrowRight, 
  Plus, 
  Clock, 
  Play,
  Languages,
  CheckCircle2
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { navigate, addToast } = useSettings();
  const { user } = useAuth();
  const { projects, createNewProject, loadProject, addClip } = useProject();
  const { sendMessage } = useMimi();

  const [promptText, setPromptText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);

  const quickSuggestions = [
    { label: 'Create a cinematic sunset video', type: 'create' },
    { label: 'Turn my clips into a travel reel', type: 'edit' },
    { label: 'Add captions and background music', type: 'edit' },
    { label: 'Improve the colours in my video', type: 'enhance' },
    { label: 'Help me learn cinematic editing', type: 'mimi' },
  ];

  const handlePromptSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;

    const lower = promptText.toLowerCase();

    // Route intelligently based on user prompt
    if (lower.includes('create') || lower.includes('generate')) {
      createNewProject('AI Scene: ' + promptText.slice(0, 30), 'ai_generated');
      navigate('ai_create');
    } else if (lower.includes('enhance') || lower.includes('color') || lower.includes('blur')) {
      createNewProject('Enhancement: ' + promptText.slice(0, 30), 'enhancement');
      navigate('enhancement');
    } else if (lower.includes('combine') || lower.includes('clips')) {
      createNewProject('Combined Sequence', 'multi_clip');
      navigate('multi_clip');
    } else {
      // Direct instruction to Mimi
      await sendMessage(promptText);
      navigate('mimi_chat');
    }
  };

  const handleSuggestionClick = (suggestion: typeof quickSuggestions[0]) => {
    setPromptText(suggestion.label);
    if (suggestion.type === 'create') {
      navigate('ai_create');
    } else if (suggestion.type === 'enhance') {
      navigate('enhancement');
    } else if (suggestion.type === 'mimi') {
      sendMessage(suggestion.label);
      navigate('mimi_chat');
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      addToast('Voice input stopped.', 'info');
    } else {
      setIsListening(true);
      addToast('Listening in English / Tamil / Tanglish...', 'info');
      // Simulate real Tanglish voice transcript after 2.5 seconds
      setTimeout(() => {
        setPromptText('Cinematic sunset video with warm golden lighting');
        setIsListening(false);
        addToast('Voice recognized: "Cinematic sunset video..."', 'success');
      }, 2400);
    }
  };

  const handleLoadSampleVideo = async () => {
    setLoadingSample(true);
    try {
      const sample = await MockVideoGenerator.createSampleOceanClip(6, "Ocean Sunset");
      const proj = createNewProject('Ocean Sunset Demo', 'video_edit', '16:9');
      addClip({
        id: `clip_${Date.now()}`,
        name: 'Ocean Waves Sample.mp4',
        url: sample.url,
        duration: sample.duration,
        width: 1280,
        height: 720,
        trimStart: 0,
        trimEnd: sample.duration,
        speed: 1,
        volume: 1,
        brightness: 0,
        contrast: 1,
        saturation: 1,
        temperature: 0,
        sharpen: false,
        filter: 'none',
        textOverlays: [],
      });
      addToast('Ocean AI sample video loaded! Entering workspace...', 'success');
      navigate('editing_workspace');
    } catch (e: any) {
      addToast('Failed to generate sample: ' + e.message, 'error');
    } finally {
      setLoadingSample(false);
    }
  };

  const actionCards = [
    {
      id: 'create',
      title: 'Create with AI',
      desc: 'Generate cinematic video scenes directly from text prompts.',
      icon: Sparkles,
      color: 'from-blue-600 to-cyan-500',
      action: () => {
        createNewProject('New AI Generation', 'ai_generated');
        navigate('ai_create');
      },
    },
    {
      id: 'edit',
      title: 'Edit a Video',
      desc: 'Trim, color grade, adjust speed, and add typography to your clips.',
      icon: Film,
      color: 'from-ocean-500 to-blue-600',
      action: () => {
        createNewProject('New Video Edit', 'video_edit');
        navigate('video_upload');
      },
    },
    {
      id: 'combine',
      title: 'Combine Clips',
      desc: 'Assemble multiple clips into a single video with transitions.',
      icon: Layers,
      color: 'from-cyan-600 to-ocean-500',
      action: () => {
        createNewProject('Combined Clips Reel', 'multi_clip');
        navigate('multi_clip');
      },
    },
    {
      id: 'enhance',
      title: 'Enhance a Video',
      desc: 'Improve lighting, contrast, clarity, and color temperature.',
      icon: Wand2,
      color: 'from-lavender-500 to-ocean-500',
      action: () => {
        createNewProject('Video Enhancement', 'enhancement');
        navigate('enhancement');
      },
    },
    {
      id: 'ask_mimi',
      title: 'Ask Mimi',
      desc: 'Get editing advice and creative tips in Tamil, Tanglish, or English.',
      icon: Bot,
      color: 'from-cyan-neon to-lavender-400',
      isAssistant: true,
      action: () => navigate('mimi_chat'),
    },
    {
      id: 'projects',
      title: 'My Projects',
      desc: 'Access your persistent library of draft and completed videos.',
      icon: FolderKanban,
      color: 'from-ocean-700 to-ocean-800',
      action: () => navigate('projects'),
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Welcome, {user ? user.display_name : 'Creator'}!</span>
            <span className="text-xl">🌊</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            MIMI AI Studio is ready. What creative scene or edit shall we build today?
          </p>
        </div>

        {/* Instant Sample Video Test Button */}
        <button
          onClick={handleLoadSampleVideo}
          disabled={loadingSample}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-ocean-800 hover:bg-ocean-750 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-neon" />
          <span>{loadingSample ? 'Generating Sample...' : 'Try Ocean AI Demo Clip'}</span>
        </button>
      </div>

      {/* Main Prompt Box */}
      <div className="relative bg-gradient-to-b from-ocean-850 to-ocean-900 border border-ocean-750 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-neon/20 border border-cyan-neon/30 flex items-center justify-center text-cyan-neon">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                What would you like to create today?
              </h3>
              <p className="text-[11px] text-gray-400">
                Describe your vision in English, Tamil (தமிழ்), or Tanglish
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-ocean-800 border border-ocean-700 text-[10px] text-cyan-300 font-mono">
            <Languages className="w-3 h-3" />
            <span>EN • TA • TANGLISH</span>
          </div>
        </div>

        <form onSubmit={handlePromptSubmit} className="relative">
          <textarea
            rows={3}
            placeholder="Describe your video idea or tell Mimi what to edit... (e.g. 'Make this video cinematic with warm sunset grade and slow motion')"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="w-full bg-ocean-950/80 border border-ocean-800 focus:border-cyan-neon rounded-2xl p-4 pr-24 text-sm text-white placeholder-gray-500 focus:outline-none transition-all resize-none shadow-inner"
          />

          <div className="absolute right-3 bottom-4 flex items-center space-x-2">
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-xl border transition-colors ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-ocean-800 border-ocean-700 text-gray-400 hover:text-white'
              }`}
              title="Voice Input (Tamil / English)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!promptText.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold shadow-ocean-glow transition-all disabled:opacity-40"
              title="Send to Studio"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[11px] font-semibold text-ocean-300 uppercase tracking-wider">
            Quick Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(sug)}
                className="px-3 py-1.5 rounded-xl bg-ocean-800/80 hover:bg-ocean-750 border border-ocean-700/80 hover:border-cyan-500/50 text-xs text-gray-300 hover:text-cyan-neon transition-colors"
              >
                {sug.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6 Main Action Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white tracking-tight">Studio Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.action}
                className="group relative bg-ocean-900 hover:bg-ocean-850 border border-ocean-800 hover:border-cyan-500/40 rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-md hover:shadow-ocean-glow flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-neon group-hover:translate-x-1 transition-all" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-neon transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Recent Projects</h3>
          <button
            onClick={() => navigate('projects')}
            className="text-xs font-semibold text-cyan-300 hover:text-cyan-neon flex items-center space-x-1"
          >
            <span>View All ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-ocean-900 border border-dashed border-ocean-800 rounded-2xl p-8 text-center space-y-3">
            <Film className="w-10 h-10 text-ocean-400 opacity-60 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Projects Yet</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              You haven't created any videos yet. Start by generating a scene from a prompt or uploading a video clip!
            </p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => {
                  createNewProject('My First Video', 'video_edit');
                  navigate('video_upload');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold text-xs shadow-ocean-glow"
              >
                Upload Video Clip
              </button>
              <button
                onClick={handleLoadSampleVideo}
                className="px-4 py-2 rounded-xl bg-ocean-800 text-gray-200 border border-ocean-700 text-xs font-semibold"
              >
                Load Ocean AI Sample
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  loadProject(proj.id);
                  navigate('editing_workspace');
                }}
                className="bg-ocean-900 hover:bg-ocean-850 border border-ocean-800 hover:border-ocean-700 rounded-2xl p-4 cursor-pointer transition-all space-y-3 group"
              >
                <div className="w-full h-32 rounded-xl bg-ocean-950 border border-ocean-800 overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-ocean-500/20 via-cyan-500/10 to-transparent" />
                  <Play className="w-8 h-8 text-cyan-neon opacity-70 group-hover:scale-110 transition-transform" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-ocean-900/90 text-cyan-300 border border-ocean-750">
                    {proj.aspect_ratio}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-ocean-900/80 text-gray-300">
                    {proj.project_type.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white truncate">{proj.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1 font-mono">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(proj.updated_at).toLocaleDateString()}</span>
                    </span>
                    <span className="text-cyan-300">{proj.clips?.length || 0} clip(s)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
