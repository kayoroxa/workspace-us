require('./convert.js')

const { sortByOccurrence } = require('./func/statistics.js')
const data = require('./hotmart_sales.json')

const dataFiltered = data
  .map(v => ({
    src: v['Código SRC'],
    status: v['Status da transação'],
  }))
  .filter(({ status }) => status === 'Completo' || status === 'Aprovado')
  .filter(({ src }) => src !== '(none)' && src.includes('pb'))

console.log(dataFiltered)
console.log(sortByOccurrence(dataFiltered, 'src'))
