import { Router } from 'express';
import { getChallenges, joinChallenge } from '../controllers/challengeController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getChallenges);
router.put('/:id/join', authMiddleware, joinChallenge);

export default router;
