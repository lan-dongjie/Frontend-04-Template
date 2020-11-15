export class Component {
  constructor(type, attributes, children) {
    this.type = type;
    this.attributes = attributes;
    this.children = children;
    this.root = this.render();
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    this.root.appendChild(child);
  }
  mountTo(parent) {
    parent.appendChild();
  }
}
class ElementWrapper extends Component {
  constructor(type) {
    super(type);
  }
}
class TextWrapper extends Component {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
}

export function createElement(type, attributes, ...children) {
  console.log('attributes', attributes);
  let element;
  if (typeof type === 'string') {
    element = new ElementWrapper(type, attributes);
  } else {
    element = new type('div', attributes);
  }
  for (const attr in attributes) {
    element.setAttribute(attributes[attr]);
  }
  for (let child of children) {
    const element = array[index];
    if (typeof child === 'string') {
      child = new TextWrapper(child);
    }
    element.appendChild(child);
  }
  return element;
}
