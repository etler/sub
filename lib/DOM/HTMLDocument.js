"use strict";

var Document = require('./Document').Document;

/*
 * HTMLDocument
 */
var HTMLDocument, createHTMLDocument;
HTMLDocument = (function () {

  // Extension
  (function (child, parent) {
    function HTMLDocument() {
      this.constructor = child;
    }
    HTMLDocument.prototype = parent.prototype;
    child.prototype = new HTMLDocument();
  }(HTMLDocument, Document));

  // Constructor
  function HTMLDocument() {
    throw new TypeError('Illegal constructor');
  }

  return HTMLDocument;
}());

createHTMLDocument = (function (constructor) {
  HTMLDocument.prototype = constructor.prototype;
  function HTMLDocument() {
  }
  return function () {return new HTMLDocument(); };
}(HTMLDocument));

exports.HTMLDocument = HTMLDocument;
exports.createHTMLDocument = createHTMLDocument;
