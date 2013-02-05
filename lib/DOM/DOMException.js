/*
 * DOMException
 */
var DOMException, createDOMException;
DOMException = (function () {
  // Extension
  (function (child, parent) {
    function DOMException() {
      this.constructor = child;
    }
    DOMException.prototype = parent.prototype;
    child.prototype = new DOMException();
  }(DOMException, Error));

  //Prototype
  DOMException.prototype.INVALID_CHARACTER_ERR = 5;

  //Constructor
  function DOMException() {
    throw new TypeError('Illegal constructor');
  }

  return DOMException;
}());

createDOMException = (function (constructor) {
  DOMException.prototype = constructor.prototype;
  function DOMException(code) {
    var key;
    this.code = code;
    for (key in this) {
      if (this[key] === code) {
        this.name = key;
        this.message = key + ': DOM Exception ' + code;
      }
    }
  }
  return function (code) {return new DOMException(code); };
}(DOMException));

exports.DOMException = DOMException;
exports.createDOMException = createDOMException;