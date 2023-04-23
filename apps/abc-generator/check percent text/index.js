const getBlocs = require('../funcs/getBlocs')

const fs = require('fs')
const text = fs.readFileSync(__dirname + '/text.txt', { encoding: 'utf-8' })

const allBlocks = getBlocs({ markNews: false, joinBy: false })

const notInText = allBlocks.filter(v => !text.includes(v))
const inText = allBlocks.filter(v => text.includes(v))

console.log(notInText)
console.log(inText)
console.log(
  `not in: ${notInText.length} | in: ${allBlocks.length - notInText.length}`
)
