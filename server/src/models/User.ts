import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
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

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    skillsTeach: { type: [String], default: [] },
    skillsLearn: { type: [String], default: [] },
    reputation: { type: Number, default: 0 },
    streak: { type: Number, default: 1 },
    exchanges: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    joinDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    location: { type: String, default: '' },
    lastLogin: { type: String, default: () => new Date().toDateString() },
    category: { type: String, default: 'Other' },
    level: { type: String, default: 'Beginner' },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ skillsTeach: 1 });
UserSchema.index({ skillsLearn: 1 });

export default mongoose.model<IUserDocument>('User', UserSchema);
