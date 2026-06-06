import type { NextApiRequest, NextApiResponse } from 'next'
import { getByIdHandler } from '../../../routes/movement-request-route'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') return getByIdHandler(req, res)
  res.setHeader('Allow', ['GET'])
  res.status(405).end('Method Not Allowed')
}
