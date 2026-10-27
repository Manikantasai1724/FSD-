import { USER_GRADIENTS } from './constants';

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getUserGradient(userId: string): string {
  const num = parseInt(userId.replace(/\D/g, ''), 10) || 0;
  return USER_GRADIENTS[num % USER_GRADIENTS.length];
}

export function detectCategory(skillName: string): string {
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

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export function getSkillMatchScore(
  userA: { skillsTeach: string[]; skillsLearn: string[] },
  userB: { skillsTeach: string[]; skillsLearn: string[]; reputation?: number }
): number {
  const aTeach = (userA.skillsTeach || []).map((s) => s.toLowerCase());
  const aLearn = (userA.skillsLearn || []).map((s) => s.toLowerCase());
  const bTeach = (userB.skillsTeach || []).map((s) => s.toLowerCase());
  const bLearn = (userB.skillsLearn || []).map((s) => s.toLowerCase());

  let score = 0;
  aTeach.forEach((skill) => {
    if (bLearn.some((s) => s.includes(skill) || skill.includes(s))) score += 50;
  });
  bTeach.forEach((skill) => {
    if (aLearn.some((s) => s.includes(skill) || skill.includes(s))) score += 50;
  });
  score += Math.round((userB.reputation || 0) * 5);
  return Math.min(score, 100);
}
