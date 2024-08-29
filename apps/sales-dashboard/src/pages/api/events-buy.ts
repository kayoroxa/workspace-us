// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { _EventBuy } from '@/utils/types/eventBuy'
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
    const { name: buyerName, email } = eventData.buyer

    const data = {
      event,
      productName,
      buyerName,
      phone: eventData.buyer.phone || eventData.buyer.checkout_phone,
      email,
      date: creation_date,
      pagamento: eventData?.purchase?.payment?.type,
      // eventData,
    }

    try {
      const sale = await faunaClient.query(
        q.Create(q.Collection('sales'), { data })
      )

      return res.status(201).json({ data: sale })
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ event: 'error', name: error.name, message: error.message })
      } else {
        return res.status(500).json({ event: 'unknown_error' })
      }
    }
  }

  if (req.method === 'GET') {
    try {
      const now = new Date().toISOString()
      //get all collation sales sorted by ts
      const response: any = await faunaClient.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection('sales')), {
            size: 100, // número máximo de resultados por página
            before: q.Time(now), // retorna resultados antes desta data/hora
          }),
          q.Lambda('X', q.Get(q.Var('X')))
        )
        // q.Paginate(q.Match(q.Index('sales_by_date_desc')))
        // q.Map(
        //   q.Paginate(
        //     q.Range(
        //       q.Match(q.Index("get_weekly_list_by_ts")),
        //       q.TimeSubtract(q.Now(), 14, "days"),
        //       q.Now()
        //     )
        //   ),
        //   q.Lambda(
        //     ["ts", "ref"],
        //     q.Get(q.Var("ref"))
        //   )
        // )
      )

      const data = response.data.map(({ ref, data }: any) => ({
        id: ref.id,
        ...data,
      })) as _EventBuy[]

      const dataSorted = data.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      return res.status(200).json(dataSorted)
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ event: 'error', name: error.name, message: error.message })
      } else {
        return res.status(500).json({ event: 'unknown_error' })
      }
    }
  }
}
