import { Component } from './frameWork';
import { enabbleGesture } from './gesture'

export default class Carousel extends Component {
  constructor(type, attributes, children) {
    super(type, attributes, children);
    this.carouselItems = this.root.children;
    this.currentIndex = 0;
    this.isDrag = false;
    this.gesture = null
    this.handler = null
    this.initInterval();
    this.initEvent();
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
  initEvent() {
    this.gesture = enabbleGesture(this.root)
    this.root.addEventListener('tap', () => {
      console.log('tap');
      clearInterval(this.handler)
    })
    this.root.addEventListener('press', () => {
      console.log('press');
    })
    this.root.addEventListener('panstart', () => {
      console.log('panstart');
    })
    this.root.addEventListener('pan', () => {
      console.log('pan');
    })
    this.root.addEventListener('panend', message => {
      console.log('panend', message);

    })
    this.root.addEventListener('flick', (message) => {
      console.log('flick', message);
      this.currentIndex += 1
      this.move()
    })
  }
  move() {
    const len = this.carouselItems.length;
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
  }
  initInterval() {
    this.handler = setInterval(() => {
      this.move()
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
