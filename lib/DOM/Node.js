var DOMException = require('./DOMException').DOMException;
var createDOMException = require('./DOMException').createDOMException;

/*
 * Node
 */
var Node, constructNode;
Node = (function () {
  // Contants
  Node.ATTRIBUTE_NODE = 2;
  Node.CDATA_SECTION_NODE = 4;
  Node.COMMENT_NODE = 8;
  Node.DOCUMENT_FRAGMENT_NODE = 11;
  Node.DOCUMENT_NODE = 9;
  Node.DOCUMENT_POSITION_CONTAINED_BY = 16;
  Node.DOCUMENT_POSITION_CONTAINS = 8;
  Node.DOCUMENT_POSITION_DISCONNECTED = 1;
  Node.DOCUMENT_POSITION_FOLLOWING = 4;
  Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
  Node.DOCUMENT_POSITION_PRECEDING = 2;
  Node.DOCUMENT_TYPE_NODE = 10;
  Node.ELEMENT_NODE = 1;
  Node.ENTITY_NODE = 6;
  Node.ENTITY_REFERENCE_NODE = 5;
  Node.NOTATION_NODE = 12;
  Node.PROCESSING_INSTRUCTION_NODE = 7;
  Node.TEXT_NODE = 3;
  //Prototype
  Node.prototype.cloneNode = function () {};
  Node.prototype.insertBefore = function (newElement, referenceElement) {
    if (referenceElement == null)
      return this.childNodes.push(newElement);
    var index = this.childNodes.indexOf(referenceElement);
    if (index === -1)
      throw createDOMException(DOMException.NOT_FOUND_ERR)
    this.childNodes.splice(index, 0, newElement);
    return newElement;
  };
  Node.prototype.removeChild = function (childElement) {
    var index = this.childNodes.indexOf(childElement);
    if (index === -1)
      throw createDOMException(DOMException.NOT_FOUND_ERR);
    this.childNodes.splice(index, 1);
    // We still have to set parent to null in case it's reused.
    childElement.parentElement = null;
  };

  //Constructor
  function Node() {
    throw new TypeError('Illegal constructor');
  }

  return Node;
}());

constructNode = function () {
  this.attributes = null;
  this.parentElement = null;
  this.nextSibling = null;
  this.firstChild = null;
  Object.defineProperty(this, 'childNodes', {
    configurable: true,
    value: []
  });
}

exports.Node = Node;
exports.constructNode = constructNode;
