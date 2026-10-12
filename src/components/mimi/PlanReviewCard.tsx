import React from 'react';
import { StructuredEditingPlan } from '../../types';
import { useMimi } from '../../context/MimiContext';
import { useSettings } from '../../context/SettingsContext';
import { CheckCircle2, Sliders, Play, X, ArrowRight, Sparkles } from 'lucide-react';

interface PlanReviewCardProps {
  plan: StructuredEditingPlan;
  onModify?: () => void;
}

export const PlanReviewCard: React.FC<PlanReviewCardProps> = ({ plan, onModify }) => {
  const { applyPlan, dismissPlan } = useMimi();
  const { navigate, addToast } = useSettings();

  const handleApply = () => {
    applyPlan(plan);
    addToast('Editing plan applied to video workspace!', 'success');
  };

  const handleReviewInDetail = () => {
    navigate('plan_review');
  };

  return (
    <div className="bg-ocean-850 border border-cyan-500/30 rounded-2xl p-4 shadow-ocean-glow space-y-3.5 my-2">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-neon/20 border border-cyan-neon/40 flex items-center justify-center text-cyan-neon">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">{plan.title}</h4>
            <p className="text-[11px] text-gray-300">{plan.summary}</p>
          </div>
        </div>

        <button
          onClick={dismissPlan}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-ocean-750 transition-colors"
          title="Dismiss Plan"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Operations List */}
      <div className="space-y-2 bg-ocean-900/80 rounded-xl p-3 border border-ocean-800">
        <p className="text-[10px] font-semibold text-ocean-300 uppercase tracking-wider">
          Proposed Operations ({plan.operations.length})
        </p>
        <div className="space-y-2">
          {plan.operations.map((op, idx) => (
            <div key={op.id || idx} className="flex items-start space-x-2 text-xs">
              <span className="w-4 h-4 rounded-full bg-ocean-750 text-cyan-neon font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div className="flex-1">
                <span className="font-semibold text-white">{op.label}</span>
                <p className="text-[11px] text-gray-400">{op.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Output Settings Meta */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 px-1 font-mono">
        <span>Target: {plan.output_settings.resolution} ({plan.output_settings.aspect_ratio})</span>
        <span className="text-emerald-400 flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Status: Validated</span>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <button
          onClick={handleApply}
          className="col-span-2 sm:col-span-1 bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-ocean-glow transition-all"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Apply Edits</span>
        </button>

        <button
          onClick={handleReviewInDetail}
          className="bg-ocean-800 hover:bg-ocean-750 text-white font-medium py-2 px-3 rounded-xl text-xs border border-ocean-700 flex items-center justify-center space-x-1 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-ocean-300" />
          <span>Review Plan</span>
        </button>

        <button
          onClick={onModify}
          className="bg-ocean-800 hover:bg-ocean-750 text-gray-300 font-medium py-2 px-3 rounded-xl text-xs border border-ocean-700 flex items-center justify-center space-x-1 transition-colors"
        >
          <span>Modify</span>
        </button>

        <button
          onClick={dismissPlan}
          className="bg-transparent hover:bg-ocean-800 text-gray-400 font-medium py-2 px-3 rounded-xl text-xs border border-transparent hover:border-ocean-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
