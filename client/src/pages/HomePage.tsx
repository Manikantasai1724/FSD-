import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import api from '../services/api';
import type { User } from '../types';
import SkillCard from '../components/ui/SkillCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function HomePage() {
  const scrollRef = useScrollAnimation();
  const [users, setUsers] = useState<User[]>([]);
  const countersAnimated = useRef(false);
  const { isLoggedIn, user: currentUser } = useAuth();
  const toast = useToast();

  useEffect(() => {
    api.get('/users').then((res) => setUsers(res.data)).catch(() => {});
  }, []);

  // Counter animation
  useEffect(() => {
    if (countersAnimated.current) return;
    const counters = document.querySelectorAll('.hero-stat .number');
    if (counters.length === 0) return;
    countersAnimated.current = true;
    const targets = [2847, 12439, 4621, 98];
    counters.forEach((el, i) => {
      const target = targets[i];
      let start = 0;
      const step = target / (1500 / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        (el as HTMLElement).textContent = Math.floor(start).toLocaleString();
      }, 16);
    });
  }, []);

  // Featured skills
  const featured: { user: User; skill: string }[] = [];
  users.slice(0, 4).forEach((u) => {
    if (u.skillsTeach?.[0]) featured.push({ user: u, skill: u.skillsTeach[0] });
    if (u.skillsTeach?.[1]) featured.push({ user: u, skill: u.skillsTeach[1] });
  });

  const categories = [
    { icon: '💻', name: 'Technology', count: 234 },
    { icon: '🎨', name: 'Design', count: 187 },
    { icon: '🎵', name: 'Music', count: 143 },
    { icon: '🗣️', name: 'Languages', count: 209 },
    { icon: '📷', name: 'Photography', count: 98 },
    { icon: '🍳', name: 'Cooking', count: 121 },
    { icon: '💪', name: 'Fitness', count: 156 },
    { icon: '📝', name: 'Writing', count: 114 },
    { icon: '📣', name: 'Marketing', count: 89 },
    { icon: '💰', name: 'Finance', count: 76 },
  ];

  const handleRequestExchange = (userId: string, skill: string) => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    if (userId === currentUser?.id) {
      toast.warning('You cannot request an exchange with yourself.');
      return;
    }
    api.post('/requests', {
      toUserId: userId,
      skillRequested: skill,
      skillOffered: currentUser?.skillsTeach?.[0] || 'TBD',
    })
      .then(() => toast.success('Exchange request sent successfully! 🎉'))
      .catch((err) => toast.error(err.response?.data?.error || 'Failed to send request'));
  };

  return (
    <div ref={scrollRef}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot"></span>
              🚀 Now with AI-powered skill matching
            </div>
            <h1>
              Learn Skills.<br />
              <span className="gradient-text">Share Knowledge.</span>
              <br />
              Grow Together.
            </h1>
            <p>
              The peer-to-peer learning platform where you trade what you know for what you want to
              learn — completely free, forever.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">🚀 Start Learning Free</Link>
              <Link to="/explore" className="btn btn-secondary btn-lg">🔍 Explore Skills</Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="number">0</div>
                <div className="label">Active Learners</div>
              </div>
              <div className="hero-stat">
                <div className="number">0</div>
                <div className="label">Skills Shared</div>
              </div>
              <div className="hero-stat">
                <div className="number">0</div>
                <div className="label">Exchanges Made</div>
              </div>
              <div className="hero-stat">
                <div className="number">0</div>
                <div className="label">% Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="section-sm" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span className="caption" style={{ color: 'var(--text-muted)' }}>Trusted by learners worldwide</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', flexWrap: 'wrap', opacity: 0.5 }}>
            {['Harvard EDU', 'MIT Open', 'Google Dev', 'UNESCO', 'Coursera'].map((name) => (
              <span key={name} style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.125rem' }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-scroll">
            <span className="eyebrow">How It Works</span>
            <h2>Skill Exchange in <span className="gradient-text">3 Simple Steps</span></h2>
            <p>No money, no barriers. Just knowledge shared between passionate people.</p>
          </div>
          <div className="steps-grid">
            {[
              { num: 1, icon: '🧑‍💼', bg: 'rgba(79,70,229,0.1)', title: 'Create Your Profile', desc: 'Sign up and list the skills you can teach and the skills you want to learn. The more specific, the better!' },
              { num: 2, icon: '🎯', bg: 'rgba(236,72,153,0.1)', title: 'Get Matched', desc: 'Our AI algorithm finds people with complementary skills. When you can teach what they want and vice versa — it\'s a perfect match!' },
              { num: 3, icon: '📈', bg: 'rgba(16,185,129,0.1)', title: 'Exchange & Grow', desc: 'Connect with your matches, schedule sessions, track your progress, and build your reputation in the community.' },
            ].map((step) => (
              <div key={step.num} className="step-card animate-scroll">
                <div className="step-number">{step.num}</div>
                <div className="step-icon" style={{ background: step.bg }}>{step.icon}</div>
                <h3>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '10px' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header animate-scroll">
            <span className="eyebrow">Featured Skills</span>
            <h2>What People Are <span className="gradient-text">Teaching Today</span></h2>
            <p>Discover thousands of skills available for exchange right now.</p>
          </div>
          <div className="skills-grid">
            {featured.slice(0, 8).map(({ user, skill }, i) => (
              <SkillCard key={`${user.id}-${skill}-${i}`} user={user} skillName={skill} onRequestExchange={handleRequestExchange} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/explore" className="btn btn-secondary btn-lg">View All Skills →</Link>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-scroll">
            <span className="eyebrow">Browse by Category</span>
            <h2>Find Skills in Any <span className="gradient-text">Domain</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '16px' }}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/explore?cat=${encodeURIComponent(cat.name)}`}
                className="animate-scroll category-link"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                  padding: '20px 16px', background: 'var(--surface)', border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', textAlign: 'center', transition: 'var(--transition)',
                  textDecoration: 'none', color: 'var(--text-primary)',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(79,70,229,0.04)';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
                }}
              >
                <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{cat.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.count} skills</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header animate-scroll">
            <span className="eyebrow">Testimonials</span>
            <h2>What Our <span className="gradient-text">Community Says</span></h2>
          </div>
          <div className="testimonials-grid">
            {[
              { initials: 'MC', name: 'Marcus Chen', role: 'Guitarist & Developer', grad: 'linear-gradient(135deg,#4F46E5,#7C3AED)', quote: '"I learned Python in exchange for teaching guitar. The matching was spot-on and my partner was incredibly patient. Best learning experience I\'ve had!"' },
              { initials: 'SR', name: 'Sofia R.', role: 'UX Designer & Language Teacher', grad: 'linear-gradient(135deg,#EC4899,#F43F5E)', quote: '"The AI matching is brilliant. Within days of signing up, I had 3 perfect matches who wanted to exchange UX design for my Spanish teaching skills."' },
              { initials: 'JP', name: 'James Park', role: 'Fitness Coach & Photographer', grad: 'linear-gradient(135deg,#F59E0B,#EF4444)', quote: '"Finished 4 skill exchanges in my first month. The community is supportive, the platform is beautiful, and I\'ve genuinely learned more here than in paid courses."' },
            ].map((t) => (
              <div key={t.name} className="testimonial-card animate-scroll">
                <div className="stars">★★★★★</div>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <div className="avatar avatar-md" style={{ background: t.grad, color: 'white' }}>{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--gradient)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem,4vw,3rem)', color: 'white', marginBottom: '16px' }} className="animate-scroll">
            Ready to Start Your<br />Skill Exchange Journey?
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }} className="animate-scroll">
            Join thousands of learners and teachers. It's free, forever.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }} className="animate-scroll">
            <Link to="/login" style={{ background: 'white', color: 'var(--primary)' }} className="btn btn-lg">🚀 Create Free Account</Link>
            <Link to="/explore" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }} className="btn btn-lg">🔍 Browse Skills</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
