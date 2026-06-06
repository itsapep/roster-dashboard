import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { postHandler, getAllHandler } from '../../src/routes/employee-route'
import * as employeeService from '../../src/services/employee-service'

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

describe('Employee route handlers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('postHandler - success', async () => {
    const createSpy = vi.spyOn(employeeService, 'createEmployee').mockResolvedValue({})

    const req: any = { body: { name: 'Alice', department: 'Engineering' } }
    const res = createMockRes()

    await postHandler(req, res)

    expect(createSpy).toHaveBeenCalledWith({ name: 'Alice', department: 'Engineering' })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ message: 'Success add employee' })
  })

  it('postHandler - service throws -> 500', async () => {
    vi.spyOn(employeeService, 'createEmployee').mockRejectedValue(new Error('db error'))

    const req: any = { body: { name: 'Bob', department: 'HR' } }
    const res = createMockRes()

    await postHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Error add employee' })
  })

  it('getAllHandler - success', async () => {
    const sample = [{ id: 1, name: 'Alice' }]
    vi.spyOn(employeeService, 'getAllEmployees').mockResolvedValue(sample)

    const req: any = {}
    const res = createMockRes()

    await getAllHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Success get all employees', data: sample })
  })

  it('getAllHandler - service throws -> 500', async () => {
    vi.spyOn(employeeService, 'getAllEmployees').mockRejectedValue(new Error('db error'))

    const req: any = {}
    const res = createMockRes()

    await getAllHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Error get all employees' })
  })
})
