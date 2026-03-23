/* ============================================
   SKILL EXCHANGE — Core JavaScript
   ============================================ */

'use strict';

// ── Constants ──
const STORAGE_KEYS = {
  USERS: 'se_users',
  CURRENT_USER: 'se_current_user',
  REQUESTS: 'se_requests',
  CHALLENGES: 'se_challenges',
  DISCUSSIONS: 'se_discussions',
  NOTIFICATIONS: 'se_notifications',
  THEME: 'se_theme'
};

const SKILL_CATEGORIES = [
  'Technology', 'Design', 'Business', 'Language', 'Music',
  'Art & Craft', 'Photography', 'Cooking', 'Fitness', 'Writing',
  'Marketing', 'Finance', 'Science', 'Teaching', 'Other'
];

const SKILL_ICONS = {
  'Technology': '💻', 'Design': '🎨', 'Business': '📊', 'Language': '🗣️',
  'Music': '🎵', 'Art & Craft': '✏️', 'Photography': '📷', 'Cooking': '🍳',
  'Fitness': '💪', 'Writing': '📝', 'Marketing': '📣', 'Finance': '💰',
  'Science': '🔬', 'Teaching': '📚', 'Other': '⭐'
};

const SKILL_BG_COLORS = [
  'rgba(79,70,229,0.1)', 'rgba(236,72,153,0.1)', 'rgba(245,158,11,0.1)',
  'rgba(16,185,129,0.1)', 'rgba(14,165,233,0.1)', 'rgba(168,85,247,0.1)',
  'rgba(239,68,68,0.1)', 'rgba(20,184,166,0.1)'
];

const ACHIEVEMENTS = [
  { id: 'first_exchange', icon: '🤝', name: 'First Exchange', desc: 'Complete your first skill exchange' },
  { id: 'teacher', icon: '🎓', name: 'Teacher', desc: 'Teach 5 skills' },
  { id: 'learner', icon: '📚', name: 'Learner', desc: 'Learn 5 skills' },
  { id: 'streak_7', icon: '🔥', name: '7 Day Streak', desc: 'Login 7 days in a row' },
  { id: 'top_rated', icon: '⭐', name: 'Top Rated', desc: 'Reach 4.5+ reputation' },
  { id: 'connector', icon: '🌐', name: 'Connector', desc: 'Make 10 connections' },
  { id: 'challenger', icon: '🏆', name: 'Challenger', desc: 'Complete 3 challenges' },
  { id: 'verified', icon: '✅', name: 'Verified', desc: 'Verify your profile' },
  { id: 'mentor', icon: '🌟', name: 'Mentor', desc: 'Help 10 learners' },
  { id: 'prolific', icon: '🚀', name: 'Prolific', desc: 'List 10+ skills' }
];

// ── Seed Data ──
const SEED_USERS = [
  {
    id: 'u1', name: 'Alex Chen', email: 'alex@example.com', password: 'pass123',
    bio: 'Full-stack developer and UI/UX enthusiast. Passionate about teaching Python and learning design.',
    skillsTeach: ['Python', 'React', 'Data Analysis', 'Machine Learning'],
    skillsLearn: ['UI/UX Design', 'Graphic Design', 'Photography'],
    reputation: 4.8, streak: 12, exchanges: 8, badges: ['first_exchange', 'teacher', 'streak_7'],
    joinDate: '2024-01-15', location: 'San Francisco, CA', category: 'Technology', level: 'Advanced'
  },
  {
    id: 'u2', name: 'Priya Sharma', email: 'priya@example.com', password: 'pass123',
    bio: 'UX Designer at a startup. Love helping others with design thinking and visual storytelling.',
    skillsTeach: ['UI/UX Design', 'Figma', 'Graphic Design', 'Brand Identity'],
    skillsLearn: ['Python', 'JavaScript', 'Data Analysis'],
    reputation: 4.9, streak: 21, exchanges: 15, badges: ['first_exchange', 'teacher', 'learner', 'top_rated'],
    joinDate: '2024-02-08', location: 'New York, NY', category: 'Design', level: 'Expert'
  },
  {
    id: 'u3', name: 'Marcus Johnson', email: 'marcus@example.com', password: 'pass123',
    bio: 'Guitarist and music producer. Also passionate about web development and language learning.',
    skillsTeach: ['Guitar', 'Music Theory', 'Audio Production'],
    skillsLearn: ['React', 'Node.js', 'Spanish'],
    reputation: 4.5, streak: 5, exchanges: 4, badges: ['first_exchange'],
    joinDate: '2024-03-20', location: 'Austin, TX', category: 'Music', level: 'Intermediate'
  },
  {
    id: 'u4', name: 'Sofia Rodriguez', email: 'sofia@example.com', password: 'pass123',
    bio: 'Spanish language teacher and passionate photographer. Helping the world connect through language.',
    skillsTeach: ['Spanish', 'French', 'Photography', 'Portrait Photography'],
    skillsLearn: ['Guitar', 'Cooking', 'Fitness Training'],
    reputation: 4.7, streak: 9, exchanges: 11, badges: ['first_exchange', 'teacher', 'connector'],
    joinDate: '2024-01-28', location: 'Miami, FL', category: 'Language', level: 'Expert'
  },
  {
    id: 'u5', name: 'James Park', email: 'james@example.com', password: 'pass123',
    bio: 'Fitness coach and nutrition expert. Let me help you transform your health!',
    skillsTeach: ['Fitness Training', 'Nutrition', 'Yoga', 'Meditation'],
    skillsLearn: ['Photography', 'Video Editing', 'Social Media Marketing'],
    reputation: 4.6, streak: 30, exchanges: 20, badges: ['first_exchange', 'teacher', 'learner', 'streak_7', 'mentor'],
    joinDate: '2023-12-05', location: 'Chicago, IL', category: 'Fitness', level: 'Expert'
  },
  {
    id: 'u6', name: 'Aisha Patel', email: 'aisha@example.com', password: 'pass123',
    bio: 'Marketing strategist who loves creative writing. Building brands, one story at a time.',
    skillsTeach: ['Content Marketing', 'SEO', 'Creative Writing', 'Social Media'],
    skillsLearn: ['UI/UX Design', 'Brand Identity', 'Video Production'],
    reputation: 4.4, streak: 7, exchanges: 6, badges: ['first_exchange', 'streak_7'],
    joinDate: '2024-04-10', location: 'Boston, MA', category: 'Marketing', level: 'Intermediate'
  },
  {
    id: 'u7', name: 'David Kim', email: 'david@example.com', password: 'pass123',
    bio: 'Chef turned cooking educator. Professional culinary skills made accessible for everyone.',
    skillsTeach: ['Cooking', 'Baking', 'Meal Prep', 'Korean Cuisine'],
    skillsLearn: ['Business Strategy', 'Finance', 'Marketing'],
    reputation: 4.9, streak: 14, exchanges: 17, badges: ['first_exchange', 'teacher', 'top_rated', 'mentor'],
    joinDate: '2024-02-14', location: 'Seattle, WA', category: 'Cooking', level: 'Expert'
  },
  {
    id: 'u8', name: 'Emma Wilson', email: 'emma@example.com', password: 'pass123',
    bio: 'Finance professional and artist. Balancing numbers and creativity every day.',
    skillsTeach: ['Personal Finance', 'Investing', 'Oil Painting', 'Watercolor'],
    skillsLearn: ['Cooking', 'Yoga', 'Meditation'],
    reputation: 4.3, streak: 3, exchanges: 3, badges: ['first_exchange'],
    joinDate: '2024-05-01', location: 'Denver, CO', category: 'Finance', level: 'Intermediate'
  }
];

