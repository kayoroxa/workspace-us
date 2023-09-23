const fs = require('fs')
const destaqueText = require('../src/utils/destaqueText.js')
// require('./fixSentences.js')

// const db = require('./db.json')
const sentencesRaw = fs.readFileSync('./sentences.txt', {
  encoding: 'utf-8',
})

const textsSentences = fs
  .readFileSync('./textos-sentences.txt', { encoding: 'utf-8' })
  .split(/(\r\n|\n+)/g)
  .filter(text => text && !text.match(/\d/g) && text.length > 0)

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

const textWithData = textsSentences.map(text => {
  const blocksIn = blocksSequence.filter(v =>
    text.toLowerCase().includes(v.block.replace(/[{}]/g, ''))
  )

  const textWithoutBlocks = blocksIn.reduce((accText, block) => {
    const blockText = block.block.replace(/[{}]/g, '')
    return accText
      .replace(new RegExp(`\\b${blockText}\\b`, 'gi'), '')
      .replace(/\s+/g, ' ')
  }, text)

  const newsVocabularies = textWithoutBlocks

  return {
    text,
    blocksIn,
    howMany: 1 - textWithoutBlocks.length / text.length,
    newsVocabularies: newsVocabularies,
    frequencyScore: blocksIn.reduce((a, b) => a + b.frequency, 0),
  }
})

function formatTextWithData(textsWithData) {
  const map = textsWithData.map(
    ({ text, howMany, frequencyScore, newsVocabularies }, i) => {
      return {
        text: destaqueText(text, newsVocabularies),
        howMany,
        frequencyScore,
        // newsVocabularies,
      }
    }
  )
  return map.sort((a, b) => a.howMany - b.howMany)
}

const formatText = formatTextWithData(textWithData)
  .filter(v => v.text.length >= 315)
  .slice(-100)

console.clear()
console.log(formatText)
console.log(textWithData.length)

fs.writeFileSync(
  'textos-sentences.txt',
  textWithData
    .sort((a, b) => b.howMany - a.howMany)
    .map(v => v.text)
    .join('\n\n\n')
)
