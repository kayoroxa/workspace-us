import { _EventBuy } from '@/utils/types/eventBuy'

// Função para gerar link do WhatsApp baseado no evento
export function generateWhatsappLink(event: _EventBuy): string {
  let message = ''
  let message2 = ''

  const firstNameRaw = event.buyerName.split(' ')[0].toLowerCase()
  const firstName = firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1)

  // Obter a saudação baseada no horário
  let bomDia = ''
  const timeNow = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: 'numeric',
    hour12: false,
  })

  const hourNow = parseInt(timeNow)

  if (hourNow >= 6 && hourNow < 12) {
    bomDia = 'Bom dia'
  } else if (hourNow >= 12 && hourNow < 18) {
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

  if (event.event === 'PURCHASE_DELAYED') {
    const lastParcela = event.installments_number
    const currentParcela = event.recurrence_number

    const faltando =
      lastParcela && currentParcela ? lastParcela - currentParcela + 1 : false

    const isLast = lastParcela === currentParcela || currentParcela === 12

    if (isLast) {
      message = `${bomDia}, ${firstName}, sua *ultima* parcela, não foi possível ser debitada 😕, só falta essa parcela 🎉`
    } else if (faltando && faltando <= 3) {
      message = `${bomDia}, ${firstName}, não foi possível ser debitada 😕, só faltam ${faltando} parcelas 🎉`
    } else if (currentParcela && currentParcela <= 7) {
      message = `${bomDia}, ${firstName}, sua ${currentParcela}ª parcela, não foi possível ser debitada 😕`
    } else {
      message = `${bomDia}, ${firstName}, sua parcela, não foi possível ser debitada 😕`
    }

    message += `

Confere se está tudo certo com o seu cartão para você poder continuar com o acesso ao curso.

Por esse link você consegue acompanhar suas parcelas: https://consumer.hotmart.com/purchase
    `
  }

  if (event.event === 'PURCHASE_CANCELED') {
    message = `${bomDia} ${firstName}, vi que você tentou comprar o meu curso de inglês, mas não conseguiu.`
    if (event.refusal_reason === 'Transaction refused') {
      message =
        message +
        `

Verifiquei aqui, acontece que a outra forma de pagamento está indisponível no momento. 

Então por favor *utilize esta* plataforma para realizar o pagamento: bit.ly/pagamento-formula-da-fluencia

Assim que efetuar o pagamento, avise-me aqui no WhatsApp para que eu te adicionar ao curso. 🤝🙂
      `
    }
    if (event.refusal_reason?.includes('Saldo insuficiente')) {
      message =
        message +
        `

Verifiquei aqui, e infelizmente o pagamento não foi concluído devido a saldo insuficiente.

Mas não se preocupe! É possível realizar a compra mesmo sem ter o limite total no cartão, desde que você tenha limite suficiente para pelo menos uma parcela. Ou seja, se o valor de cada parcela estiver dentro do seu limite, a transação será aprovada normalmente.

Gostaria de tentar dessa forma? 🤝🙂
      `
    }
  }

  if (event.event === 'PURCHASE_PROTEST') {
    message = `${bomDia} ${firstName}, vi que você pediu reembolso 😕, o que aconteceu?`
  }

  if (event.event === 'PURCHASE_OUT_OF_SHOPPING_CART') {
    message = `
${bomDia} ${firstName} 😊 Vi que você estava interessado no meu curso de inglês, mas a compra não foi concluída.

Precisa de mais informações sobre o curso? Estou aqui para te ajudar!

*Quer que eu te mande alguns depoimentos dos alunos??*
    `
  }

  if (event.event === 'PURCHASE_EXPIRED') {
    message = `
${bomDia} ${firstName} 😊, quem fala é Caio. Vi que o prazo para finalizar a compra do curso de inglês expirou.

Mas não se preocupe! Se você ainda está interessado, posso te ajudar.

Você prefere que eu:
1. Reative a sua oferta?
2. Envie mais detalhes sobre o curso?
3. Quer que eu te mande *depoimentos*?
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
