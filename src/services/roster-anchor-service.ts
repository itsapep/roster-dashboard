import { db } from '../db/index'
import { roster_anchors } from '../db/schema'
import { eq } from 'drizzle-orm'

function parseDdMmYyyy(input: string): string {
  // expect ddmmyyyy like 15102023
  if (!/^[0-9]{8}$/.test(input)) throw new Error('invalid date format')
  const dd = input.slice(0, 2)
  const mm = input.slice(2, 4)
  const yyyy = input.slice(4, 8)
  const iso = `${yyyy}-${mm}-${dd}`
  return iso
}

export async function createRosterAnchor({ employee_id, anchor_date }:{employee_id:number, anchor_date:string}){
  const iso = parseDdMmYyyy(anchor_date)
  const res = await db.insert(roster_anchors).values({ employee_id, anchor_date: iso }).returning();
  return res
}

export async function updateRosterAnchor({ employee_id, anchor_date }:{employee_id:number, anchor_date:string}){
  const iso = parseDdMmYyyy(anchor_date)
  const res = await db.update(roster_anchors).set({ anchor_date: iso }).where(eq(roster_anchors.employee_id, employee_id)).returning();
  return res
}

export default { createRosterAnchor, updateRosterAnchor }
