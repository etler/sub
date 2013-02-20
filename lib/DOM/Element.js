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
      var element, tokens, query, queries, selectors, selector, nameMatch, selectorMatch, combinatorMatch, index, value;
      element = this;
      nameMatch = "([-]?[_a-zA-Z]+[_a-zA-Z0-9-]*)";
      selectorMatch = "([.#])";
      attributeMatch = "\\["+nameMatch+"(?:([~|^$*]?[=])['\"]?"+nameMatch+"['\"]?)?\\]";
      combinatorMatch = "([+~> ])";
      tagRegExp = new RegExp("^"+nameMatch);
      idRegExp = new RegExp("^#"+nameMatch);
      classRegExp = new RegExp("^\\."+nameMatch);
      attributeRegExp = new RegExp("^"+attributeMatch);
      combinatorRegExp = new RegExp(combinatorMatch);
      queryStrings = queryString.split(',');
      queries = [];
      // First loop over comma seperated queries
      for (queryIndex = 0; queryIndex < queryStrings.length; queryIndex++) {
        query = queryStrings[queryIndex];
        query = query.trim();
        tokens = query.split(combinatorRegExp);
        tokens = tokens.filter( function(value){ return value.trim(); } );
        selectors = [];
        queries.push(selectors);
        // Within each query, loop over each selector token or combinator token
        for (index = 0; index < tokens.length; index++) {
          value = tokens[index];
          // Create a new selector object if there isn't one already
          if (!selector) {
            selector = {
              combinator: '',
              tag: '',
              ids: [],
              classes: [],
              attributes: []
            };
            selectors.push(selector);
          }
          if (combinatorRegExp.test(value)) {
            selector.combinator = value;
            // Continue because there is nothing else to parse
            continue;
          }
          selector.tag = (tag = tagRegExp.exec(value)) ? tag[1] : '';
          value = value.replace(tagRegExp, '');
          // Within each selector, parse out classes, ids, and attributes
          while (value != '') {
            if (idRegExp.test(value)) {
              (id = idRegExp.exec(value)) ? selector.ids.push(id[1]) : void 0;
              value = value.replace(idRegExp, '');
            } else
            if (classRegExp.test(value)) {
              (classes = classRegExp.exec(value)) ? selector.classes.push(classes[1]) : void 0;
              value = value.replace(classRegExp, '');
            } else
            if (attributeRegExp.test(value)) {
              (attribute = attributeRegExp.exec(value)) ? selector.attributes.push({key: attribute[1], comparator: attribute[2], value: attribute[3]}) : void 0;
              value = value.replace(attributeRegExp, '');
            } else {
              throw createDOMException(DOMException.SYNTAX_ERR);
            }
          }
          // null selector variable so it comes up as undefined and gets regenerated
          selector = null;
        }
      }
      checkTag = function(selector, element) {
        if (selector.tag && selector.tag.toUpperCase() !== child.tagName) { return false; }
        return true;
      }
      checkIDs = function(selector, element) {
        if (selector.ids.length > 1 || (selector.ids.length === 1 && selector.ids[0] !== element.getAttribute('id'))) { return false; }
        return true;
      }
      checkClasses = function(selector, element) {
        var classes = element.getAttribute('class').split(' ').filter(function(string){return string;});
        for (index = 0; index < selector.classes.length; index++) {
          if (classes.indexOf(selector.classes[index]) === -1) { return false; }
        }
        return true;
      }
      checkAttributes = function(selector, element) {
        for (index = 0; index < selector.attributes.length; index++) {
          attribute = selector.attributes[index];
          value = element.getAttribute(attribute.key);
          if (value === null) { return false; }
          switch (attribute.comparator) {
            // Exactly equal to query value
            case '=':
              if (attribute.value !== value) { return false; }
              break;
            // One of space seperated words is equal to query value
            case '~=':
              if (value.split(' ').indexOf(attribute.value) === -1) { return false; }
              break;
            // One of hyphen seperated words is equal to query value
            case '|=':
              if (value.split('-').indexOf(attribute.value) === -1) { return false; }
              break;
            // Starts with query value
            case '^=':
              if (value.indexOf(attribute.value) !== 0) { return false; }
              break;
            // Ends with query value
            case '$=':
              if (value.indexOf(attribute.value)+attribute.value.length-value.length !== 0) { return false; }
              break;
            // Has query value somewhere
            case '*=':
              if (value.indexOf(attribute.value) === -1) { return false; }
              break;
          }
        }
        return true;
      }
      select = function (query, element) {
        selector = query[0];
        selected = [];
        if (!selector) { return selected; };
        for (childIndex = 0; childIndex < element.childNodes.length; childIndex++) {
          child = element.childNodes[childIndex];
          // Check against tag
          if (!checkTag(selector, child)) { continue; }
          // Check against IDs
          if (!checkIDs(selector, child)) { continue; }
          // Check against classes
          if (!checkClasses(selector, child)) { continue; }
          // Check against attributes
          if (!checkAttributes(selector, child)) { continue; }
          selected.push(child);
        }
        return selected;
      }
      selected = queries.reduce(function (selected, query) {
        return selected.concat(select(query, element));
      }, []);
      return selected;
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
