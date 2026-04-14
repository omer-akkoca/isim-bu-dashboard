import { useState } from 'react';

import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuthActions } from '../actions/authActions';

import type { LoginProps, RegisterProps } from './@types';

type Tab = 'login' | 'register';

const LoginPage = () => {
  const navigate = useNavigate();
  const { loading, error, login, register } = useAuthActions();

  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSuccess = () => navigate('/dashboard');

  const switchTab = (t: Tab) => {
    setTab(t);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tab === 'login') {
      const data: LoginProps = { email, password };
      await login({ data, onSuccess });
    } else {
      const data: RegisterProps = { confirmPassword, email, password };
      register({ data, onSuccess });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background p-6">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-125 h-125 rounded-full opacity-10 blur-[100px] bg-[#6366F1] -top-24 -left-24" />
        <div className="absolute w-100 h-100 rounded-full opacity-8 blur-[100px] bg-[#8B5CF6] -bottom-20 -right-20" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-105 bg-white border border-gray-200 rounded-3xl p-10 shadow-xl shadow-gray-200/60">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-8">
          <img src="/logo.png" alt="İşim Bu" className="w-12 h-12 rounded-xl object-cover" />
          <div>
            <span className="block text-[17px] font-bold text-gray-900 tracking-tight">İşim Bu</span>
            <span className="block text-[11px] text-gray-400 mt-0.5">İşveren Paneli</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative grid grid-cols-2 bg-gray-100 rounded-lg p-1 mb-7">
          <button
            className={`relative z-10 py-2.5 text-[13px] font-medium rounded-md transition-colors duration-200 ${tab === 'login' ? 'text-gray-900' : 'text-gray-400'}`}
            onClick={() => switchTab('login')}
          >
            Giriş Yap
          </button>
          <button
            className={`relative z-10 py-2.5 text-[13px] font-medium rounded-md transition-colors duration-200 ${tab === 'register' ? 'text-gray-900' : 'text-gray-400'}`}
            onClick={() => switchTab('register')}
          >
            Kayıt Ol
          </button>
          <div
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white border border-gray-200 rounded-md shadow-sm transition-transform duration-300 ease-in-out"
            style={{ transform: tab === 'register' ? 'translateX(100%)' : 'translateX(0)' }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-500 text-[13px]">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-gray-500 tracking-wide">E-posta</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/12 focus:bg-white transition-all"
                placeholder="ornek@sirket.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-gray-500 tracking-wide">Şifre</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-10 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/12 focus:bg-white transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {tab === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-gray-500 tracking-wide">Şifre Tekrar</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-10 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/12 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-3.5 rounded-lg text-[14px] font-semibold text-white bg-linear-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-[#6366F1]/20 hover:opacity-90 hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : tab === 'login' ? (
              'Giriş Yap'
            ) : (
              'Hesap Oluştur'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export { LoginPage };
