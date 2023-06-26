// import moment, { MomentInput } from 'moment'

export default function myDate(str: any) {
  debugger
  const isNotDate = str.includes('/')

  if (isNotDate) {
    var partesData = str.split('/')

    // Obtém o dia, mês e ano
    var dia = parseInt(partesData[0], 10)
    var mes = parseInt(partesData[1], 10) - 1 // Os meses são indexados a partir de 0
    var ano = parseInt(partesData[2], 10)

    // Cria um objeto de data usando os valores obtidos
    var data = new Date(ano, mes, dia)

    return data
  } else {
    return new Date(str)
  }
  // return moment(str).toDate()
}

export function getTodayDate() {
  return new Date().toLocaleDateString('pt-BR')
}
