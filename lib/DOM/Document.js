var Node = require('./Node').Node;
var createText = require('./Text').createText;
var createHTMLUnknownElement = require('./HTMLUnknownElement').createHTMLUnknownElement;
var createHTMLElement = require('./HTMLElement').createHTMLElement;

/*
 * Document
 */
var Document;
Document = (function () {

  // Extension
  (function (child, parent) {
    function Document() {
      this.constructor = child;
    }
    Document.prototype = parent.prototype;
    child.prototype = new Document();
  }(Document, Node));

  // Prototype
  Document.prototype.createTextNode = createText;
  Document.prototype.createElement = function (tagName) {
    // These are all recognized html tags, and the factory to create them
    // Unless they are implemented they will point to createHTMLElement
    // The actual element they should point to are in comments after the tag
    var factories = {
      'a': createHTMLElement, // HTMLAnchorElement
      'abbr': createHTMLElement,
      'acronym': createHTMLElement,
      'address': createHTMLElement,
      'applet': createHTMLElement, // HTMLAppletElement
      'area': createHTMLElement, // HTMLAreaElement
      'article': createHTMLElement,
      'aside': createHTMLElement,
      'audio': createHTMLElement, // HTMLAudioElement extends HTMLMediaElement
      'b': createHTMLElement,
      'base': createHTMLElement, // HTMLBaseElement
      'basefont': createHTMLElement, // HTMLBaseFontElement
      'bdi': createHTMLElement,
      'bdo': createHTMLElement,
      'bgsound': createHTMLElement,
      'big': createHTMLElement,
      'blink': createHTMLElement,
      'blockquote': createHTMLElement, // HTMLQuoteElement
      'body': createHTMLElement, // HTMLBodyElement
      'br': createHTMLElement, // HTMLBRElement
      'button': createHTMLElement, // HTMLButtonElement
      'canvas': createHTMLElement, // HTMLCanvasElement
      'caption': createHTMLElement, // HTMLTableCaptionElement
      'center': createHTMLElement,
      'cite': createHTMLElement,
      'code': createHTMLElement,
      'col': createHTMLElement, // HTMLTableColElement
      'colgroup': createHTMLElement, // HTMLTableColElement
      'command': createHTMLElement,
      'data': createHTMLElement,
      'datalist': createHTMLElement, // HTMLDataListElement
      'dd': createHTMLElement,
      'del': createHTMLElement, // HTMLModElement
      'details': createHTMLElement, // HTMLDetailsElement
      'dfn': createHTMLElement,
      'dir': createHTMLElement, // HTMLDirectoryElement
      'div': createHTMLElement, // HTMLDivElement
      'dl': createHTMLElement, // HTMLDListElement
      'dt': createHTMLElement,
      'em': createHTMLElement,
      'embed': createHTMLElement, // HTMLEmbedElement
      'fieldset': createHTMLElement, // HTMLFieldSetElement
      'figcaption': createHTMLElement,
      'figure': createHTMLElement,
      'font': createHTMLElement, // HTMLFontElement
      'footer': createHTMLElement,
      'form': createHTMLElement, // HTMLFormElement
      'frame': createHTMLElement, // HTMLFrameElement
      'frameset': createHTMLElement, // HTMLFrameSetElement
      'h1': createHTMLElement, // HTMLHeadingElement
      'h2': createHTMLElement, // HTMLHeadingElement
      'h3': createHTMLElement, // HTMLHeadingElement
      'h4': createHTMLElement, // HTMLHeadingElement
      'h5': createHTMLElement, // HTMLHeadingElement
      'h6': createHTMLElement, // HTMLHeadingElement
      'head': createHTMLElement, // HTMLHeadElement
      'header': createHTMLElement,
      'hgroup': createHTMLElement,
      'hr': createHTMLElement, // HTMLHRElement
      'html': createHTMLElement, // HTMLHtmlElement
      'i': createHTMLElement,
      'iframe': createHTMLElement, // HTMLIFrameElement
      'img': createHTMLElement, // HTMLImageElement
      'input': createHTMLElement, // HTMLInputElement
      'ins': createHTMLElement, // HTMLModElement
      'isindex': createHTMLElement,
      'kbd': createHTMLElement,
      'keygen': createHTMLElement, // HTMLKeygenElement
      'label': createHTMLElement, // HTMLLabelElement
      'legend': createHTMLElement, // HTMLLegendElement
      'li': createHTMLElement, // HTMLLIElement
      'link': createHTMLElement, // HTMLLinkElement
      'listing': createHTMLElement, // HTMLPreElement
      'main': createHTMLElement,
      'map': createHTMLElement, // HTMLMapElement
      'mark': createHTMLElement,
      'marquee': createHTMLElement, // HTMLMarqueeElement
      'menu': createHTMLElement, // HTMLMenuElement
      'meta': createHTMLElement, // HTMLMetaElement
      'meter': createHTMLElement, // HTMLMeterElement
      'nav': createHTMLElement,
      'nobr': createHTMLElement,
      'noframes': createHTMLElement,
      'noscript': createHTMLElement,
      'object': createHTMLElement, // HTMLObjectElement
      'ol': createHTMLElement, // HTMLOListElement
      'optgroup': createHTMLElement, // HTMLOptGroupElement
      'option': createHTMLElement, // HTMLOptionElement
      'output': createHTMLElement, // HTMLOutputElement
      'p': createHTMLElement, // HTMLParagraphElement
      'param': createHTMLElement, // HTMLParamElement
      'plaintext': createHTMLElement,
      'pre': createHTMLElement, // HTMLPreElement
      'progress': createHTMLElement, // HTMLProgressElement
      'q': createHTMLElement, // HTMLQuoteElement
      'rp': createHTMLElement,
      'rt': createHTMLElement,
      'ruby': createHTMLElement,
      's': createHTMLElement,
      'samp': createHTMLElement,
      'script': createHTMLElement, // HTMLScriptElement
      'section': createHTMLElement,
      'select': createHTMLElement, // HTMLSelectElement
      'small': createHTMLElement,
      'source': createHTMLElement, // HTMLSourceElement
      'spacer': createHTMLElement,
      'span': createHTMLElement, // HTMLSpanElement
      'strike': createHTMLElement,
      'strong': createHTMLElement,
      'style': createHTMLElement, // HTMLStyleElement
      'sub': createHTMLElement,
      'summary': createHTMLElement,
      'sup': createHTMLElement,
      'table': createHTMLElement, // HTMLTableElement
      'tbody': createHTMLElement, // HTMLTableSectionElement
      'td': createHTMLElement, // HTMLTableCellElement
      'textarea': createHTMLElement, // HTMLTextAreaElement
      'tfoot': createHTMLElement, // HTMLTableSectionElement
      'th': createHTMLElement, // HTMLTableCellElement
      'thead': createHTMLElement, // HTMLTableSectionElement
      'time': createHTMLElement,
      'title': createHTMLElement, // HTMLTitleElement
      'tr': createHTMLElement, // HTMLTableRowElement
      'track': createHTMLElement, // HTMLTrackElement
      'tt': createHTMLElement,
      'u': createHTMLElement,
      'ul': createHTMLElement, // HTMLUListElement
      'var': createHTMLElement,
      'video': createHTMLElement, // HTMLVideoElement extends HTMLMediaElement
      'wbr': createHTMLElement,
      'xmp': createHTMLElement // HTMLPreElement
    }
    if (factories.hasOwnProperty(tagName))
      return factories[tagName](tagName);
    else
      return createHTMLUnknownElement(tagName)
  };

  // Constructor
  function Document() {
    throw new TypeError('Illegal constructor');
  }

  return Document;
}());

exports.Document = Document;
