import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { ExchangeRequest, User } from '../types';
import { getInitials, getUserGradient, timeAgo } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RequestsPage() {
  const { user: currentUser, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reqRes, usrRes] = await Promise.all([api.get('/requests'), api.get('/users')]);
      setRequests(reqRes.data);
      setUsers(usrRes.data);
    } catch {
      toast.error('Failed to load exchange requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isLoggedIn, navigate]);

  const currentId = currentUser?.id || currentUser?._id;

  const incoming = requests.filter(
    (r) => (r.toUserId === null || r.toUserId === currentId) && (r.status === 'incoming' || r.fromUserId !== currentId)
  );
  const sent = requests.filter((r) => r.fromUserId === currentId && r.status === 'sent');
  const accepted = requests.filter(
    (r) => (r.fromUserId === currentId || r.toUserId === currentId) && r.status === 'accepted'
  );

  const getUser = (id: string | null) => {
    if (!id) return null;
    return users.find((u) => (u.id || u._id) === id);
  };

  const handleAccept = async (requestId: string) => {
    try {
      await api.put(`/requests/${requestId}/accept`);
      toast.success('Exchange request accepted! 🎉');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to accept request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await api.put(`/requests/${requestId}/reject`);
      toast.info('Request declined.');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to decline request');
    }
  };

  const renderRequestCard = (req: ExchangeRequest, type: 'incoming' | 'sent' | 'accepted') => {
    const fromUser = getUser(req.fromUserId) || { name: 'Unknown User', id: req.fromUserId };
    const toUser = getUser(req.toUserId) || { name: 'Community User', id: req.toUserId };
    const displayUser = type === 'sent' ? toUser : fromUser;
    const reqId = req.id || req._id || '';

    return (
      <div key={reqId} className="request-card animate-in" id={`req-${reqId}`}>
        <div
          className="avatar avatar-md"
          style={{
            background: getUserGradient(displayUser.id || '0'),
            color: 'white',
            flexShrink: 0,
          }}
        >
          {getInitials(displayUser.name || 'User')}
        </div>
        <div className="request-info">
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{displayUser.name}</div>
          <div className="request-skills">
            <span className="tag tag-primary">Wants: {req.skillRequested}</span>
            <span className="request-arrow">⇄</span>
            <span className="tag tag-success">Offers: {req.skillOffered}</span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {timeAgo(req.date)} · "{req.message?.slice(0, 60)}
            {(req.message?.length || 0) > 60 ? '...' : ''}"
          </div>
        </div>
        <div className="request-actions">
          {type === 'incoming' && (
            <>
              <button
                type="button"
                className="btn btn-sm btn-success"
                onClick={() => handleAccept(reqId)}
              >
                ✓ Accept
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => handleReject(reqId)}
              >
                ✕ Decline
              </button>
            </>
          )}
          {type === 'sent' && <span className="badge badge-warning">Pending</span>}
          {type === 'accepted' && <span className="badge badge-success">✓ Active</span>}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>📨 Exchange Requests</h1>
          <p>Manage your incoming requests, track sent requests, and view active exchanges</p>
        </div>
      </div>

      <main style={{ padding: '40px 0 80px' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div id="requests-container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: 16 }}>⏳</div>
                <p style={{ color: 'var(--text-muted)' }}>Loading requests...</p>
              </div>
            ) : (
              <div id="requests-tabs">
                <div className="tabs">
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 0 ? 'active' : ''}`}
                    onClick={() => setActiveTab(0)}
                  >
                    📥 Incoming <span className="badge badge-danger">{incoming.length}</span>
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
                    onClick={() => setActiveTab(1)}
                  >
                    📤 Sent <span className="badge badge-warning">{sent.length}</span>
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 2 ? 'active' : ''}`}
                    onClick={() => setActiveTab(2)}
                  >
                    ✅ Active <span className="badge badge-success">{accepted.length}</span>
                  </button>
                </div>

                {/* Incoming Tab */}
                <div className={`tab-content ${activeTab === 0 ? 'active' : ''}`}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {incoming.length > 0 ? (
                      incoming.map((r) => renderRequestCard(r, 'incoming'))
                    ) : (
                      <div className="empty-state">
                        <div className="icon">📭</div>
                        <h3>No incoming requests</h3>
                        <p>When someone requests a skill exchange with you, it'll appear here</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sent Tab */}
                <div className={`tab-content ${activeTab === 1 ? 'active' : ''}`}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {sent.length > 0 ? (
                      sent.map((r) => renderRequestCard(r, 'sent'))
                    ) : (
                      <div className="empty-state">
                        <div className="icon">📤</div>
                        <h3>No sent requests</h3>
                        <p>Start exploring skills and send your first request</p>
                        <Link to="/explore" className="btn btn-primary btn-sm">
                          Explore Skills
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Tab */}
                <div className={`tab-content ${activeTab === 2 ? 'active' : ''}`}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {accepted.length > 0 ? (
                      accepted.map((r) => renderRequestCard(r, 'accepted'))
                    ) : (
                      <div className="empty-state">
                        <div className="icon">🤝</div>
                        <h3>No active exchanges yet</h3>
                        <p>Accept requests or get your requests accepted to start learning</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
