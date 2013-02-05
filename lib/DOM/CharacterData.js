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

  // Constructor
  function CharacterData() {
    throw new TypeError('Illegal constructor');
  }

  return CharacterData;
}());

constructCharacterData = function () {
  constructNode.apply(this, arguments);
  this.data = '';
  Object.defineProperty(this, 'length', {
    get: (function(){
      return this.data.length;
    }).bind(this)
  })
}

exports.CharacterData = CharacterData;
exports.constructCharacterData = constructCharacterData;
