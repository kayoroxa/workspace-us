const fs = require('fs')

// const db = require('./db.json')
const sentencesRaw = fs.readFileSync('./sentences.txt', { encoding: 'utf-8' })
const sentences = sentencesRaw
  .split('\r\n')
  .filter(line => !line.startsWith('#'))

// const blocks = db.options
//   .filter(v => v.isOnBoard === true)
//   .map(v => `{${v.name}}`)

const blocks = [
  ...new Set(
    sentences
      .join(' ')
      .toLowerCase()
      .match(/\{(.+?)\}/g)
  ),
]

const blocksSequence = blocks
  .map((block, index) => {
    return {
      block,
      frequency: sentences.filter(sentence =>
        sentence.toLowerCase().includes(block)
      ).length,
    }
  })
  .sort((a, b) => a.frequency - b.frequency)
// .slice(0, 30)

// console.log(blocksSequence)
console.log(
  blocksSequence
    .map(v => {
      return v.block
      if (v.frequency === 1) {
        return '-' + v.block
      }
    })
    // .join('\n')
    .join(',')
)
