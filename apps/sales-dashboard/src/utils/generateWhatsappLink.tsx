import { _EventBuy } from '@/utils/types/eventBuy'

// Função para gerar link do WhatsApp baseado no evento
export function generateWhatsappLink(event: _EventBuy): string {
  let message = ''
  let message2 = ''

  const firstNameRaw = event.buyerName.split(' ')[0].toLowerCase()
  const firstName = firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1)

  // Obter a saudação baseada no horário
  let bomDia = ''
  const timeNow = new Date().getHours()

  if (timeNow >= 6 && timeNow < 12) {
    bomDia = 'Bom dia'
  } else if (timeNow >= 12 && timeNow < 18) {
    bomDia = 'Boa tarde'
  } else {
    bomDia = 'Boa noite'
  }

  // Mensagens baseadas nos tipos de eventos
  if (event.event === 'PURCHASE_APPROVED') {
    message = `
${bomDia} ${firstName} 😃😃 Parabéns por sua iniciativa de querer ter o inglês como segunda língua 🇧🇷🇺🇸👏🏽🚀

Qualquer dúvida que você tiver no curso pode me chamar por aqui.

Você pode acessar o curso por este link: 
https://formula-da-fluencia.club.hotmart.com
    `
  }

  if (event.event === 'PURCHASE_BILLET_PRINTED') {
    const isPix = event.pagamento?.toLowerCase() === 'pix'
    const nome = isPix ? 'pix' : 'boleto'
    message = `
${bomDia} ${firstName}, vi que você gerou um ${nome} para se cadastrar no meu curso de inglês 🇺🇸😃📚.

Estou disponível para esclarecer quaisquer dúvidas sobre o processo de pagamento.

${
  isPix
    ? 'Você conseguiu entender como efetuar o pagamento?'
    : 'Conseguiu baixar o boleto ou quer que eu te mande ele por aqui?'
}
    `
  }

  if (event.event === 'PURCHASE_COMPLETE') {
    message = `
${bomDia} ${firstName} 😃😃 Vi que você entrou para o meu curso de inglês.

Parabéns por sua iniciativa de querer ter o inglês como segunda língua 🇧🇷🇺🇸👏🏽🚀

Qualquer dúvida que você tiver no curso pode me chamar por aqui.
    `
  }

  if (event.event === 'PURCHASE_CANCELED') {
    message = `${bomDia} ${firstName}, vi que você tentou comprar o meu curso de inglês, mas não conseguiu.`
  }

  if (event.event === 'PURCHASE_PROTEST') {
    message = `${bomDia} ${firstName}, vi que você pediu reembolso 😕, o que aconteceu?`
  }

  if (event.event === 'PURCHASE_OUT_OF_SHOPPING_CART') {
    message = `
${bomDia} ${firstName} 😊 Vi que você estava interessado no meu curso de inglês, mas a compra não foi concluída.

Precisa de mais informações sobre o curso? Estou aqui para te ajudar!
    `
  }

  if (event.event === 'PURCHASE_EXPIRED') {
    message = `
${bomDia} ${firstName} 😊, quem fala é Caio. Vi que o prazo para finalizar a compra do curso de inglês expirou.

Mas não se preocupe! Se você ainda está interessado, posso te ajudar.

Você prefere que eu:
1. Reative a sua oferta?
2. Envie mais detalhes sobre o curso?
3. Ou está com alguma outra dúvida?
    `
  }

  // Montar número de telefone corretamente
  const number =
    event?.phone?.length === 11 && event?.phone.toString()[2] === '9'
      ? '55' + event.phone
      : event.phone

  // Gerar link completo do WhatsApp
  return `https://web.whatsapp.com/send/?phone=${number}&text=${encodeURI(
    message.trim()
  )}`
}
