import type { NextApiRequest, NextApiResponse } from 'next'
import { postHandler } from '../../routes/employee-route'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return postHandler(req, res)
  }

  res.setHeader('Allow', 'POST')
  res.status(405).end('Method Not Allowed')
}
