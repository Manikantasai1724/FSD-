import { Router } from 'express';
import { getRequests, createRequest, acceptRequest, rejectRequest } from '../controllers/requestController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getRequests);
router.post('/', authMiddleware, createRequest);
router.put('/:id/accept', authMiddleware, acceptRequest);
router.put('/:id/reject', authMiddleware, rejectRequest);

export default router;
