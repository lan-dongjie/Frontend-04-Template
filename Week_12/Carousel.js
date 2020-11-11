import { Component } from './frameWork';

export default class Carousel extends Component {
  constructor(type, attributes, children) {
    super(type, attributes, children);
    // this.root = document.createElement('div')
    this.carouselItems = [];
    this.currentIndex = -1;
    this.initCarouselItem();
  }
  setAttribute(name, value) {
    // this.attributes[name] = value;
  }
  initCarouselItem() {
    this.attributes.src.forEach((item) => {
      const dom = document.createElement('div');
      dom.style.backgroundImage = `url(${item})`;
      this.carouselItems.push(dom);
      this.root.appendChild(dom);
    });
    if (!this.carouselItems.length) {
      return;
    }
    this.initInterval();
  }
  initInterval() {
    this.currentIndex = 0;
    console.log(this.carouselItems);
    setInterval(() => {
      let nextIndex = this.currentIndex % this.carouselItems.length;
      this.carouselItems.forEach((item) => {
        item.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      });
      this.currentIndex = nextIndex + 1;
    }, 3000);
  }
  render() {
    console.log('this.type', this.type);
    const dom = document.createElement(this.type);
    dom.classList.add('carousel');
    return dom;
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}
