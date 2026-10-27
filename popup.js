// Switches read "shown" for the sidebars (data-invert) and "on" for full width.
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

document.getElementById("shortcuts").addEventListener("click", (e) => {
  e.preventDefault();
  const isEdge = navigator.userAgent.includes("Edg/");
  chrome.tabs.create({ url: isEdge ? "edge://extensions/shortcuts" : "chrome://extensions/shortcuts" });
});
