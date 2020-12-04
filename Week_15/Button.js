import { Component, STATE, ATTRIBUTE, createElement } from './frameWork';
import { enabbleGesture } from './gesture'

export { STATE, ATTRIBUTE } from './frameWork';

export default class Button extends Component {
  constructor() {
    super()
    this.classList = 'btn primary'
  }
  triggerEvent(type, args) {
    console.log('----');
    this[ATTRIBUTE][type](new CustomEvent(type))
  }
  render() {
    this.childContainer = (<span />);
    this.root = (<div class={this.classList}>{this.childContainer}</div>).render()
    for (const name in this[ATTRIBUTE]) {
      if (name.startsWith('on')) {
        console.log('----', name.replace(/^on[\s\S]{1}/, s => s.charAt(2).toLocaleLowerCase()));
        this.root.addEventListener(name.replace(/^on[\s\S]{1}/, s => s.charAt(2).toLocaleLowerCase()), () => {
          this.triggerEvent(name)
        })
      }
    }
    return this.root
  }
  appendChild(child) {
    if (!this.childContainer) {
      this.render()
    }
    this.childContainer.appendChild(child)
  }
}