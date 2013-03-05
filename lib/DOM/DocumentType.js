var Node = require('./Node').Node;
var constructNode = require('./Node').constructNode;

/*
 * DocumentType
 */
var DocumentType, constructDocumentType, createDocumentType;
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

constructDocumentType = function (name, publicId, systemId) {
  constructNode.apply(this, arguments);
  this.name = name || '';
  this.publicId = publicId || '';
  this.systemId = systemId || '';
}

createDocumentType = (function (constructor) {
  DocumentType.prototype = constructor.prototype;
  function DocumentType() {
    constructDocumentType.apply(this, arguments)
  }
  return function (name, publicId, systemId) {return new DocumentType(name, publicId, systemId); };
}(DocumentType));

exports.DocumentType = DocumentType;
exports.constructDocumentType = constructDocumentType;
exports.createDocumentType = createDocumentType;
