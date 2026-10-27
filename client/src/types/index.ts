export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  bio: string;
  skillsTeach: string[];
  skillsLearn: string[];
  reputation: number;
  streak: number;
  exchanges: number;
  badges: string[];
  joinDate: string;
  location: string;
  lastLogin: string;
  category: string;
  level: string;
}

export interface ExchangeRequest {
  id: string;
  _id?: string;
  fromUserId: string;
  toUserId: string | null;
  skillRequested: string;
  skillOffered: string;
  status: 'incoming' | 'sent' | 'accepted' | 'rejected';
  date: string;
  message: string;
}

export interface Challenge {
  id: string;
  _id?: string;
  title: string;
  category: string;
  description: string;
  deadline: string;
  participants: number;
  prize: string;
  difficulty: string;
  tags: string[];
  submissions: number;
  votes: number;
}

export interface Discussion {
  id: string;
  _id?: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  votes: number;
  comments: number;
  date: string;
  category: string;
}

export interface Notification {
  id: string;
  _id?: string;
  userId: string;
  message: string;
  type: string;
  date: string;
  read: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  error?: string;
}

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
}
