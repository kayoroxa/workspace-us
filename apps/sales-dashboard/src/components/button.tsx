import { _EventBuy } from '@/utils/types/eventBuy'

export default function Button({ event }: { event: _EventBuy }) {
  let message = ''

  if (event.event === 'PURCHASE_APPROVED') {
    message = 'Conseguiu ter acesso as aulas?'
  }

  if (event.event === 'PURCHASE_CANCELED') {
    message = 'Você não conseguiu comprar!'
  }

  if (event.event === 'PURCHASE_PROTEST') {
    message = 'Por que você pediu reembolso?'
  }

  return (
    <button className="bg-green-600 px-4 py-3 shadow-lg hover:bg-green-700">
      <a
        href={`https://web.whatsapp.com/send/?phone=55${event.phone}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Whatsapp
      </a>
    </button>
  )
}
