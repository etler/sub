var CharacterData = require('./CharacterData').CharacterData;
var constructCharacterData = require('./CharacterData').constructCharacterData;

/*
 * Text
 */
var Text, constructText, createText;
Text = (function () {

  // Extension
  (function (child, parent) {
    function Text() {
      this.constructor = child;
    }
    Text.prototype = parent.prototype;
    child.prototype = new Text();
  }(Text, CharacterData));

  // Constructor
  function Text() {
    throw new TypeError('Illegal constructor');
  }

  return Text;
}());

constructText = function (string) {
  constructCharacterData.apply(this, arguments);
  this.data = String(string);
}

createText = (function (constructor) {
  Text.prototype = constructor.prototype;
  function Text() {
    constructText.apply(this, arguments)
  }
  return function (string) {return new Text(string); };
}(Text));

exports.Text = Text;
exports.constructText = constructText;
exports.createText = createText;
