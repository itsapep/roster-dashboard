import { pgTable, serial, text, timestamp, integer, date } from 'drizzle-orm/pg-core/index.js'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
})

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  department: text('department').notNull(),
  role: text('role'),
  created_at: timestamp('created_at').defaultNow(),
})

export const roster_anchors = pgTable('roster_anchors', {
  id: serial('id').primaryKey(),
  employee_id: integer('employee_id').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
  anchor_date: date('anchor_date').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

export const movement_requests = pgTable('movement_requests', {
  id: serial('id').primaryKey(),
  employee_id: integer('employee_id').references(() => employees.id),
  movement_type: text('movement_type'),
  start_date: date('start_date'),
  end_date: date('end_date'),
  status: text('status').default('Pending'),
  current_comment: text('current_comment'),
  created_at: timestamp('created_at').defaultNow(),
})

export const status_history = pgTable('status_history', {
  id: serial('id').primaryKey(),
  request_id: integer('request_id').references(() => movement_requests.id, { onDelete: 'cascade' }).notNull(),
  status: text('status').notNull(),
  changed_by: text('changed_by').default('Admin'),
  comment: text('comment').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})
