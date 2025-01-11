import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Event' },
  userId: { type: String, required: true },
  content: { type: String, required: true }
}, {
  timestamps: true
});

export const Comment = mongoose.model('Comment', commentSchema);