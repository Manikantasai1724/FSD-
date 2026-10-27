import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';
import { getInitials } from '../../utils/helpers';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore Skills' },
    { to: '/match', label: 'Find Match' },
    { to: '/community', label: 'Community' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-inner">
            <Link to="/" className="navbar-logo">
              <div className="logo-icon">🔄</div>
              SkillXchange
            </Link>

            <div className="navbar-links">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link${isActive(link.to) ? ' active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="navbar-actions">
              <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark mode">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {isLoggedIn && (
                <Link to="/requests" className="notif-btn">
                  🔔<span className="notif-dot"></span>
                </Link>
              )}

              {isLoggedIn ? (
                <>
                  <button className="btn btn-danger btn-sm logout-btn" onClick={logout}>
                    Logout
                  </button>
                  <div
                    className="nav-avatar"
                    style={{ display: 'flex' }}
                    title={user?.name}
                    onClick={() => navigate('/profile')}
                  >
                    {user ? getInitials(user.name) : ''}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary btn-sm login-btn">
                    Login
                  </Link>
                  <Link to="/login" className="btn btn-primary btn-sm login-btn">
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>

            <button
              className="hamburger"
              aria-label="Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className={`mobile-nav${mobileOpen ? ' open' : ''}`} style={{ display: mobileOpen ? 'flex' : 'none' }}>
        <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>🏠 Home</Link>
        <Link to="/explore" className="nav-link" onClick={() => setMobileOpen(false)}>🔍 Explore Skills</Link>
        <Link to="/match" className="nav-link" onClick={() => setMobileOpen(false)}>🎯 Find Match</Link>
        <Link to="/community" className="nav-link" onClick={() => setMobileOpen(false)}>🌟 Community</Link>
        <Link to="/dashboard" className="nav-link" onClick={() => setMobileOpen(false)}>📊 Dashboard</Link>
        <Link to="/requests" className="nav-link" onClick={() => setMobileOpen(false)}>📨 Requests</Link>
        <hr style={{ border: '1px solid var(--border)', margin: '8px 0' }} />
        {isLoggedIn ? (
          <button className="btn btn-danger btn-sm" style={{ width: '100%' }} onClick={() => { logout(); setMobileOpen(false); }}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
            Login / Sign Up
          </Link>
        )}
      </nav>
    </>
  );
}
