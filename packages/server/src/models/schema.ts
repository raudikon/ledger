import { pgTable, serial, text, timestamp, boolean, uuid, foreignKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const clients = pgTable('clients', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    creatorId: uuid('creator_id').notNull().references(() => users.id),
    organizationId: uuid('organization_id'), // Optional: If you want to support multi-org
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const matters = pgTable('matters', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    clientId: serial('client_id').references(() => clients.id),
    creatorId: uuid('creator_id').notNull().references(() => users.id),
    status: text('status', { enum: ['active', 'completed', 'archived'] }).notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    description: text('description').notNull(),
    status: boolean('completed').default(false),
    assigneeId: uuid('assignee_id').references(() => users.id), // Reference to the assigned user
    creatorId: uuid('creator_id').notNull().references(() => users.id), // Reference to the task creator
    notes: text('notes'),
    matterId: serial('matter_id').references(() => matters.id),
    clientId: serial('client_id').references(() => clients.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});
