import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { User } from '../types';
import { getInitials, getUserGradient, getSkillMatchScore } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function MatchPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const { user: currentUser, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users');
        setUsers(res.data);
      } catch {
        toast.error('Failed to load user profiles for matching.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isLoggedIn]);

  const matches = useMemo(() => {
    if (!currentUser || !users.length) return [];
    const currentId = currentUser.id || currentUser._id;

    const list: { user: User; score: number }[] = [];
    users.forEach((other) => {
      const otherId = other.id || other._id;
      if (otherId === currentId) return;

      const score = getSkillMatchScore(currentUser, other);
      if (score > 0) {
        list.push({ user: other, score });
      }
    });

    list.sort((a, b) => b.score - a.score);
    return list;
  }, [currentUser, users]);

  const handleConnect = async (otherUser: User) => {
    const toUserId = otherUser.id || otherUser._id || '';
    const skillRequested = otherUser.skillsTeach?.[0] || 'General Skills';
    const skillOffered = currentUser?.skillsTeach?.[0] || 'General Skills';

    try {
      await api.post('/requests', {
        toUserId,
        skillRequested,
        skillOffered,
        message: `Hi! I found our profiles complement each other on Skill Match. I can teach you ${skillOffered} in return for ${skillRequested}!`,
      });
      toast.success('Connection request sent! 🎉');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    }
  };

  return (
    <>
      {/* Hero Header */}
      <section style={{ background: 'var(--gradient)', color: 'white', padding: '56px 0 48px', textAlign: 'center' }}>
        <div className="container">
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 16px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            AI-Powered Matching
          </span>
          <h1 style={{ color: 'white', fontSize: 'clamp(1.75rem,4vw,2.75rem)', marginBottom: 12 }}>
            Find Your Perfect<br />Skill Exchange Partner
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.0625rem', maxWidth: 480, margin: '0 auto' }}>
            Our algorithm analyzes complementary skills to find your ideal learning partners.
          </p>
        </div>
      </section>

      {/* How Matching Works */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  background: 'rgba(79,70,229,0.1)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                }}
              >
                🎓
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>You Teach</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>What you know</div>
              </div>
            </div>
            <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>⇄</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  background: 'rgba(16,185,129,0.1)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                }}
              >
                📚
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>You Learn</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>What you want</div>
              </div>
            </div>
            <span style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>= 🎯</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  background: 'rgba(245,158,11,0.1)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                }}
              >
                ⭐
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Perfect Match</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI score ≥ 80%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main style={{ padding: '48px 0 80px' }}>
        <div className="container">
          <div id="match-container">
            {!isLoggedIn ? (
              <div className="empty-state">
                <div className="icon">🔒</div>
                <h3>Login to see your matches</h3>
                <p>Create an account to find your perfect skill exchange partners</p>
                <Link to="/login" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            ) : loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</div>
                <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>Finding your best matches...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="empty-state">
                <div className="icon">💔</div>
                <h3>No matches yet</h3>
                <p>Add more skills to your profile to find better matches</p>
                <Link to="/profile" className="btn btn-primary">
                  Update Profile
                </Link>
              </div>
            ) : (
              <>
                <div className="section-header">
                  <span className="eyebrow">🎯 AI-Powered Matching</span>
                  <h2>Your Skill Matches</h2>
                  <p>Based on your skills, here are your best exchange partners</p>
                </div>
                <div className="skills-grid">
                  {matches.slice(0, 12).map(({ user, score }) => {
                    const uId = user.id || user._id || '';
                    return (
                      <div key={uId} className={`match-card animate-in ${score >= 80 ? 'glow-ring' : ''}`}>
                        <div className="match-score">{score}%</div>
                        <div
                          className="avatar avatar-xl"
                          style={{
                            background: getUserGradient(uId),
                            color: 'white',
                            margin: '0 auto 12px',
                          }}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div className="match-name">{user.name}</div>
                        <div className="match-label">
                          ⭐ {user.reputation || '4.5'} · {user.exchanges || 0} exchanges
                        </div>
                        <div
                          style={{
                            margin: '14px 0',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 6,
                            justifyContent: 'center',
                          }}
                        >
                          {(user.skillsTeach || []).slice(0, 3).map((s, idx) => (
                            <span key={idx} className="tag tag-primary">
                              {s}
                            </span>
                          ))}
                        </div>
                        {score >= 80 && (
                          <div className="badge badge-success" style={{ marginBottom: 12 }}>
                            🎯 Perfect Match!
                          </div>
                        )}
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginTop: 8,
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => navigate(`/profile?user=${uId}`)}
                          >
                            View Profile
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => handleConnect(user)}
                          >
                            Connect 🔄
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
