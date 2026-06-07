import { vi, describe, it, expect, beforeEach } from 'vitest'
import { postHandler, getAllHandler } from '../../src/routes/employee-route'
import { db, clearAllTables } from '../helpers/db'
import { employees } from '../../src/db/schema'
import { eq } from 'drizzle-orm'

function createMockRes() {
  const res: any = {}
  res.status = vi.fn().mockImplementation((code: number) => {
    res._status = code
    return res
  })
  res.json = vi.fn().mockImplementation((body: any) => {
    res._body = body
    return res
  })
  res.setHeader = vi.fn()
  res.end = vi.fn()
  return res
}

describe('Employee API', () => {
  beforeEach(async () => {
    await clearAllTables()
  })

  describe('Get All Employees', () => {
    it('Scenario A: Empty State - returns empty array', async () => {
      const req: any = {}
      const res = createMockRes()

      await getAllHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res._body.data).toEqual([])
    })

    it('Scenario B: Populated State - returns all inserted employees', async () => {
      await db.insert(employees).values([
        { name: 'Alice', department: 'Engineering', role: 'Engineer' },
        { name: 'Bob', department: 'HR', role: 'Manager' },
      ])

      const req: any = {}
      const res = createMockRes()

      await getAllHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res._body.data).toHaveLength(2)
      expect(res._body.data[0]).toMatchObject({
        name: expect.any(String),
        department: expect.any(String),
      })
    })
  })

  describe('Create Employee', () => {
    it('Scenario A: Valid Input - creates employee and returns 201', async () => {
      const req: any = { body: { name: 'Charlie', department: 'Engineering' } }
      const res = createMockRes()

      await postHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res._body.message).toBe('Success add employee')

      const inserted = await db.select().from(employees).where(eq(employees.name, 'Charlie'))
      expect(inserted).toHaveLength(1)
      expect(inserted[0].department).toBe('Engineering')
    })

    it('Scenario B: Invalid Input (missing fields) - returns 500 and no insertion', async () => {
      const req: any = { body: { name: 'Dave' } }
      const res = createMockRes()

      await postHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res._body.message).toBe('Error add employee')

      const count = await db.select().from(employees)
      expect(count).toHaveLength(0)
    })
  })
})
