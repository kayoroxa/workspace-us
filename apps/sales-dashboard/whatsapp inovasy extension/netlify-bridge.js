const APP_ORIGIN = "https://inovasy-sells-dashboard.netlify.app";

window.addEventListener("message", (event) => {
  if (event.origin !== APP_ORIGIN) return;

  const msg = event.data;
  if (!msg || msg.type !== "INOVASY_EXT_CALL") return;

  const id = msg.id;
  const method = msg.method;
  const params = msg.params ?? null;
  if (!id || typeof method !== "string") return;

  chrome.runtime.sendMessage({ method, params }, (resp) => {
    const payload = {
      type: "INOVASY_EXT_RESP",
      id,
      ok: !!resp?.ok,
      ...resp,
    };

    window.postMessage(payload, APP_ORIGIN);
  });
});

window.postMessage({ type: "INOVASY_EXT_READY", ok: true }, APP_ORIGIN);
