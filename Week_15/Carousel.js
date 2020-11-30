import { Component, STATE, ATTRIBUTE } from './frameWork';
import { enabbleGesture } from './gesture'
import { Animation, Timeline } from './animation'
import { ease, easeIn, easeOut, easeInOut } from './ease'

const line = v => v

export { STATE, ATTRIBUTE } from './frameWork';

export default class Carousel extends Component {
  constructor(type) {
    super(type);
    this[STATE].position = 0;
    this.width = 0
    this.carouselItems = []
    this.handler = null
    this.timeline = new Timeline()
    this.duration = 1500
    this.timingFunction = line
    this.template = v => `translateX(${v}px)`
    this.t = 0
  }
  initCarouselItem() {
    this[ATTRIBUTE].src.forEach((item) => {
      const dom = document.createElement('div');
      dom.style.backgroundImage = `url(${item})`;
      this.root.appendChild(dom);
    });
  }
  initEvent() {
    this.gesture = enabbleGesture(this.root)
    let ax = 0
    this.root.addEventListener('start', message => {

      clearInterval(this.handler)
      this.handler = null
      this.timeline.pause()
      let progress = (Date.now() - this.t) / this.duration
      ax = this.timingFunction(progress) * this.width - this.width
    })
    this.root.addEventListener('pan', message => {
      this.dragMove(message.clientX - message.startX - ax)
    })
    this.root.addEventListener('panend', message => {
      this.timeline.reset()
      this.timeline.start()
      this.dragEnd(message.clientX - message.startX - ax);
    })
    this.root.addEventListener('flick', (message) => {
      // console.log('flick', message);
      // this[STATE].position += Math.sign(message.clientX - message.startX)
      // this.move()
    })
    this.root.addEventListener('end', message => {

      this.initInterval();
    })
  }
  dragMove(dragX) {
    const len = this.carouselItems.length;
    let position = this[STATE].position
    let current = position - ((dragX - dragX % this.width) / this.width)
    for (let offset of [-1, 0, 1]) {
      let pos = current + offset
      pos = (pos + len) % len
      const child = this.carouselItems[pos]
      child.style.transform = `translateX(${- pos * this.width + offset * this.width + dragX % this.width}px)`;
    }
  }
  dragEnd(dragX) {
    const len = this.carouselItems.length;
    const magnification = dragX % this.width
    const left = magnification * 2 / this.width
    let position = this[STATE].position
    position = position - Math.round(dragX / this.width);
    for (let offset of [0, - Math.sign(Math.round(left))]) {
      let pos = position + offset;
      pos = (pos + len) % len;
      if (offset === 0) {
        position = pos;
      }
      const child = this.carouselItems[pos];
      const startX = -pos * this.width + magnification
      const endX = (offset - pos) * this.width
      this.timeline.add(new Animation(child.style, 'transform', startX, endX, this.duration * left / 2, 0, this.timingFunction, this.template))
    }
    this[STATE].position = position + 1
  }
  move() {
    const len = this.carouselItems.length;
    let currentIndex = this[STATE].position % len;
    let current = this.carouselItems[currentIndex];
    this.t = Date.now()
    {
      const startX = -currentIndex * this.width
      const endX = -(currentIndex + 1) * this.width
      this.timeline.add(new Animation(current.style, 'transform', startX, endX, this.duration, 0, this.timingFunction, this.template))
    }

    // 下一个先准备好
    let nextIndex = (currentIndex + 1) % len;
    let next = this.carouselItems[nextIndex];
    {
      const startX = -(nextIndex - 1) * this.width
      const endX = -nextIndex * this.width
      this.timeline.add(new Animation(next.style, 'transform', startX, endX, this.duration, 0, this.timingFunction, this.template))
    }
    // this.triggerEvent('change', { position: this[STATE].position })
    this[STATE].position = currentIndex + 1;

    // console.log('---', this[STATE].position, current, next);
  }
  initInterval() {
    if (this.handler) {
      return
    }
    this.handler = setInterval(() => {
      this.move()
    }, 3000);
  }
  render() {
    const dom = document.createElement('div');
    this.root = dom
    dom.classList.add('carousel');
    this.initCarouselItem();
    enabbleGesture(this.root)
    this.carouselItems = this.root.children
    setTimeout(() => {
      // 获取宽度
      this.width = this.root.getBoundingClientRect().width
      this.timeline.start();
      this.initInterval();
      this.initEvent();
    }, 25)
  }
  triggerEvent(type, args) {
    this[ATTRIBUTE][`on${type.replace(/^\s\S/, s => s.toUpperCase())}`](new CustomEvent(type, { detail: args }))
  }
}
