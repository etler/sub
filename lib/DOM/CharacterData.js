var Node = require('./Node').Node;
var constructNode = require('./Node').constructNode;

/*
 * CharacterData
 */
var CharacterData, constructCharacterData;
CharacterData = (function () {

  // Extension
  (function (child, parent) {
    function CharacterData() {
      this.constructor = child;
    }
    CharacterData.prototype = parent.prototype;
    child.prototype = new CharacterData();
  }(CharacterData, Node));

  // Prototype
  (function () {
    CharacterData.prototype.appendData = function (data) {
      this.data += data;
    }
  }());

  // Constructor
  function CharacterData() {
    throw new TypeError('Illegal constructor');
  }

  return CharacterData;
}());

constructCharacterData = function (string) {
  constructNode.apply(this, arguments);
  this.data = String(string);
  Object.defineProperty(this, 'length', {
    configurable: true,
    get: (function(){
      return this.data.length;
    }).bind(this)
  })
}

exports.CharacterData = CharacterData;
exports.constructCharacterData = constructCharacterData;
