const fs = require('fs')

const db = require('./db.json')
const sentencesRaw = fs.readFileSync('./sentences.txt', { encoding: 'utf-8' })
const sentences = sentencesRaw.split('\r\n')

const aa = db.options
  .filter(v => v.isOnBoard === true)
  .map(v => `{${v.name}}`)
  .join('\n')

console.log(sentences)
