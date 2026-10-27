importScripts("shared.js");

const COMMAND_KEYS = {
  "toggle-global-nav": "hideGlobalNav",
  "toggle-course-menu": "hideCourseMenu",
  "toggle-full-width": "fullWidth",
};

chrome.commands.onCommand.addListener(async (command) => {
  const key = COMMAND_KEYS[command];
  if (!key) return;
  const settings = await chrome.storage.sync.get(CST_DEFAULTS);
  await chrome.storage.sync.set({ [key]: !settings[key] });
});
