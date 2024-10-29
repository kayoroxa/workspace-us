import clientPromise from '@/services/mongodb'
import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === 'PATCH') {
    const { id } = req.query
    const { reviewed } = req.body

    // Verifica se `id` é uma string e se `reviewed` é um booleano
    if (typeof id !== 'string' || typeof reviewed !== 'boolean') {
      return res.status(400).json({
        event: 'invalid_data',
        message: 'Invalid id or reviewed value',
      })
    }

    try {
      const client = await clientPromise
      const db = client.db('inovasy')
      const salesCollection = db.collection('sales')

      // Converte `id` para ObjectId e atualiza o campo `reviewed`
      const result = await salesCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { reviewed } },
        { returnDocument: 'after' }
      )

      // Verifica se o documento foi encontrado e atualizado
      if (!result || !result.value) {
        return res.status(404).json({
          event: 'not_found',
          message: 'Document not found',
        })
      }

      return res.status(200).json({ data: result.value })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          event: 'error',
          name: error.name,
          message: error.message,
        })
      } else {
        return res.status(500).json({
          event: 'unknown_error',
        })
      }
    }
  } else {
    return res.status(405).json({ event: 'method_not_allowed' })
  }
}
