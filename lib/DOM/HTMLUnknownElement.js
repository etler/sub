"use strict";

var HTMLElement = require('./HTMLElement').HTMLElement;
var constructHTMLElement = require('./HTMLElement').constructHTMLElement;

/*
 * HTMLUnknownElement
 */
var HTMLUnknownElement, createHTMLUnknownElement;
HTMLUnknownElement = (function () {
  // Extension
  (function (child, parent) {
    function HTMLUnknownElement() {
      this.constructor = child;
    }
    HTMLUnknownElement.prototype = parent.prototype;
    child.prototype = new HTMLUnknownElement();
  }(HTMLUnknownElement, HTMLElement));

  //Constructor
  function HTMLUnknownElement() {
    throw new TypeError('Illegal constructor');
  }

  return HTMLUnknownElement;
}());


createHTMLUnknownElement = (function (constructor) {
  HTMLUnknownElement.prototype = constructor.prototype;
  function HTMLUnknownElement() {
    constructHTMLElement.apply(this, arguments);
  }
  return function (tagName) {return new HTMLUnknownElement(tagName); };
}(HTMLUnknownElement));

exports.HTMLUnknownElement = HTMLUnknownElement;
exports.createHTMLUnknownElement = createHTMLUnknownElement;
