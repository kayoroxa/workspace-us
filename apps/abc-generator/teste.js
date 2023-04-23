const readlineSync = require('readline-sync')

const questions = [
  'What time is it?',
  'Do you like pizza?',
  'How old are you?',
  'Where do you live?',
  'Can you speak Spanish?',
  'Did you have breakfast today?',
  'Who is your favorite actor?',
  'Why are you studying English?',
  'Have you ever been to New York?',
  'Are you feeling well today?',
]

function askQuestion() {
  const question = questions[Math.floor(Math.random() * questions.length)]
  const answer = prompt(question)
  if (checkAnswer(answer, question)) {
    console.log('Correct!')
  } else {
    console.log("Sorry, that's not correct. Please try again.")
    askQuestion()
  }
}

function checkAnswer(answer, question) {
  // implemente aqui a lógica para verificar se a resposta está correta
  // dependendo da pergunta, a lógica pode variar bastante
  // você pode usar bibliotecas como NLTK para ajudar a analisar a resposta
  return true
}

while (true) {
  askQuestion()
  const playAgain = prompt('Do you want to play again? (y/n)')
  if (playAgain.toLowerCase() !== 'y') {
    break
  }
}

console.log('Thanks for playing!')
