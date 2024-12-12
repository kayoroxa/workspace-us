import Toggle from '@/components/toggle'
import { Inter } from 'next/font/google'
import { useQuery } from 'react-query'
import Button from '../components/button'
import { _EventBuy } from '../utils/types/eventBuy'

const inter = Inter({ subsets: ['latin'] })

function diferenceDays(date1: Date, date2: Date) {
  return Math.round(
    Math.abs(date1.getTime() - date2.getTime()) / (1000 * 3600 * 24)
  )
}

export default function Home() {
  let { data: eventsBuy, isLoading } = useQuery<_EventBuy[]>(
    ['events-buy'],
    () => fetch('/api/events-buy').then(res => res.json()),
    {
      refetchInterval: 10 * 60 * 1000,
    }
  )

  if (isLoading) return <div>Loading...</div>
  if (!eventsBuy) return <div>Error {JSON.stringify(eventsBuy)}</div>

  function convertEvent(event: _EventBuy) {
    if (event.event === 'PURCHASE_APPROVED') return 'Comprou 💹'
    if (event.event === 'PURCHASE_COMPLETE') return 'Completo ✅💹'
    if (event.event === 'PURCHASE_OUT_OF_SHOPPING_CART')
      return 'Abandonou Carrinho ❌🛒'
    if (event.event === 'PURCHASE_CANCELED') return 'Compra Cancelada ❌💳'
    if (event.event === 'PURCHASE_PROTEST') return 'Reembolso 😡'
    if (event.event === 'PURCHASE_BILLET_PRINTED')
      return event.pagamento + ' ⏱✉'
    if (event.event === 'PURCHASE_DELAYED') return 'Atrasado ⌛'
    else return event.event
  }

  function emojiHistoric(historic: string) {
    historic = historic.replace(/PURCHASE_APPROVED/g, '💹')
    historic = historic.replace(/PURCHASE_COMPLETE/g, '✅💹')
    historic = historic.replace(/PURCHASE_OUT_OF_SHOPPING_CART/g, '❌🛒')
    historic = historic.replace(/PURCHASE_CANCELED/g, '❌💳')
    historic = historic.replace(/PURCHASE_PROTEST/g, '😡')
    historic = historic.replace(/PURCHASE_BILLET_PRINTED/g, '⏱✉')
    return historic
  }

  if (typeof eventsBuy?.map !== 'function') {
    return <div>Error {JSON.stringify(eventsBuy)}</div>
  }

  eventsBuy = eventsBuy.reduce((acc, event) => {
    const existIndex = acc.findIndex(v => v.email === event.email)
    if (existIndex > -1) {
      // acc.splice(existIndex, 1) // remove
      acc[existIndex] = {
        ...acc[existIndex],
        historic: emojiHistoric(event.event + ' -> ' + acc[existIndex].event),
      }
      return acc
    }
    return [...acc, event]
  }, [] as _EventBuy[])

  return (
    <div className="w-full min-h-screen bg-zinc-800 text-zinc-100 flex flex-col items-center gap-5 p-10 ">
      {typeof eventsBuy?.map === 'function' &&
        eventsBuy?.map(event => (
          <div
            key={event.date}
            className="flex gap-10 bg-zinc-700 p-4 w-fit rounded-lg"
          >
            {event.historic && event.historic.length > 0 && (
              <section>
                <h1>Historic:</h1>
                <h1>{event.historic}</h1>
              </section>
            )}
            <section>
              <h1>Nome:</h1>
              <h4>{event.buyerName}</h4>
            </section>
            <section>
              <h1>Telefone:</h1>
              <h4>{event.phone}</h4>
            </section>
            <section>
              <h1>Email:</h1>
              <h1>{event.email}</h1>
            </section>
            <section className="bg-zinc-600 px-3">
              <h1>Evento:</h1>
              <h1>
                <strong>{convertEvent(event)}</strong>
              </h1>
            </section>
            <section>
              <h1>Dias:</h1>
              {/* atual date - event.date */}
              <h2>{diferenceDays(new Date(event.date), new Date())}</h2>
            </section>
            <section>
              <h1>Data:</h1>

              {/* //timestamp to brasilian date */}
              <h2>
                {new Date(event.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </h2>
            </section>

            <section className="flex justify-center items-center">
              <Toggle id={event.email} />
            </section>

            <section>{event.phone && <Button event={event} />}</section>
          </div>
        ))}
    </div>
  )
}
