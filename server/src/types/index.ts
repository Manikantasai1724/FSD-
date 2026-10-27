export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
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

export interface IExchangeRequest {
  id?: string;
  fromUserId: string;
  toUserId: string | null;
  skillRequested: string;
  skillOffered: string;
  status: 'incoming' | 'sent' | 'accepted' | 'rejected';
  date: string;
  message: string;
}

export interface IChallenge {
  id?: string;
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

export interface IDiscussion {
  id?: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  votes: number;
  comments: number;
  date: string;
  category: string;
}

export interface INotification {
  id?: string;
  userId: string;
  message: string;
  type: string;
  date: string;
  read: boolean;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  skillsTeach?: string[];
  skillsLearn?: string[];
  bio?: string;
  location?: string;
}
