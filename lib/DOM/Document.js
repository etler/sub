var Node = require('./Node').Node;
var createText = require('./Text').createText;
var createHTMLElement = require('./HTMLElement').createHTMLElement;

/*
 * Document
 */
var Document;
Document = (function () {

  // Extension
  (function (child, parent) {
    function Document() {
      this.constructor = child;
    }
    Document.prototype = parent.prototype;
    child.prototype = new Document();
  }(Document, Node));

  // Prototype
  Document.prototype.createTextNode = createText;
  Document.prototype.createElement = createHTMLElement;

  // Constructor
  function Document() {
    throw new TypeError('Illegal constructor');
  }

  return Document;
}());

exports.Document = Document;
