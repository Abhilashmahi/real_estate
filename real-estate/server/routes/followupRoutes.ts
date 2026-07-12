import { Router } from 'express';
import { getFollowups, createFollowup, toggleFollowup } from '../controllers/followupController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getFollowups);
router.post('/', createFollowup);
router.put('/:id/toggle', toggleFollowup);

export default router;
