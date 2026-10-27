// Applies the saved settings as classes on <html>; content.css does the rest.
(() => {
  const CLASSES = {
    hideGlobalNav: "cst-hide-global-nav",
    hideCourseMenu: "cst-hide-course-menu",
    fullWidth: "cst-full-width",
  };
  // chrome.storage is async, so a copy is kept in the page's localStorage to apply
  // the classes synchronously at document_start and avoid a flash of the sidebars.
  const CACHE_KEY = "canvasSidebarToggle";

  const apply = (settings) => {
    const root = document.documentElement;
    for (const [key, cls] of Object.entries(CLASSES)) {
      root.classList.toggle(cls, Boolean(settings[key]));
    }
  };

  let current = {};
  try {
    current = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
    apply(current);
  } catch (e) {
    // localStorage unavailable; fall through to chrome.storage.
  }

  const update = (changes) => {
    current = { ...current, ...changes };
    apply(current);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(current));
    } catch (e) {}
  };

  chrome.storage.sync.get(Object.keys(CLASSES), update);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    const next = {};
    for (const key of Object.keys(CLASSES)) {
      if (key in changes) next[key] = changes[key].newValue;
    }
    if (Object.keys(next).length) update(next);
  });
})();
