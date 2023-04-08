import { _EventBuy } from '@/utils/types/eventBuy'

export default function Button({ event }: { event: _EventBuy }) {
  let message = ''

  const firstNameRaw = event.buyerName.split(' ')[0].toLowerCase()
  const firstName = firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1)

  //get time now to know if is good morning
  let bomDia = ''

  const timeNow = new Date().getHours()

  if (timeNow >= 6 && timeNow < 12) {
    bomDia = 'Bom dia'
  } else if (timeNow >= 12 && timeNow < 18) {
    bomDia = 'Boa tarde'
  } else if (timeNow >= 18 && timeNow < 24) {
    bomDia = 'Boa noite'
  }

  if (event.event === 'PURCHASE_APPROVED') {
    message = `
${bomDia} ${firstName} 😃😃 vi que você entrou pro meu curso de inglês.

Parabéns por sua iniciativa de querer ter o inglês como segunda lingua 🇧🇷🇺🇸👏🏽🚀

Qualquer duvida que você tiver no curso pode me chamar por aqui.

Falando nisso, já conseguiu receber o acesso as aulas do curso??          
    `
  }

  if (event.event === 'PURCHASE_BILLET_PRINTED') {
    message = `
${bomDia} ${firstName}, vi que você gerou um boleto/pix para se cadastrar no meu curso de inglês 🇺🇸😃📚, 

Estou disponível para esclarecer quaisquer dúvidas que possam ter surgido em relação ao processo de pagamento.

Você conseguiu entender como efetuar o pagamento?    
    `
  }
  if (event.event === 'PURCHASE_COMPLETE') {
    message = `
${bomDia} ${firstName} 😃😃 vi que você entrou pro meu curso de inglês.

Parabéns por sua iniciativa de querer ter o inglês como segunda lingua 🇧🇷🇺🇸👏🏽🚀

Qualquer duvida que você tiver no curso pode me chamar por aqui.

Falando nisso, já conseguiu receber o acesso as aulas do curso??  
    `
  }

  if (event.event === 'PURCHASE_CANCELED') {
    message = 'Você não conseguiu comprar!'
  }

  if (event.event === 'PURCHASE_PROTEST') {
    message = 'Por que você pediu reembolso?'
  }

  const number = event?.phone?.length === 11 ? '55' + event.phone : event.phone

  return (
    <button className="bg-green-600 px-4 py-3 shadow-lg hover:bg-green-700">
      <a
        href={`https://web.whatsapp.com/send/?phone=${number}&text=${encodeURI(
          message.trim()
        )}`}
        target="_blank"
        rel="noreferrer"
        // rel="noopener noreferrer"
      >
        Whatsapp
      </a>
    </button>
  )
}
