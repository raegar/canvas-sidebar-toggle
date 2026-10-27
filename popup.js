// Switches read "shown" for the sidebars and buttons (data-invert) and "on" for full width.
const inputs = document.querySelectorAll("input[data-key]");

chrome.storage.sync.get(CST_DEFAULTS, (settings) => {
  for (const input of inputs) {
    const value = Boolean(settings[input.dataset.key]);
    input.checked = input.hasAttribute("data-invert") ? !value : value;
  }
});

for (const input of inputs) {
  input.addEventListener("change", () => {
    const value = input.hasAttribute("data-invert") ? !input.checked : input.checked;
    chrome.storage.sync.set({ [input.dataset.key]: value });
  });
}

// Show the shortcuts actually assigned: if another extension already owns a key,
// the browser leaves ours unset rather than reporting a conflict.
chrome.commands.getAll((commands) => {
  for (const command of commands) {
    const hint = document.querySelector(`[data-command="${command.name}"]`);
    if (!hint) continue;
    hint.textContent = command.shortcut || "No shortcut set";
    hint.classList.toggle("unset", !command.shortcut);
  }
});

document.getElementById("shortcuts").addEventListener("click", (e) => {
  e.preventDefault();
  const isEdge = navigator.userAgent.includes("Edg/");
  chrome.tabs.create({ url: isEdge ? "edge://extensions/shortcuts" : "chrome://extensions/shortcuts" });
});
