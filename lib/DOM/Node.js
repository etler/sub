var DOMException = require('./DOMException').DOMException;
var createDOMException = require('./DOMException').createDOMException;

/*
 * Node
 */
var Node, constructNode;
Node = (function () {
  // Contants
  Node.ELEMENT_NODE = 1;
  Node.ATTRIBUTE_NODE = 2;
  Node.TEXT_NODE = 3;
  Node.CDATA_SECTION_NODE = 4;
  Node.ENTITY_REFERENCE_NODE = 5;
  Node.ENTITY_NODE = 6;
  Node.PROCESSING_INSTRUCTION_NODE = 7;
  Node.DOCUMENT_NODE = 9;
  Node.COMMENT_NODE = 8;
  Node.DOCUMENT_TYPE_NODE = 10;
  Node.DOCUMENT_FRAGMENT_NODE = 11;
  Node.NOTATION_NODE = 12;
  Node.DOCUMENT_POSITION_DISCONNECTED = 1;
  Node.DOCUMENT_POSITION_PRECEDING = 2;
  Node.DOCUMENT_POSITION_FOLLOWING = 4;
  Node.DOCUMENT_POSITION_CONTAINS = 8;
  Node.DOCUMENT_POSITION_CONTAINED_BY = 16;
  Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
  //Prototype
  Node.prototype.cloneNode = function (deep) {
    var HTMLElement = require('./HTMLElement').HTMLElement;
    var createHTMLElement = require('./HTMLElement').createHTMLElement;
    var Text = require('./Text').Text;
    var createText = require('./Text').createText;
    var newNode;
    deep = deep || true;
    if (this instanceof HTMLElement) {
      newNode = createHTMLElement(this.tagName);
      for (var key in this.attributes)
        newNode.attributes[key] = this.attributes[key];
    }
    if (this instanceof Text) {
      newNode = createText(this.data);
    }
    if (deep === true) {
      for (var index = 0; index < this.childNodes.length; index++) {
        newNode.insertBefore(this.childNodes[index].cloneNode(true));
      }
    }
    return newNode;
  };

  Node.prototype.contains = function (element) {
    for (var index = 0; index < this.childNodes.length; index++) {
      child = this.childNodes[index];
      if (child === element || child.contains(element)) {
        return true;
      }
    }
    return false;
  }

  Node.prototype.hasAttributes = function () {
    for (var key in this.attributes)
      return true;
    return false;
  }

  Node.prototype.insertBefore = function (newElement, referenceElement) {
    var index;
    if (!(newElement instanceof Node)) {
      throw createDOMException(DOMException.NOT_FOUND_ERR);
    }
    if (referenceElement instanceof Node) {
      index = this.childNodes.indexOf(referenceElement);
      if (index === -1) {
        throw createDOMException(DOMException.NOT_FOUND_ERR);
      }
    }
    // If already inserted, remove from where it was
    if (newElement.parentNode)
      newElement.parentNode.removeChild(newElement);
    newElement.parentNode = this;
    // We need to reindex in case the parent element was this element
    // Index is by default the last node.
    index = this.childNodes.length;
    if (referenceElement != null)
      index = this.childNodes.indexOf(referenceElement);
    this.childNodes.splice(index, 0, newElement);
    return newElement;
  };

  Node.prototype.appendChild = function (newElement) {
    return this.insertBefore(newElement);
  }

  Node.prototype.removeChild = function (childElement) {
    var index = this.childNodes.indexOf(childElement);
    if (index === -1)
      throw createDOMException(DOMException.NOT_FOUND_ERR);
    this.childNodes.splice(index, 1);
    // We still have to set parent to null in case it's reused.
    childElement.parentNode = null;
    return childElement;
  };

  Node.prototype.replaceChild = function (newElement, oldElement) {
    if (newElement instanceof Node || oldElement instanceof Node) {
      this.insertBefore(newElement, oldElement);
      this.removeChild(oldElement);
    }
    return oldElement;
  }

  //Constructor
  function Node() {
    throw new TypeError('Illegal constructor');
  }

  return Node;
}());

constructNode = function () {
  this.attributes = null;
  this.parentNode = null;
  Object.defineProperty(this, 'parentElement', {
    configurable: true,
    get: function(){
      return this.parentNode;
    }
  });
  Object.defineProperty(this, 'firstChild', {
    configurable: true,
    get: function(){
      return this.childNodes[0] || null;
    }
  });
  Object.defineProperty(this, 'lastChild', {
    configurable: true,
    get: function(){
      return this.childNodes[this.childNodes.length-1] || null;
    }
  });
  Object.defineProperty(this, 'nextSibling', {
    configurable: true,
    get: function(){
      var index, sibling;
      if (this.parentNode) {
        index = this.parentNode.childNodes.indexOf(this);
        sibling = this.parentNode.childNodes[index+1];
      }
      return sibling || null;
    }
  });
  Object.defineProperty(this, 'previousSibling', {
    configurable: true,
    get: function(){
      var index, sibling;
      if (this.parentNode) {
        index = this.parentNode.childNodes.indexOf(this);
        sibling = this.parentNode.childNodes[index-1];
      }
      return sibling || null;
    }
  });
  Object.defineProperty(this, 'childNodes', {
    configurable: true,
    value: []
  });
}

exports.Node = Node;
exports.constructNode = constructNode;
