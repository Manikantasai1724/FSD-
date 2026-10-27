import type { User } from '../../types';
import { detectCategory, getInitials } from '../../utils/helpers';
import { SKILL_ICONS, SKILL_BG_COLORS } from '../../utils/constants';

interface SkillCardProps {
  user: User;
  skillName: string;
  onRequestExchange: (userId: string, skill: string) => void;
}

function generateLevelDots(level: string) {
  const levels: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
  const filled = levels[level] || 2;
  return (
    <div className="skill-level">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`level-dot${i <= filled ? ' filled' : ''}`} />
      ))}
    </div>
  );
}

export default function SkillCard({ user, skillName, onRequestExchange }: SkillCardProps) {
  const colorIdx = Math.abs(
    skillName.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  ) % SKILL_BG_COLORS.length;
  const bgColor = SKILL_BG_COLORS[colorIdx];
  const category = detectCategory(skillName);
  const icon = SKILL_ICONS[category] || '⭐';

  return (
    <div className="skill-card animate-in">
      <div className="skill-card-header">
        <div className="skill-icon" style={{ background: bgColor }}>
          {icon}
        </div>
        <div className="skill-card-body">
          <div className="skill-card-name">{skillName}</div>
          <div className="skill-card-meta">
            <span>{user.name}</span>
            <span>·</span>
            {generateLevelDots(user.level || 'Intermediate')}
          </div>
        </div>
      </div>
      <div className="skill-card-tags">
        <span className="tag tag-primary">{category}</span>
        <span className="tag tag-muted">{user.level || 'Intermediate'}</span>
        {user.badges?.includes('verified') && <span className="tag tag-success">✅ Verified</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div className="avatar avatar-sm" style={{ background: 'var(--gradient)', color: 'white' }}>
          {getInitials(user.name)}
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ⭐ {user.reputation || '4.5'} · {user.exchanges || 0} exchanges
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary btn-sm"
        style={{ width: '100%' }}
        onClick={() => onRequestExchange(user.id || user._id || '', skillName)}
      >
        🔄 Request Exchange
      </button>
    </div>
  );
}
