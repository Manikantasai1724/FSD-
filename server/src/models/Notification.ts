import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDocument extends Document {
  userId: string;
  message: string;
  type: string;
  date: string;
  read: boolean;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'info' },
    date: { type: String, default: () => new Date().toISOString() },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, read: 1 });

export default mongoose.model<INotificationDocument>('Notification', NotificationSchema);
