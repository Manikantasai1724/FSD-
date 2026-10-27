import mongoose, { Schema, Document } from 'mongoose';

export interface IDiscussionDocument extends Document {
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  votes: number;
  comments: number;
  date: string;
  category: string;
}

const DiscussionSchema = new Schema<IDiscussionDocument>(
  {
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    date: { type: String, default: () => new Date().toISOString() },
    category: { type: String, default: 'General' },
  },
  { timestamps: true }
);

DiscussionSchema.index({ category: 1 });

export default mongoose.model<IDiscussionDocument>('Discussion', DiscussionSchema);
