import type { NextApiRequest, NextApiResponse } from 'next'
import {
  createMovementRequest,
  updateMovementRequest,
  getAllMovementRequests,
  getMovementRequestById,
} from '../services/movement-request-service'

export async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { employee_id, movement_type, start_date, end_date } = req.body
    if (!employee_id || !movement_type || !start_date || !end_date) {
      return res.status(400).json({ message: 'Missing fields' })
    }
    await createMovementRequest({
      employee_id: Number(employee_id),
      movement_type,
      start_date,
      end_date,
    })
    return res.status(201).json({ message: 'Success create movement request' })
  } catch (err) {
    console.error('create movement request error', err)
    return res.status(500).json({ message: 'Error create movement request' })
  }
}

export async function putHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, employee_id, movement_type, start_date, end_date, status, current_comment } = req.body
    if (!id) {
      return res.status(400).json({ message: 'Missing id' })
    }
    await updateMovementRequest({
      id: Number(id),
      employee_id: employee_id ? Number(employee_id) : undefined,
      movement_type,
      start_date,
      end_date,
      status,
      current_comment,
    })
    return res.status(200).json({ message: 'Success update movement request' })
  } catch (err) {
    console.error('update movement request error', err)
    return res.status(500).json({ message: 'Error update movement request' })
  }
}

export async function getAllHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getAllMovementRequests()
    return res.status(200).json({ message: 'Success get all movement request', data })
  } catch (err) {
    console.error('get all movement request error', err)
    return res.status(500).json({ message: 'Error get all movement request' })
  }
}

export async function getByIdHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = Number(req.query.id)
    if (!id) {
      return res.status(400).json({ message: 'Missing id' })
    }
    const data = await getMovementRequestById(id)
    return res.status(200).json({ message: 'Success get movement request by id', data })
  } catch (err) {
    console.error('get movement request by id error', err)
    return res.status(500).json({ message: 'Error get movement request by id' })
  }
}
