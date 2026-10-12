import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSettings();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-3.5 rounded-2xl shadow-2xl border backdrop-blur-lg transition-all animate-in slide-in-from-top-2 duration-200 ${
              isSuccess
                ? 'bg-ocean-900/95 border-emerald-500/40 text-emerald-300'
                : isError
                ? 'bg-ocean-900/95 border-rose-500/40 text-rose-300'
                : isWarning
                ? 'bg-ocean-900/95 border-amber-500/40 text-amber-300'
                : 'bg-ocean-900/95 border-cyan-500/40 text-cyan-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-cyan-neon" />}
            </div>

            <div className="flex-1 text-xs">
              {toast.title && <p className="font-bold text-white mb-0.5">{toast.title}</p>}
              <p className="text-gray-200 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
