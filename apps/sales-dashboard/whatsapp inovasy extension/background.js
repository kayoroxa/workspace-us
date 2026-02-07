const APP_ORIGIN = "https://inovasy-sells-dashboard.netlify.app";
const APP_URL = `${APP_ORIGIN}/`;

chrome.action.onClicked.addListener(async () => {
  await chrome.tabs.create({ url: APP_URL });
});

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  (async () => {
    switch (req?.method) {
      case "ping":
        return {
          ok: true,
          extensionVersion: chrome.runtime.getManifest().version,
        };

      case "openDashboard":
        await chrome.tabs.create({ url: APP_URL });
        return { ok: true };

      case "openUrl": {
        const url = req?.params?.url;
        if (typeof url !== "string") throw new Error("url invalida");

        const u = new URL(url);
        const isAllowed =
          u.origin === APP_ORIGIN || u.origin === "https://web.whatsapp.com";
        if (!isAllowed) throw new Error("url nao permitida");

        const tab = await chrome.tabs.create({ url: u.toString() });
        return { ok: true, tabId: tab.id };
      }

      case "openWhatsAppChat": {
        const phone = String(req?.params?.phone ?? "").trim();
        const text = String(req?.params?.text ?? "").trim();

        if (!phone) throw new Error("phone invalido");
        const cleanPhone = phone.replace(/\D/g, "");

        const url = new URL("https://web.whatsapp.com/send/");
        url.searchParams.set("phone", cleanPhone);
        if (text) url.searchParams.set("text", text);

        // Prefer reusing an existing WhatsApp Web tab.
        const existingTabs = await chrome.tabs.query({
          url: "https://web.whatsapp.com/*",
        });

        const existing = existingTabs && existingTabs[0];
        if (existing?.id) {
          await chrome.tabs.update(existing.id, {
            url: url.toString(),
            active: true,
          });
          return { ok: true, tabId: existing.id, reused: true };
        }

        const tab = await chrome.tabs.create({ url: url.toString() });
        return { ok: true, tabId: tab.id, reused: false };
      }

      case "notifyWaConversationUpdated": {
        const phone = String(req?.params?.phone ?? "").replace(/\D/g, "");
        const responded = Boolean(req?.params?.responded);
        if (!phone) throw new Error("phone invalido");

        const waTabs = await chrome.tabs.query({
          url: "https://web.whatsapp.com/*",
        });
        await Promise.all(
          (waTabs || [])
            .filter((t) => t && t.id)
            .map((t) =>
              chrome.tabs.sendMessage(t.id, {
                method: "conversationUpdated",
                params: { phone, responded },
              })
            )
        );

        return { ok: true };
      }

      default:
        throw new Error("Metodo nao suportado");
    }
  })()
    .then((res) => sendResponse(res))
    .catch((err) =>
      sendResponse({ ok: false, error: String(err?.message || err) })
    );

  return true;
});
