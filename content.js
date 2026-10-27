// Applies the saved settings as classes on <html> (content.css does the layout)
// and adds a small toolbar of toggle buttons to the page.
(() => {
  // chrome.storage is async, so a copy is kept in the page's localStorage to apply
  // the classes synchronously at document_start and avoid a flash of the sidebars.
  const CACHE_KEY = "canvasSidebarToggle";

  const SLASH = '<path class="slash" d="M3 3l18 18"/>';
  const svg = (body) =>
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}${SLASH}</svg>`;

  const BUTTONS = [
    {
      key: "hideGlobalNav",
      selector: "#header.ic-app-header",
      label: "global navigation",
      icon: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M5.5 8h1M5.5 12h1M5.5 16h1"/>'),
    },
    {
      key: "hideCourseMenu",
      selector: "#left-side",
      label: "course menu",
      icon: svg('<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke-width="3"/>'),
    },
  ];

  const TOOLBAR_CSS = `
    .bar {
      display: flex;
      flex-direction: var(--cst-direction, row);
      gap: 2px;
      padding: 3px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: var(--cst-radius, 8px);
      background: var(--ic-brand-global-nav-bgd, #2d3b45);
      box-shadow: var(--cst-shadow, none);
    }
    button {
      all: unset;
      box-sizing: border-box;
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      color: var(--ic-brand-global-nav-menu-item__text-color, #fff);
      cursor: pointer;
    }
    button:hover { background: rgba(255, 255, 255, 0.15); }
    button:focus-visible { outline: 2px solid currentColor; outline-offset: 1px; }
    .slash { display: none; }
    button[data-hidden="true"] .slash { display: inline; }
  `;

  let current = {};
  let buttons = [];

  const apply = () => {
    const root = document.documentElement;
    for (const [key, cls] of Object.entries(CST_SETTINGS)) {
      root.classList.toggle(cls, Boolean(current[key]));
    }
    for (const { button, key, label } of buttons) {
      const hidden = Boolean(current[key]);
      const text = `${hidden ? "Show" : "Hide"} ${label}`;
      button.title = text;
      button.setAttribute("aria-label", text);
      button.dataset.hidden = String(hidden);
    }
  };

  const update = (changes) => {
    current = { ...current, ...changes };
    apply();
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(current));
    } catch (e) {}
  };

  const createToolbar = () => {
    const available = BUTTONS.filter((b) => document.querySelector(b.selector));
    if (!available.length) return; // not a page with Canvas sidebars

    const host = document.createElement("div");
    host.id = "cst-page-buttons";
    const shadow = host.attachShadow({ mode: "open" });
    // A constructed stylesheet isn't subject to the page's CSP, unlike an inline <style>.
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(TOOLBAR_CSS);
    shadow.adoptedStyleSheets = [sheet];

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", "Canvas sidebars");
    shadow.appendChild(bar);

    for (const b of available) {
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = b.icon;
      button.addEventListener("click", () => {
        const next = { [b.key]: !current[b.key] };
        update(next);
        try {
          chrome.storage.sync.set(next);
        } catch (e) {
          // Extension was reloaded; this tab keeps working until it's refreshed.
        }
      });
      bar.appendChild(button);
      buttons.push({ ...b, button });
    }

    document.body.appendChild(host);
    apply();
  };

  try {
    current = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
    apply();
  } catch (e) {
    // localStorage unavailable; fall through to chrome.storage.
  }

  chrome.storage.sync.get(CST_DEFAULTS, update);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    const next = {};
    for (const key of Object.keys(CST_SETTINGS)) {
      if (key in changes) next[key] = changes[key].newValue;
    }
    if (Object.keys(next).length) update(next);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createToolbar);
  } else {
    createToolbar();
  }
})();
