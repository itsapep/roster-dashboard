import type { NextApiRequest, NextApiResponse } from 'next'
import { postHandler, putHandler } from '../../routes/roster-anchor-route'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method === 'POST') return postHandler(req, res)
  if (req.method === 'PUT') return putHandler(req, res)
  res.setHeader('Allow', ['POST','PUT'])
  res.status(405).end('Method Not Allowed')
}
