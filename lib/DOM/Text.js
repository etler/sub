"use strict";

var CharacterData = require('./CharacterData').CharacterData;
var initializeCharacterData = require('./CharacterData').initializeCharacterData;
var Node = require('./Node').Node;

/*
 * Text
 */
var Text, initializeText, createText;
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
    if (!(this instanceof Text)) {
      throw new TypeError("Failed to construct 'Text': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
    } else {
      return createText.apply(this, arguments);
    }
  };

  return Text;
}());

initializeText = function (string) {
  initializeCharacterData.apply(this, arguments);
  this.nodeType = Node.TEXT_NODE;
};

createText = (function (constructor) {
  Text.prototype = constructor.prototype;
  function Text() {
    initializeText.apply(this, arguments);
  }
  return function (string) {return new Text(string); };
}(Text));

exports.Text = Text;
exports.initializeText = initializeText;
exports.createText = createText;
