/*
 * Node
 */
var Node, constructNode;
Node = (function () {
  //Prototype
  Node.prototype.cloneNode = function () {};
  Node.prototype.insertBefore = function () {};
  Node.prototype.removeChild = function () {};

  //Constructor
  function Node() {
    throw new TypeError('Illegal constructor');
  }

  return Node;
}());

constructNode = function () {
  this.attributes = null;
  this.parentNode = null;
}

exports.Node = Node;
exports.constructNode = constructNode;
