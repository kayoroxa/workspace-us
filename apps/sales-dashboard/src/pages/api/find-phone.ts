// src/pages/api/find-phone.ts
import clientPromise from '@/services/mongodb'
import { _EventBuy } from '@/utils/types/eventBuy'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = req.query.email as string

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    const client = await clientPromise
    const db = client.db('inovasy')
    const salesCollection = db.collection<_EventBuy>('sales')

    const sale = await salesCollection.findOne(
      { email },
      { sort: { date: -1 } } // Retorna o mais recente
    )

    if (!sale) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({
      phone: sale.phone,
      name: sale.buyerName,
      email: sale.email,
    })
  } catch (error: any) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
    })
  }
}
