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
tagNameChar = "(" + tagNameStartChar + "|[-.0-9])";
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

    Element.prototype.querySelectorAll = function (string) {
      var elements, queries, trim,
        parseSelector, parseSelectors, parseQuery, parseQueries,
        checkTag, checkIDs, checkClasses, checkAttributes, check, select;
      trim = function (string) {
        return string.trim();
      }
      parseSelector = function (string) {
        var nameMatch, selector, nextMatch, match;
        nameMatch = "([-]?[_a-zA-Z]+[_a-zA-Z0-9-]*)";
        selector = {
          combinator: '',
          tag: '',
          ids: [],
          classes: [],
          attributes: []
        };
        // This is a side-effecty helper function to reduce duplicate code.
        nextMatch = function (regExp) {
          var match;
          if (regExp.test(string)) {
            match = regExp.exec(string).slice(1);
            string = string.replace(regExp, '');
          }
          return match;
        }
        // Combinator and tag must come first so they are checked before the loop
        if (match = nextMatch(new RegExp("^([+~> ])\\s*")))
          { selector.combinator = match[0]; }
        if (match = nextMatch(new RegExp("^"+nameMatch)))
          { selector.tag = match[0]; }
        // Within each selector, parse out classes, ids, and attributes
        while (string != '') {
          if (match = nextMatch(new RegExp("^#"+nameMatch)))
            { selector.ids.push(match[0]); } else
          if (match = nextMatch(new RegExp("^\\."+nameMatch)))
            { selector.classes.push(match[0]); } else
          if (match = nextMatch(new RegExp("^\\["+nameMatch+"(?:([~|^$*]?[=])['\"]?"+nameMatch+"['\"]?)?\\]")))
            { selector.attributes.push({key: match[0], comparator: match[1], value: match[2]}); } else
          { throw createDOMException(DOMException.SYNTAX_ERR); }
        }
        return selector;
      }
      parseSelectors = function (strings) {
        return strings.reduce(function (selectors, string) {
          selectors.push(parseSelector(string));
          return selectors;
        }, []);
      }
      parseQuery = function (string) {
        // Split selectors so there is a combinator, then selector
        return parseSelectors(
          string
            .match(/\s*([+~> ]?\s*[^+~> ]+)/g)
            .map(trim)
        );
      }
      parseQueries = function (strings) {
        return strings.reduce(function (queries, string) {
          queries.push(parseQuery(string));
          return queries;
        }, []);
      }
      checkTag = function(selector, element) {
        return !(selector.tag && selector.tag.toUpperCase() !== element.tagName);
      }
      checkIDs = function(selector, element) {
        return !(selector.ids.length > 1 || (selector.ids.length === 1 && selector.ids[0] !== element.getAttribute('id')));
      }
      checkClasses = function(selector, element) {
        var classes = (element.getAttribute('class') || '').split(' ').filter(function(string){return string;});
        for (index = 0; index < selector.classes.length; index++) {
          if (classes.indexOf(selector.classes[index]) === -1) { return false; }
        }
        return true;
      }
      checkAttributes = function(selector, element) {
        var attribute, value;
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
      check = function (selector, element) {
        return (checkTag(selector, element) && checkIDs(selector, element) && checkClasses(selector, element) && checkAttributes(selector, element));
      }
      // Given a selector and an element, find new elements that match the selector from the current element
      selectChildren = function (selector, element) {
        var selected, childIndex, child;
        selected = [];
        if (selector.combinator === '' || selector.combinator === '>') {
          for (childIndex = 0; childIndex < element.childNodes.length; childIndex++) {
            child = element.childNodes[childIndex];
            if (check(selector, child)) {
              selected.push(child);
            }
            if (selector.combinator === '' && child.childNodes.length) {
              selected.push.apply(selected, selectChildren(selector, child));
            }
          }
        } else if (element.nextSibling && (selector.combinator === '+' || selector.combinator === '~')) {
          child = element.nextSibling
          if (check(selector, child)) {
            selected.push(child);
          }
          if (selector.combinator === '~' || child.nodeType === Node.TEXT_NODE) {
            selected.push.apply(selected, selectChildren(selector, child));
          }
        }
        return selected;
      }
      // Given a query of selectors, apply selectors against elements and find matching children
      select = function (query, elements) {
        var selector, selected;
        selector = query[0];
        selected = elements.reduce(function (selected, element) {
          return selected.concat(selectChildren(selector, element));
        }, []);
        if (query.length > 1) {
          selected = select(query.slice(1), selected);
        }
        return selected;
      }
      string = String(string);
      if (!string) { throw createDOMException(DOMException.SYNTAX_ERR); }
      queries = parseQueries(
        string
          .split(',')
          .map(trim)
      );
      elements = [this];
      // Iterate through each query and return unique results
      return queries.reduce(function (selected, query) {
        return selected.concat(select(query, elements).filter(
          function (element) { return selected.indexOf(element) === -1; }
        ));
      }, []);
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
