import { vi, describe, it, expect, beforeEach } from 'vitest'
import { postHandler, putHandler, getAllHandler } from '../../src/routes/roster-anchor-route'
import { db, clearAllTables } from '../helpers/db'
import { employees, roster_anchors } from '../../src/db/schema'
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

async function insertTestEmployee(name = 'Test Employee') {
  const result = await db.insert(employees).values({ name, department: 'Test', role: 'Tester' }).returning()
  return result[0]
}

describe('Roster Anchor API', () => {
  beforeEach(async () => {
    await clearAllTables()
  })

  describe('Get All Roster Anchors', () => {
    it('Scenario A: Empty State - returns empty array', async () => {
      const req: any = { query: {} }
      const res = createMockRes()

      await getAllHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res._body.data).toEqual([])
    })

    it('Scenario B: Verify data retrieval - returns all anchors with correct dates', async () => {
      const emp1 = await insertTestEmployee('Employee 1')
      const emp2 = await insertTestEmployee('Employee 2')

      await db.insert(roster_anchors).values([
        { employee_id: emp1.id, anchor_date: '2023-10-15' },
        { employee_id: emp2.id, anchor_date: '2023-11-20' },
      ])

      const req: any = { query: {} }
      const res = createMockRes()

      await getAllHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res._body.data).toHaveLength(2)
      expect(res._body.data[0]).toMatchObject({
        employee_id: expect.any(Number),
        anchor_date: expect.any(String),
      })
    })
  })

  describe('Get Roster Anchor By Employee ID', () => {
    it('Scenario A: Correct association - returns only that employees anchor', async () => {
      const emp1 = await insertTestEmployee('Employee 1')
      const emp2 = await insertTestEmployee('Employee 2')

      await db.insert(roster_anchors).values([
        { employee_id: emp1.id, anchor_date: '2023-10-15' },
        { employee_id: emp2.id, anchor_date: '2023-11-20' },
      ])

      const req: any = { query: { employee_id: String(emp1.id) } }
      const res = createMockRes()

      await getAllHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res._body.data).toHaveLength(1)
      expect(res._body.data[0].employee_id).toBe(emp1.id)
    })
  })

  describe('Create Roster Anchor', () => {
    it('Scenario A: Valid Input - creates anchor and returns 201', async () => {
      const emp = await insertTestEmployee()

      const req: any = { body: { employee_id: emp.id, anchor_date: '15102023' } }
      const res = createMockRes()

      await postHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res._body.message).toBe('Success add roster anchor')

      const inserted = await db.select().from(roster_anchors).where(eq(roster_anchors.employee_id, emp.id))
      expect(inserted).toHaveLength(1)
      expect(inserted[0].anchor_date).toBe('2023-10-15')
    })

    it('Scenario B: Missing Fields - returns 400', async () => {
      const req: any = { body: { employee_id: 1 } }
      const res = createMockRes()

      await postHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res._body.message).toBe('Missing fields')

      const count = await db.select().from(roster_anchors)
      expect(count).toHaveLength(0)
    })
  })

  describe('Update Roster Anchor', () => {
    it('Scenario A: Valid Update - changes anchor date', async () => {
      const emp = await insertTestEmployee()

      await db.insert(roster_anchors).values({
        employee_id: emp.id,
        anchor_date: '2023-10-15',
      })

      const req: any = { body: { employee_id: emp.id, anchor_date: '20112023' } }
      const res = createMockRes()

      await putHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res._body.message).toBe('Success update roster anchor')

      const updated = await db.select().from(roster_anchors).where(eq(roster_anchors.employee_id, emp.id))
      expect(updated[0].anchor_date).toBe('2023-11-20')
    })

    it('Scenario B: Invalid Date Format - returns error', async () => {
      const emp = await insertTestEmployee()

      await db.insert(roster_anchors).values({
        employee_id: emp.id,
        anchor_date: '2023-10-15',
      })

      const req: any = { body: { employee_id: emp.id, anchor_date: '2023-10-15' } }
      const res = createMockRes()

      await putHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(500)

      const unchanged = await db.select().from(roster_anchors).where(eq(roster_anchors.employee_id, emp.id))
      expect(unchanged[0].anchor_date).toBe('2023-10-15')
    })
  })
})
