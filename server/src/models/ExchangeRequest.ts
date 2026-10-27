import mongoose, { Schema, Document } from 'mongoose';

export interface IExchangeRequestDocument extends Document {
  fromUserId: string;
  toUserId: string | null;
  skillRequested: string;
  skillOffered: string;
  status: 'incoming' | 'sent' | 'accepted' | 'rejected';
  date: string;
  message: string;
}

const ExchangeRequestSchema = new Schema<IExchangeRequestDocument>(
  {
    fromUserId: { type: String, required: true },
    toUserId: { type: String, default: null },
    skillRequested: { type: String, required: true },
    skillOffered: { type: String, required: true },
    status: {
      type: String,
      enum: ['incoming', 'sent', 'accepted', 'rejected'],
      default: 'sent',
    },
    date: { type: String, default: () => new Date().toISOString() },
    message: { type: String, default: '' },
  },
  { timestamps: true }
);

ExchangeRequestSchema.index({ fromUserId: 1 });
ExchangeRequestSchema.index({ toUserId: 1 });
ExchangeRequestSchema.index({ status: 1 });

export default mongoose.model<IExchangeRequestDocument>('ExchangeRequest', ExchangeRequestSchema);
