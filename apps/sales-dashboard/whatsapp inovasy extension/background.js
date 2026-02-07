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

        const tab = await chrome.tabs.create({ url: url.toString() });
        return { ok: true, tabId: tab.id };
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
