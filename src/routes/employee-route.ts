import type { NextApiRequest, NextApiResponse } from 'next'
import { createEmployee } from '../services/employee-service'

export async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, department, role } = req.body

    await createEmployee({ name, department, role })

    return res.status(201).json({ message: 'Success add employee' })
  } catch (err) {
    console.error('create employee error', err)
    return res.status(500).json({ message: 'Error add employee' })
  }
}
