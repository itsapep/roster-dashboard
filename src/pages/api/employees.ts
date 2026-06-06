import type { NextApiRequest, NextApiResponse } from 'next'
import { postHandler, getAllHandler } from '../../routes/employee-route'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') return postHandler(req, res)
  if (req.method === 'GET') return getAllHandler(req, res)

  res.setHeader('Allow', ['POST', 'GET'])
  res.status(405).end('Method Not Allowed')
}
