const str = 'what {are} you {doing}'

const regex = /{[^{}]*}|you/g
const result = str.replace(regex, match => {
  if (match.startsWith('{') && match.endsWith('}')) {
    return match // Mantém o conteúdo entre chaves inalterado
  } else {
    return match.replace(/you/g, 'i')
  }
})

console.log(result)
