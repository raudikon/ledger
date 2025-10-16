import { Router } from 'express';
import type { IncomingHttpHeaders } from 'http';
import { authMiddleware, type AuthRequest } from '../middleware/auth';
import { auth as betterAuth } from '../../auth';

const router = Router();

// Sign up
router.post('/signup', async (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        const url = `${protocol}://${host}/ba/sign-up/email`;

        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers as IncomingHttpHeaders)) {
            if (Array.isArray(value)) headers.set(key, value.join(', '));
            else if (typeof value === 'string') headers.set(key, value);
        }
        headers.set('content-type', 'application/json');

        const body = JSON.stringify(req.body);
        const request = new Request(url, { method: 'POST', headers, body });
        const response = await betterAuth.handler(request);

        response.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') {
                res.setHeader('set-cookie', value);
            }
        });

        const payload = await response.text();
        res.status(response.status).send(payload);
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        const url = `${protocol}://${host}/ba/sign-in/email`;

        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers as IncomingHttpHeaders)) {
            if (Array.isArray(value)) headers.set(key, value.join(', '));
            else if (typeof value === 'string') headers.set(key, value);
        }
        headers.set('content-type', 'application/json');

        const body = JSON.stringify(req.body);
        const request = new Request(url, { method: 'POST', headers, body });
        const response = await betterAuth.handler(request);

        response.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') {
                res.setHeader('set-cookie', value);
            }
        });

        const payload = await response.text();
        res.status(response.status).send(payload);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        res.json(req.user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Error getting user data' });
    }
});

export const authRoutes = router;
