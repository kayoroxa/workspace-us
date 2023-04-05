// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { query as q } from 'faunadb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { faunaClient } from '../../services/fauna'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === 'POST') {
    const { event, data: eventData, creation_date } = req.body

    const productName = eventData.product.name
    const { name: buyerName, checkout_phone: phone, email } = eventData.buyer

    const data = {
      event,
      productName,
      buyerName,
      phone,
      email,
      date: creation_date,
    }

    try {
      const sale = await faunaClient.query(
        q.Create(q.Collection('sales'), { data })
      )

      return res.status(201).json({ data: sale })
    } catch (error) {
      return res.status(500).json({ event: 'error' })
    }
  }

  if (req.method === 'GET') {
    try {
      //get all collation sales sorted by ts
      const response: any = await faunaClient.query(
        q.Map(
          q.Paginate(q.Match(q.Index('sales'))),
          q.Lambda('Sales', q.Get(q.Var('Sales')))
        )
      )

      return res.status(200).json(response.data.map(({ data }: any) => data))
    } catch (error) {
      return res.status(500).json({ event: 'error' })
    }
  }
}