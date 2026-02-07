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

  // Monta a URL sem texto pre-preenchido (evita qualquer automacao de mensagem)
  var link = `https://web.whatsapp.com/send/?phone=${cleanPhone}`;

  // Navegacao direta (evita simular clique / focar input)
  try {
    window.location.href = link;
  } catch (e) {
    // noop
  }

  try {
    localStorage.setItem(link, true);
  } catch (e2) {
    // noop
  }
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
          try {
            window.location.href = link;
          } catch (e2) {}
          localStorage.setItem(link, true);

          // Marca no DB que esse lead já foi "lido/atendido" (reviewed)
          // Obs: depende do item vir com `id` no payload do /api/events-buy
          markSaleAsReviewedOnDb(event.id);

          a.remove();
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
  if (typeof chrome === "undefined" || !chrome.runtime?.id) return;

  var API_ORIGIN = "https://inovasy-sells-dashboard.netlify.app";
  var API_BASE = API_ORIGIN + "/api/wa/conversations";

  var currentChatId = null;
  var currentChatDisplay = null;
  var currentHeaderEl = null;
  var chipEl = null;
  var debounceTimer = null;

  var currentResponded = false;

  var globalBtnEl = null;
  var globalOverlayEl = null;
  var globalOverlayListEl = null;
  var globalOverlayCountEl = null;

  var apiCircuit = {
    disabledUntil: 0,
    failCount: 0,
    lastErrorAt: 0,
  };

  var lastPostByPhone = {};

  function now() {
    return Date.now();
  }

  function apiIsDisabled() {
    return Date.now() < apiCircuit.disabledUntil;
  }

  function apiNoteSuccess() {
    apiCircuit.failCount = 0;
    apiCircuit.disabledUntil = 0;
  }

  function apiNoteFailure(statusOrCode) {
    apiCircuit.failCount = Math.min(10, (apiCircuit.failCount || 0) + 1);
    apiCircuit.lastErrorAt = Date.now();

    var status = Number(statusOrCode || 0);

    // Default backoff: 1m, 2m, 4m, 8m, ... (cap 30m)
    var ms = Math.min(
      30 * 60 * 1000,
      60 * 1000 * Math.pow(2, apiCircuit.failCount - 1)
    );

    // If endpoint doesn't exist (deploy not updated), cool down longer.
    if (status === 404) ms = 60 * 60 * 1000;

    // Rate-limit / forbidden: be extra cautious.
    if (status === 429 || status === 403) ms = 60 * 60 * 1000;

    apiCircuit.disabledUntil = Date.now() + ms;
  }

  async function apiFetch(path, init) {
    if (apiIsDisabled()) {
      var err = new Error("api_disabled");
      err.code = "api_disabled";
      throw err;
    }

    try {
      var res = await fetch(API_ORIGIN + path, {
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

      if (!res.ok) {
        apiNoteFailure(res.status);
      } else {
        apiNoteSuccess();
      }

      return res;
    } catch (e) {
      apiNoteFailure(0);
      throw e;
    }
  }

  function openChatByPhoneDigits(digits) {
    var clean = String(digits || "").replace(/\D/g, "");
    if (!clean) return;
    var link =
      "https://web.whatsapp.com/send/?phone=" + encodeURIComponent(clean);

    try {
      window.location.href = link;
    } catch (e) {}
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
    currentResponded = Boolean(responded);
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

  function renderChipDbOffline() {
    if (!chipEl || !chipEl.isConnected) return;
    chipEl.disabled = true;
    chipEl.classList.remove("inovasy-responded");
    chipEl.classList.add("inovasy-pending");
    chipEl.textContent = "DB OFF";
  }

  function renderChipSaving() {
    if (!chipEl || !chipEl.isConnected) return;
    chipEl.disabled = true;
    chipEl.classList.remove("inovasy-responded");
    chipEl.classList.add("inovasy-pending");
    chipEl.textContent = "Salvando...";
  }

  async function upsertPendingConversation(chat) {
    if (!chat || !chat.id) return;

    // Persist to DB (always pending on open). No local cache.
    if (chat.phone) {
      try {
        var ts = Date.now();
        var lastTs = lastPostByPhone[chat.phone] || 0;
        // Avoid spamming the API if WA fires multiple "chat changed" signals.
        if (ts - lastTs < 15000) return;
        lastPostByPhone[chat.phone] = ts;

        var res = await apiFetch("/api/wa/conversations", {
          method: "POST",
          body: JSON.stringify({
            phone: chat.phone,
            display: chat.display || "",
          }),
        });

        if (res && res.ok) {
          renderChip(false);
        } else {
          renderChipDbOffline();
        }
      } catch (e) {
        renderChipDbOffline();
      }
    }
  }

  async function toggleRespondedForCurrentChat() {
    if (!currentChatId) return;
    if (!currentChatId || String(currentChatId).indexOf("unknown:") === 0)
      return;

    var phone = String(currentChatId);
    var next = !currentResponded;

    try {
      var res = await apiFetch(
        "/api/wa/conversations/" + encodeURIComponent(phone),
        {
          method: "PATCH",
          body: JSON.stringify({ responded: Boolean(next) }),
        }
      );
      if (res && res.ok) {
        renderChip(next);
      } else {
        renderChipDbOffline();
      }
    } catch (e) {
      renderChipDbOffline();
    }
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
      // DB-only: show saving state until server confirms.
      renderChipSaving();
      upsertPendingConversation(chat).catch(function () {
        renderChipDbOffline();
      });
    } else {
      // No-op (DB-only, no polling).
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
      if (!res.ok || !json || json.ok !== true) return null;
      return Array.isArray(json.data) ? json.data : [];
    } catch (e) {
      return null;
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
    if (!items) {
      if (globalOverlayCountEl) globalOverlayCountEl.textContent = "DB offline";
      renderGlobalOverlay([]);
      return;
    }

    if (globalOverlayCountEl) {
      globalOverlayCountEl.textContent =
        items.length + " conversas (mostrando ate 50)";
    }
    renderGlobalOverlay(items);
  }

  async function refreshGlobalBadge() {
    if (!globalBtnEl || !globalBtnEl.isConnected) return;
    var count = await fetchPendingCount();
    if (count === null) {
      globalBtnEl.title = "DB offline";
      var badge0 = globalBtnEl.querySelector(".inovasy-pending-badge");
      if (badge0) badge0.style.display = "none";
      return;
    }
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

  // Poll occasionally (reduz carga; evita observar o DOM inteiro).
  setInterval(scheduleCheck, 2000);
  scheduleCheck();

  // Global header button (list pending from DB).
  setInterval(ensureGlobalButton, 5000);
  setInterval(function () {
    refreshGlobalBadge().catch(function () {});
  }, 60000);
  ensureGlobalButton();

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

  // Update chip when popup toggles responded.
  chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    if (req?.method !== "conversationUpdated") return;
    try {
      var phone = String(req?.params?.phone || "").replace(/\D/g, "");
      if (!phone) return;
      if (String(currentChatId) !== phone) return;
      renderChip(Boolean(req?.params?.responded));
    } catch (e) {}
  });
})();
