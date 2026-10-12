import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, quickDemoLogin } = useAuth();
  const { navigate, addToast } = useSettings();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      addToast('Welcome back to MIMI AI Studio!', 'success');
      navigate('home');
    } else {
      setError(result.error || 'Invalid credentials.');
    }
  };

  const handleDevLogin = () => {
    quickDemoLogin();
    addToast('Logged in using Studio Creator demo profile!', 'info');
    navigate('home');
  };

  return (
    <div className="min-h-screen bg-ocean-950 flex flex-col justify-center items-center p-6 select-none relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-ocean-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-ocean-900 border border-ocean-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ocean-500 to-cyan-neon flex items-center justify-center mx-auto shadow-ocean-glow">
            <span className="text-xl font-black text-white">M</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Sign in to MIMI AI</h2>
          <p className="text-xs text-gray-400">Your Creative Video Studio & AI Buddy</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="email"
                placeholder="creator@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ocean-850 border border-ocean-750 focus:border-cyan-neon rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <button
                type="button"
                onClick={() => navigate('forgot_password')}
                className="text-[11px] text-cyan-300 hover:text-cyan-neon"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ocean-850 border border-ocean-750 focus:border-cyan-neon rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-sm shadow-ocean-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Development Quick Mode Option */}
        <div className="pt-2 border-t border-ocean-800 space-y-3">
          <button
            type="button"
            onClick={handleDevLogin}
            className="w-full py-2.5 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 text-xs font-medium text-cyan-300 flex items-center justify-center space-x-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-neon" />
            <span>Quick Launch Studio (Creator Dev Session)</span>
          </button>

          <p className="text-center text-xs text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('register')}
              className="font-bold text-cyan-neon hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