const SEED_REQUESTS = [
  {
    id: 'r1', fromUserId: 'u2', toUserId: null,
    skillRequested: 'Python', skillOffered: 'UI/UX Design',
    status: 'incoming', date: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
    message: 'Hi! I noticed you teach Python. I can offer UX design sessions in return. Would love to connect!'
  },
  {
    id: 'r2', fromUserId: 'u4', toUserId: null,
    skillRequested: 'React', skillOffered: 'Spanish',
    status: 'incoming', date: new Date(Date.now() - 5*60*60*1000).toISOString(),
    message: 'Hola! I\'d love to exchange Spanish lessons for help with React. 1:1 sessions, flexible schedule.'
  },
  {
    id: 'r3', fromUserId: null, toUserId: 'u3',
    skillRequested: 'Guitar', skillOffered: 'Python',
    status: 'sent', date: new Date(Date.now() - 24*60*60*1000).toISOString(),
    message: 'I\'ve been wanting to learn guitar for years. I can teach Python in exchange!'
  },
  {
    id: 'r4', fromUserId: 'u5', toUserId: null,
    skillRequested: 'Photography', skillOffered: 'Fitness Training',
    status: 'accepted', date: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
    message: 'Would love to learn photography! Can offer personal training in return.'
  }
];

const SEED_CHALLENGES = [
  {
    id: 'c1', title: 'Build a Mini Website', category: 'Technology',
    description: 'Create a fully responsive landing page for a fictional product. Include hero section, features, and contact form.',
    deadline: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
    participants: 47, prize: '🏆 Featured on platform + 50 reputation points',
    difficulty: 'Intermediate', tags: ['HTML', 'CSS', 'JavaScript'],
    submissions: 23, votes: 156
  },
  {
    id: 'c2', title: 'Design a Brand Logo', category: 'Design',
    description: 'Create a modern logo for "GreenLeaf" — an eco-friendly sustainable products company.',
    deadline: new Date(Date.now() + 5*24*60*60*1000).toISOString(),
    participants: 34, prize: '🎨 Designer Badge + 40 reputation points',
    difficulty: 'Beginner', tags: ['Figma', 'Illustrator', 'Branding'],
    submissions: 18, votes: 89
  },
  {
    id: 'c3', title: '30-Day Fitness Challenge', category: 'Fitness',
    description: 'Complete a 30-day workout program. Document your journey and share progress photos.',
    deadline: new Date(Date.now() + 25*24*60*60*1000).toISOString(),
    participants: 89, prize: '💪 Fitness Champion Badge + 60 reputation points',
    difficulty: 'All Levels', tags: ['Fitness', 'Wellness', 'Consistency'],
    submissions: 45, votes: 234
  },
  {
    id: 'c4', title: 'Cook a Traditional Dish', category: 'Cooking',
    description: 'Cook an authentic dish from a culture different from your own and share the recipe and story.',
    deadline: new Date(Date.now() + 10*24*60*60*1000).toISOString(),
    participants: 62, prize: '👨‍🍳 Culinary Explorer Badge + 35 reputation points',
    difficulty: 'Beginner', tags: ['Cooking', 'Culture', 'Recipe'],
    submissions: 31, votes: 178
  }
];

const SEED_DISCUSSIONS = [
  {
    id: 'd1', authorId: 'u1', authorName: 'Alex Chen',
    title: 'Best resources for learning React in 2024?',
    content: 'Looking for recommendations on learning React. What courses or projects worked best for you?',
    votes: 24, comments: 12, date: new Date(Date.now() - 2*60*60*1000).toISOString(), category: 'Technology'
  },
  {
    id: 'd2', authorId: 'u2', authorName: 'Priya Sharma',
    title: 'Tips for making portfolio projects stand out',
    content: 'After reviewing many portfolios, I\'ve noticed what makes some stand out. Sharing my thoughts here.',
    votes: 45, comments: 19, date: new Date(Date.now() - 5*60*60*1000).toISOString(), category: 'Design'
  },
  {
    id: 'd3', authorId: 'u4', authorName: 'Sofia Rodriguez',
    title: 'Language exchange tips — what works best?',
    content: 'I\'ve been doing language exchanges for 3 years. Here are my top strategies for making it effective.',
    votes: 31, comments: 8, date: new Date(Date.now() - 24*60*60*1000).toISOString(), category: 'Language'
  },
  {
    id: 'd4', authorId: 'u7', authorName: 'David Kim',
    title: 'How to teach cooking online effectively',
    content: 'Sharing my experience setting up virtual cooking classes that actually work.',
    votes: 18, comments: 6, date: new Date(Date.now() - 48*60*60*1000).toISOString(), category: 'Cooking'
  }
];

// ── Storage Utilities ──
const Storage = {
  get: (key) => {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  },
  remove: (key) => localStorage.removeItem(key)
};

// ── Initialize App ──
function initApp() {
  // Seed data if first time
  if (!Storage.get(STORAGE_KEYS.USERS)) {
    Storage.set(STORAGE_KEYS.USERS, SEED_USERS);
  }
  if (!Storage.get(STORAGE_KEYS.CHALLENGES)) {
    Storage.set(STORAGE_KEYS.CHALLENGES, SEED_CHALLENGES);
  }
  if (!Storage.get(STORAGE_KEYS.DISCUSSIONS)) {
    Storage.set(STORAGE_KEYS.DISCUSSIONS, SEED_DISCUSSIONS);
  }

  // Apply saved theme
  const savedTheme = Storage.get(STORAGE_KEYS.THEME) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Update all theme toggles
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  });

  // Update nav based on auth state
  updateNavAuth();

  // Mobile nav
  setupMobileNav();
}

