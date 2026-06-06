import { vi, describe, it, expect, beforeEach } from 'vitest'
import { postHandler, putHandler, getAllHandler } from '../../src/routes/roster-anchor-route'
import * as raService from '../../src/services/roster-anchor-service'

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

describe('Roster anchor route handlers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('postHandler - success', async () => {
    vi.spyOn(raService, 'createRosterAnchor').mockResolvedValue([{}])

    const req: any = { body: { employee_id: 1, anchor_date: '15102023' } }
    const res = createMockRes()

    await postHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ message: 'Success add roster anchor' })
  })

  it('postHandler - missing fields -> 400', async () => {
    const req: any = { body: { employee_id: 1 } }
    const res = createMockRes()

    await postHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing fields' })
  })

  it('putHandler - success', async () => {
    vi.spyOn(raService, 'updateRosterAnchor').mockResolvedValue([{}])

    const req: any = { body: { employee_id: 1, anchor_date: '15102023' } }
    const res = createMockRes()

    await putHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Success update roster anchor' })
  })

  it('putHandler - missing fields -> 400', async () => {
    const req: any = { body: { employee_id: 1 } }
    const res = createMockRes()

    await putHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing fields' })
  })

  it('getAllHandler - get by employee id path', async () => {
    vi.spyOn(raService, 'getRosterAnchorByEmployeeId').mockResolvedValue([{ employee_id: 1 }])

    const req: any = { query: { employee_id: '1' } }
    const res = createMockRes()

    await getAllHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Success get roster anchor by employee id' }))
  })
})
