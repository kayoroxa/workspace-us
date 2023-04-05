import Button from '@/components/button'
import { _EventBuy } from '@/utils/types/eventBuy'
import { Inter } from 'next/font/google'
import { useQuery } from 'react-query'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: eventsBuy, isLoading } = useQuery<_EventBuy[]>(
    ['events-buy'],
    () => fetch('/api/events-buy').then(res => res.json())
  )

  return (
    <div className="w-full min-h-screen bg-zinc-800 text-zinc-100 flex justify-center items-start p-10 ">
      {eventsBuy &&
        eventsBuy.map(event => (
          <div
            key={event.date}
            className="flex gap-10 bg-zinc-700 p-4 w-fit rounded-lg"
          >
            <section>
              <h1>Nome:</h1>
              <h4>{event.phone}</h4>
            </section>
            <section>
              <h1>Telefone:</h1>
              <h4>{event.phone}</h4>
            </section>
            <section>
              <h1>Evento:</h1>
              <h1>{event.event}</h1>
            </section>
            <section>
              <h1>Email:</h1>
              <h1>{event.email}</h1>
            </section>
            <section>
              <Button event={event} />
            </section>
          </div>
        ))}
    </div>
  )
}
