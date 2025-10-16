import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as authSchema from './src/models/authSchema';

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

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:5173',
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [
        process.env.BETTER_AUTH_URL ?? 'http://localhost:5173',
    ],
    emailAndPassword: {
        enabled: true,
    },
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: authSchema,
    }),
});

export type Auth = typeof auth;
