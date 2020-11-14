import { Component } from './frameWork';

export default class Carousel extends Component {
  constructor(type, attributes, children) {
    super(type, attributes, children);
    this.carouselItems = [];
    this.currentIndex = -1;
    this.initInterval();
  }
  setAttribute(name, value) {
    // this.attributes[name] = value;
  }
  initCarouselItem(root) {
    this.attributes.src.forEach((item) => {
      const dom = document.createElement('div');
      dom.style.backgroundImage = `url(${item})`;
      root.appendChild(dom);
    });
  }
  initInterval() {
    this.currentIndex = 0;
    this.carouselItems = this.root.children;
    const len = this.carouselItems.length;
    setInterval(() => {
      let currentIndex = this.currentIndex % len;
      let current = this.carouselItems[currentIndex];

      // 下一个先准备好
      let nextIndex = (currentIndex + 1) % len;
      let next = this.carouselItems[nextIndex];
      next.style.transition = 'none';
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

      // 准备好之后一起移动
      setTimeout(() => {
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        next.style.transition = '';
        next.style.transform = `translateX(-${nextIndex * 100}%)`;
      }, 16);
      this.currentIndex = currentIndex + 1;
    }, 3000);
  }
  render() {
    const dom = document.createElement(this.type);
    this.initCarouselItem(dom);
    dom.classList.add('carousel');
    return dom;
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}
