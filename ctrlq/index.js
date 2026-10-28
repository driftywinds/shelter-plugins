(function (exports) {
  "use strict";

  function closeWindow() {
    // Prefer Discord's native bridge, fall back to the plain DOM call.
    try {
      if (window.DiscordNative && DiscordNative.window && typeof DiscordNative.window.close === "function") {
        DiscordNative.window.close();
        return;
      }
    } catch (e) {
      console.warn("[ctrl-q-close] DiscordNative close failed, falling back", e);
    }
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
    // Capture phase so Discord's own handlers can't swallow the event first.
    document.addEventListener("keydown", onKeyDown, true);
  };

  exports.onUnload = function () {
    document.removeEventListener("keydown", onKeyDown, true);
  };

  return exports;
})({})
