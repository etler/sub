"use strict";

var Element = require('./Element').Element;
var initializeElement = require('./Element').initializeElement;

/*
 * HTMLElement
 */
var HTMLElement, initializeHTMLElement, createHTMLElement;
HTMLElement = (function () {
  // Extension
  (function (child, parent) {
    function HTMLElement() {
      this.constructor = child;
    }
    HTMLElement.prototype = parent.prototype;
    child.prototype = new HTMLElement();
  }(HTMLElement, Element));

  // Constructor
  function HTMLElement() {
    throw new TypeError('Illegal constructor');
  }

  return HTMLElement;
}());

initializeHTMLElement = function(){
  initializeElement.apply(this, arguments);
};

var createHTMLUnknownElement;

createHTMLElement = (function (constructor) {
  HTMLElement.prototype = constructor.prototype;
  function HTMLElement() {
    initializeHTMLElement.apply(this, arguments);
  }
  return function (tagName) {
    // Require it here instead of at the top because these classes extend this class
    if (!createHTMLUnknownElement) {
      createHTMLUnknownElement = require('./HTMLUnknownElement').createHTMLUnknownElement;
    }
    var factory;
    tagName = String(tagName);
    tagName = tagName.toUpperCase();
    if (factories.hasOwnProperty(tagName)) {
      factory = factories[tagName];
      if (factory === createHTMLElement) {
        return new HTMLElement(tagName);
      }
      return factory(tagName);
    }
    return createHTMLUnknownElement(tagName);
  };
}(HTMLElement));