// ── Auth ──
const Auth = {
  currentUser: () => Storage.get(STORAGE_KEYS.CURRENT_USER),
  isLoggedIn: () => !!Storage.get(STORAGE_KEYS.CURRENT_USER),
  login: (email, password) => {
    const users = Storage.get(STORAGE_KEYS.USERS) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      // Update streak
      const today = new Date().toDateString();
      const lastLogin = user.lastLogin;
      if (lastLogin !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastLogin === yesterday) { user.streak = (user.streak || 0) + 1; }
        else if (!lastLogin) { user.streak = 1; }
        else { user.streak = 1; }
        user.lastLogin = today;
        // Update in storage
        const idx = users.findIndex(u => u.id === user.id);
        users[idx] = user;
        Storage.set(STORAGE_KEYS.USERS, users);
      }
      Storage.set(STORAGE_KEYS.CURRENT_USER, user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email or password' };
  },
  signup: (data) => {
    const users = Storage.get(STORAGE_KEYS.USERS) || [];
    if (users.find(u => u.email === data.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      id: 'u' + Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      bio: data.bio || '',
      skillsTeach: data.skillsTeach || [],
      skillsLearn: data.skillsLearn || [],
      reputation: 0,
      streak: 1,
      exchanges: 0,
      badges: [],
      joinDate: new Date().toISOString().split('T')[0],
      location: data.location || '',
      lastLogin: new Date().toDateString(),
      category: data.skillsTeach?.[0] ? 'Technology' : 'Other',
      level: 'Beginner'
    };
    users.push(newUser);
    Storage.set(STORAGE_KEYS.USERS, users);
    Storage.set(STORAGE_KEYS.CURRENT_USER, newUser);
    return { success: true, user: newUser };
  },
  logout: () => {
    Storage.remove(STORAGE_KEYS.CURRENT_USER);
    window.location.href = 'index.html';
  },
  requireAuth: () => {
    if (!Auth.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

// ── Theme Toggle ──
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  Storage.set(STORAGE_KEYS.THEME, next);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

// ── Nav Auth Update ──
function updateNavAuth() {
  const user = Auth.currentUser();
  const navActions = document.querySelectorAll('.navbar-actions');

  navActions.forEach(container => {
    const loginBtn = container.querySelector('.login-btn');
    const avatarEl = container.querySelector('.nav-avatar');

    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (avatarEl) {
        avatarEl.style.display = 'flex';
        avatarEl.textContent = user.name.charAt(0).toUpperCase();
        avatarEl.title = user.name;
        avatarEl.onclick = () => window.location.href = 'profile.html';
      }
    } else {
      if (loginBtn) loginBtn.style.display = '';
      if (avatarEl) avatarEl.style.display = 'none';
    }
  });
}

// ── Mobile Nav ──
function setupMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    mobileNav.style.display = 'flex';
  });

  // Close on link click
  mobileNav.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// ── Toast Notifications ──
const Toast = {
  container: null,
  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = 'info', duration = 3500) {
    if (!this.container) this.init();
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>
    `;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }, duration);
    return toast;
  },
  success: (msg, dur) => Toast.show(msg, 'success', dur),
  error: (msg, dur) => Toast.show(msg, 'error', dur),
  warning: (msg, dur) => Toast.show(msg, 'warning', dur),
  info: (msg, dur) => Toast.show(msg, 'info', dur)
};

// ── Modal ──
const Modal = {
  show(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('show'));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) Modal.hide(id);
    });
  },
  hide(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('show');
    setTimeout(() => overlay.style.display = 'none', 200);
  }
};

// ── Tags Input ──
function setupTagsInput(containerId, hiddenInputId) {
  const container = document.getElementById(containerId);
  const hiddenInput = document.getElementById(hiddenInputId);
  if (!container || !hiddenInput) return;

  const input = container.querySelector('input');
  let tags = [];

  function updateHidden() {
    hiddenInput.value = JSON.stringify(tags);
  }

  function addTag(val) {
    val = val.trim();
    if (!val || tags.includes(val)) return;
    tags.push(val);
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `${val}<button type="button" onclick="this.closest('.tag-chip').remove(); removeTag('${hiddenInputId}', '${val}')">×</button>`;
    container.insertBefore(chip, input);
    input.value = '';
    updateHidden();
  }

  input.addEventListener('keydown', (e) => {
    if (['Enter', ',', 'Tab'].includes(e.key)) {
      e.preventDefault();
      addTag(input.value);
    }
    if (e.key === 'Backspace' && !input.value && tags.length) {
      const last = container.querySelectorAll('.tag-chip');
      if (last.length) {
        const lastVal = tags[tags.length - 1];
        last[last.length - 1].remove();
        tags = tags.filter(t => t !== lastVal);
        updateHidden();
      }
    }
  });

  input.addEventListener('blur', () => { if (input.value) addTag(input.value); });

  // Public remove
  window[`removeTag_${hiddenInputId}`] = (val) => {
    tags = tags.filter(t => t !== val);
    updateHidden();
  };
  updateHidden();
  return { addTag, getTags: () => tags };
}

function removeTag(inputId, val) {
  const input = document.getElementById(inputId);
  if (!input) return;
  try {
    let tags = JSON.parse(input.value) || [];
    tags = tags.filter(t => t !== val);
    input.value = JSON.stringify(tags);
  } catch {}
}

// ── Skill Matching Algorithm ──
const SkillMatcher = {
  getScore(userA, userB) {
    if (!userA || !userB || userA.id === userB.id) return 0;

    const aTeach = (userA.skillsTeach || []).map(s => s.toLowerCase());
    const aLearn = (userA.skillsLearn || []).map(s => s.toLowerCase());
    const bTeach = (userB.skillsTeach || []).map(s => s.toLowerCase());
    const bLearn = (userB.skillsLearn || []).map(s => s.toLowerCase());

    let score = 0;

    // A teaches what B wants
    aTeach.forEach(skill => { if (bLearn.some(s => s.includes(skill) || skill.includes(s))) score += 50; });
    // B teaches what A wants
    bTeach.forEach(skill => { if (aLearn.some(s => s.includes(skill) || skill.includes(s))) score += 50; });

    // Reputation bonus
    score += Math.round((userB.reputation || 0) * 5);

    return Math.min(score, 100);
  },

  findMatches(currentUser, users) {
    if (!currentUser) return [];
    return users
      .filter(u => u.id !== currentUser.id)
      .map(u => ({ user: u, score: this.getScore(currentUser, u) }))
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score);
  }
};

// ── Skill Card Generator ──
function createSkillCard(user, skillName, options = {}) {
  const colorIdx = Math.abs(skillName.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % SKILL_BG_COLORS.length;
  const bgColor = SKILL_BG_COLORS[colorIdx];
  const category = detectCategory(skillName);
  const icon = SKILL_ICONS[category] || '⭐';
  const levelDots = generateLevelDots(user.level || 'Intermediate');
  const currentUser = Auth.currentUser();

  return `
    <div class="skill-card animate-in">
      <div class="skill-card-header">
        <div class="skill-icon" style="background:${bgColor}">${icon}</div>
        <div class="skill-card-body">
          <div class="skill-card-name">${skillName}</div>
          <div class="skill-card-meta">
            <span>${user.name}</span>
            <span>·</span>
            <div class="skill-level">${levelDots}</div>
          </div>
        </div>
      </div>
      <div class="skill-card-tags">
        <span class="tag tag-primary">${category}</span>
        <span class="tag tag-muted">${user.level || 'Intermediate'}</span>
        ${user.badges && user.badges.includes('verified') ? '<span class="tag tag-success">✅ Verified</span>' : ''}
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div class="avatar avatar-sm" style="background:var(--gradient);color:white;">${user.name.charAt(0)}</div>
        <div>
          <div style="font-size:0.875rem;font-weight:600;">${user.name}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">⭐ ${user.reputation || '4.5'} · ${user.exchanges || 0} exchanges</div>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" style="width:100%;" onclick="requestExchange('${user.id}', '${skillName}', '${options.currentSkill || ''}')">
        🔄 Request Exchange
      </button>
    </div>
  `;
}

function generateLevelDots(level) {
  const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
  const filled = levels[level] || 2;
  let dots = '';
  for (let i = 1; i <= 4; i++) {
    dots += `<div class="level-dot ${i <= filled ? 'filled' : ''}"></div>`;
  }
  return dots;
}

function detectCategory(skillName) {
  const skill = skillName.toLowerCase();
  if (/python|javascript|react|node|css|html|coding|programming|data|machine|web|app|sql|java|swift/.test(skill)) return 'Technology';
  if (/design|figma|photoshop|ux|ui|illustrator|sketch|logo|brand|graphic/.test(skill)) return 'Design';
  if (/guitar|piano|music|violin|drum|bass|sing|audio|beat|producer/.test(skill)) return 'Music';
  if (/spanish|french|english|mandarin|japanese|german|italian|language/.test(skill)) return 'Language';
  if (/photo|portrait|landscape|camera|lightroom|editing/.test(skill)) return 'Photography';
  if (/cook|bake|chef|recipe|meal|culinary|food/.test(skill)) return 'Cooking';
  if (/fitness|yoga|gym|workout|nutrition|health|pilates|meditation/.test(skill)) return 'Fitness';
  if (/write|blog|copywrite|content|journalism|novel|story/.test(skill)) return 'Writing';
  if (/market|seo|social media|advertis|brand/.test(skill)) return 'Marketing';
  if (/finance|invest|budget|accounting|stock|trading/.test(skill)) return 'Finance';
  if (/paint|draw|sketch|sculpt|craft|ceramics|art/.test(skill)) return 'Art & Craft';
  return 'Other';
}

// ── Request Exchange ──
function requestExchange(toUserId, skillRequested, skillOffered) {
  if (!Auth.requireAuth()) return;

  const currentUser = Auth.currentUser();
  if (toUserId === currentUser.id) {
    Toast.warning('You cannot request an exchange with yourself.');
    return;
  }

  const requests = Storage.get(STORAGE_KEYS.REQUESTS) || [];
  const existing = requests.find(r =>
    r.fromUserId === currentUser.id && r.toUserId === toUserId &&
    r.skillRequested === skillRequested && r.status !== 'rejected'
  );

  if (existing) {
    Toast.warning('You already have a pending request for this skill.');
    return;
  }

  const newRequest = {
    id: 'r' + Date.now(),
    fromUserId: currentUser.id,
    toUserId,
    skillRequested,
    skillOffered: skillOffered || (currentUser.skillsTeach?.[0] || 'TBD'),
    status: 'sent',
    date: new Date().toISOString(),
    message: `Hi! I'd love to exchange skills. I'll teach you ${skillOffered || currentUser.skillsTeach?.[0] || 'my skills'} in return.`
  };

  requests.push(newRequest);
  Storage.set(STORAGE_KEYS.REQUESTS, requests);

  Toast.success('Exchange request sent successfully! 🎉');

  // Add notification
  addNotification(`New exchange request sent to ${getUserById(toUserId)?.name || 'a user'}`, 'request');
}

// ── Notifications ──
function addNotification(message, type = 'info') {
  const notifications = Storage.get(STORAGE_KEYS.NOTIFICATIONS) || [];
  notifications.unshift({
    id: 'n' + Date.now(),
    message,
    type,
    date: new Date().toISOString(),
    read: false
  });
  Storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications.slice(0, 50));
}

function getUnreadCount() {
  const notifications = Storage.get(STORAGE_KEYS.NOTIFICATIONS) || [];
  return notifications.filter(n => !n.read).length;
}

// ── Helpers ──
function getUserById(id) {
  const users = Storage.get(STORAGE_KEYS.USERS) || [];
  return users.find(u => u.id === id);
}

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getUserGradient(userId) {
  const gradients = [
    'linear-gradient(135deg,#4F46E5,#7C3AED)',
    'linear-gradient(135deg,#EC4899,#F43F5E)',
    'linear-gradient(135deg,#0EA5E9,#6366F1)',
    'linear-gradient(135deg,#F59E0B,#EF4444)',
    'linear-gradient(135deg,#10B981,#0EA5E9)',
    'linear-gradient(135deg,#8B5CF6,#EC4899)',
    'linear-gradient(135deg,#F97316,#EAB308)',
    'linear-gradient(135deg,#06B6D4,#8B5CF6)',
  ];
  const idx = parseInt(userId.replace(/\D/g, '')) % gradients.length || 0;
  return gradients[idx];
}

// ── Tabs ──
function setupTabs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const btns = container.querySelectorAll('.tab-btn');
  const contents = container.querySelectorAll('.tab-content');

  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      if (contents[i]) contents[i].classList.add('active');
    });
  });
}

// ── Scroll Animations ──
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ── Counter Animation ──
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

// ── Progress Bar Animation ──
function animateProgress(el, targetPercent) {
  setTimeout(() => {
    el.style.width = targetPercent + '%';
  }, 200);
}

// ── Search & Filter ──
function setupSearch(inputId, containerId, filterFn) {
  const input = document.getElementById(inputId);
  const container = document.getElementById(containerId);
  if (!input || !container) return;

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => filterFn(input.value.trim().toLowerCase()), 200);
  });
}

// ── Explore Page ──
function initExplorePage() {
  if (!document.getElementById('explore-grid')) return;

  const users = Storage.get(STORAGE_KEYS.USERS) || [];
  const currentUser = Auth.currentUser();
  let activeCategory = 'All';
  let searchQuery = '';

  function renderCards() {
    const grid = document.getElementById('explore-grid');
    let cards = [];

    users.forEach(user => {
      if (currentUser && user.id === currentUser.id) return;
      (user.skillsTeach || []).forEach(skill => {
        const matchCat = activeCategory === 'All' || detectCategory(skill) === activeCategory;
        const matchSearch = !searchQuery ||
          skill.toLowerCase().includes(searchQuery) ||
          user.name.toLowerCase().includes(searchQuery) ||
          detectCategory(skill).toLowerCase().includes(searchQuery);

        if (matchCat && matchSearch) {
          cards.push({ user, skill });
        }
      });
    });

    if (cards.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;" class="empty-state">
          <div class="icon">🔍</div>
          <h3>No skills found</h3>
          <p>Try a different search or category</p>
        </div>`;
      return;
    }

    grid.innerHTML = cards.map(({ user, skill }) => createSkillCard(user, skill)).join('');
  }

  // Category filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category || 'All';
      renderCards();
    });
  });

  // Search
  setupSearch('skill-search', 'explore-grid', (q) => {
    searchQuery = q;
    renderCards();
  });

  renderCards();
}

