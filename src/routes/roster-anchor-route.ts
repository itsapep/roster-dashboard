import { NextApiRequest, NextApiResponse } from 'next'
import { createRosterAnchor, updateRosterAnchor } from '../services/roster-anchor-service'

export async function postHandler(req: NextApiRequest, res: NextApiResponse){
  try{
    const { employee_id, anchor_date } = req.body
    if (!employee_id || !anchor_date) return res.status(400).json({ message: 'Missing fields' })
    await createRosterAnchor({ employee_id: Number(employee_id), anchor_date })
    return res.status(201).json({ message: 'Success add roster anchor' })
  }catch(err){
    return res.status(500).json({ message: 'Error add roster anchor' })
  }
}

export async function putHandler(req: NextApiRequest, res: NextApiResponse){
  try{
    const { employee_id, anchor_date } = req.body
    if (!employee_id || !anchor_date) return res.status(400).json({ message: 'Missing fields' })
    await updateRosterAnchor({ employee_id: Number(employee_id), anchor_date })
    return res.status(200).json({ message: 'Success update roster anchor' })
  }catch(err){
    return res.status(500).json({ message: 'Error update roster anchor' })
  }
}

export default { postHandler, putHandler }
