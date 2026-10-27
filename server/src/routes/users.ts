import { Router } from 'express';
import { getAllUsers, getUserById, updateUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/me', authMiddleware, updateUser);

export default router;
