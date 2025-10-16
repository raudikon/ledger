import express from 'express';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './models/schema';
import { config } from 'dotenv';
import type { IncomingHttpHeaders } from 'http';

config({ path: '../../.env' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client);

// Middleware
const clientOrigin = process.env.BETTER_AUTH_URL ?? 'http://localhost:5173';
app.use(cors({ origin: clientOrigin, credentials: true }));
// Express 5 uses path-to-regexp v6; use explicit wildcard path instead of '*'
// Express 5 path-to-regexp v6: use RegExp for wildcard preflight
app.options(/^\/ba(?:\/.*)?$/, cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.set('trust proxy', true);

// BetterAuth handler (mounted under /ba to avoid breaking existing routes)
import { auth as betterAuth } from '../auth';

app.use('/ba', async (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        const subPath = req.originalUrl.replace(/^\/ba/, '') || '/';
        const url = `${protocol}://${host}${subPath}`;
        console.log(`[BA] Incoming ${req.method} ${req.originalUrl} -> ${subPath}`);

        // Build a fetch Request from Express req
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers as IncomingHttpHeaders)) {
            if (Array.isArray(value)) headers.set(key, value.join(', '));
            else if (typeof value === 'string') headers.set(key, value);
        }

        let body: BodyInit | undefined;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            // Express has parsed JSON body; re-encode if present
            if (req.is('application/json') && req.body && Object.keys(req.body).length > 0) {
                body = JSON.stringify(req.body);
                headers.set('content-type', 'application/json');
            } else if (typeof req.body === 'string') {
                body = req.body;
            }
        }

        const request = new Request(url, {
            method: req.method,
            headers,
            body,
        });

        const response = await betterAuth.handler(request);
        console.log(`[BA] ${req.method} ${subPath} -> ${response.status}`);

        // Copy status and headers back to Express
        res.status(response.status);
        response.headers.forEach((value, key) => {
            // Express will manage content-length automatically
            if (key.toLowerCase() !== 'content-length') {
                res.setHeader(key, value);
            }
        });

        const buffer = Buffer.from(await response.arrayBuffer());
        res.send(buffer);
    } catch (err) {
        console.error('BetterAuth handler error:', err);
        res.status(500).json({ message: 'Auth handler error' });
    }
});

// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Existing custom auth routes remain mounted under /auth (temporary)
import { authRoutes } from './routes/auth';
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
