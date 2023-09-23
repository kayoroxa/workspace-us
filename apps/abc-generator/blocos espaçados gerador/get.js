const fs = require('fs')
require('./fixSentences.js')
const pathJoin = require('path').join

// const file = './frances-sentences.txt'
const pathFile = pathJoin(__dirname, './sentences.txt')

const sentencesRaw = fs.readFileSync(pathFile, { encoding: 'utf-8' })

const sentencesSlipped = sentencesRaw.split('\r\n')
const ignoreAhead = sentencesSlipped.findIndex(s => s.includes('***'))

const sentences = sentencesSlipped
  .slice(0, ignoreAhead > 0 ? ignoreAhead : sentencesSlipped.length)
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
  .slice(0, 300)

// console.log(blocksSequence)
console.log(
  blocksSequence
    .map(v => {
      if (v.frequency === 1) {
        return '-' + v.block
      }
      return v.block
    })
    .join('\n')
)