// ── Match Page ──
function initMatchPage() {
  const container = document.getElementById('match-container');
  if (!container) return;

  if (!Auth.isLoggedIn()) {
    container.innerHTML = `<div class="empty-state"><div class="icon">🔒</div><h3>Login to see your matches</h3><p>Create an account to find your perfect skill exchange partners</p><a href="login.html" class="btn btn-primary">Get Started</a></div>`;
    return;
  }

  const currentUser = Auth.currentUser();
  const users = Storage.get(STORAGE_KEYS.USERS) || [];
  const matches = SkillMatcher.findMatches(currentUser, users);

  if (matches.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">💔</div><h3>No matches yet</h3><p>Add more skills to your profile to find better matches</p><a href="profile.html" class="btn btn-primary">Update Profile</a></div>`;
    return;
  }

  container.innerHTML = `
    <div class="section-header">
      <span class="eyebrow">🎯 AI-Powered Matching</span>
      <h2>Your Skill Matches</h2>
      <p>Based on your skills, here are your best exchange partners</p>
    </div>
    <div class="skills-grid">
      ${matches.slice(0, 12).map(({ user, score }) => `
        <div class="match-card animate-in ${score >= 80 ? 'glow-ring' : ''}">
          <div class="match-score">${score}%</div>
          <div class="avatar avatar-xl" style="background:${getUserGradient(user.id)};color:white;margin:0 auto 12px;">${getInitials(user.name)}</div>
          <div class="match-name">${user.name}</div>
          <div class="match-label">⭐ ${user.reputation} · ${user.exchanges} exchanges</div>
          <div style="margin:14px 0;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">
            ${(user.skillsTeach || []).slice(0, 3).map(s => `<span class="tag tag-primary">${s}</span>`).join('')}
          </div>
          ${score >= 80 ? '<div class="badge badge-success" style="margin-bottom:12px;">🎯 Perfect Match!</div>' : ''}
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:8px;">
            <button class="btn btn-sm btn-secondary" onclick="viewProfile('${user.id}')">View Profile</button>
            <button class="btn btn-sm btn-primary" onclick="requestExchange('${user.id}', '${(user.skillsTeach || [])[0] || ''}', '${(currentUser.skillsTeach || [])[0] || ''}')">Connect 🔄</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function viewProfile(userId) {
  window.location.href = `profile.html?user=${userId}`;
}

// ── Requests Page ──
function initRequestsPage() {
  const container = document.getElementById('requests-container');
  if (!container) return;

  if (!Auth.requireAuth()) return;

  const currentUser = Auth.currentUser();
  const allRequests = Storage.get(STORAGE_KEYS.REQUESTS) || [];

  // Filter
  const incoming = allRequests.filter(r => r.toUserId === null || r.toUserId === currentUser.id).filter(r => r.status === 'incoming' || r.fromUserId !== currentUser.id);
  const sent = allRequests.filter(r => r.fromUserId === currentUser.id && r.status === 'sent');
  const accepted = allRequests.filter(r => (r.fromUserId === currentUser.id || r.toUserId === currentUser.id) && r.status === 'accepted');

  function renderRequest(req, type) {
    const fromUser = getUserById(req.fromUserId) || { name: 'Unknown', id: req.fromUserId };
    const toUser = getUserById(req.toUserId) || { name: 'Unknown' };
    const displayUser = type === 'sent' ? toUser : fromUser;

    return `
      <div class="request-card animate-in" id="req-${req.id}">
        <div class="avatar avatar-md" style="background:${getUserGradient(fromUser.id)};color:white;flex-shrink:0;">${getInitials(fromUser.name)}</div>
        <div class="request-info">
          <div style="font-weight:700;margin-bottom:4px;">${displayUser.name}</div>
          <div class="request-skills">
            <span class="tag tag-primary">Wants: ${req.skillRequested}</span>
            <span class="request-arrow">⇄</span>
            <span class="tag tag-success">Offers: ${req.skillOffered}</span>
          </div>
          <div style="font-size:0.8125rem;color:var(--text-muted);">${timeAgo(req.date)} · "${req.message?.slice(0, 60)}${req.message?.length > 60 ? '...' : ''}"</div>
        </div>
        <div class="request-actions">
          ${type === 'incoming' ? `
            <button class="btn btn-sm btn-success" onclick="acceptRequest('${req.id}')">✓ Accept</button>
            <button class="btn btn-sm btn-danger" onclick="rejectRequest('${req.id}')">✕ Decline</button>
          ` : type === 'sent' ? `
            <span class="badge badge-warning">Pending</span>
          ` : `
            <span class="badge badge-success">✓ Active</span>
          `}
        </div>
      </div>
    `;
  }

  const incomingHTML = incoming.length
    ? incoming.map(r => renderRequest(r, 'incoming')).join('')
    : `<div class="empty-state"><div class="icon">📭</div><h3>No incoming requests</h3><p>When someone requests a skill exchange with you, it'll appear here</p></div>`;

  const sentHTML = sent.length
    ? sent.map(r => renderRequest(r, 'sent')).join('')
    : `<div class="empty-state"><div class="icon">📤</div><h3>No sent requests</h3><p>Start exploring skills and send your first request</p><a href="explore.html" class="btn btn-primary btn-sm">Explore Skills</a></div>`;

  const acceptedHTML = accepted.length
    ? accepted.map(r => renderRequest(r, 'accepted')).join('')
    : `<div class="empty-state"><div class="icon">🤝</div><h3>No active exchanges yet</h3><p>Accept requests or get your requests accepted to start learning</p></div>`;

  container.innerHTML = `
    <div id="requests-tabs">
      <div class="tabs">
        <button class="tab-btn active" data-tab="0">📥 Incoming <span class="badge badge-danger">${incoming.length}</span></button>
        <button class="tab-btn" data-tab="1">📤 Sent <span class="badge badge-warning">${sent.length}</span></button>
        <button class="tab-btn" data-tab="2">✅ Active <span class="badge badge-success">${accepted.length}</span></button>
      </div>
      <div class="tab-content active"><div style="display:flex;flex-direction:column;gap:12px;">${incomingHTML}</div></div>
      <div class="tab-content"><div style="display:flex;flex-direction:column;gap:12px;">${sentHTML}</div></div>
      <div class="tab-content"><div style="display:flex;flex-direction:column;gap:12px;">${acceptedHTML}</div></div>
    </div>
  `;

  setupTabs('requests-tabs');
}

function acceptRequest(requestId) {
  const requests = Storage.get(STORAGE_KEYS.REQUESTS) || [];
  const req = requests.find(r => r.id === requestId);
  if (!req) return;
  req.status = 'accepted';
  Storage.set(STORAGE_KEYS.REQUESTS, requests);

  const fromUser = getUserById(req.fromUserId);
  Toast.success(`Exchange with ${fromUser?.name || 'user'} accepted! 🎉`);
  addNotification(`You accepted a skill exchange with ${fromUser?.name || 'a user'}`, 'success');
  setTimeout(() => initRequestsPage(), 500);
}

function rejectRequest(requestId) {
  const requests = Storage.get(STORAGE_KEYS.REQUESTS) || [];
  const idx = requests.findIndex(r => r.id === requestId);
  if (idx > -1) { requests[idx].status = 'rejected'; Storage.set(STORAGE_KEYS.REQUESTS, requests); }
  Toast.info('Request declined.');
  setTimeout(() => initRequestsPage(), 500);
}

// ── Dashboard Page ──
function initDashboardPage() {
  if (!document.getElementById('dashboard-content')) return;
  if (!Auth.requireAuth()) return;

  const currentUser = Auth.currentUser();
  const requests = Storage.get(STORAGE_KEYS.REQUESTS) || [];
  const accepted = requests.filter(r =>
    (r.fromUserId === currentUser.id || r.toUserId === currentUser.id) && r.status === 'accepted'
  );

  const progressData = (currentUser.skillsLearn || []).map(skill => ({
    skill,
    progress: Math.floor(Math.random() * 60) + 20
  }));

  const notifications = Storage.get(STORAGE_KEYS.NOTIFICATIONS) || [];

  document.getElementById('dashboard-content').innerHTML = `
    <div class="stats-grid">
      ${[
        { icon: '🔄', label: 'Active Exchanges', value: accepted.length, change: '+2 this week', up: true },
        { icon: '⭐', label: 'Reputation Score', value: currentUser.reputation || '0', change: '+0.2 this month', up: true },
        { icon: '🔥', label: 'Day Streak', value: currentUser.streak || 0, change: 'Keep it up!', up: true },
        { icon: '📚', label: 'Skills Learning', value: (currentUser.skillsLearn || []).length, change: currentUser.skillsTeach?.length + ' teaching', up: false },
      ].map(s => `
        <div class="stat-card animate-in">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:1.75rem;">${s.icon}</span>
          </div>
          <div class="stat-card-value">${s.value}</div>
          <div class="stat-card-label">${s.label}</div>
          <div class="stat-card-change ${s.up ? 'change-up' : ''}">${s.change}</div>
        </div>
      `).join('')}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:8px;">
      <div class="card">
        <h3 style="margin-bottom:20px;">📈 Learning Progress</h3>
        ${progressData.length ? progressData.map(p => `
          <div style="margin-bottom:18px;">
            <div class="progress-label"><span>${p.skill}</span><span>${p.progress}%</span></div>
            <div class="progress-bar"><div class="progress-fill" data-target="${p.progress}" style="width:0%"></div></div>
          </div>
        `).join('') : '<div class="empty-state" style="padding:24px;"><div class="icon">📚</div><p>Add skills you want to learn</p><a href="profile.html" class="btn btn-primary btn-sm">Update Profile</a></div>'}
      </div>

      <div class="card">
        <h3 style="margin-bottom:20px;">🔔 Recent Notifications</h3>
        ${notifications.slice(0, 5).map(n => `
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);">
            <span style="font-size:1.25rem;">${n.type === 'success' ? '✅' : n.type === 'request' ? '📨' : 'ℹ️'}</span>
            <div>
              <div style="font-size:0.875rem;font-weight:500;">${n.message}</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">${timeAgo(n.date)}</div>
            </div>
          </div>
        `).join('') || '<div style="text-align:center;padding:20px;color:var(--text-muted);">No notifications yet</div>'}
      </div>
    </div>

    <div style="margin-top:24px;" class="card">
      <h3 style="margin-bottom:20px;">🤝 Active Exchanges</h3>
      ${accepted.length ? `<div style="display:flex;flex-direction:column;gap:12px;">
        ${accepted.map(r => {
          const partner = getUserById(r.fromUserId === currentUser.id ? r.toUserId : r.fromUserId);
          return partner ? `
            <div style="display:flex;align-items:center;gap:14px;padding:14px;background:var(--surface-2);border-radius:var(--radius);">
              <div class="avatar avatar-md" style="background:${getUserGradient(partner.id)};color:white;">${getInitials(partner.name)}</div>
              <div style="flex:1;">
                <div style="font-weight:700;">${partner.name}</div>
                <div style="font-size:0.8125rem;color:var(--text-muted);">Teaching: ${r.skillOffered} · Learning: ${r.skillRequested}</div>
              </div>
              <span class="badge badge-success">Active</span>
            </div>
          ` : '';
        }).join('')}
      </div>` : `<div class="empty-state" style="padding:24px;"><div class="icon">🤝</div><h3>No active exchanges</h3><p>Start by exploring skills or checking your matches</p><div style="display:flex;gap:10px;justify-content:center;"><a href="explore.html" class="btn btn-primary btn-sm">Explore</a><a href="match.html" class="btn btn-secondary btn-sm">Find Matches</a></div></div>`}
    </div>
  `;

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll('.progress-fill').forEach(el => {
      animateProgress(el, parseInt(el.dataset.target || 0));
    });
  }, 300);
}

