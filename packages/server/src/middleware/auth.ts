import type { Request, Response, NextFunction } from 'express';
import { auth as betterAuth } from '../../auth';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name?: string;
        image?: string | null;
        emailVerified?: boolean;
    };
    session?: {
        id: string;
        userId: string;
        expiresAt: Date;
        token: string;
    };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const headers = new Headers();
        Object.entries(req.headers).forEach(([key, value]) => {
            if (!value) return;
            if (Array.isArray(value)) {
                headers.set(key, value.join(', '));
            } else {
                headers.set(key, value);
            }
        });

        const sessionResponse = await betterAuth.api.getSession({
            headers,
        });

        if (!sessionResponse) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.session = {
            id: sessionResponse.session.id,
            userId: sessionResponse.session.userId,
            token: sessionResponse.session.token,
            expiresAt: new Date(sessionResponse.session.expiresAt),
        };
        req.user = sessionResponse.user;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
