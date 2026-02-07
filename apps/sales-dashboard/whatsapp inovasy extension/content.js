// Variável para rastrear se os botões estão exibidos ou não
var buttonsVisible = false;
var buttonContainer = null;

function markSaleAsReviewedOnDb(saleId) {
  if (!saleId) return;

  try {
    var storageKey = "inovasy_reviewed_" + saleId;
    if (localStorage.getItem(storageKey)) return;

    fetch(
      "https://inovasy-sells-dashboard.netlify.app/api/" + saleId + "/review",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
        keepalive: true,
        body: JSON.stringify({ reviewed: true }),
      }
    )
      .then(function (res) {
        if (!res.ok)
          throw new Error("Failed to update reviewed status: " + res.status);
        return res.json();
      })
      .then(function () {
        localStorage.setItem(storageKey, "true");
      })
      .catch(function (err) {
        console.error("Erro ao atualizar reviewed no DB");
      });
  } catch (err) {
    console.error("Erro inesperado ao marcar reviewed no DB");
  }
}

// === BOTÃO PARA ABRIR CHAT VIA E-MAIL (USANDO window.prompt) ===
function injectChatByEmailButton() {
  if (document.getElementById("chatEmailButton")) return;

  var chatButton = document.createElement("button");
  chatButton.id = "chatEmailButton";
  chatButton.innerText = "Abrir Chat por E-mail";
  // Estilização inline para posicionamento e aparência
  chatButton.style.position = "fixed";
  chatButton.style.top = "10px";
  chatButton.style.right = "10px";
  chatButton.style.backgroundColor = "#007bff";
  chatButton.style.color = "#fff";
  chatButton.style.padding = "10px 20px";
  chatButton.style.border = "none";
  chatButton.style.borderRadius = "5px";
  chatButton.style.cursor = "pointer";
  chatButton.style.zIndex = "1000";

  chatButton.onclick = function () {
    var emailValue = window.prompt("Digite o email:");
    if (emailValue && emailValue.trim() !== "") {
      fetchChatByEmail(emailValue.trim());
    }
  };

  document.body.appendChild(chatButton);
}

// Consulta a API find-phone e chama openChat ao obter o telefone
function fetchChatByEmail(email) {
  const url =
    "https://inovasy-sells-dashboard.netlify.app/api/find-phone?email=" +
    encodeURIComponent(email);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.phone) {
        openChat(data.phone);
      } else {
        alert("Telefone não encontrado para este email.");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar telefone");
      alert("Erro ao buscar telefone.");
    });
}