// These are all recognized html tags, and the factory to create them
// Unless they are implemented they will point to createHTMLElement
// The actual element they should point to are in comments after the tag
var factories = {
  'A': createHTMLElement, // HTMLAnchorElement
  'ABBR': createHTMLElement,
  'ACRONYM': createHTMLElement,
  'ADDRESS': createHTMLElement,
  'APPLET': createHTMLElement, // HTMLAppletElement
  'AREA': createHTMLElement, // HTMLAreaElement
  'ARTICLE': createHTMLElement,
  'ASIDE': createHTMLElement,
  'AUDIO': createHTMLElement, // HTMLAudioElement extends HTMLMediaElement
  'B': createHTMLElement,
  'BASE': createHTMLElement, // HTMLBaseElement
  'BASEFONT': createHTMLElement, // HTMLBaseFontElement
  'BDI': createHTMLElement,
  'BDO': createHTMLElement,
  'BGSOUND': createHTMLElement,
  'BIG': createHTMLElement,
  'BLINK': createHTMLElement,
  'BLOCKQUOTE': createHTMLElement, // HTMLQuoteElement
  'BODY': createHTMLElement, // HTMLBodyElement
  'BR': createHTMLElement, // HTMLBRElement
  'BUTTON': createHTMLElement, // HTMLButtonElement
  'CANVAS': createHTMLElement, // HTMLCanvasElement
  'CAPTION': createHTMLElement, // HTMLTableCaptionElement
  'CENTER': createHTMLElement,
  'CITE': createHTMLElement,
  'CODE': createHTMLElement,
  'COL': createHTMLElement, // HTMLTableColElement
  'COLGROUP': createHTMLElement, // HTMLTableColElement
  'COMMAND': createHTMLElement,
  'DATA': createHTMLElement,
  'DATALIST': createHTMLElement, // HTMLDataListElement
  'DD': createHTMLElement,
  'DEL': createHTMLElement, // HTMLModElement
  'DETAILS': createHTMLElement, // HTMLDetailsElement
  'DFN': createHTMLElement,
  'DIR': createHTMLElement, // HTMLDirectoryElement
  'DIV': createHTMLElement, // HTMLDivElement
  'DL': createHTMLElement, // HTMLDListElement
  'DT': createHTMLElement,
  'EM': createHTMLElement,
  'EMBED': createHTMLElement, // HTMLEmbedElement
  'FIELDSET': createHTMLElement, // HTMLFieldSetElement
  'FIGCAPTION': createHTMLElement,
  'FIGURE': createHTMLElement,
  'FONT': createHTMLElement, // HTMLFontElement
  'FOOTER': createHTMLElement,
  'FORM': createHTMLElement, // HTMLFormElement
  'FRAME': createHTMLElement, // HTMLFrameElement
  'FRAMESET': createHTMLElement, // HTMLFrameSetElement
  'H1': createHTMLElement, // HTMLHeadingElement
  'H2': createHTMLElement, // HTMLHeadingElement
  'H3': createHTMLElement, // HTMLHeadingElement
  'H4': createHTMLElement, // HTMLHeadingElement
  'H5': createHTMLElement, // HTMLHeadingElement
  'H6': createHTMLElement, // HTMLHeadingElement
  'HEAD': createHTMLElement, // HTMLHeadElement
  'HEADER': createHTMLElement,
  'HGROUP': createHTMLElement,
  'HR': createHTMLElement, // HTMLHRElement
  'HTML': createHTMLElement, // HTMLHtmlElement
  'I': createHTMLElement,
  'IFRAME': createHTMLElement, // HTMLIFrameElement
  'IMG': createHTMLElement, // HTMLImageElement
  'INPUT': createHTMLElement, // HTMLInputElement
  'INS': createHTMLElement, // HTMLModElement
  'ISINDEX': createHTMLElement,
  'KBD': createHTMLElement,
  'KEYGEN': createHTMLElement, // HTMLKeygenElement
  'LABEL': createHTMLElement, // HTMLLabelElement
  'LEGEND': createHTMLElement, // HTMLLegendElement
  'LI': createHTMLElement, // HTMLLIElement
  'LINK': createHTMLElement, // HTMLLinkElement
  'LISTING': createHTMLElement, // HTMLPreElement
  'MAIN': createHTMLElement,
  'MAP': createHTMLElement, // HTMLMapElement
  'MARK': createHTMLElement,
  'MARQUEE': createHTMLElement, // HTMLMarqueeElement
  'MENU': createHTMLElement, // HTMLMenuElement
  'META': createHTMLElement, // HTMLMetaElement
  'METER': createHTMLElement, // HTMLMeterElement
  'NAV': createHTMLElement,
  'NOBR': createHTMLElement,
  'NOFRAMES': createHTMLElement,
  'NOSCRIPT': createHTMLElement,
  'OBJECT': createHTMLElement, // HTMLObjectElement
  'OL': createHTMLElement, // HTMLOListElement
  'OPTGROUP': createHTMLElement, // HTMLOptGroupElement
  'OPTION': createHTMLElement, // HTMLOptionElement
  'OUTPUT': createHTMLElement, // HTMLOutputElement
  'P': createHTMLElement, // HTMLParagraphElement
  'PARAM': createHTMLElement, // HTMLParamElement
  'PLAINTEXT': createHTMLElement,
  'PRE': createHTMLElement, // HTMLPreElement
  'PROGRESS': createHTMLElement, // HTMLProgressElement
  'Q': createHTMLElement, // HTMLQuoteElement
  'RP': createHTMLElement,
  'RT': createHTMLElement,
  'RUBY': createHTMLElement,
  'S': createHTMLElement,
  'SAMP': createHTMLElement,
  'SCRIPT': createHTMLElement, // HTMLScriptElement
  'SECTION': createHTMLElement,
  'SELECT': createHTMLElement, // HTMLSelectElement
  'SMALL': createHTMLElement,
  'SOURCE': createHTMLElement, // HTMLSourceElement
  'SPACER': createHTMLElement,
  'SPAN': createHTMLElement, // HTMLSpanElement
  'STRIKE': createHTMLElement,
  'STRONG': createHTMLElement,
  'STYLE': createHTMLElement, // HTMLStyleElement
  'SUB': createHTMLElement,
  'SUMMARY': createHTMLElement,
  'SUP': createHTMLElement,
  'TABLE': createHTMLElement, // HTMLTableElement
  'TBODY': createHTMLElement, // HTMLTableSectionElement
  'TD': createHTMLElement, // HTMLTableCellElement
  'TEXTAREA': createHTMLElement, // HTMLTextAreaElement
  'TFOOT': createHTMLElement, // HTMLTableSectionElement
  'TH': createHTMLElement, // HTMLTableCellElement
  'THEAD': createHTMLElement, // HTMLTableSectionElement
  'TIME': createHTMLElement,
  'TITLE': createHTMLElement, // HTMLTitleElement
  'TR': createHTMLElement, // HTMLTableRowElement
  'TRACK': createHTMLElement, // HTMLTrackElement
  'TT': createHTMLElement,
  'U': createHTMLElement,
  'UL': createHTMLElement, // HTMLUListElement
  'VAR': createHTMLElement,
  'VIDEO': createHTMLElement, // HTMLVideoElement extends HTMLMediaElement
  'WBR': createHTMLElement,
  'XMP': createHTMLElement // HTMLPreElement
};

exports.HTMLElement = HTMLElement;
exports.initializeHTMLElement = initializeHTMLElement;
exports.createHTMLElement = createHTMLElement;
