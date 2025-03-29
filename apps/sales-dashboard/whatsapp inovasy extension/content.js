// Variável para rastrear se os botões estão exibidos ou não
var buttonsVisible = false;
var buttonContainer = null;

// === BOTÃO PARA ABRIR CHAT VIA E-MAIL (USANDO window.prompt) ===
function injectChatByEmailButton() {
  var chatButton = document.createElement('button');
  chatButton.id = 'chatEmailButton';
  chatButton.innerText = 'Abrir Chat por E-mail';
  // Estilização inline para posicionamento e aparência
  chatButton.style.position = 'fixed';
  chatButton.style.top = '10px';
  chatButton.style.right = '10px';
  chatButton.style.backgroundColor = '#007bff';
  chatButton.style.color = '#fff';
  chatButton.style.padding = '10px 20px';
  chatButton.style.border = 'none';
  chatButton.style.borderRadius = '5px';
  chatButton.style.cursor = 'pointer';
  chatButton.style.zIndex = '1000';

  chatButton.onclick = function () {
    var emailValue = window.prompt('Digite o email:');
    if (emailValue && emailValue.trim() !== '') {
      fetchChatByEmail(emailValue.trim());
    }
  };

  document.body.appendChild(chatButton);
}

// Consulta a API find-phone e chama openChat ao obter o telefone
function fetchChatByEmail(email) {
  const url =
    'https://inovasy-sells-dashboard.netlify.app/api/find-phone?email=' +
    encodeURIComponent(email);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Resposta da API:', data);
      if (data.phone) {
        openChat(data.phone);
      } else {
        alert('Telefone não encontrado para este email.');
      }
    })
    .catch(error => {
      console.error('Erro ao buscar telefone:', error);
      alert('Erro ao buscar telefone.');
    });
}

// === ABRIR O CHAT SEM RECARREGAR A PÁGINA, SIMULANDO O CLICK DE UM LINK ===
function openChat(phone) {
  console.log('Função openChat chamada com phone:', phone);

  // Aplica a lógica para adicionar o código do país, se necessário
  const number =
    phone.length === 11 && phone.toString()[2] === '9'
      ? '55' + phone
      : phone;
  console.log('Número após verificação de código do país:', number);

  // Remove quaisquer caracteres não numéricos
  var cleanPhone = number.replace(/\D/g, '');
  console.log('Número limpo:', cleanPhone);

  // Monta a URL, incluindo o parâmetro text com um valor padrão ("Olá")
  var link = `https://web.whatsapp.com/send/?phone=${cleanPhone}&text=Olá`;
  console.log('Link gerado:', link);

  // Cria um elemento de link temporário para simular o clique
  var tempAnchor = document.createElement('a');
  tempAnchor.href = link;
  tempAnchor.onclick = function (e) {
    e.preventDefault(); // previne a navegação padrão
    window.history.pushState(null, null, link);
    window.dispatchEvent(new Event('popstate'));
    localStorage.setItem(link, true);
    setTimeout(function () {
      var messageInput = document.querySelector('._ak1r [contenteditable="true"]');
      if (messageInput) {
        messageInput.focus();
      }
    }, 1000);
  };

  // Adiciona o elemento temporário ao DOM para que o clique funcione
  document.body.appendChild(tempAnchor);
  // Simula o clique no elemento temporário
  tempAnchor.click();
  // Remove o elemento temporário após o clique
  setTimeout(function () {
    tempAnchor.remove();
  }, 100);
}

// === BOTÃO PARA CARREGAR SELLS (sem alteração) ===
function injectLoadButton() {
  var submitButton = document.createElement('button');
  submitButton.id = 'submitButton';
  const textButton = 'Carregar Sells';
  submitButton.innerText = textButton;
  submitButton.style.position = 'fixed';
  submitButton.style.top = '60px';
  submitButton.style.right = '10px';
  submitButton.style.backgroundColor = '#25D366';
  submitButton.style.color = '#fff';
  submitButton.style.padding = '10px 20px';
  submitButton.style.borderRadius = '5px';
  submitButton.style.border = 'none';
  submitButton.style.cursor = 'pointer';
  submitButton.style.zIndex = '1000';

  document.body.appendChild(submitButton);

  submitButton.onclick = function () {
    if (!buttonsVisible) {
      submitButton.disabled = true;
      submitButton.style.backgroundColor = 'gray';
      submitButton.style.cursor = 'not-allowed';
      submitButton.innerText = 'Carregando...';

      fetch('https://inovasy-sells-dashboard.netlify.app/api/events-buy')
        .then(response => response.json())
        .then(data => {
          injectButtons(data);
          submitButton.innerText = 'Fechar Botões';
          submitButton.style.backgroundColor = '#ff6666';
          submitButton.style.cursor = 'pointer';
          buttonsVisible = true;
        })
        .catch(error => console.error('Erro ao buscar dados da API:', error))
        .finally(() => {
          submitButton.disabled = false;
        });
    } else {
      if (buttonContainer) {
        buttonContainer.remove();
        submitButton.innerText = textButton;
        submitButton.style.backgroundColor = '#25D366';
        buttonsVisible = false;
      }
    }
  };
}

