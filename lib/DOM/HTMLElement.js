var Element = require('./Element').Element;
var constructElement = require('./Element').constructElement;

/*
 * HTMLElement
 */
var HTMLElement, constructHTMLElement, createHTMLElement;
HTMLElement = (function () {
  // Extension
  (function (child, parent) {
    function HTMLElement() {
      this.constructor = child;
    }
    HTMLElement.prototype = parent.prototype;
    child.prototype = new HTMLElement();
  }(HTMLElement, Element));

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
    constructHTMLElement.apply(this, arguments);
  }
  return function (tagName) {return new HTMLElement(tagName); };
}(HTMLElement));

exports.HTMLElement = HTMLElement;
exports.constructHTMLElement = constructHTMLElement;
exports.createHTMLElement = createHTMLElement;
