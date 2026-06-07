import { vi, describe, it, expect, beforeEach } from 'vitest'
import { postHandler, putHandler, getAllHandler, getByIdHandler } from '../../src/routes/movement-request-route'
import { db, clearAllTables } from '../helpers/db'
import { employees, movement_requests, status_history } from '../../src/db/schema'
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

describe('Movement Request API', () => {
  beforeEach(async () => {
    await clearAllTables()
  })

  describe('Get All Movement Requests', () => {
    it('Scenario A: Verify nested status_history data', async () => {
      const emp = await insertTestEmployee()

      const [mr] = await db.insert(movement_requests).values({
        employee_id: emp.id,
        movement_type: 'Transfer',
        start_date: '2023-10-01',
        end_date: '2023-10-02',
        status: 'Pending',
      }).returning()

      await db.insert(status_history).values([
        { request_id: mr.id, status: 'Pending', comment: 'Created' },
        { request_id: mr.id, status: 'Approved', comment: 'Approved by manager' },
      ])

      const req: any = { query: {} }
      const res = createMockRes()

      await getAllHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res._body.data).toHaveLength(1)
      expect(res._body.data[0].status_history).toHaveLength(2)
      expect(res._body.data[0].status_history[0].status).toBe('Pending')
      expect(res._body.data[0].status_history[1].status).toBe('Approved')
    })
  })

  describe('Get Movement Requests By Employee ID', () => {
    it('Scenario A: Valid Employee ID - returns only that employees requests', async () => {
      const emp1 = await insertTestEmployee('Employee 1')
      const emp2 = await insertTestEmployee('Employee 2')

      await db.insert(movement_requests).values([
        { employee_id: emp1.id, movement_type: 'Transfer', start_date: '2023-10-01', end_date: '2023-10-02', status: 'Pending' },
        { employee_id: emp1.id, movement_type: 'Leave', start_date: '2023-10-03', end_date: '2023-10-04', status: 'Approved' },
        { employee_id: emp2.id, movement_type: 'Swap', start_date: '2023-10-05', end_date: '2023-10-06', status: 'Pending' },
      ])

      const req: any = { query: { employee_id: String(emp1.id) } }
      const res = createMockRes()

      await getAllHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res._body.data).toHaveLength(2)
      res._body.data.forEach((r: any) => {
        expect(r.employee_id).toBe(emp1.id)
      })
    })

    it('Scenario B: Non-existent Employee ID - returns empty array', async () => {
      const emp = await insertTestEmployee()
      await db.insert(movement_requests).values({
        employee_id: emp.id,
        movement_type: 'Transfer',
        start_date: '2023-10-01',
        end_date: '2023-10-02',
        status: 'Pending',
      })

      const req: any = { query: { employee_id: '99999' } }
      const res = createMockRes()

      await getAllHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res._body.data).toEqual([])
    })
  })

  describe('Get Pending Movement Requests', () => {
    it('Scenario A: Filter by status - returns only Pending requests', async () => {
      const emp = await insertTestEmployee()

      await db.insert(movement_requests).values([
        { employee_id: emp.id, movement_type: 'Transfer', start_date: '2023-10-01', end_date: '2023-10-02', status: 'Approved' },
        { employee_id: emp.id, movement_type: 'Leave', start_date: '2023-10-03', end_date: '2023-10-04', status: 'Pending' },
        { employee_id: emp.id, movement_type: 'Swap', start_date: '2023-10-05', end_date: '2023-10-06', status: 'Rejected' },
      ])

      const req: any = { query: { status: 'Pending' } }
      const res = createMockRes()

      await getAllHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res._body.data).toHaveLength(1)
      expect(res._body.data[0].status).toBe('Pending')
    })
  })

  describe('Create Movement Request', () => {
    it('Scenario A: Valid Input - creates request with initial Pending status', async () => {
      const emp = await insertTestEmployee()

      const req: any = {
        body: {
          employee_id: emp.id,
          movement_type: 'Transfer',
          start_date: '01102023',
          end_date: '02102023',
        },
      }
      const res = createMockRes()

      await postHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res._body.message).toBe('Success create movement request')

      const inserted = await db.select().from(movement_requests).where(eq(movement_requests.employee_id, emp.id))
      expect(inserted).toHaveLength(1)
      expect(inserted[0].status).toBe('Pending')

      const history = await db.select().from(status_history).where(eq(status_history.request_id, inserted[0].id))
      expect(history).toHaveLength(1)
      expect(history[0].status).toBe('Pending')
    })

    it('Scenario B: Missing Fields - returns 400', async () => {
      const req: any = { body: { employee_id: 1 } }
      const res = createMockRes()

      await postHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res._body.message).toBe('Missing fields')

      const count = await db.select().from(movement_requests)
      expect(count).toHaveLength(0)
    })
  })

  describe('Update Movement Request', () => {
    it('Scenario A: Valid Update - changes status and adds history', async () => {
      const emp = await insertTestEmployee()

      const [mr] = await db.insert(movement_requests).values({
        employee_id: emp.id,
        movement_type: 'Transfer',
        start_date: '2023-10-01',
        end_date: '2023-10-02',
        status: 'Pending',
      }).returning()

      const req: any = { body: { id: mr.id, status: 'Approved', comment: 'Looks good' } }
      const res = createMockRes()

      await putHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res._body.message).toBe('Success update movement request')

      const updated = await db.select().from(movement_requests).where(eq(movement_requests.id, mr.id))
      expect(updated[0].status).toBe('Approved')

      const history = await db.select().from(status_history).where(eq(status_history.request_id, mr.id))
      expect(history.length).toBeGreaterThanOrEqual(1)
      expect(history.some((h) => h.status === 'Approved')).toBe(true)
    })

    it('Scenario B: Missing ID - returns 400', async () => {
      const req: any = { body: { status: 'Approved' } }
      const res = createMockRes()

      await putHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res._body.message).toBe('Missing id')
    })
  })

  describe('Get By ID', () => {
    it('returns 400 when id is missing', async () => {
      const req: any = { query: {} }
      const res = createMockRes()

      await getByIdHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res._body.message).toBe('Missing id')
    })
  })
})
