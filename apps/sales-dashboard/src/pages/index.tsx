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
  const { data: eventsBuy, isLoading } = useQuery<_EventBuy[]>(
    ['events-buy'],
    () => fetch('/api/events-buy').then(res => res.json()),
    {
      refetchInterval: 3 * 60 * 1000,
    }
  )

  function convertEvent(event: string) {
    if (event === 'PURCHASE_APPROVED') return 'Comprou 💹'
    if (event === 'PURCHASE_COMPLETE') return 'Completo ✅💹'
    if (event === 'PURCHASE_OUT_OF_SHOPPING_CART')
      return 'Abandonou Carrinho ❌🛒'
    if (event === 'PURCHASE_CANCELED') return 'Compra Cancelada ❌💳'
    if (event === 'PURCHASE_BILLET_PRINTED') return 'pix/boleto ⏱✉'
    else return event
  }

  return (
    <div className="w-full min-h-screen bg-zinc-800 text-zinc-100 flex flex-col items-center gap-5 p-10 ">
      {eventsBuy &&
        eventsBuy.map(event => (
          <div
            key={event.date}
            className="flex gap-10 bg-zinc-700 p-4 w-fit rounded-lg"
          >
            <section>
              <h1>Nome:</h1>
              <h4>{event.buyerName}</h4>
            </section>
            <section>
              <h1>Telefone:</h1>
              <h4>{event.phone}</h4>
            </section>
            <section>
              <h1>Evento:</h1>
              <h1>{convertEvent(event.event)}</h1>
            </section>
            <section>
              <h1>Email:</h1>
              <h1>{event.email}</h1>
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
              <Toggle
                id={event.email}
                comprou={event.event === 'PURCHASE_APPROVED'}
              />
            </section>

            <section>{event.phone && <Button event={event} />}</section>
          </div>
        ))}
    </div>
  )
}
