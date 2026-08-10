import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

/** Copia en la nube del progreso y del aula por usuario de Identity */
export const userSync = pgTable('user_sync', {
  userId: text('user_id').primaryKey(),
  progress: jsonb('progress').notNull().default({}),
  classroom: jsonb('classroom').notNull().default({}),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type UserSyncRow = typeof userSync.$inferSelect
export type NewUserSyncRow = typeof userSync.$inferInsert
