exports.window = require('./DOM/Window').createWindow();
if (process.browser)
  window.sub = exports;
