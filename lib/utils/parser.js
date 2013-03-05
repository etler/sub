var createDocumentType = require('../DOM/DocumentType').createDocumentType;
var createHTMLElement = require('../DOM/HTMLElement').createHTMLElement;
var createText = require('../DOM/Text').createText;

var htmlparser = require('htmlparser');
var handler = new htmlparser.DefaultHandler(function (error, dom) {
  if (error) {
    throw error;
  }
  else {

  }
}, { verbose: true, ignoreWhitespace: false, enforceEmptyTags: false });
var parser = new htmlparser.Parser(handler);

var converter = function (raw) {
  return raw.map(function(node){
    var element, children, key;
    switch (node.type) {
      case 'directive':
        match = node.data.match(/^!doctype\s+(\S+)(?:\s+(?:PUBLIC\s+(?:"(?=[^']+")|'(?=[^"]+'))([^'"]+)["']|SYSTEM)(?:\s+(?:"(?=[^']+")|'(?=[^"]+'))([^'"]+)["'])?)?$/i) || [];
        element = createDocumentType(match[1], match[2], match[3]);
        break;
      case 'tag':
      case 'script':
        element = createHTMLElement(node.name);
        for (key in node.attribs) {
          element.setAttribute(key, node.attribs[key]);
        }
        if (node.children) {
          children = converter(node.children);
          children.forEach(function(child){
            element.insertBefore(child);
          });
        }
        break;
      case 'text':
        element = createText(node.data);
        break;
    }
    return element;
  }).filter(function(element){
    return element;
  });
}

module.exports = function (string) {
  parser.parseComplete(string);
  return converter(handler.dom);
}
