// src/pages/api/events-buy.ts
import clientPromise from '@/services/mongodb'
import { generateWhatsappLink } from '@/utils/generateWhatsappLink'
import { _EventBuy } from '@/utils/types/eventBuy'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const client = await clientPromise
  const db = client.db('inovasy')
  const salesCollection = db.collection<_EventBuy>('sales') // Tipagem explícita da coleção como _EventBuy

  if (req.method === 'POST') {
    const { event, data: eventData, creation_date } = req.body

    const data: Omit<_EventBuy, 'id'> = {
      event,
      productName: eventData.product.name,
      buyerName: eventData.buyer.name,
      phone: eventData.buyer.phone || eventData.buyer.checkout_phone,
      email: eventData.buyer.email,
      date: creation_date,
      pagamento: eventData.purchase?.payment?.type,
      refusal_reason: eventData.purchase?.payment?.refusal_reason || null,
    }

    // "refusal_reason": "Transaction refused",

    try {
      const result = await salesCollection.insertOne(data)
      const whatsappLink = generateWhatsappLink(data)

      return res.status(201).json({
        data: { ...data, id: result.insertedId.toString() },
        whatsappLink,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          event: 'error',
          name: error.name,
          message: error.message,
        })
      } else {
        return res.status(500).json({
          event: 'unknown_error',
          message: 'An unexpected error occurred.',
        })
      }
    }
  }

  if (req.method === 'GET') {
    try {
      const sales = await salesCollection
        .find()
        .sort({ date: -1 })
        .limit(100)
        .toArray()
      const data: _EventBuy[] = sales.map(sale => {
        const whatsappLink = sale.phone ? generateWhatsappLink(sale) : null

        return {
          id: sale._id.toString(),
          productName: sale.productName,
          buyerName: sale.buyerName,
          phone: sale.phone,
          email: sale.email,
          event: sale.event,
          date: sale.date,
          pagamento: sale.pagamento,
          historic: sale.historic,
          reviewed: sale.reviewed,
          whatsappLink,
        } as _EventBuy
      })

      return res.status(200).json(data)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          event: 'error',
          name: error.name,
          message: error.message,
        })
      } else {
        return res.status(500).json({
          event: 'unknown_error',
          message: 'An unexpected error occurred.',
        })
      }
    }
  }
}
