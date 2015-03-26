"use strict";

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
}, { verbose: true, ignoreWhitespace: false, enforceEmptyTags: true });
var parser = new htmlparser.Parser(handler);

var converter = function (raw) {
  return raw.map(function(node){
    var element, children, key, match;
    switch (node.type) {
      case 'directive':
        /* doctype regex explanation
         * // All doctypes start with !doctype then one or more spaces
         * ^!doctype\s+
         * // The name is a consecutive group of characters
         * (\S+)
         * // This next segment is optional
         * (?:\s+
         *   // The optional segment begins with PUBLIC or SYSTEM
         *   (?:SYSTEM
         *     // If the optional segment begins with SYSTEM there must be a string after it
         *     (?!\s*$)
         *     |PUBLIC\s+
         *     // If it begins with PUBLIC the next segment is a quoted publicID string
         *     // Check for an opening " or '
         *     // Then do a lookahead for the matching quote to prevent quote mixing
         *     (?:"(?=[^']+")|'(?=[^"]+'))
         *     // The string block (This means you cannot have a differing quote within your quote block but this regex is complex enough)
         *     ([^'"]+)
         *     // Match the ending quote
         *     ["']
         *   )
         *   // Begin the systemID string which may come after SYSTEM or after the publicID string
         *   // The systemID is optional after the publicID
         *   (?:\s+
         *     // The quote check same as above
         *     (?:"(?=[^']+")|'(?=[^"]+'))
         *     // The string block
         *     ([^'"]+)
         *     // Match the ending quote
         *     ["']
         *   )?
         *)?$
         */
        match = node.data.match(/^!doctype\s+(\S+)(?:\s+(?:SYSTEM(?!$)|PUBLIC\s+(?:"(?=[^']+")|'(?=[^"]+'))([^'"]+)["'])(?:\s+(?:"(?=[^']+")|'(?=[^"]+'))([^'"]+)["'])?)?$/i) || [];
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
