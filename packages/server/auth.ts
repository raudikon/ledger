import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { authUsers, authSessions, authAccounts, authVerificationTokens } from './src/models/authSchema';

const envPath = path.resolve(__dirname, '../../.env');

loadEnv({
    path: envPath,
});

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required for BetterAuth');
}

if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error('BETTER_AUTH_SECRET environment variable is required for BetterAuth');
}

const client = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(client);

const appOrigin = process.env.APP_ORIGIN ?? process.env.BETTER_AUTH_URL ?? 'http://localhost:5173';
const apiOrigin = process.env.API_ORIGIN ?? process.env.BETTER_AUTH_BASE_URL ?? 'http://localhost:3000';

export const auth = betterAuth({
    basePath: '/',
    baseURL: apiOrigin,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [appOrigin, apiOrigin],
    session: {
        cookie: {
            sameSite: 'none',
            secure: false,
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user: authUsers,
            session: authSessions,
            account: authAccounts,
            verification: authVerificationTokens,
        },
    }),
});

export type Auth = typeof auth;
