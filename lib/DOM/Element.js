var Node = require('./Node').Node;
var constructNode = require('./Node').constructNode;
var DOMException = require('./DOMException').DOMException;
var createDOMException = require('./DOMException').createDOMException;
var Text = require('./Text').Text;

// Helpers
/* As specified at:
 * http://www.w3.org/TR/2008/REC-xml-20081126/#d0e804
 */
var attributeNameStartChar, attributeNameChar, attributeNameRegExp, attributeString;
attributeNameStartChar = "([:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD])";
attributeNameChar = "(" + attributeNameStartChar + "|[\\-\\.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040])";
attributeNameRegExp = new RegExp("^" + attributeNameStartChar + attributeNameChar + "*$");

attributeString = function (string) {
  string = String(string);
  if (!attributeNameRegExp.test(string)) {throw createDOMException(DOMException.INVALID_CHARACTER_ERR); }
  return string.toLowerCase();
};

var tagNameStartChar, tagNameChar, tagNameRegExp, tagString;
tagNameStartChar = "([:A-Z_a-z])";
tagNameChar = "(" + tagNameStartChar + "|[-.])";
tagNameRegExp = new RegExp("^" + tagNameStartChar + tagNameChar + "*$");;

tagString = function (string) {
  string = String(string);
  if (!tagNameRegExp.test(string)) {throw createDOMException(DOMException.INVALID_CHARACTER_ERR); }
  return string.toUpperCase();
}

var asHTML;
asHTML = function (node) {
  if (node instanceof Text) {
    return node.data;
  }
  if (node instanceof Element) {
    var tag, attributes;
    tag = node.tagName.toLowerCase();
    attributes = '';
    for (key in node.attributes) {
      attributes += ' '+key+'="'+node.attributes[key]+'"'
    }
    return '<'+tag+attributes+'>'+node.innerHTML+'</'+tag+'>';
  }
}

/*
 * Element
 */
var Element, constructElement, createElement;
Element = (function () {
  // Extension
  (function (child, parent) {
    function Element() {
      this.constructor = child;
    }
    Element.prototype = parent.prototype;
    child.prototype = new Element();
  }(Element, Node));

  // Prototype
  (function () {
    Element.prototype.getAttribute = function (attribute) {
      if (typeof attribute === 'undefined') {return null; }
      return this.attributes[attributeString(attribute)] || null;
    };

    Element.prototype.setAttribute = function (attribute, value) {
      this.attributes[attributeString(attribute)] = value;
    };

    Element.prototype.querySelectorAll = function (queryString) {
      var tokens, query, queries, selectors, selector, nameMatch, selectorMatch, combinatorMatch, index, value;
      nameMatch = "([-]?[_a-zA-Z]+[_a-zA-Z0-9-]*)";
      selectorMatch = "([.#])";
      attributeMatch = "\\["+nameMatch+"(?:([~|^$*]?[=])['\"]?"+nameMatch+"['\"]?)?\\]";
      combinatorMatch = "([+~> ])";
      tagRegExp = new RegExp("^"+nameMatch);
      idRegExp = new RegExp("^#"+nameMatch);
      classRegExp = new RegExp("^\\."+nameMatch);
      attributeRegExp = new RegExp("^"+attributeMatch);
      combinatorRegExp = new RegExp(combinatorMatch);
      tokens = queryString.split(combinatorRegExp);
      tokens = tokens.filter( function(value){ return value.trim(); } );
      queries = [];
      for (index = 0; index < tokens.length; index++) {
        value = tokens[index];
        if (!query) {
          query = {
            combinator: '',
            tag: '',
            ids: [],
            classes: [],
            attributes: []
          };
          queries.push(query);
        }
        if (combinatorRegExp.test(value)) {
          query.combinator = value;
          continue;
        }
        query.tag = (tag = tagRegExp.exec(value)) ? tag[1] : '';
        value = value.replace(tagRegExp, '');
        while (value != '') {
          if (idRegExp.test(value)) {
            (id = idRegExp.exec(value)) ? query.ids.push(id[1]) : void 0;
            value = value.replace(idRegExp, '');
          } else
          if (classRegExp.test(value)) {
            (classes = classRegExp.exec(value)) ? query.classes.push(classes[1]) : void 0;
            value = value.replace(classRegExp, '');
          } else
          if (attributeRegExp.test(value)) {
            (attribute = attributeRegExp.exec(value)) ? query.attributes.push({key: attribute[1], comparator: attribute[2], value: attribute[3]}) : void 0;
            value = value.replace(attributeRegExp, '');
          } else {
            throw createDOMException(DOMException.SYNTAX_ERR);
          }
        }
        // null query variable so it comes up as undefined and gets regenerated
        query = null;
      }
      return queries;
    };
  }());

  //Constructor
  function Element() {
    throw new TypeError('Illegal constructor');
  }

  return Element;
}());

constructElement = function(tagName) {
  constructNode.apply(this, arguments);
  Object.defineProperty(this, 'nodeType', {
    configurable: true,
    value: Node.ELEMENT_NODE
  });
  Object.defineProperty(this, 'tagName', {
    configurable: true,
    value: tagString(tagName)
  });
  Object.defineProperty(this, 'parentElement', {
    configurable: true,
    value: null
  });
  Object.defineProperty(this, 'attributes', {
    configurable: true,
    value: {}
  });
  Object.defineProperty(this, 'innerHTML', {
    configurable: true,
    get: function () {
      var index, html;
      html = '';
      for (index = 0; index < this.childNodes.length; index++) {
        html += asHTML(this.childNodes[index]);
      }
      return html;
    },
    set: function (string) {

    }
  });
  Object.defineProperty(this, 'outerHTML', {
    configurable: true,
    get: function () {
      return asHTML(this);
    },
    set: function (string) {

    }
  });
}

exports.Element = Element;
exports.constructElement = constructElement;
