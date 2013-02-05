var Element = require('./Element').Element;
var constructElement = require('./Element').constructElement;

/*
 * HTMLElement
 */
var HTMLElement, attributeNameStartChar, attributeNameChar, attributeNameRegExp, attributeString, attributes, constructHTMLElement, createHTMLElement;
HTMLElement = (function () {
  // Internals
  /* As specified at:
   * http://www.w3.org/TR/2008/REC-xml-20081126/#d0e804
   */
  var attributeNameStartChar, attributeNameChar, attributeNameRegExp, attributeString;
  attributeNameStartChar = "([:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD])";
  attributeNameChar = "(" + attributeNameStartChar + "|[\\-\\.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040])";
  attributeNameRegExp = new RegExp("^" + attributeNameStartChar + attributeNameChar + "*$");

  attributeString = function (string) {
    if (!attributeNameRegExp.test(string)) {throw createDOMException(5); }
    return string.toString().toLowerCase();
  };

  // Extension
  (function (child, parent) {
    function HTMLElement() {
      this.constructor = child;
    }
    HTMLElement.prototype = parent.prototype;
    child.prototype = new HTMLElement();
  }(HTMLElement, Element));

  // Prototype
  (function () {
    var attributes = {};

    HTMLElement.prototype.getAttribute = function (attribute) {
      if (typeof attribute === 'undefined') {return null; }
      return attributes[attributeString(attribute)] || null;
    };

    HTMLElement.prototype.setAttribute = function (attribute, value) {
      attributes[attributeString(attribute)] = value;
    };

    HTMLElement.prototype.querySelectorAll = function () {};
  }());

  // Constructor
  function HTMLElement() {
    throw new TypeError('Illegal constructor');
  }

  return HTMLElement;
}());

constructHTMLElement = function(){
  constructElement.apply(this, arguments);
}

createHTMLElement = (function (constructor) {
  HTMLElement.prototype = constructor.prototype;
  function HTMLElement() {
  }
  return function () {return new HTMLElement(); };
}(HTMLElement));

exports.HTMLElement = HTMLElement;
exports.constructHTMLElement = constructHTMLElement;
exports.createHTMLElement = createHTMLElement;