// === ABRIR O CHAT SEM RECARREGAR A PÁGINA, SIMULANDO O CLICK DE UM LINK ===
function openChat(phone) {
  // Aplica a lógica para adicionar o código do país, se necessário
  const number =
    phone.length === 11 && phone.toString()[2] === "9" ? "55" + phone : phone;

  // Remove quaisquer caracteres não numéricos
  var cleanPhone = number.replace(/\D/g, "");

  // Monta a URL, incluindo o parâmetro text com um valor padrão ("Olá")
  var link = `https://web.whatsapp.com/send/?phone=${cleanPhone}&text=Olá`;

  // Cria um elemento de link temporário para simular o clique
  var tempAnchor = document.createElement("a");
  tempAnchor.href = link;
  tempAnchor.onclick = function (e) {
    e.preventDefault(); // previne a navegação padrão
    window.history.pushState(null, null, link);
    window.dispatchEvent(new Event("popstate"));
    localStorage.setItem(link, true);
    setTimeout(function () {
      var messageInput = document.querySelector(
        '._ak1r [contenteditable="true"]'
      );
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
  if (document.getElementById("submitButton")) return;

  var submitButton = document.createElement("button");
  submitButton.id = "submitButton";
  const textButton = "Carregar Sells";
  submitButton.innerText = textButton;
  submitButton.style.position = "fixed";
  submitButton.style.top = "60px";
  submitButton.style.right = "10px";
  submitButton.style.backgroundColor = "#25D366";
  submitButton.style.color = "#fff";
  submitButton.style.padding = "10px 20px";
  submitButton.style.borderRadius = "5px";
  submitButton.style.border = "none";
  submitButton.style.cursor = "pointer";
  submitButton.style.zIndex = "1000";

  document.body.appendChild(submitButton);

  submitButton.onclick = function () {
    if (!buttonsVisible) {
      submitButton.disabled = true;
      submitButton.style.backgroundColor = "gray";
      submitButton.style.cursor = "not-allowed";
      submitButton.innerText = "Carregando...";

      fetch("https://inovasy-sells-dashboard.netlify.app/api/events-buy")
        .then((response) => response.json())
        .then((data) => {
          injectButtons(data);
          submitButton.innerText = "Fechar Botões";
          submitButton.style.backgroundColor = "#ff6666";
          submitButton.style.cursor = "pointer";
          buttonsVisible = true;
        })
        .catch(() => console.error("Erro ao buscar dados da API"))
        .finally(() => {
          submitButton.disabled = false;
        });
    } else {
      if (buttonContainer) {
        buttonContainer.remove();
        submitButton.innerText = textButton;
        submitButton.style.backgroundColor = "#25D366";
        buttonsVisible = false;
      }
    }
  };
}

// === INJETAR OS LINKS RETORNADOS PELA API DE SELLS ===
function injectButtons(data) {
  buttonContainer = document.createElement("div");
  buttonContainer.id = "buttonContainer";
  buttonContainer.style.position = "fixed";
  buttonContainer.style.top = "110px";
  buttonContainer.style.right = "10px";
  buttonContainer.style.backgroundColor = "#fff";
  buttonContainer.style.padding = "10px";
  buttonContainer.style.border = "2px solid #25d366";
  buttonContainer.style.borderRadius = "5px";
  buttonContainer.style.zIndex = "1000";
  buttonContainer.style.overflowY = "auto";
  buttonContainer.style.height = "50vh";
  document.body.appendChild(buttonContainer);

  if (Array.isArray(data)) {
    buttonContainer.innerHTML = "";
    data.forEach(function (event) {
      var link = event.whatsappLink;
      if (link) {
        var a = document.createElement("a");
        a.href = link;
        a.innerText = getButtonLabel(link);

        var isReviewedOnDb = event && event.reviewed === true;
        var isReviewedCached =
          event &&
          event.id &&
          localStorage.getItem("inovasy_reviewed_" + event.id);
        var isClickedLocal = localStorage.getItem(link);

        // If the DB says it's reviewed, keep UI consistent across sessions.
        if (isReviewedOnDb && !isClickedLocal) {
          localStorage.setItem(link, "true");
          isClickedLocal = "true";
        }

        if (isClickedLocal || isReviewedOnDb || isReviewedCached) {
          a.classList.add("whatsapp-button", "clicked");
          a.onmouseover = function () {
            a.style.cursor = "not-allowed";
          };
          a.onmouseout = function () {
            a.style.cursor = "pointer";
          };
        } else {
          a.classList.add("whatsapp-button", "not-clicked");
        }

        a.onclick = function (e) {
          e.preventDefault();
          window.history.pushState(null, null, link);
          window.dispatchEvent(new Event("popstate"));
          localStorage.setItem(link, true);

          // Marca no DB que esse lead já foi "lido/atendido" (reviewed)
          // Obs: depende do item vir com `id` no payload do /api/events-buy
          markSaleAsReviewedOnDb(event.id);

          a.remove();
          setTimeout(function () {
            var messageInput = document.querySelector(
              '._ak1r [contenteditable="true"]'
            );
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
  var textStart = link.indexOf("text=");
  if (textStart !== -1) {
    var message = decodeURIComponent(link.substring(textStart + 5));
    var words = message.split(" ").slice(0, 5);
    return words.join(" ") + (words.length > 5 ? "..." : "");
  }
  return "Abrir conversa";
}

// Injetar os dois botões na página
injectChatByEmailButton();
injectLoadButton();

// ===============================
// Conversas pendentes (responder)
// ===============================
(function () {
  if (typeof chrome === "undefined" || !chrome.storage?.local) return;

  var API_ORIGIN = "https://inovasy-sells-dashboard.netlify.app";
  var API_BASE = API_ORIGIN + "/api/wa/conversations";

  var STORAGE_KEYS = {
    conversations: "inovasy_conversations_v1",
  };

  var currentChatId = null;
  var currentChatDisplay = null;
  var currentHeaderEl = null;
  var chipEl = null;
  var debounceTimer = null;

  var globalBtnEl = null;
  var globalOverlayEl = null;
  var globalOverlayListEl = null;
  var globalOverlayCountEl = null;

  var lastDbSyncAt = 0;

  function now() {
    return Date.now();
  }

  function apiFetch(path, init) {
    try {
      return fetch(API_ORIGIN + path, {
        method: (init && init.method) || "GET",
        headers: Object.assign(
          { "Content-Type": "application/json" },
          (init && init.headers) || {}
        ),
        body: init && init.body,
        mode: "cors",
        credentials: "omit",
        keepalive: true,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  function openChatByPhoneDigits(digits) {
    var clean = String(digits || "").replace(/\D/g, "");
    if (!clean) return;
    var link =
      "https://web.whatsapp.com/send/?phone=" + encodeURIComponent(clean);

    try {
      window.history.pushState(null, null, link);
      window.dispatchEvent(new Event("popstate"));
    } catch (e) {
      window.location.href = link;
    }
  }

  function normalizePhoneFromText(text) {
    var t = String(text || "").trim();
    if (!t) return "";

    // Example: "+55 11 97438-6086" -> "5511974386086"
    var digits = t.replace(/\D/g, "");
    if (digits.length < 9) return "";
    return digits;
  }

  function findConversationHeader() {
    // Most stable anchor in WhatsApp Web.
    var mainHeader = document.querySelector("#main header");
    if (mainHeader) return mainHeader;

    var byTestId = document.querySelector(
      'header[data-testid="conversation-header"]'
    );
    if (byTestId) return byTestId;

    // Fallback: use the profile header button (title can vary by locale).
    var profileBtn = document.querySelector('header [role="button"][title]');
    if (profileBtn) {
      var h = profileBtn.closest("header");
      if (h) return h;
    }

    return null;
  }

  function pickHeaderTitleSpan(header) {
    if (!header) return null;

    // Prefer the clickable title block.
    var spans = header.querySelectorAll(
      'div[role="button"] span[dir="auto"], span[dir="auto"]'
    );
    if (!spans || !spans.length) return null;

    var best = null;
    for (var i = 0; i < spans.length; i++) {
      var s = spans[i];
      var txt = String(s.textContent || "").trim();
      if (!txt) continue;

      // Ignore presence/status strings.
      var lower = txt.toLowerCase();
      if (
        lower === "online" ||
        lower.indexOf("digit") === 0 ||
        lower.indexOf("visto") === 0
      ) {
        continue;
      }

      // If it looks like a phone number, take it immediately.
      if (normalizePhoneFromText(txt)) return s;

      // Otherwise keep the first reasonable candidate.
      if (!best) best = s;
    }

    return best;
  }

  function getCurrentChatFromHeader(header) {
    var titleSpan = pickHeaderTitleSpan(header);
    if (!titleSpan) return null;

    var display = String(titleSpan.textContent || "").trim();
    var phone = normalizePhoneFromText(display);

    if (!phone) {
      // If the header isn't showing a phone number (e.g. saved contact),
      // we can't safely open the chat by number.
      return { id: "unknown:" + display, phone: "", display: display };
    }

    return { id: phone, phone: phone, display: display };
  }

  function ensureChip(header) {
    if (!header) return null;

    if (chipEl && chipEl.isConnected) {
      // If WhatsApp replaced the header element, reattach.
      if (currentHeaderEl !== header) {
        currentHeaderEl = header;
        header.appendChild(chipEl);
      }
      return chipEl;
    }

    chipEl = document.createElement("button");
    chipEl.id = "inovasy-reply-chip";
    chipEl.type = "button";
    chipEl.className = "inovasy-reply-chip inovasy-pending";
    chipEl.textContent = "Pendente";
    chipEl.title = "Clique para marcar como respondido/pendente";

    chipEl.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!currentChatId) return;
      toggleRespondedForCurrentChat().catch(function () {});
    });

    currentHeaderEl = header;
    header.appendChild(chipEl);
    return chipEl;
  }

  function renderChip(responded) {
    if (!chipEl || !chipEl.isConnected) return;
    chipEl.disabled = false;
    if (responded) {
      chipEl.classList.remove("inovasy-pending");
      chipEl.classList.add("inovasy-responded");
      chipEl.textContent = "Respondido";
    } else {
      chipEl.classList.remove("inovasy-responded");
      chipEl.classList.add("inovasy-pending");
      chipEl.textContent = "Pendente";
    }
  }

  async function loadConversations() {
    var res = await chrome.storage.local.get([STORAGE_KEYS.conversations]);
    return res[STORAGE_KEYS.conversations] || {};
  }

  async function saveConversations(conversations) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.conversations]: conversations,
    });
  }

  async function upsertPendingConversation(chat) {
    if (!chat || !chat.id) return;

    var conversations = await loadConversations();
    var existing = conversations[chat.id] || null;

    conversations[chat.id] = {
      id: chat.id,
      phone: chat.phone,
      display: chat.display || existing?.display || "",
      tags: existing?.tags || [],
      responded: false,
      createdAt: existing?.createdAt || now(),
      lastOpenedAt: now(),
      lastUpdatedAt: now(),
      lastRespondedAt: null,
    };

    await saveConversations(conversations);

    // Persist to DB (always pending on open).
    if (chat.phone) {
      try {
        await apiFetch("/api/wa/conversations", {
          method: "POST",
          body: JSON.stringify({
            phone: chat.phone,
            display: chat.display || "",
          }),
        });
      } catch (e) {}
    }
  }

  async function setResponded(conversationId, responded) {
    if (!conversationId) return;
    var conversations = await loadConversations();
    var c = conversations[conversationId];
    if (!c) return;

    conversations[conversationId] = {
      ...c,
      responded: Boolean(responded),
      lastRespondedAt: responded ? now() : null,
      lastUpdatedAt: now(),
    };

    await saveConversations(conversations);

    // Persist responded state to DB.
    if (c && c.phone) {
      try {
        await apiFetch("/api/wa/conversations/" + encodeURIComponent(c.phone), {
          method: "PATCH",
          body: JSON.stringify({ responded: Boolean(responded) }),
        });
      } catch (e) {}
    }
  }

  async function toggleRespondedForCurrentChat() {
    if (!currentChatId) return;
    var conversations = await loadConversations();
    var c = conversations[currentChatId];
    var next = !(c && c.responded);
    await setResponded(currentChatId, next);
    renderChip(next);
  }

  async function syncChipFromStorage(conversationId) {
    if (!conversationId) return;
    var conversations = await loadConversations();
    var c = conversations[conversationId];
    renderChip(Boolean(c && c.responded));
  }

  async function syncChipFromDb(conversationId) {
    if (!conversationId) return;
    var ts = Date.now();
    if (ts - lastDbSyncAt < 5000) return;
    lastDbSyncAt = ts;

    try {
      var res = await apiFetch(
        "/api/wa/conversations/" + encodeURIComponent(String(conversationId)),
        { method: "GET" }
      );
      var json = await res.json();
      if (!res.ok || !json || json.ok !== true || !json.data) return;
      renderChip(Boolean(json.data.responded));
    } catch (e) {}
  }

  function scheduleCheck() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(checkChat, 120);
  }

  function checkChat() {
    var header = findConversationHeader();
    if (!header) return;
    ensureChip(header);

    var chat = getCurrentChatFromHeader(header);
    if (!chat) return;

    var changed = chat.id !== currentChatId;
    currentChatId = chat.id;
    currentChatDisplay = chat.display;

    if (changed) {
      // On every open (including re-open), reset to pending.
      renderChip(false);
      upsertPendingConversation(chat)
        .then(function () {
          renderChip(false);
        })
        .catch(function () {});
    } else {
      // No chat change: keep UI in sync with DB (popup can change state).
      syncChipFromDb(currentChatId).catch(function () {});
    }
  }

  function findGlobalHeader() {
    // "WhatsApp" wordmark in the left-side global header.
    var wordmark = document.querySelector(
      '[data-icon="wa-wordmark-refreshed"]'
    );
    if (wordmark) {
      var h = wordmark.closest("header");
      if (h) return h;
    }
    return null;
  }

  async function fetchPendingConversations(limit) {
    try {
      var q = "?pending=1&limit=" + encodeURIComponent(String(limit || 50));
      var res = await apiFetch("/api/wa/conversations" + q, { method: "GET" });
      var json = await res.json();
      if (!res.ok || !json || json.ok !== true) return [];
      return Array.isArray(json.data) ? json.data : [];
    } catch (e) {
      return [];
    }
  }

  async function fetchPendingCount() {
    try {
      var res = await apiFetch("/api/wa/conversations?pending=1&count=1", {
        method: "GET",
      });
      var json = await res.json();
      if (!res.ok || !json || json.ok !== true) return null;
      if (typeof json.count === "number") return json.count;
      return null;
    } catch (e) {
      return null;
    }
  }

  function ensureGlobalOverlay() {
    if (globalOverlayEl && globalOverlayEl.isConnected) return globalOverlayEl;

    globalOverlayEl = document.createElement("div");
    globalOverlayEl.id = "inovasy-pending-overlay";
    globalOverlayEl.innerHTML =
      "" +
      '<div class="inovasy-pending-modal">' +
      '  <div class="inovasy-pending-top">' +
      "    <div>" +
      '      <div class="inovasy-pending-title">Pendentes para responder</div>' +
      '      <div class="inovasy-pending-sub" id="inovasy-pending-sub">Carregando...</div>' +
      "    </div>" +
      '    <div class="inovasy-pending-actions">' +
      '      <button type="button" class="inovasy-pending-btn" id="inovasy-pending-refresh">Atualizar</button>' +
      '      <button type="button" class="inovasy-pending-btn secondary" id="inovasy-pending-close">Fechar</button>' +
      "    </div>" +
      "  </div>" +
      '  <div class="inovasy-pending-list" id="inovasy-pending-list"></div>' +
      "</div>";

    document.body.appendChild(globalOverlayEl);

    globalOverlayListEl = globalOverlayEl.querySelector(
      "#inovasy-pending-list"
    );
    globalOverlayCountEl = globalOverlayEl.querySelector(
      "#inovasy-pending-sub"
    );

    globalOverlayEl
      .querySelector("#inovasy-pending-close")
      .addEventListener("click", function () {
        globalOverlayEl.classList.remove("open");
      });

    globalOverlayEl
      .querySelector("#inovasy-pending-refresh")
      .addEventListener("click", function () {
        refreshGlobalOverlay().catch(function () {});
      });

    globalOverlayEl.addEventListener("click", function (e) {
      if (e.target === globalOverlayEl) {
        globalOverlayEl.classList.remove("open");
      }
    });

    return globalOverlayEl;
  }

  function renderGlobalOverlay(items) {
    if (!globalOverlayListEl) return;
    globalOverlayListEl.innerHTML = "";

    if (!items || !items.length) {
      var empty = document.createElement("div");
      empty.className = "inovasy-pending-empty";
      empty.textContent = "Nenhuma pendencia agora.";
      globalOverlayListEl.appendChild(empty);
      return;
    }

    items.slice(0, 50).forEach(function (c) {
      var row = document.createElement("div");
      row.className = "inovasy-pending-item";

      var left = document.createElement("div");
      left.className = "inovasy-pending-left";
      var who = document.createElement("div");
      who.className = "inovasy-pending-who";
      who.textContent = c.display
        ? String(c.display) + " ( +" + String(c.phone) + " )"
        : "+" + String(c.phone);
      who.addEventListener("click", function () {
        openChatByPhoneDigits(c.phone);
        globalOverlayEl.classList.remove("open");
      });
      left.appendChild(who);

      var tagLine = document.createElement("div");
      tagLine.className = "inovasy-pending-tags";
      var tags = Array.isArray(c.tags) ? c.tags : [];
      tagLine.textContent = tags.length ? "#" + tags.join(" #") : "";
      left.appendChild(tagLine);

      var right = document.createElement("div");
      right.className = "inovasy-pending-right";
      var done = document.createElement("button");
      done.type = "button";
      done.className = "inovasy-pending-btn small";
      done.textContent = "Marcar respondido";
      done.addEventListener("click", function () {
        apiFetch(
          "/api/wa/conversations/" + encodeURIComponent(String(c.phone)),
          {
            method: "PATCH",
            body: JSON.stringify({ responded: true }),
          }
        )
          .then(function () {
            refreshGlobalOverlay().catch(function () {});
          })
          .catch(function () {});
      });
      right.appendChild(done);

      row.appendChild(left);
      row.appendChild(right);
      globalOverlayListEl.appendChild(row);
    });
  }

  async function refreshGlobalOverlay() {
    ensureGlobalOverlay();
    if (globalOverlayCountEl)
      globalOverlayCountEl.textContent = "Carregando...";
    var items = await fetchPendingConversations(50);
    if (globalOverlayCountEl)
      globalOverlayCountEl.textContent =
        items.length + " conversas (mostrando ate 50)";
    renderGlobalOverlay(items);
  }

  async function refreshGlobalBadge() {
    if (!globalBtnEl || !globalBtnEl.isConnected) return;
    var count = await fetchPendingCount();
    if (count === null) return;
    var badge = globalBtnEl.querySelector(".inovasy-pending-badge");
    if (!badge) return;
    badge.textContent = String(Math.min(99, count));
    badge.style.display = count > 0 ? "inline-flex" : "none";
  }

  function ensureGlobalButton() {
    var header = findGlobalHeader();
    if (!header) return;

    if (globalBtnEl && globalBtnEl.isConnected) {
      if (!header.contains(globalBtnEl)) header.appendChild(globalBtnEl);
      return;
    }

    globalBtnEl = document.createElement("button");
    globalBtnEl.id = "inovasy-pending-global-btn";
    globalBtnEl.type = "button";
    globalBtnEl.className = "inovasy-pending-global-btn";
    globalBtnEl.innerHTML =
      '<span class="inovasy-pending-label">Pendentes</span>' +
      '<span class="inovasy-pending-badge" style="display:none">0</span>';
    globalBtnEl.title = "Abrir lista de pendencias";

    globalBtnEl.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      ensureGlobalOverlay();
      globalOverlayEl.classList.add("open");
      refreshGlobalOverlay().catch(function () {});
    });

    var newChatIcon = header.querySelector('[data-icon="new-chat-outline"]');
    var newChatBtn = newChatIcon ? newChatIcon.closest("button") : null;
    var actionsRoot =
      newChatBtn && newChatBtn.parentElement ? newChatBtn.parentElement : null;
    (actionsRoot || header).appendChild(globalBtnEl);
    refreshGlobalBadge().catch(function () {});
  }

  // Detect chat changes via header mutations.
  try {
    var mo = new MutationObserver(function () {
      scheduleCheck();
    });
    mo.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  } catch (e) {}

  // Also poll occasionally (WhatsApp sometimes swaps nodes without obvious mutations).
  setInterval(scheduleCheck, 1500);
  scheduleCheck();

  // Global header button (list pending from DB).
  setInterval(ensureGlobalButton, 2000);
  setInterval(function () {
    refreshGlobalBadge().catch(function () {});
  }, 20000);
  ensureGlobalButton();

  // If storage changes (from other features), keep a cheap local sync.
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area !== "local") return;
    if (!currentChatId) return;
    if (!changes[STORAGE_KEYS.conversations]) return;
    syncChipFromStorage(currentChatId).catch(function () {});
  });

  chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    (async function () {
      switch (req?.method) {
        case "getCurrentChat": {
          var header = findConversationHeader();
          var chat = getCurrentChatFromHeader(header);
          if (!chat) return { ok: false, error: "Chat nao encontrado" };
          if (!chat.phone) {
            return {
              ok: true,
              chat: { phone: "", display: chat.display || "" },
            };
          }
          return {
            ok: true,
            chat: { phone: chat.phone, display: chat.display || "" },
          };
        }

        default:
          return { ok: false, error: "Metodo nao suportado" };
      }
    })()
      .then(function (res) {
        sendResponse(res);
      })
      .catch(function (err) {
        sendResponse({ ok: false, error: String(err?.message || err) });
      });

    return true;
  });
})();
