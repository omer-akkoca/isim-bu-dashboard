import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

type Tab = 'login' | 'register';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tab === 'register' && password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.code;
      if (msg === 'auth/user-not-found' || msg === 'auth/wrong-password' || msg === 'auth/invalid-credential') {
        setError('E-posta veya şifre hatalı.');
      } else if (msg === 'auth/email-already-in-use') {
        setError('Bu e-posta zaten kullanılıyor.');
      } else if (msg === 'auth/weak-password') {
        setError('Şifre en az 6 karakter olmalı.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-root">
      <div className="login-bg">
        <div className="login-blob blob-1" />
        <div className="login-blob blob-2" />
        <div className="login-blob blob-3" />
        <div className="login-grid" />
      </div>

      <div className="login-card">
        <div className="login-logo-wrap">
          <img src="/logo.png" alt="Benim İşim" className="login-logo" />
          <div className="login-brand">
            <span className="login-brand-name">Benim İşim</span>
            <span className="login-brand-sub">İşveren Paneli</span>
          </div>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Giriş Yap
          </button>
          <button
            className={`login-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Kayıt Ol
          </button>
          <div className={`login-tab-indicator ${tab === 'register' ? 'right' : ''}`} />
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div className="login-field">
            <label className="login-label">E-posta</label>
            <div className="login-input-wrap">
              <Mail size={16} className="login-input-icon" />
              <input
                type="email"
                className="login-input"
                placeholder="ornek@sirket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Şifre</label>
            <div className="login-input-wrap">
              <Lock size={16} className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {tab === 'register' && (
            <div className="login-field">
              <label className="login-label">Şifre Tekrar</label>
              <div className="login-input-wrap">
                <Lock size={16} className="login-input-icon" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : (
              tab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
