const fs = require('fs')
const Papa = require('papaparse')

const csvData = fs.readFileSync(__dirname + '/hotmart_sales.csv', {
  encoding: 'utf-8',
})

const parsedData = Papa.parse(csvData, { header: true }).data

const jsonData = JSON.stringify(parsedData)

fs.writeFileSync(
  __dirname + '/hotmart_sales.js',
  'const sales = ' + jsonData,
  'utf-8'
)
fs.writeFileSync(__dirname + '/hotmart_sales.json', jsonData, 'utf-8')
