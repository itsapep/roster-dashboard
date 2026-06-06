import { NextApiRequest, NextApiResponse } from 'next'
import { createRosterAnchor, updateRosterAnchor, getAllRosterAnchors, getRosterAnchorByEmployeeId } from '../services/roster-anchor-service'

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

export async function getAllHandler(req: NextApiRequest, res: NextApiResponse){
  try{
    const { employee_id } = req.query

    if (employee_id) {
      const empIdStr = Array.isArray(employee_id) ? employee_id[0] : employee_id;
      const data = await getRosterAnchorByEmployeeId(Number(empIdStr))
      return res.status(200).json({ message: 'Success get roster anchor by employee id', data })
    }

    const data = await getAllRosterAnchors()
    return res.status(200).json({ message: 'Success get all roster anchors', data })
  }catch(err){
    return res.status(500).json({ message: 'Error get roster anchors' })
  }
}

export default { postHandler, putHandler, getAllHandler }
