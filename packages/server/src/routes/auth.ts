import { Router } from 'express';
import { authMiddleware, type AuthRequest } from '../middleware/auth';

const router = Router();

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        // Return BetterAuth user directly; no legacy DB lookup
        res.json(req.user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Error getting user data' });
    }
});

export const authRoutes = router;
