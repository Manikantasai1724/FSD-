import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import type { Challenge, Discussion, User } from '../types';
import { ACHIEVEMENTS } from '../utils/constants';
import { getInitials, getUserGradient, timeAgo, daysUntil } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/ui/Modal';

export default function CommunityPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeDiscCategory, setActiveDiscCategory] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  // New discussion form
  const [newCategory, setNewCategory] = useState('Technology');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [posting, setPosting] = useState(false);

  const { user: currentUser, isLoggedIn } = useAuth();
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const [chRes, discRes, usrRes] = await Promise.all([
        api.get('/challenges'),
        api.get('/discussions'),
        api.get('/users'),
      ]);
      setChallenges(chRes.data);
      setDiscussions(discRes.data);
      setUsers(usrRes.data);
    } catch {
      toast.error('Failed to load community data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleJoinChallenge = async (challengeId: string) => {
    if (!isLoggedIn) {
      toast.warning('Please log in to join challenges.');
      return;
    }
    try {
      await api.post(`/challenges/${challengeId}/join`);
      toast.success("You've joined the challenge! Good luck! 🏆");
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to join challenge');
    }
  };

  const handleUpvote = async (discussionId: string) => {
    try {
      await api.post(`/discussions/${discussionId}/upvote`);
      toast.success('Upvoted! 👍');
      setDiscussions((prev) =>
        prev.map((d) => (d.id === discussionId || d._id === discussionId ? { ...d, votes: d.votes + 1 } : d))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to upvote');
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.warning('Please log in to post a discussion.');
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    setPosting(true);
    try {
      await api.post('/discussions', {
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
      });
      toast.success('Discussion posted successfully! 🚀');
      setShowNewModal(false);
      setNewTitle('');
      setNewContent('');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to post discussion');
    } finally {
      setPosting(false);
    }
  };

  const filteredDiscussions = useMemo(() => {
    if (activeDiscCategory === 'all') return discussions;
    return discussions.filter(
      (d) => d.category.toLowerCase() === activeDiscCategory.toLowerCase()
    );
  }, [discussions, activeDiscCategory]);

  const leaderboardUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => (b.exchanges || 0) - (a.exchanges || 0))
      .slice(0, 8);
  }, [users]);

  return (
    <>
      {/* Hero */}
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
              marginBottom: 16,
            }}
          >
            🌟 Community Hub
          </span>
          <h1 style={{ color: 'white', fontSize: 'clamp(1.75rem,4vw,2.75rem)', marginBottom: 12 }}>
            Learn Together, Grow Together
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 480, margin: '0 auto' }}>
            Challenges, discussions, and a leaderboard to keep you motivated.
          </p>
        </div>
      </section>

      <main style={{ padding: '48px 0 80px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
            {/* Main Column */}
            <div>
              {/* Challenges */}
              <div style={{ marginBottom: 48 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 24,
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <h2 style={{ fontSize: '1.5rem' }}>🏆 Weekly Challenges</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                      Complete challenges, earn badges, and climb the leaderboard
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => toast.info('Challenge creation coming soon!')}
                  >
                    + Create Challenge
                  </button>
                </div>

                <div className="skills-grid" id="challenge-grid">
                  {challenges.map((c) => {
                    const cId = c.id || c._id || '';
                    return (
                      <div key={cId} className="challenge-card animate-in">
                        <div className="challenge-header">
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                              gap: 12,
                            }}
                          >
                            <div>
                              <span
                                className="tag tag-primary"
                                style={{ marginBottom: 10, display: 'inline-flex' }}
                              >
                                {c.category}
                              </span>
                              <h3>{c.title}</h3>
                            </div>
                            <span
                              className={`tag ${
                                c.difficulty === 'Beginner'
                                  ? 'tag-success'
                                  : c.difficulty === 'Intermediate'
                                  ? 'tag-warning'
                                  : 'tag-primary'
                              }`}
                            >
                              {c.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="challenge-body">
                          <p
                            style={{
                              color: 'var(--text-secondary)',
                              fontSize: '0.9375rem',
                              lineHeight: 1.6,
                              marginBottom: 12,
                            }}
                          >
                            {c.description}
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                            {(c.tags || []).map((t, idx) => (
                              <span key={idx} className="tag tag-muted">
                                #{t}
                              </span>
                            ))}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            🏆 {c.prize}
                          </div>
                        </div>
                        <div className="challenge-footer">
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            👥 {c.participants} joined · 📋 {c.submissions || 0} submissions · ⏰{' '}
                            {daysUntil(c.deadline)}d left
                          </div>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleJoinChallenge(cId)}
                          >
                            Join Challenge
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Discussions */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <h2 style={{ fontSize: '1.5rem' }}>💬 Community Discussions</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                      Share, ask, and learn from the community
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      if (!isLoggedIn) {
                        toast.warning('Please log in to start a discussion.');
                        return;
                      }
                      setShowNewModal(true);
                    }}
                  >
                    + New Post
                  </button>
                </div>

                {/* Filter */}
                <div className="filter-bar" style={{ marginBottom: 16 }}>
                  <button
                    type="button"
                    className={`filter-btn ${activeDiscCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveDiscCategory('all')}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${activeDiscCategory === 'Technology' ? 'active' : ''}`}
                    onClick={() => setActiveDiscCategory('Technology')}
                  >
                    💻 Tech
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${activeDiscCategory === 'Design' ? 'active' : ''}`}
                    onClick={() => setActiveDiscCategory('Design')}
                  >
                    🎨 Design
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${activeDiscCategory === 'Language' ? 'active' : ''}`}
                    onClick={() => setActiveDiscCategory('Language')}
                  >
                    🗣️ Languages
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${activeDiscCategory === 'Cooking' ? 'active' : ''}`}
                    onClick={() => setActiveDiscCategory('Cooking')}
                  >
                    🍳 Cooking
                  </button>
                </div>

                <div id="discussion-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filteredDiscussions.map((d) => {
                    const dId = d.id || d._id || '';
                    return (
                      <div key={dId} className="discussion-card animate-in">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <div
                            className="avatar avatar-md"
                            style={{
                              background: getUserGradient(d.authorId || '0'),
                              color: 'white',
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(d.authorName || 'User')}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 4,
                                flexWrap: 'wrap',
                              }}
                            >
                              <span style={{ fontWeight: 700 }}>{d.authorName}</span>
                              <span className="tag tag-muted">{d.category}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                {timeAgo(d.date)}
                              </span>
                            </div>
                            <h4 style={{ marginBottom: 6, fontSize: '1rem' }}>{d.title}</h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {d.content.slice(0, 120)}
                              {d.content.length > 120 ? '...' : ''}
                            </p>
                            <div
                              style={{
                                display: 'flex',
                                gap: 16,
                                marginTop: 12,
                                fontSize: '0.8125rem',
                                color: 'var(--text-muted)',
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => handleUpvote(dId)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: 'var(--text-muted)',
                                  fontSize: '0.8125rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                👍 {d.votes}
                              </button>
                              <span>💬 {d.comments || 0} comments</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside style={{ position: 'sticky', top: 84 }}>
              {/* Leaderboard */}
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ marginBottom: 16 }}>🏅 Leaderboard</h3>
                <div id="leaderboard-list">
                  {leaderboardUsers.map((user, i) => {
                    const uId = user.id || user._id || '';
                    return (
                      <div key={uId} className="leaderboard-item">
                        <div className={`leaderboard-rank rank-${i + 1}`}>
                          {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                        </div>
                        <div
                          className="avatar avatar-sm"
                          style={{ background: getUserGradient(uId), color: 'white' }}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{user.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            🔥 {user.streak || 0}d · ⭐ {user.reputation || '4.5'}
                          </div>
                        </div>
                        <div className="leaderboard-points">
                          {(user.exchanges || 0) * 10 + Math.round((user.reputation || 0) * 20)}pts
                        </div>
                      </div>
                    );
                  })}
                </div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('You are already viewing the top community leaders!');
                  }}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: 12,
                    fontSize: '0.875rem',
                    color: 'var(--primary)',
                    fontWeight: 600,
                  }}
                >
                  View Full Leaderboard →
                </a>
              </div>

              {/* Achievement Badges */}
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ marginBottom: 16 }}>🎖️ Achievement Badges</h3>
                <div className="achievement-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                  {ACHIEVEMENTS.slice(0, 8).map((a) => {
                    const earned = (currentUser?.badges || ['first_exchange', 'teacher']).includes(a.id);
                    return (
                      <div
                        key={a.id}
                        className={`achievement-badge ${earned ? 'earned' : ''}`}
                        title={a.desc}
                        style={earned ? {} : { opacity: 0.4 }}
                      >
                        <span className="icon" style={earned ? {} : { filter: 'grayscale(1)' }}>
                          {a.icon}
                        </span>
                        <span className="name">{a.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Community Stats */}
              <div className="card">
                <h3 style={{ marginBottom: 16 }}>📈 Community Stats</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 12,
                      background: 'var(--surface-2)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'var(--primary)',
                      }}
                    >
                      {challenges.length || 89}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Challenges</div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 12,
                      background: 'var(--surface-2)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'var(--success)',
                      }}
                    >
                      342
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submissions</div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 12,
                      background: 'var(--surface-2)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'var(--accent-2)',
                      }}
                    >
                      {discussions.length || '1,247'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Discussions</div>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: 12,
                      background: 'var(--surface-2)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'var(--warning)',
                      }}
                    >
                      8,934
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Community Votes</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* New Discussion Modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="💬 Start a Discussion">
        <form onSubmit={handleCreateDiscussion}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              id="disc-category"
              className="form-control"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              <option value="Technology">Technology</option>
              <option value="Design">Design</option>
              <option value="Music">Music</option>
              <option value="Language">Language</option>
              <option value="Cooking">Cooking</option>
              <option value="Fitness">Fitness</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              id="disc-title"
              className="form-control"
              placeholder="What's on your mind?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              id="disc-content"
              className="form-control"
              rows={4}
              placeholder="Share your thoughts, question, or tip..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              required
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowNewModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={posting}>
              {posting ? 'Posting...' : 'Post Discussion 🚀'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
