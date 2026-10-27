import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { ExchangeRequest, Notification, User } from '../types';
import { getInitials, getUserGradient, timeAgo } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function DashboardPage() {
  const { user, isLoggedIn, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [reqRes, notifRes, usrRes] = await Promise.all([
          api.get('/requests'),
          api.get('/notifications'),
          api.get('/users'),
        ]);
        setRequests(reqRes.data);
        setNotifications(notifRes.data);
        setAllUsers(usrRes.data);
      } catch {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const currentId = user.id || user._id;

  const acceptedRequests = requests.filter(
    (r) => (r.fromUserId === currentId || r.toUserId === currentId) && r.status === 'accepted'
  );

  const pendingRequestsCount = requests.filter(
    (r) => (r.toUserId === currentId || !r.toUserId) && r.status === 'incoming'
  ).length;

  const hr = new Date().getHours();
  const greetText = hr < 12 ? '🌅 Good morning' : hr < 18 ? '☀️ Good afternoon' : '🌙 Good evening';
  const firstName = user.name?.split(' ')[0] || 'Friend';

  const progressData = (user.skillsLearn || []).map((skill, i) => ({
    skill,
    progress: [40, 65, 85, 50, 75][i % 5],
  }));

  const getPartnerUser = (req: ExchangeRequest) => {
    const partnerId = req.fromUserId === currentId ? req.toUserId : req.fromUserId;
    return allUsers.find((u) => (u.id || u._id) === partnerId);
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div id="dashboard-greeting">
            <h1>
              {greetText}, {firstName}!
            </h1>
            <p>Track your learning journey, active exchanges, and community activity</p>
          </div>
        </div>
      </div>

      <main style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div className="dashboard-grid">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
              <div className="sidebar-nav">
                <div
                  style={{
                    padding: '12px 14px 16px',
                    borderBottom: '1px solid var(--border)',
                    marginBottom: 8,
                  }}
                  id="sidebar-profile"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      className="avatar avatar-md"
                      style={{ background: getUserGradient(currentId || '0'), color: 'white' }}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ⭐ {user.reputation || '4.5'} rep
                      </div>
                    </div>
                  </div>
                </div>

                <Link to="/dashboard" className="sidebar-nav-item active">
                  📊 Overview
                </Link>
                <Link to="/profile" className="sidebar-nav-item">
                  👤 My Profile
                </Link>
                <Link to="/explore" className="sidebar-nav-item">
                  🔍 Explore Skills
                </Link>
                <Link to="/match" className="sidebar-nav-item">
                  🎯 Find Matches
                </Link>
                <Link to="/requests" className="sidebar-nav-item">
                  📨 Requests{' '}
                  {pendingRequestsCount > 0 && (
                    <span className="badge badge-danger" id="req-badge">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>
                <Link to="/community" className="sidebar-nav-item">
                  🌟 Community
                </Link>
                <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }}></div>
                <button
                  type="button"
                  className="sidebar-nav-item logout-btn"
                  style={{ color: 'var(--danger)', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  🚪 Logout
                </button>
              </div>

              {/* Quick Stat Card */}
              <div className="card" style={{ marginTop: 16 }}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div
                    id="streak-display-sidebar"
                    className="streak-display"
                    style={{ justifyContent: 'center', marginBottom: 12 }}
                  >
                    🔥 {user.streak || 0} Day Streak
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Keep your streak going!
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="card" style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.875rem' }}>Quick Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link to="/explore" className="btn btn-primary btn-sm">
                    🔍 Explore Skills
                  </Link>
                  <Link to="/match" className="btn btn-secondary btn-sm">
                    🎯 Find Match
                  </Link>
                  <Link to="/community" className="btn btn-secondary btn-sm">
                    🌟 Community
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
                  <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
                </div>
              ) : (
                <div id="dashboard-content">
                  {/* Stats Grid */}
                  <div className="stats-grid">
                    <div className="stat-card animate-in">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: '1.75rem' }}>🔄</span>
                      </div>
                      <div className="stat-card-value">{acceptedRequests.length}</div>
                      <div className="stat-card-label">Active Exchanges</div>
                      <div className="stat-card-change change-up">+2 this week</div>
                    </div>

                    <div className="stat-card animate-in">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: '1.75rem' }}>⭐</span>
                      </div>
                      <div className="stat-card-value">{user.reputation || '4.5'}</div>
                      <div className="stat-card-label">Reputation Score</div>
                      <div className="stat-card-change change-up">+0.2 this month</div>
                    </div>

                    <div className="stat-card animate-in">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: '1.75rem' }}>🔥</span>
                      </div>
                      <div className="stat-card-value">{user.streak || 0}</div>
                      <div className="stat-card-label">Day Streak</div>
                      <div className="stat-card-change change-up">Keep it up!</div>
                    </div>

                    <div className="stat-card animate-in">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: '1.75rem' }}>📚</span>
                      </div>
                      <div className="stat-card-value">{(user.skillsLearn || []).length}</div>
                      <div className="stat-card-label">Skills Learning</div>
                      <div className="stat-card-change">{(user.skillsTeach || []).length} teaching</div>
                    </div>
                  </div>

                  {/* Progress & Notifications */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 8 }}>
                    <div className="card">
                      <h3 style={{ marginBottom: 20 }}>📈 Learning Progress</h3>
                      {progressData.length > 0 ? (
                        progressData.map((p, i) => (
                          <div key={i} style={{ marginBottom: 18 }}>
                            <div className="progress-label">
                              <span>{p.skill}</span>
                              <span>{p.progress}%</span>
                            </div>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${p.progress}%` }}></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state" style={{ padding: 24 }}>
                          <div className="icon">📚</div>
                          <p>Add skills you want to learn</p>
                          <Link to="/profile" className="btn btn-primary btn-sm">
                            Update Profile
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="card">
                      <h3 style={{ marginBottom: 20 }}>🔔 Recent Notifications</h3>
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((n, i) => (
                          <div
                            key={n.id || n._id || i}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 10,
                              padding: '10px 0',
                              borderBottom: '1px solid var(--border)',
                            }}
                          >
                            <span style={{ fontSize: '1.25rem' }}>
                              {n.type === 'success' ? '✅' : n.type === 'request' ? '📨' : 'ℹ️'}
                            </span>
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{n.message}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {timeAgo(n.date)}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                          No notifications yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Exchanges */}
                  <div style={{ marginTop: 24 }} className="card">
                    <h3 style={{ marginBottom: 20 }}>🤝 Active Exchanges</h3>
                    {acceptedRequests.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {acceptedRequests.map((r) => {
                          const partner = getPartnerUser(r);
                          if (!partner) return null;
                          const pId = partner.id || partner._id || '';
                          return (
                            <div
                              key={r.id || r._id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 14,
                                padding: 14,
                                background: 'var(--surface-2)',
                                borderRadius: 'var(--radius)',
                              }}
                            >
                              <div
                                className="avatar avatar-md"
                                style={{ background: getUserGradient(pId), color: 'white' }}
                              >
                                {getInitials(partner.name)}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>{partner.name}</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                  Teaching: {r.skillOffered} · Learning: {r.skillRequested}
                                </div>
                              </div>
                              <span className="badge badge-success">Active</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="empty-state" style={{ padding: 24 }}>
                        <div className="icon">🤝</div>
                        <h3>No active exchanges</h3>
                        <p>Start by exploring skills or checking your matches</p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                          <Link to="/explore" className="btn btn-primary btn-sm">
                            Explore
                          </Link>
                          <Link to="/match" className="btn btn-secondary btn-sm">
                            Find Matches
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
