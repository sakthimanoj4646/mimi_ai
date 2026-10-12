import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { useMimi } from '../context/MimiContext';
import { 
  Sliders, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Clock, 
  Film,
  Play,
  Check
} from 'lucide-react';

export const PlanReviewScreen: React.FC = () => {
  const { navigate, addToast } = useSettings();
  const { currentProject, clips } = useProject();
  const { activePlan, applyPlan, dismissPlan } = useMimi();

  if (!activePlan) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <Sliders className="w-12 h-12 mx-auto text-ocean-400 opacity-60" />
        <h3 className="text-lg font-bold text-white">No Active Editing Plan to Review</h3>
        <p className="text-xs text-gray-400">
          Ask Mimi in chat or the video workspace to prepare a plan from your natural-language instructions.
        </p>
        <button
          onClick={() => navigate('mimi_chat')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold text-xs shadow-ocean-glow"
        >
          Open Mimi Chat
        </button>
      </div>
    );
  }

  const handleApply = () => {
    applyPlan(activePlan);
    addToast('Editing plan applied to studio clips!', 'success');
    navigate('editing_workspace');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('editing_workspace')}
          className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </button>

        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
          Schema: Validated & Safe
        </span>
      </div>

      <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Title & Overview */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-neon/20 border border-cyan-neon/40 flex items-center justify-center text-cyan-neon">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">{activePlan.title}</h2>
              <p className="text-xs text-gray-300">{activePlan.summary}</p>
            </div>
          </div>
        </div>

        {/* Plan Metadata Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Target Resolution</span>
            <span className="text-xs font-bold text-white font-mono">{activePlan.output_settings.resolution}</span>
          </div>

          <div className="p-3 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Aspect Ratio</span>
            <span className="text-xs font-bold text-cyan-300 font-mono">{activePlan.output_settings.aspect_ratio}</span>
          </div>

          <div className="p-3 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Frame Rate</span>
            <span className="text-xs font-bold text-white font-mono">{activePlan.output_settings.fps} FPS</span>
          </div>

          <div className="p-3 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Operations</span>
            <span className="text-xs font-bold text-lavender-400 font-mono">{activePlan.operations.length} actions</span>
          </div>
        </div>

        {/* Detailed Operations Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Execution Steps Breakdown
          </h3>

          <div className="space-y-3">
            {activePlan.operations.map((op, idx) => (
              <div
                key={op.id || idx}
                className="p-4 rounded-2xl bg-ocean-850/80 border border-ocean-800 flex items-start space-x-3"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 text-cyan-neon flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{op.label}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ocean-950 text-cyan-300 border border-ocean-750 uppercase">
                      {op.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">{op.description}</p>

                  {/* Parameter dump */}
                  {op.parameters && Object.keys(op.parameters).length > 0 && (
                    <div className="mt-2 p-2 rounded-xl bg-ocean-950 border border-ocean-850 text-[11px] font-mono text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                      {Object.entries(op.parameters).map(([k, v]) => (
                        <span key={k}>
                          <span className="text-ocean-300">{k}:</span> <span className="text-white">{String(v)}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center space-x-3 pt-2 border-t border-ocean-800">
          <button
            onClick={handleApply}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-xs shadow-ocean-glow flex items-center justify-center space-x-2 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Apply Edits to Studio Workspace</span>
          </button>

          <button
            onClick={() => {
              dismissPlan();
              addToast('Editing plan dismissed.', 'info');
              navigate('editing_workspace');
            }}
            className="py-3.5 px-6 rounded-2xl bg-ocean-800 hover:bg-ocean-750 text-gray-300 font-semibold text-xs border border-ocean-700 transition-colors"
          >
            Cancel Plan
          </button>
        </div>
      </div>
    </div>
  );
};
