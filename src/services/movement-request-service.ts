import { db } from '../db'
import { movement_requests } from '../db/schema'
import { eq } from 'drizzle-orm'

function parseDdMmYyyy(input: string): string {
  if (!/^[0-9]{8}$/.test(input)) throw new Error('invalid date format')
  const dd = input.slice(0, 2)
  const mm = input.slice(2, 4)
  const yyyy = input.slice(4, 8)
  return `${yyyy}-${mm}-${dd}`
}

export type CreateMovementRequestInput = {
  employee_id: number
  movement_type: string
  start_date: string
  end_date: string
}

export type UpdateMovementRequestInput = {
  id: number
  employee_id?: number
  movement_type?: string
  start_date?: string
  end_date?: string
  status?: string
  current_comment?: string
}

export async function createMovementRequest(data: CreateMovementRequestInput) {
  const start_date = parseDdMmYyyy(data.start_date)
  const end_date = parseDdMmYyyy(data.end_date)
  const res = await db.insert(movement_requests).values({
    employee_id: data.employee_id,
    movement_type: data.movement_type,
    start_date,
    end_date,
  }).returning()
  return res
}

export async function updateMovementRequest(data: UpdateMovementRequestInput) {
  const setValues: Record<string, unknown> = {}
  if (data.employee_id !== undefined) setValues.employee_id = data.employee_id
  if (data.movement_type !== undefined) setValues.movement_type = data.movement_type
  if (data.start_date !== undefined) setValues.start_date = parseDdMmYyyy(data.start_date)
  if (data.end_date !== undefined) setValues.end_date = parseDdMmYyyy(data.end_date)
  if (data.status !== undefined) setValues.status = data.status
  if (data.current_comment !== undefined) setValues.current_comment = data.current_comment
  const res = await db.update(movement_requests).set(setValues).where(eq(movement_requests.id, data.id)).returning()
  return res
}

export async function getAllMovementRequests() {
  const res = await db.select().from(movement_requests)
  return res
}

export async function getMovementRequestById(id: number) {
  const res = await db.select().from(movement_requests).where(eq(movement_requests.id, id))
  return res
}
