import mongoose, { Schema, Document } from 'mongoose';

export interface IChallengeDocument extends Document {
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

const ChallengeSchema = new Schema<IChallengeDocument>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: String, required: true },
    participants: { type: Number, default: 0 },
    prize: { type: String, default: '' },
    difficulty: { type: String, default: 'Beginner' },
    tags: { type: [String], default: [] },
    submissions: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IChallengeDocument>('Challenge', ChallengeSchema);
