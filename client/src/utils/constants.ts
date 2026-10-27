import type { Achievement } from '../types';

export const SKILL_CATEGORIES = [
  'Technology', 'Design', 'Business', 'Language', 'Music',
  'Art & Craft', 'Photography', 'Cooking', 'Fitness', 'Writing',
  'Marketing', 'Finance', 'Science', 'Teaching', 'Other'
];

export const SKILL_ICONS: Record<string, string> = {
  'Technology': '💻', 'Design': '🎨', 'Business': '📊', 'Language': '🗣️',
  'Music': '🎵', 'Art & Craft': '✏️', 'Photography': '📷', 'Cooking': '🍳',
  'Fitness': '💪', 'Writing': '📝', 'Marketing': '📣', 'Finance': '💰',
  'Science': '🔬', 'Teaching': '📚', 'Other': '⭐'
};

export const SKILL_BG_COLORS = [
  'rgba(79,70,229,0.1)', 'rgba(236,72,153,0.1)', 'rgba(245,158,11,0.1)',
  'rgba(16,185,129,0.1)', 'rgba(14,165,233,0.1)', 'rgba(168,85,247,0.1)',
  'rgba(239,68,68,0.1)', 'rgba(20,184,166,0.1)'
];

export const ACHIEVEMENTS: Achievement[] = [
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

export const USER_GRADIENTS = [
  'linear-gradient(135deg,#4F46E5,#7C3AED)',
  'linear-gradient(135deg,#EC4899,#F43F5E)',
  'linear-gradient(135deg,#0EA5E9,#6366F1)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
  'linear-gradient(135deg,#10B981,#0EA5E9)',
  'linear-gradient(135deg,#8B5CF6,#EC4899)',
  'linear-gradient(135deg,#F97316,#EAB308)',
  'linear-gradient(135deg,#06B6D4,#8B5CF6)',
];
