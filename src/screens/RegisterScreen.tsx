import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { User, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const RegisterScreen: React.FC = () => {
  const { register } = useAuth();
  const { navigate, addToast } = useSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!terms) {
      setError('Please accept the studio terms to create an account.');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      addToast('Account created successfully! Welcome to MIMI AI.', 'success');
      navigate('home');
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-ocean-950 flex flex-col justify-center items-center p-6 select-none relative">
      <div className="w-full max-w-md bg-ocean-900 border border-ocean-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">Create Creator Account</h2>
          <p className="text-xs text-gray-400">Join MIMI AI Studio and build creative video workflows</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Display Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Alex Rivers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ocean-850 border border-ocean-750 focus:border-cyan-neon rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="email"
                placeholder="alex@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ocean-850 border border-ocean-750 focus:border-cyan-neon rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ocean-850 border border-ocean-750 focus:border-cyan-neon rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
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

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-ocean-850 border border-ocean-750 focus:border-cyan-neon rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="rounded bg-ocean-800 border-ocean-700 text-cyan-neon focus:ring-0"
            />
            <label htmlFor="terms" className="text-xs text-gray-400 select-none">
              I agree to the <span className="text-cyan-300">Studio Terms of Service</span> & Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-sm shadow-ocean-glow transition-all flex items-center justify-center space-x-2 mt-4"
          >
            {loading ? <span>Creating Studio Account...</span> : <span>Create Account</span>}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 pt-2 border-t border-ocean-800">
          Already registered?{' '}
          <button onClick={() => navigate('login')} className="font-bold text-cyan-neon hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
