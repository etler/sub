var Node = require('./Node').Node;
var constructNode = require('./Node').constructNode;

/*
 * Element
 */
var Element, constructElement, createElement;
Element = (function () {
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
    function Element() {
      this.constructor = child;
    }
    Element.prototype = parent.prototype;
    child.prototype = new Element();
  }(Element, Node));

  // Prototype
  (function () {
    var attributes = {};

    Element.prototype.getAttribute = function (attribute) {
      if (typeof attribute === 'undefined') {return null; }
      return attributes[attributeString(attribute)] || null;
    };

    Element.prototype.setAttribute = function (attribute, value) {
      attributes[attributeString(attribute)] = value;
    };

    Element.prototype.querySelectorAll = function () {};
  }());

  //Constructor
  function Element() {
    throw new TypeError('Illegal constructor');
  }

  return Element;
}());

constructElement = function(){
  constructNode.apply(this, arguments);
}

createElement = (function (constructor) {
  Element.prototype = constructor.prototype;
  function Element() {
  }
  return function () {return new Element(); };
}(Element));

exports.Element = Element;
exports.constructElement = constructElement;
exports.createElement = createElement;
