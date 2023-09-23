const fs = require('fs')
const pathJoin = require('path').join

const pathFile = pathJoin(__dirname, './sentences.txt')
function fixSentencesBlocosFaltantes(sentences, blocos) {
  const blocosOrderedBySize = blocos.sort((a, b) => {
    const currentIs = a.endsWith('to}')
    const prevIs = b.endsWith('to}')

    if (currentIs && !prevIs) return -1
    return b.length - a.length
  })

  const sentencesFixed = sentences.map(sentence => {
    if (sentence.includes('{') || sentence.startsWith('#')) {
      return sentence.toLowerCase()
    }

    blocosOrderedBySize.forEach(blocoWithKeys => {
      const bloco = blocoWithKeys.replace(/[{}]/g, '')
      sentence = sentence.replace(/[.,!:"]/g, '')

      const regex = new RegExp(`{[^{}]*}|\\b${bloco}\\b`, 'gi')
      sentence = sentence.replace(regex, match => {
        if (match.startsWith('{') && match.endsWith('}')) {
          return match // Mantém o conteúdo entre chaves inalterado
        } else {
          return match.replace(new RegExp(`\\b(${bloco})\\b`, 'gi'), '{$1}')
        }
      })
    })
    return sentence.toLowerCase()
  })

  return sentencesFixed
}

// const db = require('./db.json')
const sentencesRaw = fs.readFileSync(pathFile, {
  encoding: 'utf-8',
})

const sentencesOld = sentencesRaw.split('\r\n')
const indexCut = sentencesOld.findIndex(s => s.includes('**'))
const sentences = sentencesOld.slice(
  0,
  indexCut > 0 ? indexCut : sentencesOld.length
)

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

const sentencesFixed = fixSentencesBlocosFaltantes(sentences, blocks)

fs.writeFileSync(
  pathFile,
  [...sentencesFixed, ...sentencesOld.slice(indexCut, sentencesOld.length)]
    .join('\r\n')
    .replace(/\"/g, '')
)
