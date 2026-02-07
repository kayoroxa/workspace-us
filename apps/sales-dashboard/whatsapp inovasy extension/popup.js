const API_ORIGIN = "https://inovasy-sells-dashboard.netlify.app";

function normalizePhone(input) {
  const digits = String(input || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits;
}

function parseTags(input) {
  return String(input || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function apiFetch(path, init) {
  return fetch(API_ORIGIN + path, {
    method: (init && init.method) || "GET",
    headers: Object.assign(
      { "Content-Type": "application/json" },
      (init && init.headers) || {}
    ),
    body: init && init.body,
  });
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs && tabs[0];
}

async function listConversations(limit = 500) {
  const res = await apiFetch(
    `/api/wa/conversations?limit=${encodeURIComponent(String(limit))}`,
    { method: "GET" }
  );
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.ok !== true) {
    throw new Error((json && json.error) || "DB offline / rota nao publicada");
  }
  return Array.isArray(json.data) ? json.data : [];
}

async function upsertConversation({ phone, display, tags }) {
  const digits = normalizePhone(phone);
  if (!digits) throw new Error("Numero invalido");

  const res = await apiFetch("/api/wa/conversations", {
    method: "POST",
    body: JSON.stringify({
      phone: digits,
      display: String(display || ""),
      tags: Array.isArray(tags) ? tags : [],
    }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.ok !== true) {
    throw new Error((json && json.error) || "Falha ao salvar no DB");
  }
}

async function patchConversation(phone, patch) {
  const digits = normalizePhone(phone);
  if (!digits) throw new Error("Numero invalido");

  const res = await apiFetch(
    `/api/wa/conversations/${encodeURIComponent(digits)}`,
    {
      method: "PATCH",
      body: JSON.stringify(patch || {}),
    }
  );
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.ok !== true) {
    throw new Error((json && json.error) || "Falha ao atualizar no DB");
  }

  // Let the WhatsApp tab update the header chip immediately (no polling).
  if (typeof patch?.responded === "boolean") {
    chrome.runtime.sendMessage({
      method: "notifyWaConversationUpdated",
      params: { phone: digits, responded: patch.responded },
    });
  }
}

function formatPhoneDigits(digits) {
  const s = String(digits || "");
  if (!s) return "";
  return "+" + s;
}

function el(id) {
  return document.getElementById(id);
}

function matchesSearch(conv, q) {
  if (!q) return true;
  const hay = [conv.phone, conv.display, ...(conv.tags || [])]
    .join(" ")
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

function byUpdatedDesc(a, b) {
  const aT = new Date(a.lastUpdatedAt || a.lastOpenedAt || 0).getTime();
  const bT = new Date(b.lastUpdatedAt || b.lastOpenedAt || 0).getTime();
  return bT - aT;
}

function renderList(items, q) {
  const root = el("list");
  const empty = el("empty");
  root.innerHTML = "";

  const rows = (items || [])
    .filter((c) => matchesSearch(c, q))
    .sort(byUpdatedDesc);

  empty.style.display = rows.length ? "none" : "block";

  rows.forEach((c) => {
    const item = document.createElement("div");
    item.className = "item";

    const who = document.createElement("div");
    who.className = "who";
    who.textContent = c.display
      ? `${c.display} (${formatPhoneDigits(c.phone)})`
      : formatPhoneDigits(c.phone);
    who.title = "Abrir conversa no WhatsApp";
    who.addEventListener("click", () => {
      chrome.runtime.sendMessage({
        method: "openWhatsAppChat",
        params: { phone: c.phone },
      });
    });

    const right = document.createElement("div");
    right.className = "right";
    const toggle = document.createElement("label");
    toggle.className = "toggle";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = Boolean(c.responded);
    const label = document.createElement("span");
    label.textContent = cb.checked ? "Respondido" : "Pendente";
    cb.addEventListener("change", async () => {
      label.textContent = cb.checked ? "Respondido" : "Pendente";
      try {
        await patchConversation(c.phone, { responded: cb.checked });

        statusPill.className = `pill ${cb.checked ? "good" : "bad"}`;
        statusPill.textContent = cb.checked ? "Concluido" : "Nao concluido";
      } catch (e) {
        // Revert UI on failure.
        cb.checked = !cb.checked;
        label.textContent = cb.checked ? "Respondido" : "Pendente";
        statusPill.className = `pill ${cb.checked ? "good" : "bad"}`;
        statusPill.textContent = cb.checked ? "Concluido" : "Nao concluido";
        alert(String(e?.message || e));
      }
    });
    toggle.appendChild(cb);
    toggle.appendChild(label);
    right.appendChild(toggle);

    const meta = document.createElement("div");
    meta.className = "meta";

    const statusPill = document.createElement("span");
    statusPill.className = `pill ${c.responded ? "good" : "bad"}`;
    statusPill.textContent = c.responded ? "Concluido" : "Nao concluido";
    meta.appendChild(statusPill);

    (c.tags || []).forEach((t) => {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = `#${t}`;
      meta.appendChild(pill);
    });

    const edit = document.createElement("button");
    edit.className = "btn secondary";
    edit.type = "button";
    edit.textContent = "Editar tags";
    edit.addEventListener("click", async () => {
      const current = (c.tags || []).join(", ");
      const next = window.prompt("Editar tags (separe por virgula):", current);
      if (next === null) return;
      const tags = parseTags(next);
      try {
        await patchConversation(c.phone, { tags });
        await refresh();
      } catch (e) {
        alert(String(e?.message || e));
      }
    });
    meta.appendChild(edit);

    item.appendChild(who);
    item.appendChild(right);
    item.appendChild(meta);
    root.appendChild(item);
  });
}

async function setStatusLine() {
  const s = el("status");
  const tab = await getActiveTab();
  const isWA = Boolean(
    tab?.url && tab.url.startsWith("https://web.whatsapp.com/")
  );
  s.textContent = isWA
    ? "WhatsApp Web: ok"
    : "Abra o WhatsApp Web para capturar o chat";
}

async function captureFromOpenChat() {
  const tab = await getActiveTab();
  if (!tab?.id) throw new Error("Aba ativa invalida");

  const res = await chrome.tabs.sendMessage(tab.id, {
    method: "getCurrentChat",
  });
  if (!res?.ok) throw new Error(res?.error || "Nao consegui capturar o chat");
  if (!res?.chat?.phone) throw new Error("Chat atual sem numero");

  await upsertConversation({
    phone: res.chat.phone,
    display: res.chat.display,
    tags: parseTags(el("tags").value),
  });
}

let _lastItems = [];

async function refresh() {
  const items = await listConversations(500);
  _lastItems = items;
  renderList(items, el("search").value);
}

document.addEventListener("DOMContentLoaded", () => {
  el("add").addEventListener("click", async () => {
    try {
      await upsertConversation({
        phone: el("phone").value,
        tags: parseTags(el("tags").value),
      });
      el("phone").value = "";
      await refresh();
    } catch (e) {
      alert(String(e?.message || e));
    }
  });

  el("capture").addEventListener("click", async () => {
    try {
      await captureFromOpenChat();
      await refresh();
    } catch (e) {
      alert(String(e?.message || e));
    }
  });

  el("refresh").addEventListener("click", async () => {
    try {
      await refresh();
    } catch (e) {
      alert(String(e?.message || e));
    }
  });

  el("search").addEventListener("input", () => {
    renderList(_lastItems, el("search").value);
  });

  el("open-dashboard").addEventListener("click", () => {
    chrome.runtime.sendMessage({ method: "openDashboard" });
  });

  setStatusLine();
  refresh().catch((e) => {
    alert(String(e?.message || e));
  });
});
