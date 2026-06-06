import { db } from '../db'
import { movement_requests, status_history } from '../db/schema'
import { eq, inArray } from 'drizzle-orm'

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
  comment?: string
}

export type UpdateMovementRequestInput = {
  id: number
  employee_id?: number
  movement_type?: string
  start_date?: string
  end_date?: string
  status?: string
  current_comment?: string
  comment?: string
}

async function createStatusHistory(
  requestId: number,
  status: string,
  comment: string,
  changedBy: string = 'Admin'
) {
  return await db.insert(status_history).values({
    request_id: requestId,
    status,
    comment,
    changed_by: changedBy,
  })
}

export async function createMovementRequest(data: CreateMovementRequestInput) {
  const start_date = parseDdMmYyyy(data.start_date)
  const end_date = parseDdMmYyyy(data.end_date)
  
  return await db.transaction(async (tx) => {
    const res = await tx.insert(movement_requests).values({
      employee_id: data.employee_id,
      movement_type: data.movement_type,
      start_date,
      end_date,
    }).returning()
    
    if (res.length > 0) {
      const requestId = res[0].id
      const comment = data.comment || 'Movement request created'
      await tx.insert(status_history).values({
        request_id: requestId,
        status: 'Pending',
        comment,
        changed_by: 'Admin',
      })
    }
    
    return res
  })
}

export async function updateMovementRequest(data: UpdateMovementRequestInput) {
  const setValues: Record<string, unknown> = {}
  if (data.employee_id !== undefined) setValues.employee_id = data.employee_id
  if (data.movement_type !== undefined) setValues.movement_type = data.movement_type
  if (data.start_date !== undefined) setValues.start_date = parseDdMmYyyy(data.start_date)
  if (data.end_date !== undefined) setValues.end_date = parseDdMmYyyy(data.end_date)
  if (data.status !== undefined) setValues.status = data.status
  if (data.current_comment !== undefined) setValues.current_comment = data.current_comment
  
  return await db.transaction(async (tx) => {
    const res = await tx.update(movement_requests).set(setValues).where(eq(movement_requests.id, data.id)).returning()
    
    // If status changed, record it in status_history
    if (data.status !== undefined) {
      const comment = data.comment || data.current_comment || 'Status updated'
      await tx.insert(status_history).values({
        request_id: data.id,
        status: data.status,
        comment,
        changed_by: 'Admin',
      })
    }
    
    return res
  })
}

async function attachStatusHistory(requests: Array<{ id: number; [key: string]: unknown }>) {
  if (requests.length === 0) return []

  const requestIds = requests.map((r) => r.id)
  const allHistory = await db
    .select()
    .from(status_history)
    .where(inArray(status_history.request_id, requestIds))

  const historyByRequestId = new Map<number, typeof allHistory>()
  for (const h of allHistory) {
    const list = historyByRequestId.get(h.request_id) || []
    list.push(h)
    historyByRequestId.set(h.request_id, list)
  }

  return requests.map((request) => ({
    ...request,
    status_history: historyByRequestId.get(request.id) || [],
  }))
}

export async function getAllMovementRequests() {
  const requests = await db.select().from(movement_requests)
  return await attachStatusHistory(requests)
}

export async function getMovementRequestsByEmployeeId(employeeId: number) {
  const requests = await db
    .select()
    .from(movement_requests)
    .where(eq(movement_requests.employee_id, employeeId))
  return await attachStatusHistory(requests)
}

export async function getPendingMovementRequests() {
  const requests = await db
    .select()
    .from(movement_requests)
    .where(eq(movement_requests.status, 'Pending'))
  return await attachStatusHistory(requests)
}

export async function getMovementRequestById(id: number) {
  const res = await db.select().from(movement_requests).where(eq(movement_requests.id, id))
  
  if (res.length === 0) return []
  
  const history = await db.select().from(status_history).where(eq(status_history.request_id, id))
  
  return [{
    ...res[0],
    status_history: history,
  }]
}
