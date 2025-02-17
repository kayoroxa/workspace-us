// src/pages/api/events-buy.ts
import clientPromise from '@/services/mongodb'
import { generateWhatsappLink } from '@/utils/generateWhatsappLink'
import { _EventBuy } from '@/utils/types/eventBuy'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostHog } from 'posthog-node'

const posthog = new PostHog('phc_KPVLO4Ylczu9Zf75JjFVZ2JzAe8opg5BfLDNq7lQFb3', {
  host: 'https://us.i.posthog.com',
  flushAt: 1,
})

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
      refusal_reason: eventData.purchase?.payment?.refusal_reason || undefined,
      recurrence_number: eventData.purchase?.recurrence_number,
      installments_number:
        eventData.purchase?.payment?.installments_number || undefined,
      src:
        eventData.purchase?.origin?.sck?.replace(/id=[\w-]+/, '') ??
        eventData.purchase?.origin?.src?.replace(/id=[\w-]+/, '') ??
        null,
      distinctId: eventData.purchase?.origin?.sck
        ? (eventData.purchase?.origin?.sck.match(/id=([\w-]+)/) || [])[1]
        : null,
      approved_date: eventData.purchase?.approved_date,
      // sessionId: eventData.purchase?.origin?.sck
      //   ? (eventData.purchase?.origin?.sck.match(/si=([\w-]+)/) || [])[1]
      //   : null,
    }

    // "refusal_reason": "Transaction refused",

    try {
      // const result = await salesCollection.insertOne(data)
      const whatsappLink = generateWhatsappLink(data)

      let madeAPostHogRequest = false
      let captureData: any = null
      let resultPost: any = null

      if (data.distinctId && data.distinctId !== 'undefined') {
        const timestamp =
          eventData.purchase?.approved_date &&
          Number(eventData.purchase?.approved_date) !== 0
            ? new Date(Number(eventData.purchase.approved_date))
            : new Date()

        captureData = {
          distinctId: data.distinctId, // Usando ref como distinct_id
          timestamp,
          event: event, // Nome do evento
          properties: {
            productName: data.productName,
            buyerName: data.buyerName,
            phone: data.phone,
            email: data.email,
            paymentMethod: data.pagamento,
            refusalReason: data.refusal_reason,
            recurrenceNumber: data.recurrence_number,
            installmentsNumber: data.installments_number,
            src: data.src,
            distinctId: data.distinctId,
            date: data.date,
          },
        }

        posthog.capture(captureData)

        posthog.identify({
          distinctId: data.distinctId,
          properties: {
            email: data.email,
            name: data.buyerName,
            phone: data.phone,
          },
        })

        madeAPostHogRequest = true
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          resultPost = await posthog.flush()
          console.log('result', resultPost)
        } catch (flushError) {
          // Se ocorrer erro no flush, você pode registrar ou tratar de outra forma
        }
      }

      return res.status(201).json({
        // data: { ...data, id: result.insertedId.toString() },
        whatsappLink,
        madeAPostHogRequest,
        resultPost,
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
        .find({
          $or: [
            { event: 'PURCHASE_DELAYED' }, // Ignora recurrence_number quando for PURCHASE_DELAYED
            { recurrence_number: { $in: [1, null] } }, // Aplica filtro em outros casos, só pega as primeiras parcelas.
          ],
        })
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
          installments_number: sale.installments_number || null,
          recurrence_number: sale.recurrence_number || null,
          src: sale.src === undefined ? undefined : sale.src, // 🔹 Adicionado src
          distinctId:
            sale.distinctId === undefined ? undefined : sale.distinctId, // 🔹 Adicionado ref
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
