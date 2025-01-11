import { Request, Response } from 'express';
import { Comment } from '../models/comment.model';
import { Event } from '../models/event.model';
import { AuthRequest } from '../middleware/auth';

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const eventId = req.params.eventId;
    const userId = req.user?.userId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const comment = new Comment({
      eventId,
      userId,
      content
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
};

export const getEventComments = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const comments = await Comment.find({ eventId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const commentId = req.params.commentId;
    const userId = req.user?.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (String(comment.userId) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Error updating comment' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user?.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (String(comment.userId) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
};