import { NextApiRequest, NextApiResponse } from 'next'
import { createEmployee } from '../services/employee-service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, department, role } = req.body
    if (!name || !department) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    await createEmployee({ name, department, role })
    return res.status(201).json({ message: 'Success add employee' })
  } catch (err) {
    console.error('Error adding employee', err)
    return res.status(500).json({ message: 'Error add employee' })
  }
}
