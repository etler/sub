var Node = require('./Node').Node;
var constructNode = require('./Node').constructNode;

/*
 * Element
 */
var Element, constructElement, createElement;
Element = (function () {
  // Extension
  (function (child, parent) {
    function Element() {
      this.constructor = child;
    }
    Element.prototype = parent.prototype;
    child.prototype = new Element();
  }(Element, Node));

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
