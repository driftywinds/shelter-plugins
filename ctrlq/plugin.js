(function (exports) {
  "use strict";

  const TAG = "[ctrl-q-close]";

  async function closeWindow() {
    const T = window.__TAURI__;
    if (!T) {
      console.error(TAG, "window.__TAURI__ is missing, not running inside Dorion?");
      return;
    }

    // 1. Dorion's own backend command (src-tauri/src/functionality/window.rs).
    //    Saves window state, then closes the native window, or hides it to the
    //    tray if "minimize to tray" is enabled in Dorion's settings.
    try {
      await T.core.invoke("close");
      return;
    } catch (e) {
      console.warn(TAG, "invoke('close') failed", e);
    }

    // 2. Tauri's own window API (only works if the capability allows it)
    try {
      await T.window.getCurrentWindow().close();
      return;
    } catch (e) {
      console.warn(TAG, "window API close failed", e);
    }

    // 3. Hard exit via the process plugin
    try {
      await T.process.exit(0);
      return;
    } catch (e) {
      console.warn(TAG, "process.exit failed", e);
    }

    // Deliberately no window.close() fallback: in Dorion it only destroys the
    // webview and leaves an empty native window behind.
    console.error(TAG, "all close methods failed");
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
