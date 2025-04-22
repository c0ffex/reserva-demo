import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const operatingHours = pgTable('operating_hours', {
  id: serial('id').primaryKey(),
  dayOfWeek: integer('day_of_week').notNull(),
  openTime: text('open_time').notNull(),
  closeTime: text('close_time').notNull(),
  isClosed: boolean('is_closed').default(false)
});