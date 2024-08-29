import { query as q } from 'faunadb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { faunaClient } from '../../../services/fauna'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === 'PATCH') {
    const { email } = req.query
    const { reviewed } = req.body

    if (typeof email !== 'string' || typeof reviewed !== 'boolean') {
      return res.status(400).json({
        event: 'invalid_data',
        message: 'Invalid email or reviewed value',
      })
    }

    try {
      // Encontrar o documento pelo email
      const document: any = await faunaClient.query(
        q.Get(q.Match(q.Index('sales_by_email'), email))
      )

      // Atualizar o documento encontrado
      const updatedSale = await faunaClient.query(
        q.Update(document.ref, {
          data: {
            reviewed,
          },
        })
      )

      return res.status(200).json({ data: updatedSale })
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ event: 'error', name: error.name, message: error.message })
      } else {
        return res.status(500).json({ event: 'unknown_error' })
      }
    }
  } else {
    return res.status(405).json({ event: 'method_not_allowed' })
  }
}
