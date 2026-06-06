import { vi, describe, it, expect, beforeEach } from 'vitest'
import { postHandler, putHandler, getAllHandler, getByIdHandler } from '../../src/routes/movement-request-route'
import * as mrService from '../../src/services/movement-request-service'

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

describe('Movement request route handlers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('postHandler - success', async () => {
    const payload = { employee_id: 1, movement_type: 'Transfer', start_date: '01102023', end_date: '02102023' }
    vi.spyOn(mrService, 'createMovementRequest').mockResolvedValue([{}])

    const req: any = { body: payload }
    const res = createMockRes()

    await postHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Success create movement request' }))
  })

  it('postHandler - missing fields -> 400', async () => {
    const req: any = { body: { employee_id: 1 } }
    const res = createMockRes()

    await postHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing fields' })
  })

  it('putHandler - success', async () => {
    vi.spyOn(mrService, 'updateMovementRequest').mockResolvedValue([{}])

    const req: any = { body: { id: 1, status: 'Approved' } }
    const res = createMockRes()

    await putHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Success update movement request' }))
  })

  it('putHandler - missing id -> 400', async () => {
    const req: any = { body: { status: 'Approved' } }
    const res = createMockRes()

    await putHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing id' })
  })

  it('getAllHandler - service throws -> 500', async () => {
    vi.spyOn(mrService, 'getAllMovementRequests').mockRejectedValue(new Error('db error'))

    const req: any = { query: {} }
    const res = createMockRes()

    await getAllHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Error get all movement request' })
  })

  it('getByIdHandler - missing id -> 400', async () => {
    const req: any = { query: {} }
    const res = createMockRes()

    await getByIdHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing id' })
  })
})
