import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordScreen: React.FC = () => {
  const { navigate, addToast } = useSettings();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    addToast('Password reset link dispatched.', 'info');
  };

  return (
    <div className="min-h-screen bg-ocean-950 flex flex-col justify-center items-center p-6 select-none relative">
      <div className="w-full max-w-md bg-ocean-900 border border-ocean-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        <button
          onClick={() => navigate('login')}
          className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to sign in</span>
        </button>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">Recover Password</h2>
          <p className="text-xs text-gray-400">
            Enter your email and we'll send you secure instructions to reset your studio password.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-ocean-850 border border-emerald-500/40 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Reset Instructions Dispatched</h4>
            <p className="text-xs text-gray-300">
              If an account is associated with <span className="font-semibold text-cyan-300">{email}</span>, a reset link has been dispatched.
            </p>
            <button
              onClick={() => navigate('login')}
              className="mt-2 py-2 px-4 rounded-xl bg-ocean-800 hover:bg-ocean-750 text-xs font-bold text-white border border-ocean-700"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  placeholder="name@studio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ocean-850 border border-ocean-750 focus:border-cyan-neon rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-sm shadow-ocean-glow transition-all"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
