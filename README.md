# Canvas Sidebar Toggle

Chrome/Edge extension that hides or shows Canvas's global navigation and course menu, letting the page content expand into the freed space.

## Install (unpacked)

1. Open `chrome://extensions` (Chrome) or `edge://extensions` (Edge).
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Pin the extension to the toolbar if you want quick access to the popup.

## Use

- On-page buttons: a small toolbar at the bottom of the global nav (or on the left edge
  when the nav is hidden). A slashed icon means that sidebar is hidden; click to toggle.
  The toolbar can be turned off in the popup.
- Popup switches: Global navigation, Course menu, Full-width content, On-page buttons.
- Shortcuts: `Alt+Shift+G` (global nav), `Alt+Shift+L` (course menu), `Alt+Shift+W` (full width).
  Change them at `chrome://extensions/shortcuts` / `edge://extensions/shortcuts`.
- Settings are remembered and apply to all open Canvas tabs immediately.

### A shortcut doesn't work

If another extension already uses a key, the browser silently leaves this extension's
shortcut unassigned. The popup shows the keys actually assigned, in red as
"No shortcut set" when one is missing; set it from **Change shortcuts** in the popup.

## Other Canvas sites

The extension runs on `canvas.anglia.ac.uk` and `*.instructure.com`. To add another
Canvas domain, add it to both `host_permissions` and `content_scripts.matches` in
`manifest.json`, then click reload on the extension.

## Why hiding the elements isn't enough

Canvas reserves the sidebar space with margins on the layout wrappers, not with the sidebars' own widths:
the global nav (`#header`) is `position: fixed` with `.ic-Layout-wrapper { margin-left: 54px/84px }`,
and the course menu (`#left-side`) is absolutely positioned into `.ic-Layout-columns { margin-left: 192px }`.
`content.css` hides each sidebar and zeroes its matching margin.
