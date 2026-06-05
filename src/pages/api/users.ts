import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../db'
import { users } from '../../db/schema'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await db.select().from(users).limit(10)
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'DB error' })
  }
}
