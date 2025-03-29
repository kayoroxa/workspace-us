// Variável para rastrear se os botões estão exibidos ou não
var buttonsVisible = false
var buttonContainer = null

// Função para injetar o botão "Carregar Botões" no WhatsApp Web
function injectLoadButton() {
  var submitButton = document.createElement('button')
  submitButton.id = 'submitButton' // Define o ID para aplicar o estilo do CSS
  const textButton = 'Carregar Sells'
  submitButton.innerText = textButton

  // Adiciona o botão ao corpo da página do WhatsApp Web
  document.body.appendChild(submitButton)

  // Adiciona funcionalidade ao botão
  submitButton.onclick = function () {
    if (!buttonsVisible) {
      // Bloqueia o botão enquanto carrega
      submitButton.disabled = true
      submitButton.style.backgroundColor = 'gray'
      submitButton.style.cursor = 'not-allowed'
      submitButton.innerText = 'Carregando...'

      // Carregar botões e exibi-los
      fetch('https://inovasy-sells-dashboard.netlify.app/api/events-buy')
        .then(response => response.json())
        .then(data => {
          injectButtons(data)
          submitButton.innerText = 'Fechar Botões'
          submitButton.style.backgroundColor = '#ff6666' // Vermelho claro
          submitButton.style.cursor = 'pointer'
          buttonsVisible = true
        })
        .catch(error => console.error('Erro ao buscar dados da API:', error))
        .finally(() => {
          // Desbloqueia o botão após o carregamento
          submitButton.disabled = false
        })
    } else {
      // Fechar botões e esconder o container
      if (buttonContainer) {
        buttonContainer.remove()
        submitButton.innerText = textButton
        submitButton.style.backgroundColor = '#25D366' // Verde WhatsApp
        buttonsVisible = false
      }
    }
  }
}

// Função para injetar os botões no WhatsApp Web
function injectButtons(data) {
  buttonContainer = document.createElement('div')
  buttonContainer.id = 'buttonContainer' // Define o ID para aplicar o estilo do CSS
  document.body.appendChild(buttonContainer)

  if (Array.isArray(data)) {
    // Remove botões existentes antes de criar novos
    buttonContainer.innerHTML = '' // Limpa o container de botões antes de adicionar novos

    // Cria um botão para cada link
    data.forEach(function (event) {
      var link = event.whatsappLink
      if (link) {
        var a = document.createElement('a')
        a.href = link
        a.innerText = getButtonLabel(link) // Nome do botão com as 5 primeiras palavras

        // Verifica se o link já foi clicado
        if (localStorage.getItem(link)) {
          a.classList.add('whatsapp-button', 'clicked') // Adiciona a classe para botões já clicados

          // Adiciona comportamento para cursor bloqueado ao passar o mouse
          a.onmouseover = function () {
            a.style.cursor = 'not-allowed'
          }
          a.onmouseout = function () {
            a.style.cursor = 'pointer'
          }
        } else {
          a.classList.add('whatsapp-button', 'not-clicked') // Adiciona a classe para botões não clicados
        }

        // Adiciona funcionalidade ao clicar no botão
        a.onclick = function (e) {
          e.preventDefault()
          window.history.pushState(null, null, link)
          window.dispatchEvent(new Event('popstate'))

          // Salva o link no localStorage para saber que foi clicado
          localStorage.setItem(link, true)

          // Remove o botão clicado
          a.remove()

          // Foca no campo de mensagem automaticamente
          setTimeout(function () {
            var messageInput = document.querySelector(
              '._ak1r [contenteditable="true"]'
            )
            if (messageInput) {
              messageInput.focus() // Foca no campo de texto
            }
          }, 1000) // Pequeno atraso para garantir que o campo esteja visível
        }

        // Adiciona o botão ao container de botões
        buttonContainer.appendChild(a)
      }
    })
  }
}

// Função para extrair as primeiras 5 palavras do texto após "text="
function getButtonLabel(link) {
  var textStart = link.indexOf('text=')
  if (textStart !== -1) {
    var message = decodeURIComponent(link.substring(textStart + 5))
    var words = message.split(' ').slice(0, 5)
    return words.join(' ') + (words.length > 5 ? '...' : '')
  }
  return 'Abrir conversa' // Se não encontrar "text=", usa um nome padrão
}

// Injetar o botão "Carregar Botões" quando o WhatsApp Web carregar
injectLoadButton()

async function sendVideoToWhatsApp() {
  // Caminho do vídeo local na extensão
  const videoUrl = chrome.runtime.getURL('assets/video.mp4')

  try {
    // Carregar o vídeo como Blob
    const response = await fetch(videoUrl)
    if (!response.ok) throw new Error('Erro ao carregar o vídeo')

    const blob = await response.blob()
    const file = new File([blob], 'video.mp4', { type: 'video/mp4' })

    // Encontrar o input de arquivos
    const inputFile = document.querySelector('input[type="file"]')
    if (!inputFile) {
      console.error('Campo de upload de arquivos não encontrado!')
      return
    }

    // Alterar o atributo 'accept' para aceitar apenas vídeos temporariamente
    const originalAccept = inputFile.getAttribute('accept') || ''
    inputFile.setAttribute('accept', 'video/*')

    // Adicionar o arquivo ao input usando DataTransfer
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)

    // Atribuir o arquivo ao input.files
    Object.defineProperty(inputFile, 'files', {
      value: dataTransfer.files,
      writable: false,
    })

    // Disparar o evento 'change' para o WhatsApp processar o upload
    const changeEvent = new Event('change', { bubbles: true })
    inputFile.dispatchEvent(changeEvent)

    console.log('Vídeo carregado com sucesso!')

    // Restaurar o atributo 'accept' original
    inputFile.setAttribute('accept', originalAccept)
  } catch (error) {
    console.error('Erro ao enviar o vídeo:', error)
  }
}

// Função para adicionar um botão para enviar o vídeo
function addUploadButton() {
  const button = document.createElement('button')
  button.innerText = 'Enviar Vídeo'
  button.style.position = 'fixed'
  button.style.top = '20px'
  button.style.left = '20px'
  button.style.backgroundColor = '#4CAF50'
  button.style.color = 'white'
  button.style.padding = '10px'
  button.style.border = 'none'
  button.style.borderRadius = '5px'
  button.style.cursor = 'pointer'
  button.style.zIndex = 1000

  button.onclick = sendVideoToWhatsApp // Chama a função de envio de vídeo

  document.body.appendChild(button) // Adiciona o botão à página
}

// Adiciona o botão ao carregar a página
addUploadButton()
