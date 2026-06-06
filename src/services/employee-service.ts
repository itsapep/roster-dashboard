import { db } from '../db'
import { employees } from '../db/schema'

export type CreateEmployeeInput = {
  name: string
  department: string
  role?: string
}

export async function createEmployee(data: CreateEmployeeInput) {
  if (!data?.name || !data?.department) {
    throw new Error('Invalid input')
  }

  const result = await db.insert(employees).values({
    name: data.name,
    department: data.department,
    role: data.role ?? null,
  })

  return result
}

export async function getAllEmployees() {
  return await db.select().from(employees)
}
