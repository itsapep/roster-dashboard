import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

import { db } from '../../src/db'
import { employees, roster_anchors, movement_requests, status_history } from '../../src/db/schema'

export async function clearAllTables() {
  await db.delete(status_history).execute()
  await db.delete(movement_requests).execute()
  await db.delete(roster_anchors).execute()
  await db.delete(employees).execute()
}

export { db }