// === INJETAR OS LINKS RETORNADOS PELA API DE SELLS ===
function injectButtons(data) {
  buttonContainer = document.createElement('div');
  buttonContainer.id = 'buttonContainer';
  buttonContainer.style.position = 'fixed';
  buttonContainer.style.top = '110px';
  buttonContainer.style.right = '10px';
  buttonContainer.style.backgroundColor = '#fff';
  buttonContainer.style.padding = '10px';
  buttonContainer.style.border = '2px solid #25d366';
  buttonContainer.style.borderRadius = '5px';
  buttonContainer.style.zIndex = '1000';
  buttonContainer.style.overflowY = 'auto';
  buttonContainer.style.height = '50vh';
  document.body.appendChild(buttonContainer);

  if (Array.isArray(data)) {
    buttonContainer.innerHTML = '';
    data.forEach(function (event) {
      var link = event.whatsappLink;
      if (link) {
        var a = document.createElement('a');
        a.href = link;
        a.innerText = getButtonLabel(link);

        if (localStorage.getItem(link)) {
          a.classList.add('whatsapp-button', 'clicked');
          a.onmouseover = function () {
            a.style.cursor = 'not-allowed';
          };
          a.onmouseout = function () {
            a.style.cursor = 'pointer';
          };
        } else {
          a.classList.add('whatsapp-button', 'not-clicked');
        }

        a.onclick = function (e) {
          e.preventDefault();
          window.history.pushState(null, null, link);
          window.dispatchEvent(new Event('popstate'));
          localStorage.setItem(link, true);
          a.remove();
          setTimeout(function () {
            var messageInput = document.querySelector('._ak1r [contenteditable="true"]');
            if (messageInput) {
              messageInput.focus();
            }
          }, 1000);
        };

        buttonContainer.appendChild(a);
      }
    });
  }
}

// Extrai as primeiras 5 palavras do texto após "text="
function getButtonLabel(link) {
  var textStart = link.indexOf('text=');
  if (textStart !== -1) {
    var message = decodeURIComponent(link.substring(textStart + 5));
    var words = message.split(' ').slice(0, 5);
    return words.join(' ') + (words.length > 5 ? '...' : '');
  }
  return 'Abrir conversa';
}

// Injetar os dois botões na página
injectChatByEmailButton();
injectLoadButton();

// === OPCIONAL: BOTÃO DE ENVIAR VÍDEO ===
async function sendVideoToWhatsApp() {
  const videoUrl = chrome.runtime.getURL('assets/video.mp4');

  try {
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error('Erro ao carregar o vídeo');

    const blob = await response.blob();
    const file = new File([blob], 'video.mp4', { type: 'video/mp4' });

    const inputFile = document.querySelector('input[type="file"]');
    if (!inputFile) {
      console.error('Campo de upload de arquivos não encontrado!');
      return;
    }

    const originalAccept = inputFile.getAttribute('accept') || '';
    inputFile.setAttribute('accept', 'video/*');

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    Object.defineProperty(inputFile, 'files', {
      value: dataTransfer.files,
      writable: false,
    });

    const changeEvent = new Event('change', { bubbles: true });
    inputFile.dispatchEvent(changeEvent);

    console.log('Vídeo carregado com sucesso!');

    inputFile.setAttribute('accept', originalAccept);
  } catch (error) {
    console.error('Erro ao enviar o vídeo:', error);
  }
}

function addUploadButton() {
  const button = document.createElement('button');
  button.innerText = 'Enviar Vídeo';
  button.style.position = 'fixed';
  button.style.top = '20px';
  button.style.left = '20px';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.padding = '10px';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.zIndex = 1000;

  button.onclick = sendVideoToWhatsApp;
  document.body.appendChild(button);
}

addUploadButton();
