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
    // These properties within defineProperties should not be in the element
    // prototype, this is a speed optimization, as the call to defineProperties
    // is expensive when called on every element initialization.
    // On the actual DOM, these properties belong to the object itself,
    // not the prototype
    Object.defineProperty(CharacterData.prototype, 'length', {
      configurable: true,
      get: (function(){
        return this.data.length;
      }).bind(this)
    })
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
}

exports.CharacterData = CharacterData;
exports.constructCharacterData = constructCharacterData;
