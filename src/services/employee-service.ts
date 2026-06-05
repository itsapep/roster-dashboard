import { db } from '../db'
import { employees } from '../db/schema'

export async function createEmployee(data: { name: string; department: string; role?: string }) {
  const { name, department, role } = data
  const result = await db.insert(employees).values({ name, department, role })
  return result
}
