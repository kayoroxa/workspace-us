chrome.action.onClicked.addListener(tab => {
  // Injetar o código do content.js na aba ativa
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js'],
  })
})
