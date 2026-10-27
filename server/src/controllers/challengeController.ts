import { Request, Response } from 'express';
import Challenge from '../models/Challenge';

export async function getChallenges(_req: Request, res: Response): Promise<void> {
  try {
    const challenges = await Challenge.find().sort({ deadline: 1 });
    const challengesWithId = challenges.map((c) => ({ ...c.toObject(), id: c._id.toString() }));
    res.json(challengesWithId);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
}

export async function joinChallenge(req: Request, res: Response): Promise<void> {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }

    challenge.participants += 1;
    await challenge.save();

    res.json({ ...challenge.toObject(), id: challenge._id.toString() });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ error: 'Failed to join challenge' });
  }
}