// ── Profile Page ──
function initProfilePage() {
  const profileContent = document.getElementById('profile-content');
  if (!profileContent) return;

  const urlParams = new URLSearchParams(window.location.search);
  const viewingId = urlParams.get('user');
  const currentUser = Auth.currentUser();
  const user = viewingId ? getUserById(viewingId) : currentUser;

  if (!user) {
    if (!Auth.isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }
    profileContent.innerHTML = '<div class="empty-state"><div class="icon">❓</div><h3>User not found</h3></div>';
    return;
  }

  const isOwnProfile = !viewingId || viewingId === currentUser?.id;
  const earned = ACHIEVEMENTS.filter(a => (user.badges || []).includes(a.id));
  const unearned = ACHIEVEMENTS.filter(a => !(user.badges || []).includes(a.id));

  profileContent.innerHTML = `
    <div class="profile-header-card animate-in">
      <div class="profile-cover" style="background:${getUserGradient(user.id)};">
        ${isOwnProfile ? '<button class="profile-cover-edit" onclick="Toast.info(\'Cover editing coming soon!\')">✏️</button>' : ''}
      </div>
      <div class="profile-body">
        <div class="profile-avatar-wrap">
          <div class="profile-avatar" style="background:${getUserGradient(user.id)};">${getInitials(user.name)}</div>
          ${isOwnProfile ? '<button class="btn btn-secondary btn-sm" onclick="Modal.show(\'edit-profile-modal\')">✏️ Edit Profile</button>' : `<button class="btn btn-primary btn-sm" onclick="requestExchange('${user.id}', '${user.skillsTeach?.[0] || ''}', '${currentUser?.skillsTeach?.[0] || ''}')">🔄 Request Exchange</button>`}
        </div>
        <div class="profile-name">${user.name} ${(user.badges || []).includes('verified') ? '<span class="verified">✅</span>' : ''}</div>
        <div class="profile-handle">@${user.name.toLowerCase().replace(/\s/g, '_')} · Joined ${formatDate(user.joinDate)}</div>
        <div class="profile-bio">${user.bio || 'No bio added yet.'}</div>
        <div class="profile-meta">
          ${user.location ? `<span>📍 ${user.location}</span>` : ''}
          <span>⭐ ${user.reputation || 0} reputation</span>
          <span>🔥 ${user.streak || 0} day streak</span>
        </div>
        <div class="profile-stats">
          <div><div class="profile-stat-value">${(user.skillsTeach || []).length}</div><div class="profile-stat-label">Teaching</div></div>
          <div><div class="profile-stat-value">${(user.skillsLearn || []).length}</div><div class="profile-stat-label">Learning</div></div>
          <div><div class="profile-stat-value">${user.exchanges || 0}</div><div class="profile-stat-label">Exchanges</div></div>
          <div><div class="profile-stat-value">${(user.badges || []).length}</div><div class="profile-stat-label">Badges</div></div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <span class="streak-display">🔥 ${user.streak || 0} Day Streak</span>
          ${(user.badges || []).slice(0, 3).map(b => {
            const ach = ACHIEVEMENTS.find(a => a.id === b);
            return ach ? `<span class="tag tag-primary">${ach.icon} ${ach.name}</span>` : '';
          }).join('')}
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
      <div class="card animate-in animate-delay-1">
        <h3 style="margin-bottom:16px;">🎓 Skills I Teach</h3>
        ${(user.skillsTeach || []).length ? `<div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${(user.skillsTeach || []).map(s => `<span class="tag tag-primary">${SKILL_ICONS[detectCategory(s)] || '⭐'} ${s}</span>`).join('')}
        </div>` : '<p style="color:var(--text-muted);">No teaching skills added yet.</p>'}
      </div>
      <div class="card animate-in animate-delay-2">
        <h3 style="margin-bottom:16px;">📚 Skills I Want to Learn</h3>
        ${(user.skillsLearn || []).length ? `<div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${(user.skillsLearn || []).map(s => `<span class="tag tag-success">${SKILL_ICONS[detectCategory(s)] || '⭐'} ${s}</span>`).join('')}
        </div>` : '<p style="color:var(--text-muted);">No learning goals added yet.</p>'}
      </div>
    </div>

    ${user.skillsLearn?.length ? `
    <div class="card animate-in animate-delay-3" style="margin-bottom:20px;">
      <h3 style="margin-bottom:20px;">📈 Learning Progress</h3>
      ${(user.skillsLearn || []).map((skill, i) => {
        const progress = [35, 60, 80, 45, 70][i % 5];
        return `<div style="margin-bottom:16px;">
          <div class="progress-label"><span>${skill}</span><span>${progress}%</span></div>
          <div class="progress-bar"><div class="progress-fill" data-target="${progress}" style="width:0%"></div></div>
        </div>`;
      }).join('')}
    </div>` : ''}

    <div class="card animate-in animate-delay-4">
      <h3 style="margin-bottom:20px;">🏅 Achievements</h3>
      <div class="achievement-grid">
        ${[...earned.map(a => `
          <div class="achievement-badge earned" title="${a.desc}">
            <span class="icon">${a.icon}</span>
            <span class="name">${a.name}</span>
          </div>
        `), ...unearned.slice(0, 6 - earned.length).map(a => `
          <div class="achievement-badge" title="${a.desc}" style="opacity:0.4;">
            <span class="icon" style="filter:grayscale(1);">${a.icon}</span>
            <span class="name">${a.name}</span>
          </div>
        `)].join('')}
      </div>
    </div>
  `;

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll('.progress-fill').forEach(el => {
      animateProgress(el, parseInt(el.dataset.target || 0));
    });
  }, 500);
}

