"use strict";

/*
 * DOMException
 */
var DOMException, constructDOMException, createDOMException;
DOMException = (function () {
  // Extension
  (function (child, parent) {
    function DOMException() {
      this.constructor = child;
    }
    DOMException.prototype = parent.prototype;
    child.prototype = new DOMException();
  }(DOMException, Error));

  //Constants
  DOMException.ABORT_ERR = 20;
  DOMException.DATA_CLONE_ERR = 25;
  DOMException.DOMSTRING_SIZE_ERR = 2;
  DOMException.HIERARCHY_REQUEST_ERR = 3;
  DOMException.INDEX_SIZE_ERR = 1;
  DOMException.INUSE_ATTRIBUTE_ERR = 10;
  DOMException.INVALID_ACCESS_ERR = 15;
  DOMException.INVALID_CHARACTER_ERR = 5;
  DOMException.INVALID_MODIFICATION_ERR = 13;
  DOMException.INVALID_NODE_TYPE_ERR = 24;
  DOMException.INVALID_STATE_ERR = 11;
  DOMException.NAMESPACE_ERR = 14;
  DOMException.NETWORK_ERR = 19;
  DOMException.NOT_FOUND_ERR = 8;
  DOMException.NOT_SUPPORTED_ERR = 9;
  DOMException.NO_DATA_ALLOWED_ERR = 6;
  DOMException.NO_MODIFICATION_ALLOWED_ERR = 7;
  DOMException.QUOTA_EXCEEDED_ERR = 22;
  DOMException.SECURITY_ERR = 18;
  DOMException.SYNTAX_ERR = 12;
  DOMException.TIMEOUT_ERR = 23;
  DOMException.TYPE_MISMATCH_ERR = 17;
  DOMException.URL_MISMATCH_ERR = 21;
  DOMException.VALIDATION_ERR = 16;
  DOMException.WRONG_DOCUMENT_ERR =  4;

  //Constructor
  function DOMException() {
    throw new TypeError('Illegal constructor');
  }

  return DOMException;
}());

constructDOMException = function (code) {
  var key;
  this.code = code;
  for (key in DOMException) {
    if (DOMException[key] === code) {
      this.name = key;
      this.message = 'DOM Exception ' + code;
    }
  }
};

createDOMException = (function (constructor) {
  DOMException.prototype = constructor.prototype;
  function DOMException(code) {
    constructDOMException.apply(this, arguments);
  }
  return function (code) {
    var exception = new DOMException(code);
    Error.captureStackTrace(exception, createDOMException);
    return exception;
  };
}(DOMException));

exports.DOMException = DOMException;
exports.constructDOMException = constructDOMException;
exports.createDOMException = createDOMException;
