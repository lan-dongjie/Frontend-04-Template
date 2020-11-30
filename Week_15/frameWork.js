export const STATE = Symbol('state')
export const ATTRIBUTE = Symbol('attribute')

export class Component {
  constructor(type) {
    this.type = type;
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }
  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }
  appendChild(child) {
    child.mountTo(this.root);
  }
  mountTo(parent) {
    if (!this.root) {
      this.render()
    }
    parent.appendChild(this.root);
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
  let element;
  if (typeof type === 'string') {
    element = new ElementWrapper(type);
  } else {
    element = new type;
  }
  for (const name in attributes) {
    element.setAttribute(name, attributes[name]);
  }
  for (let child of children) {
    if (typeof child === 'string') {
      child = new TextWrapper(child);
    }
    element.appendChild(child);
  }
  return element;
}