// ── Community Page ──
function initCommunityPage() {
  const challengeGrid = document.getElementById('challenge-grid');
  const leaderboardList = document.getElementById('leaderboard-list');
  const discussionList = document.getElementById('discussion-list');

  if (challengeGrid) {
    const challenges = Storage.get(STORAGE_KEYS.CHALLENGES) || [];
    challengeGrid.innerHTML = challenges.map(c => `
      <div class="challenge-card animate-in">
        <div class="challenge-header">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
            <div>
              <span class="tag tag-primary" style="margin-bottom:10px;display:inline-flex;">${c.category}</span>
              <h3>${c.title}</h3>
            </div>
            <span class="tag ${c.difficulty === 'Beginner' ? 'tag-success' : c.difficulty === 'Intermediate' ? 'tag-warning' : 'tag-primary'}">${c.difficulty}</span>
          </div>
        </div>
        <div class="challenge-body">
          <p style="color:var(--text-secondary);font-size:0.9375rem;line-height:1.6;margin-bottom:12px;">${c.description}</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
            ${c.tags.map(t => `<span class="tag tag-muted">#${t}</span>`).join('')}
          </div>
          <div style="font-size:0.875rem;color:var(--text-muted);">
            🏆 ${c.prize}
          </div>
        </div>
        <div class="challenge-footer">
          <div style="font-size:0.8125rem;color:var(--text-muted);">
            👥 ${c.participants} joined · 📋 ${c.submissions} submissions · ⏰ ${daysUntil(c.deadline)}d left
          </div>
          <button class="btn btn-primary btn-sm" onclick="joinChallenge('${c.id}')">Join Challenge</button>
        </div>
      </div>
    `).join('');
  }

  if (leaderboardList) {
    const users = Storage.get(STORAGE_KEYS.USERS) || [];
    const sorted = [...users].sort((a, b) => (b.exchanges || 0) - (a.exchanges || 0));
    leaderboardList.innerHTML = sorted.slice(0, 8).map((user, i) => `
      <div class="leaderboard-item">
        <div class="leaderboard-rank rank-${i + 1}">${i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</div>
        <div class="avatar avatar-sm" style="background:${getUserGradient(user.id)};color:white;">${getInitials(user.name)}</div>
        <div style="flex:1;">
          <div style="font-weight:600;font-size:0.9375rem;">${user.name}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">🔥 ${user.streak}d · ⭐ ${user.reputation}</div>
        </div>
        <div class="leaderboard-points">${(user.exchanges || 0) * 10 + Math.round((user.reputation || 0) * 20)}pts</div>
      </div>
    `).join('');
  }

  if (discussionList) {
    const discussions = Storage.get(STORAGE_KEYS.DISCUSSIONS) || [];
    discussionList.innerHTML = discussions.map(d => `
      <div class="discussion-card animate-in">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <div class="avatar avatar-md" style="background:${getUserGradient(d.authorId)};color:white;flex-shrink:0;">${getInitials(d.authorName)}</div>
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">
              <span style="font-weight:700;">${d.authorName}</span>
              <span class="tag tag-muted">${d.category}</span>
              <span style="font-size:0.75rem;color:var(--text-muted);margin-left:auto;">${timeAgo(d.date)}</span>
            </div>
            <h4 style="margin-bottom:6px;font-size:1rem;">${d.title}</h4>
            <p style="font-size:0.875rem;color:var(--text-secondary);">${d.content.slice(0, 120)}...</p>
            <div style="display:flex;gap:16px;margin-top:12px;font-size:0.8125rem;color:var(--text-muted);">
              <button onclick="upvoteDiscussion('${d.id}')" style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:0.8125rem;" class="flex-center" style="gap:4px;">👍 ${d.votes}</button>
              <span>💬 ${d.comments} comments</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function joinChallenge(challengeId) {
  if (!Auth.isLoggedIn()) { window.location.href = 'login.html'; return; }
  Toast.success('You\'ve joined the challenge! Good luck! 🏆');
  addNotification('You joined a community challenge!', 'success');
}

function upvoteDiscussion(discussionId) {
  const discussions = Storage.get(STORAGE_KEYS.DISCUSSIONS) || [];
  const d = discussions.find(d => d.id === discussionId);
  if (d) { d.votes++; Storage.set(STORAGE_KEYS.DISCUSSIONS, discussions); Toast.success('Upvoted! 👍'); initCommunityPage(); }
}

// ── Auth Page ──
function initAuthPage() {
  if (!document.getElementById('auth-tabs')) return;

  // Switch tabs
  document.querySelectorAll('.auth-tab').forEach((tab, i) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.auth-form-panel').forEach((p, j) => {
        p.style.display = j === i ? 'block' : 'none';
      });
    });
  });

  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const result = Auth.login(email, password);
      if (result.success) {
        Toast.success(`Welcome back, ${result.user.name}! 🎉`);
        setTimeout(() => window.location.href = 'dashboard.html', 800);
      } else {
        Toast.error(result.error);
      }
    });
  }

  // Signup form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    setupTagsInput('teach-tags-input', 'teach-hidden');
    setupTagsInput('learn-tags-input', 'learn-hidden');

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const confirm = document.getElementById('signup-confirm').value;

      if (password !== confirm) { Toast.error('Passwords do not match'); return; }
      if (password.length < 6) { Toast.error('Password must be at least 6 characters'); return; }

      let skillsTeach = [], skillsLearn = [];
      try { skillsTeach = JSON.parse(document.getElementById('teach-hidden')?.value || '[]'); } catch {}
      try { skillsLearn = JSON.parse(document.getElementById('learn-hidden')?.value || '[]'); } catch {}

      const result = Auth.signup({ name, email, password, skillsTeach, skillsLearn });
      if (result.success) {
        Toast.success(`Welcome to Skill Exchange, ${result.user.name}! 🚀`);
        setTimeout(() => window.location.href = 'dashboard.html', 800);
      } else {
        Toast.error(result.error);
      }
    });
  }

  // Demo login
  document.querySelectorAll('.demo-login-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('login-email').value = 'alex@example.com';
      document.getElementById('login-password').value = 'pass123';
      Toast.info('Demo credentials filled in!');
    });
  });
}

// ── Homepage counters ──
function initHomepage() {
  if (!document.querySelector('.hero-stat .number')) return;

  const counters = document.querySelectorAll('.hero-stat .number');
  const targets = [2847, 12439, 4621, 98];
  counters.forEach((el, i) => { animateCounter(el, targets[i]); });
}

// ── Global Init ──
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  Toast.init();

  initHomepage();
  initAuthPage();
  initProfilePage();
  initExplorePage();
  initMatchPage();
  initRequestsPage();
  initDashboardPage();
  initCommunityPage();

  setupScrollAnimations();

  // Theme toggles
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Logout buttons
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', Auth.logout);
  });
});
