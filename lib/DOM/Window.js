"use strict";

var CharacterData = require('./CharacterData').CharacterData;
var Document = require('./Document').Document;
var DOMException = require('./DOMException').DOMException;
var Element = require('./Element').Element;
var HTMLDocument = require('./HTMLDocument').HTMLDocument;
var HTMLElement = require('./HTMLElement').HTMLElement;
var Node = require('./Node').Node;
var Text = require('./Text').Text;
var Window =  require('./Window').Window;

var createHTMLDocument = require('./HTMLDocument').createHTMLDocument;

/*
 * Window
 */
var Window, createWindow;
Window = (function () {

  // Constructor
  function Window() {
    throw new TypeError('Illegal constructor');
  }

  return Window;
}());

createWindow = (function (constructor) {
  Window.prototype = constructor.prototype;
  // Constructor Override
  function Window() {
    // References to constructors
    this.CharacterData = CharacterData;
    this.Document = Document;
    this.DOMException = DOMException;
    this.Element = Element;
    this.HTMLDocument = HTMLDocument;
    this.HTMLElement = HTMLElement;
    this.Node = Node;
    this.Text = Text;
    this.Window = Window;
    // Properties
    this.document = createHTMLDocument();
  }
  return function () {return new Window(); };
}(Window));

exports.Window = Window;
exports.createWindow = createWindow;
