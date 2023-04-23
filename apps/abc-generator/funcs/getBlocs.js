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
function getBlocs({ markNews, joinBy = '\n' }) {
  const blocks = blocksSequence.map(v => {
    if (markNews === true && v.frequency === 1) {
      return '-' + v.block
    }
    return v.block
  })

  if (joinBy === false) {
    return blocks.map(b => b.replace(/[{}]/g, ''))
  }
  return blocks.join(joinBy)
}

module.exports = getBlocs
