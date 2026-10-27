import { Request, Response } from 'express';
import Discussion from '../models/Discussion';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

export async function getDiscussions(req: Request, res: Response): Promise<void> {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category: category as string } : {};
    const discussions = await Discussion.find(filter).sort({ date: -1 });
    const discussionsWithId = discussions.map((d) => ({ ...d.toObject(), id: d._id.toString() }));
    res.json(discussionsWithId);
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
}

export async function createDiscussion(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { title, content, category } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const user = await User.findById(req.user.userId).select('name');
    const discussion = await Discussion.create({
      authorId: req.user.userId,
      authorName: user?.name || 'Unknown',
      title,
      content,
      category: category || 'General',
      votes: 0,
      comments: 0,
      date: new Date().toISOString(),
    });

    res.status(201).json({ ...discussion.toObject(), id: discussion._id.toString() });
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({ error: 'Failed to create discussion' });
  }
}

export async function upvoteDiscussion(req: Request, res: Response): Promise<void> {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      res.status(404).json({ error: 'Discussion not found' });
      return;
    }

    discussion.votes += 1;
    await discussion.save();

    res.json({ ...discussion.toObject(), id: discussion._id.toString() });
  } catch (error) {
    console.error('Upvote discussion error:', error);
    res.status(500).json({ error: 'Failed to upvote discussion' });
  }
}
