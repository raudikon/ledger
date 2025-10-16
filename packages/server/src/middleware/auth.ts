import type { Request, Response, NextFunction } from 'express';
import type { IncomingHttpHeaders } from 'http';
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
        // Build a fetch Request to BetterAuth's get-session endpoint using incoming cookies/headers
        const protocol = req.protocol;
        const host = req.get('host');
        const url = `${protocol}://${host}/ba/get-session`;

        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers as IncomingHttpHeaders)) {
            if (Array.isArray(value)) headers.set(key, value.join(', '));
            else if (typeof value === 'string') headers.set(key, value);
        }

        const request = new Request(url, { method: 'GET', headers });
        const response = await betterAuth.handler(request);

        if (!response.ok) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const data = (await response.json()) as
            | null
            | {
                  session: { id: string; userId: string; expiresAt: string; token: string };
                  user: { id: string; email: string; name?: string; image?: string | null; emailVerified?: boolean };
              };

        if (!data) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.session = {
            id: data.session.id,
            userId: data.session.userId,
            token: data.session.token,
            expiresAt: new Date(data.session.expiresAt),
        };
        req.user = data.user;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
