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
    this.width = null
    this.carouselItems = this.root.children
    this.initInterval();
    this.initEvent();
    setTimeout(() => {
      this.width = this.root.getBoundingClientRect().width
      console.log('----', this.root, this.root.getBoundingClientRect());
    })
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
    this.root.addEventListener('tap', message => {
      console.log('tap---');
      clearInterval(this.handler)
    })
    this.root.addEventListener('press', message => {
      // console.log('press', message);
    })
    this.root.addEventListener('panstart', message => {
      clearInterval(this.handler)
    })
    this.root.addEventListener('pan', message => {
      // console.log('pan', message);
      this.dragMove(message.clientX - message.startX)
    })
    this.root.addEventListener('panend', message => {
      // console.log('panend', message);
      this.dragEnd(message.clientX - message.startX);
      this.initInterval();
    })
    this.root.addEventListener('flick', (message) => {
      // console.log('flick', message);
      // this.currentIndex += Math.sign(message.clientX - message.startX)
      // this.move()
    })
  }
  dragMove(dragX) {
    const len = this.carouselItems.length;
    let position = this.currentIndex
    let current = position - ((dragX - dragX % this.width) / this.width)
    for (let offset of [-1, 0, 1]) {
      let pos = current + offset
      pos = (pos + len) % len
      // console.log('this.carouselItems', this.carouselItems, this.width, this.currentIndex, current);
      const child = this.carouselItems[pos]
      child.style.transition = 'none';
      child.style.transform = `translateX(${- pos * this.width + offset * this.width + dragX % this.width}px)`;
    }
  }
  dragEnd(dragX) {
    const len = this.carouselItems.length;
    let position = this.currentIndex
    position = position - Math.round(dragX / this.width);
    for (let offset of [0, - Math.sign(Math.round(dragX / this.width) - dragX + this.width / 2 * Math.sign(dragX))]) {
      let pos = position + offset
      pos = (pos + len) % len
      if (offset === 0) {
        this.currentIndex = pos
      }
      const child = this.carouselItems[pos]
      child.style.transition = '';
      child.style.transform = `translateX(${- pos * this.width + offset * this.width}px)`;
    }
  }
  initEventff() {
    this.root.addEventListener('mousedown', event => {
      const { width } = this.root.getBoundingClientRect()
      const len = this.carouselItems.length;
      let startX = event.clientX;
      this.isDrag = true;
      let position = this.currentIndex
      const move = event => {
        const dragX = event.clientX - startX;
        let current = position - ((dragX - dragX % width) / width)
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset
          pos = (pos + len) % len
          const child = this.carouselItems[pos]
          child.style.transition = 'none';
          child.style.transform = `translateX(${- pos * width + offset * width + dragX % width}px)`;
        }
      }
      const up = event => {
        this.isDrag = false
        const dragX = event.clientX - startX;
        position = position - Math.round(dragX / width);
        for (let offset of [0, - Math.sign(Math.round(dragX / width) - dragX + width / 2 * Math.sign(dragX))]) {
          let pos = position + offset
          pos = (pos + len) % len
          if (offset === 0) {
            this.currentIndex = pos
          }
          const child = this.carouselItems[pos]
          child.style.transition = '';
          child.style.transform = `translateX(${- pos * width + offset * width}px)`;
        }
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
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
