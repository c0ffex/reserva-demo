import { 
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  text
} from 'drizzle-orm/pg-core';

export const reservations = pgTable('reservations', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 100 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  partySize: integer('party_size').notNull(),
  startTime: timestamp('start_time', { withTimezone: true, mode: 'date' }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true, mode: 'date' }).notNull(),
  status: varchar('status', { length: 20 }).default('confirmed'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});