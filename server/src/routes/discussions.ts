import { Router } from 'express';
import { getDiscussions, createDiscussion, upvoteDiscussion } from '../controllers/discussionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getDiscussions);
router.post('/', authMiddleware, createDiscussion);
router.put('/:id/upvote', upvoteDiscussion);

export default router;
