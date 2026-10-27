import { Request, Response } from 'express';
import ExchangeRequest from '../models/ExchangeRequest';
import Notification from '../models/Notification';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export async function getRequests(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userId = req.user.userId;
    const requests = await ExchangeRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }, { toUserId: null }],
    }).sort({ date: -1 });

    const requestsWithId = requests.map((r) => ({ ...r.toObject(), id: r._id.toString() }));
    res.json(requestsWithId);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
}

export async function createRequest(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { toUserId, skillRequested, skillOffered, message } = req.body;

    if (!toUserId || !skillRequested) {
      res.status(400).json({ error: 'Target user and requested skill are required' });
      return;
    }

    if (toUserId === req.user.userId) {
      res.status(400).json({ error: 'Cannot request an exchange with yourself' });
      return;
    }

    // Check for existing pending request
    const existing = await ExchangeRequest.findOne({
      fromUserId: req.user.userId,
      toUserId,
      skillRequested,
      status: { $nin: ['rejected'] },
    });

    if (existing) {
      res.status(409).json({ error: 'You already have a pending request for this skill' });
      return;
    }

    const currentUser = await User.findById(req.user.userId).select('name skillsTeach');
    const exchangeRequest = await ExchangeRequest.create({
      fromUserId: req.user.userId,
      toUserId,
      skillRequested,
      skillOffered: skillOffered || currentUser?.skillsTeach?.[0] || 'TBD',
      status: 'sent',
      date: new Date().toISOString(),
      message: message || `Hi! I'd love to exchange skills. I'll teach you ${skillOffered || currentUser?.skillsTeach?.[0] || 'my skills'} in return.`,
    });

    // Create notification for target user
    const targetUser = await User.findById(toUserId).select('name');
    await Notification.create({
      userId: req.user.userId,
      message: `New exchange request sent to ${targetUser?.name || 'a user'}`,
      type: 'request',
      date: new Date().toISOString(),
      read: false,
    });

    res.status(201).json({ ...exchangeRequest.toObject(), id: exchangeRequest._id.toString() });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
}

export async function acceptRequest(req: AuthRequest, res: Response): Promise<void> {
  try {
    const exchangeRequest = await ExchangeRequest.findById(req.params.id);
    if (!exchangeRequest) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    exchangeRequest.status = 'accepted';
    await exchangeRequest.save();

    const fromUser = await User.findById(exchangeRequest.fromUserId).select('name');
    if (req.user) {
      await Notification.create({
        userId: req.user.userId,
        message: `You accepted a skill exchange with ${fromUser?.name || 'a user'}`,
        type: 'success',
        date: new Date().toISOString(),
        read: false,
      });
    }

    res.json({ ...exchangeRequest.toObject(), id: exchangeRequest._id.toString() });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
}

export async function rejectRequest(req: AuthRequest, res: Response): Promise<void> {
  try {
    const exchangeRequest = await ExchangeRequest.findById(req.params.id);
    if (!exchangeRequest) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    exchangeRequest.status = 'rejected';
    await exchangeRequest.save();

    res.json({ ...exchangeRequest.toObject(), id: exchangeRequest._id.toString() });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
}
