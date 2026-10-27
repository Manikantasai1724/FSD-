import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { User } from '../types';
import { ACHIEVEMENTS, SKILL_ICONS } from '../utils/constants';
import { getInitials, getUserGradient, formatDate, detectCategory } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/ui/Modal';
import TagsInput from '../components/ui/TagsInput';

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const viewingId = searchParams.get('user');

  const { user: currentUser, isLoggedIn, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editTeach, setEditTeach] = useState<string[]>([]);
  const [editLearn, setEditLearn] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const currentId = currentUser?.id || currentUser?._id;
  const isOwnProfile = !viewingId || viewingId === currentId;

  useEffect(() => {
    const fetchUser = async () => {
      if (isOwnProfile) {
        if (!isLoggedIn) {
          navigate('/login');
          return;
        }
        setProfileUser(currentUser);
        setLoading(false);
      } else {
        try {
          setLoading(true);
          const res = await api.get(`/users/${viewingId}`);
          setProfileUser(res.data);
        } catch {
          toast.error('Failed to load user profile');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [viewingId, isOwnProfile, isLoggedIn, currentUser, navigate]);

  const handleOpenEdit = () => {
    if (!profileUser) return;
    setEditName(profileUser.name || '');
    setEditBio(profileUser.bio || '');
    setEditLocation(profileUser.location || '');
    setEditTeach([...(profileUser.skillsTeach || [])]);
    setEditLearn([...(profileUser.skillsLearn || [])]);
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedData: Partial<User> = {
        name: editName.trim() || profileUser?.name || '',
        bio: editBio.trim(),
        location: editLocation.trim(),
        skillsTeach: editTeach,
        skillsLearn: editLearn,
      };

      const success = await updateUser(updatedData);
      if (success) {
        toast.success('Profile updated successfully! ✨');
        setProfileUser((prev) => (prev ? ({ ...prev, ...updatedData } as User) : null));
        setShowEditModal(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRequestExchange = async () => {
    if (!isLoggedIn) {
      toast.warning('Please log in to request an exchange.');
      navigate('/login');
      return;
    }
    if (!profileUser) return;

    const toUserId = profileUser.id || profileUser._id || '';
    const skillRequested = profileUser.skillsTeach?.[0] || 'General Skills';
    const skillOffered = currentUser?.skillsTeach?.[0] || 'General Skills';

    try {
      await api.post('/requests', {
        toUserId,
        skillRequested,
        skillOffered,
        message: `Hi ${profileUser.name}! I'd love to exchange skills with you. I can offer ${skillOffered} in return for ${skillRequested}.`,
      });
      toast.success('Exchange request sent successfully! 🎉');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send exchange request');
    }
  };

  if (loading) {
    return (
      <main style={{ padding: '40px 0 80px' }}>
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>⏳</div>
          <p style={{ color: 'var(--text-muted)' }}>Loading profile...</p>
        </div>
      </main>
    );
  }

  if (!profileUser) {
    return (
      <main style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div className="empty-state">
            <div className="icon">❓</div>
            <h3>User not found</h3>
          </div>
        </div>
      </main>
    );
  }

  const pId = profileUser.id || profileUser._id || '0';
  const earnedBadges = ACHIEVEMENTS.filter((a) => (profileUser.badges || []).includes(a.id));
  const unearnedBadges = ACHIEVEMENTS.filter((a) => !(profileUser.badges || []).includes(a.id));

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>{isOwnProfile ? 'My Profile' : `${profileUser.name}'s Profile`}</h1>
          <p>
            {isOwnProfile
              ? 'Manage your skills, track progress, and showcase your expertise'
              : 'Explore skills, background, and achievements'}
          </p>
        </div>
      </div>

      <main style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div id="profile-content">
            {/* Header Card */}
            <div className="profile-header-card animate-in">
              <div className="profile-cover" style={{ background: getUserGradient(pId) }}>
                {isOwnProfile && (
                  <button
                    type="button"
                    className="profile-cover-edit"
                    onClick={() => toast.info('Cover editing coming soon!')}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <div className="profile-body">
                <div className="profile-avatar-wrap">
                  <div className="profile-avatar" style={{ background: getUserGradient(pId) }}>
                    {getInitials(profileUser.name)}
                  </div>
                  {isOwnProfile ? (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleOpenEdit}>
                      ✏️ Edit Profile
                    </button>
                  ) : (
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleRequestExchange}>
                      🔄 Request Exchange
                    </button>
                  )}
                </div>

                <div className="profile-name">
                  {profileUser.name}{' '}
                  {(profileUser.badges || []).includes('verified') && <span className="verified">✅</span>}
                </div>
                <div className="profile-handle">
                  @{profileUser.name.toLowerCase().replace(/\s/g, '_')} · Joined{' '}
                  {formatDate(profileUser.joinDate || new Date().toISOString())}
                </div>
                <div className="profile-bio">{profileUser.bio || 'No bio added yet.'}</div>

                <div className="profile-meta">
                  {profileUser.location && <span>📍 {profileUser.location}</span>}
                  <span>⭐ {profileUser.reputation || '4.5'} reputation</span>
                  <span>🔥 {profileUser.streak || 0} day streak</span>
                </div>

                <div className="profile-stats">
                  <div>
                    <div className="profile-stat-value">{(profileUser.skillsTeach || []).length}</div>
                    <div className="profile-stat-label">Teaching</div>
                  </div>
                  <div>
                    <div className="profile-stat-value">{(profileUser.skillsLearn || []).length}</div>
                    <div className="profile-stat-label">Learning</div>
                  </div>
                  <div>
                    <div className="profile-stat-value">{profileUser.exchanges || 0}</div>
                    <div className="profile-stat-label">Exchanges</div>
                  </div>
                  <div>
                    <div className="profile-stat-value">{(profileUser.badges || []).length}</div>
                    <div className="profile-stat-label">Badges</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span className="streak-display">🔥 {profileUser.streak || 0} Day Streak</span>
                  {(profileUser.badges || []).slice(0, 3).map((b) => {
                    const ach = ACHIEVEMENTS.find((a) => a.id === b);
                    return ach ? (
                      <span key={ach.id} className="tag tag-primary">
                        {ach.icon} {ach.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Teaching & Learning Skills Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div className="card animate-in animate-delay-1">
                <h3 style={{ marginBottom: 16 }}>🎓 Skills I Teach</h3>
                {(profileUser.skillsTeach || []).length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {(profileUser.skillsTeach || []).map((s, idx) => (
                      <span key={idx} className="tag tag-primary">
                        {SKILL_ICONS[detectCategory(s)] || '⭐'} {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No teaching skills added yet.</p>
                )}
              </div>

              <div className="card animate-in animate-delay-2">
                <h3 style={{ marginBottom: 16 }}>📚 Skills I Want to Learn</h3>
                {(profileUser.skillsLearn || []).length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {(profileUser.skillsLearn || []).map((s, idx) => (
                      <span key={idx} className="tag tag-success">
                        {SKILL_ICONS[detectCategory(s)] || '⭐'} {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No learning goals added yet.</p>
                )}
              </div>
            </div>

            {/* Learning Progress */}
            {(profileUser.skillsLearn || []).length > 0 && (
              <div className="card animate-in animate-delay-3" style={{ marginBottom: 20 }}>
                <h3 style={{ marginBottom: 20 }}>📈 Learning Progress</h3>
                {(profileUser.skillsLearn || []).map((skill, i) => {
                  const progress = [35, 60, 80, 45, 70][i % 5];
                  return (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div className="progress-label">
                        <span>{skill}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Achievements */}
            <div className="card animate-in animate-delay-4">
              <h3 style={{ marginBottom: 20 }}>🏅 Achievements</h3>
              <div className="achievement-grid">
                {earnedBadges.map((a) => (
                  <div key={a.id} className="achievement-badge earned" title={a.desc}>
                    <span className="icon">{a.icon}</span>
                    <span className="name">{a.name}</span>
                  </div>
                ))}
                {unearnedBadges.slice(0, Math.max(0, 6 - earnedBadges.length)).map((a) => (
                  <div key={a.id} className="achievement-badge" title={a.desc} style={{ opacity: 0.4 }}>
                    <span className="icon" style={{ filter: 'grayscale(1)' }}>
                      {a.icon}
                    </span>
                    <span className="name">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="✏️ Edit Profile">
        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Your name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Bio / About</label>
            <textarea
              className="form-control"
              placeholder="Tell others about yourself..."
              rows={3}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <div className="form-control-icon">
              <span className="icon">📍</span>
              <input
                type="text"
                className="form-control"
                placeholder="City, Country"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Skills I Teach</label>
            <TagsInput
              tags={editTeach}
              onChange={setEditTeach}
              placeholder="Add skill and press Enter"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Skills I Want to Learn</label>
            <TagsInput
              tags={editLearn}
              onChange={setEditLearn}
              placeholder="Add skill and press Enter"
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes ✓'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
