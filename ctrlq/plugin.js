(function (exports) {
  "use strict";

  async function closeWindow() {
    const T = window.__TAURI__;

    try {
      // Tauri v2
      if (T && T.window && typeof T.window.getCurrentWindow === "function") {
        await T.window.getCurrentWindow().close();
        return;
      }
      // Tauri v2 (webviewWindow namespace)
      if (T && T.webviewWindow && typeof T.webviewWindow.getCurrentWebviewWindow === "function") {
        await T.webviewWindow.getCurrentWebviewWindow().close();
        return;
      }
      // Tauri v1
      if (T && T.window && T.window.appWindow) {
        await T.window.appWindow.close();
        return;
      }
      if (T && T.window && typeof T.window.getCurrent === "function") {
        await T.window.getCurrent().close();
        return;
      }
    } catch (e) {
      console.warn("[ctrl-q-close] Tauri close failed, falling back", e);
    }

    try {
      if (window.DiscordNative && DiscordNative.window && typeof DiscordNative.window.close === "function") {
        DiscordNative.window.close();
        return;
      }
    } catch (e) {
      console.warn("[ctrl-q-close] DiscordNative close failed, falling back", e);
    }

    // Last resort: in Dorion this only kills the webview, not the window.
    console.warn("[ctrl-q-close] no native window API found, using window.close()");
    window.close();
  }

  function onKeyDown(e) {
    if (e.repeat) return;
    if (!e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
    if (e.key.toLowerCase() !== "q") return;

    e.preventDefault();
    e.stopPropagation();
    closeWindow();
  }

  exports.onLoad = function () {
    document.addEventListener("keydown", onKeyDown, true);
  };

  exports.onUnload = function () {
    document.removeEventListener("keydown", onKeyDown, true);
  };

  return exports;
})({})
