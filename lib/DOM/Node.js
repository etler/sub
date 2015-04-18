"use strict";

var DOMException = require('./DOMException').DOMException;
var createDOMException = require('./DOMException').createDOMException;

/*
 * Node
 */
var Node, initializeNode;
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

  // These properties within defineProperties should not be in the element
  // prototype, this is a speed optimization, as the call to defineProperties
  // is expensive when called on every element initialization.
  // On the actual DOM, these properties belong to the object itself,
  // not the prototype.
  Object.defineProperties(Node.prototype, {
    'parentElement': {
      configurable: true,
      get: function () {
        return this.parentNode;
      }
    },
    'firstChild': {
      configurable: true,
      get: function () {
        return this.childNodes[0] || null;
      }
    },
    'lastChild': {
      configurable: true,
      get: function () {
        return this.childNodes[this.childNodes.length - 1] || null;
      }
    },
    'nextSibling': {
      configurable: true,
      get: function () {
        var index, sibling;
        if (this.parentNode) {
          index = this.parentNode.childNodes.indexOf(this);
          sibling = this.parentNode.childNodes[index + 1];
        }
        return sibling || null;
      }
    },
    'previousSibling': {
      configurable: true,
      get: function () {
        var index, sibling;
        if (this.parentNode) {
          index = this.parentNode.childNodes.indexOf(this);
          sibling = this.parentNode.childNodes[index - 1];
        }
        return sibling || null;
      }
    }
  });
  // cloneNode is set up to load in dependencies once, and then replace itself
  // with the closure function. This is so the dependencies do not need to be
  // loaded repeatedly, they cannot be taken out of the function, or it will
  // cause a dependency loop.
  Node.prototype.cloneNode = function () {
    var HTMLElement = require('./HTMLElement').HTMLElement;
    var createHTMLElement = require('./HTMLElement').createHTMLElement;
    var Text = require('./Text').Text;
    var createText = require('./Text').createText;
    Node.prototype.cloneNode = function (deep) {
      var newNode;
      var index;
      if (deep === null || deep === undefined) { deep = true; }
      if (this instanceof HTMLElement) {
        newNode = createHTMLElement(this.tagName);
        for (index = 0; index < this.attributes.length; index++) {
          newNode.attributes[index] = {
            name: this.attributes[index].name,
            value: this.attributes[index].value
          };
        }
      }
      if (this instanceof Text) {
        newNode = createText(this.data);
      }
      if (deep === true) {
        for (index = 0; index < this.childNodes.length; index++) {
          newNode.insertBefore(this.childNodes[index].cloneNode(true));
        }
      }
      return newNode;
    };
    return Node.prototype.cloneNode.apply(this, arguments);
  };

  Node.prototype.contains = function (element) {
    var index, child;
    for (index = 0; index < this.childNodes.length; index++) {
      child = this.childNodes[index];
      if (child === element || child.contains(element)) {
        return true;
      }
    }
    return false;
  };

  Node.prototype.hasAttributes = function () {
    return this.attributes.length > 0;
  };

  Node.prototype.hasChildNodes = function () {
    return this.childNodes.length > 0;
  };

  Node.prototype.normalize = function () {
    var index, child;
    for (index = 0; index < this.childNodes.length; index++) {
      child = this.childNodes[index];
      child.normalize();
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.data === '') {
          child.parentNode.removeChild(child);
        } else if (child.nextSibling.nodeType === Node.TEXT_NODE) {
          child.appendData(child.nextSibling.data);
          this.removeChild(child.nextSibling);
        }
      }
    }
  };

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
    if (newElement.parentNode) {
      newElement.parentNode.removeChild(newElement);
    }
    newElement.parentNode = this;
    // We need to reindex in case the parent element was this element
    // Index is by default the last node.
    index = this.childNodes.length;
    if (referenceElement !== null && referenceElement !== undefined) {
      index = this.childNodes.indexOf(referenceElement);
    }
    this.childNodes.splice(index, 0, newElement);
    return newElement;
  };

  Node.prototype.appendChild = function (newElement) {
    return this.insertBefore(newElement);
  };

  Node.prototype.removeChild = function (childElement) {
    var index = this.childNodes.indexOf(childElement);
    if (index === -1) {
      throw createDOMException(DOMException.NOT_FOUND_ERR);
    }
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
  };

  //Constructor
  function Node() {
    throw new TypeError('Illegal constructor');
  }

  return Node;
}());

initializeNode = function () {
  this.attributes = [];
  this.parentNode = null;
  this.childNodes = [];
};

exports.Node = Node;
exports.initializeNode = initializeNode;
