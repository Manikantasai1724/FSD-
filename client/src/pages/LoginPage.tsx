import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TagsInput from '../components/ui/TagsInput';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please enter both email and password');
      return;
    }
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async () => {
    setLoginEmail('alex@example.com');
    setLoginPassword('pass123');
    setLoading(true);
    const result = await login('alex@example.com', 'pass123');
    setLoading(false);
    if (result.success) {
      toast.success('Logged in as Demo User (Alex Rivera)!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error || 'Demo login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (signupPassword !== signupConfirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (!agreedTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }

    setLoading(true);
    const result = await signup({
      name: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      skillsTeach: teachSkills,
      skillsLearn: learnSkills,
    });
    setLoading(false);

    if (result.success) {
      toast.success('Account created successfully! Welcome to SkillXchange.');
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(result.error || 'Signup failed');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-bg">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon" style={{ width: 56, height: 56, fontSize: '1.5rem', margin: '0 auto 16px' }}>
            🔄
          </div>
          <h2>Welcome to SkillXchange</h2>
          <p>The place where knowledge is currency</p>
        </div>

        <div className="auth-tabs" id="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {tab === 'login' && (
          <div className="auth-form-panel" id="login-panel">
            <form id="login-form" onSubmit={handleLogin} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">
                  Email Address
                </label>
                <div className="form-control-icon">
                  <span className="icon">📧</span>
                  <input
                    type="email"
                    id="login-email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <div className="form-control-icon">
                  <span className="icon">🔒</span>
                  <input
                    type="password"
                    id="login-password"
                    className="form-control"
                    placeholder="Your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
                  />{' '}
                  Remember me
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Password reset is not enabled for demo accounts.');
                  }}
                  style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', marginBottom: 12 }}
              >
                {loading ? 'Logging in...' : 'Login to Account'}
              </button>
              <button
                type="button"
                className="btn btn-secondary demo-login-btn"
                onClick={handleDemoLogin}
                disabled={loading}
                style={{ width: '100%' }}
              >
                🎭 Try Demo Account
              </button>
            </form>

            <div className="auth-divider">or continue with</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => toast.info('OAuth coming soon!')}
              >
                🔍 Google
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => toast.info('OAuth coming soon!')}
              >
                🐙 GitHub
              </button>
            </div>
          </div>
        )}

        {tab === 'signup' && (
          <div className="auth-form-panel" id="signup-panel">
            <form id="signup-form" onSubmit={handleSignup} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-name">
                  Full Name
                </label>
                <div className="form-control-icon">
                  <span className="icon">👤</span>
                  <input
                    type="text"
                    id="signup-name"
                    className="form-control"
                    placeholder="Your full name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">
                  Email Address
                </label>
                <div className="form-control-icon">
                  <span className="icon">📧</span>
                  <input
                    type="email"
                    id="signup-email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="signup-password"
                    className="form-control"
                    placeholder="Min. 6 chars"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-confirm">
                    Confirm
                  </label>
                  <input
                    type="password"
                    id="signup-confirm"
                    className="form-control"
                    placeholder="Repeat password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Skills I Can Teach{' '}
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(press Enter to add)</span>
                </label>
                <TagsInput
                  tags={teachSkills}
                  onChange={setTeachSkills}
                  placeholder="e.g. Python, Guitar, Cooking..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Skills I Want to Learn{' '}
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(press Enter to add)</span>
                </label>
                <TagsInput
                  tags={learnSkills}
                  onChange={setLearnSkills}
                  placeholder="e.g. UI/UX, Spanish, Yoga..."
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    lineHeight: 1.5,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    required
                    style={{ width: 16, height: 16, accentColor: 'var(--primary)', marginTop: 2 }}
                  />
                  <span>
                    I agree to the{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--primary)' }}>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--primary)' }}>
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Creating Account...' : '🚀 Create Free Account'}
              </button>
            </form>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Demo: <strong>alex@example.com</strong> / <strong>pass123</strong>
        </div>
      </div>
    </main>
  );
}
