"use strict";

var Node = require('./Node').Node;
var initializeNode = require('./Node').initializeNode;

/*
 * DocumentType
 */
var DocumentType, initializeDocumentType, createDocumentType;
DocumentType = (function () {

  // Extension
  (function (child, parent) {
    function DocumentType() {
      this.constructor = child;
    }
    DocumentType.prototype = parent.prototype;
    child.prototype = new DocumentType();
  }(DocumentType, Node));

  // Constructor
  function DocumentType() {
    throw new TypeError('Illegal constructor');
  }

  return DocumentType;
}());

initializeDocumentType = function (name, publicId, systemId) {
  initializeNode.apply(this, arguments);
  this.name = name || '';
  this.publicId = publicId || '';
  this.systemId = systemId || '';
};

createDocumentType = (function (constructor) {
  DocumentType.prototype = constructor.prototype;
  function DocumentType() {
    initializeDocumentType.apply(this, arguments);
  }
  return function (name, publicId, systemId) {return new DocumentType(name, publicId, systemId); };
}(DocumentType));

exports.DocumentType = DocumentType;
exports.initializeDocumentType = initializeDocumentType;
exports.createDocumentType = createDocumentType;
