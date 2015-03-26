"use strict";

exports.window = require('./DOM/Window').createWindow();
exports.parser = require('./utils/parser');
if (process.browser)
  window.sub = exports;
