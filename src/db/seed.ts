import { db } from './index'
import * as schema from './schema'

async function main() {
  console.log('Seeding database...')

  // Clear child tables first
  await db.delete(schema.status_history).execute()
  await db.delete(schema.movement_requests).execute()
  await db.delete(schema.roster_anchors).execute()
  await db.delete(schema.employees).execute()

  // Prepare employees
  const mockEmployees = [
    { name: 'Ava Martin', department: 'Operations', role: 'Operator' },
    { name: 'Liam Johnson', department: 'Operations', role: 'Supervisor' },
    { name: 'Sophia Lee', department: 'Operations', role: 'Manager' },
    { name: 'Noah Brown', department: 'Logistics', role: 'Logistics Coordinator' },
    { name: 'Olivia Davis', department: 'Logistics', role: 'Driver' },
    { name: 'William Garcia', department: 'Logistics', role: 'Loader' },
    { name: 'Emma Martinez', department: 'Engineering', role: 'Maintenance Engineer' },
    { name: 'James Rodriguez', department: 'Engineering', role: 'Technician' },
    { name: 'Isabella Wilson', department: 'Engineering', role: 'Technician' },
    { name: 'Benjamin Anderson', department: 'Operations', role: 'Operator' },
    { name: 'Mia Thomas', department: 'Logistics', role: 'Driver' },
    { name: 'Elijah Taylor', department: 'Engineering', role: 'Maintenance Engineer' },
    { name: 'Charlotte Moore', department: 'Operations', role: 'Supervisor' },
    { name: 'Lucas Jackson', department: 'Logistics', role: 'Coordinator' },
    { name: 'Amelia White', department: 'Engineering', role: 'Technician' },
  ]

  const inserted = await db.insert(schema.employees).values(mockEmployees).returning()
  const employeeIds = inserted.map((r: any) => r.id)

  // Create staggered roster anchors
  const base = new Date('2023-01-01')
  const anchors = employeeIds.map((id: number, idx: number) => {
    const offsetDays = [0, 7, 14][idx % 3]
    const d = new Date(base)
    d.setDate(d.getDate() + offsetDays)
    return { employee_id: id, anchor_date: d.toISOString().slice(0, 10) }
  })

  await db.insert(schema.roster_anchors).values(anchors).execute()

  // Create 7 pending movement requests spanning departments
  const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
  const requests = Array.from({ length: 7 }).map(() => {
    const eid = pick(employeeIds)
    const start = new Date()
    start.setDate(start.getDate() + Math.floor(Math.random() * 30))
    const end = new Date(start)
    end.setDate(start.getDate() + Math.floor(Math.random() * 7) + 1)
    return {
      employee_id: eid,
      movement_type: pick(['Change Swing', 'Request Leave', 'Temporary Swap']),
      start_date: start.toISOString().slice(0, 10),
      end_date: end.toISOString().slice(0, 10),
      status: 'Pending',
      current_comment: 'Auto-generated request for testing',
    }
  })

  await db.insert(schema.movement_requests).values(requests).execute()

  console.log('Seed complete')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
