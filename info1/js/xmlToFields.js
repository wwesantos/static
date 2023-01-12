const DEFAULT_SEPARATOR = ".";

const getNodeName = node => {
  if (node.nodeName.indexOf(":") > -1) {
    return node.nodeName.split(":")[1];
  } else {
    return node.nodeName;
  }
};

class PrefixGenerator {
  constructor() {
    this.stack = [];
  }
  getPrefix(separator) {
    if (typeof separator === "undefined") {
      return this.stack.join(DEFAULT_SEPARATOR);
    } else {
      return this.stack.join(separator);
    }
  }
  addPefix(prefix) {
    this.stack.push(prefix);
  }
  removePrefix() {
    this.stack.pop();
  }
}

class Field {
  constructor(prefix, field) {
    this.prefix = prefix;
    this.field = field;
  }
  getPrefixedText() {
    if (this.prefix == null || this.prefix.length == 0) {
      return this.field;
    } else {
      return `${this.prefix}.${this.field}`;
    }
  }
}

let fields = [];
let prefixGen = new PrefixGenerator();
const isElementNode = node => node.nodeType === 1;
const isLeafNode = node => node.childNodes.length === 1;

const processChildren = nodes => {
  nodes.forEach(node => {
    if (isElementNode(node)) {
      if (isLeafNode(node)) {
        fields.push(new Field(prefixGen.getPrefix(), getNodeName(node)));
      } else {
        prefixGen.addPefix(getNodeName(node));
        processChildren(node.childNodes);
        prefixGen.removePrefix();
      }
    }
  });
};

const isParseSuccesfull = xmlDoc => {
  const errors = xmlDoc.getElementsByTagName("parsererror");
  if (errors.length > 0) {
    showError(errors[0].innerText);
    return false;
  } else {
    return true;
  }
};

get("#execute").addEventListener("click", e => {
  e.preventDefault();
  const input = get("#input").value;
  const output = get("#output");
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(input, "text/xml");
  output.value = "";

  if (isParseSuccesfull(xmlDoc)) {
    fields = [];
    prefixGen = new PrefixGenerator();
    processChildren(xmlDoc.childNodes);
    let outputValue = "";
    fields.forEach(field => (outputValue += `${field.getPrefixedText()}\n`));
    output.value = outputValue;
  }
});