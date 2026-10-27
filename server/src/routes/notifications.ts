import { Router } from 'express';
import { getNotifications, markRead } from '../controllers/notificationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getNotifications);
router.put('/read', authMiddleware, markRead);

export default router;
