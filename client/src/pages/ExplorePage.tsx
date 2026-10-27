import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { User } from '../types';
import { detectCategory } from '../utils/helpers';
import SkillCard from '../components/ui/SkillCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  { label: 'All Skills', value: 'All' },
  { label: '💻 Technology', value: 'Technology' },
  { label: '🎨 Design', value: 'Design' },
  { label: '🎵 Music', value: 'Music' },
  { label: '🗣️ Languages', value: 'Language' },
  { label: '📷 Photography', value: 'Photography' },
  { label: '🍳 Cooking', value: 'Cooking' },
  { label: '💪 Fitness', value: 'Fitness' },
  { label: '📝 Writing', value: 'Writing' },
  { label: '📣 Marketing', value: 'Marketing' },
  { label: '💰 Finance', value: 'Finance' },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get('cat') || 'All'
  );
  const [sortBy, setSortBy] = useState<'reputation' | 'exchanges' | 'newest'>('reputation');

  const { user: currentUser, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users');
        setUsers(res.data);
      } catch {
        toast.error('Failed to load skills. Please check if the server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat });
    }
  };

  const handleRequestExchange = async (toUserId: string, skill: string) => {
    if (!isLoggedIn) {
      toast.warning('Please log in to request a skill exchange.');
      navigate('/login');
      return;
    }

    const currentId = currentUser?.id || currentUser?._id;
    if (toUserId === currentId) {
      toast.warning('You cannot request an exchange with yourself.');
      return;
    }

    try {
      const offered = currentUser?.skillsTeach?.[0] || 'General Skills';
      await api.post('/requests', {
        toUserId,
        skillRequested: skill,
        skillOffered: offered,
        message: `Hi! I'd love to exchange skills. I can teach you ${offered} in return.`,
      });
      toast.success('Exchange request sent successfully! 🎉');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send exchange request.');
    }
  };

  // Build flattened skill card items
  const skillCards = useMemo(() => {
    const currentId = currentUser?.id || currentUser?._id;
    let list: { user: User; skill: string }[] = [];

    users.forEach((u) => {
      const uId = u.id || u._id;
      if (currentId && uId === currentId) return;

      (u.skillsTeach || []).forEach((skill) => {
        const cat = detectCategory(skill);
        const matchCat = activeCategory === 'All' || cat.toLowerCase() === activeCategory.toLowerCase();
        const matchSearch =
          !searchQuery ||
          skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchCat && matchSearch) {
          list.push({ user: u, skill });
        }
      });
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'reputation') {
        return (b.user.reputation || 0) - (a.user.reputation || 0);
      }
      if (sortBy === 'exchanges') {
        return (b.user.exchanges || 0) - (a.user.exchanges || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.user.joinDate || 0).getTime() - new Date(a.user.joinDate || 0).getTime();
      }
      return 0;
    });

    return list;
  }, [users, currentUser, activeCategory, searchQuery, sortBy]);

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--gradient)', color: 'white', padding: '60px 0 40px' }}>
        <div className="container">
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Explore Skills
            </span>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.75rem,4vw,2.75rem)', margin: '12px 0 16px' }}>
              Find Your Next Skill to Learn
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 28 }}>
              Browse thousands of skills taught by real people. Request an exchange and start learning today.
            </p>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                id="skill-search"
                className="form-control"
                placeholder="Search skills, topics, or mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'white',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  padding: '14px 14px 14px 48px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  boxShadow: 'var(--shadow-lg)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 68,
          zIndex: 100,
        }}
      >
        <div className="container">
          <div className="filter-bar" style={{ overflowX: 'auto', flexWrap: 'nowrap', padding: '12px 0' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`filter-btn ${
                  activeCategory.toLowerCase() === cat.value.toLowerCase() ? 'active' : ''
                }`}
                onClick={() => handleCategoryClick(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <main style={{ padding: '40px 0 80px' }}>
        <div className="container">
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
            <div id="results-count" style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
              {loading
                ? 'Loading skills...'
                : `Showing ${skillCards.length} skill${skillCards.length !== 1 ? 's' : ''}`}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sort by:</span>
              <select
                className="form-control"
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{ width: 'auto', padding: '8px 12px', fontSize: '0.875rem' }}
              >
                <option value="reputation">Top Rated</option>
                <option value="exchanges">Most Exchanges</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="skills-grid" id="explore-grid">
            {loading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <div key={i} style={{ height: 220 }} className="card skeleton" />)
            ) : skillCards.length === 0 ? (
              <div style={{ gridColumn: '1 / -1' }} className="empty-state">
                <div className="icon">🔍</div>
                <h3>No skills found</h3>
                <p>Try a different search or category</p>
              </div>
            ) : (
              skillCards.map(({ user, skill }, i) => (
                <SkillCard
                  key={`${user.id || user._id}-${skill}-${i}`}
                  user={user}
                  skillName={skill}
                  onRequestExchange={handleRequestExchange}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
