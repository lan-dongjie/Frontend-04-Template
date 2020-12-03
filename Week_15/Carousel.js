import { Component, STATE, ATTRIBUTE } from './frameWork';
import { enabbleGesture } from './gesture'
import { Animation, Timeline } from './animation'
import { ease, easeIn, easeOut, easeInOut, linear } from './ease'


export { STATE, ATTRIBUTE } from './frameWork';

export default class Carousel extends Component {
  constructor(type) {
    super(type);
    this[STATE].position = 0;
    this.width = 0
    this.carouselItems = []
    this.handler = null
    this.timeline = new Timeline()
    this.duration = 500
    this.timingFunction = linear
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
    let ax = 0
    this.root.addEventListener('start', message => {
      clearInterval(this.handler)
      this.handler = null
      this.timeline.pause()
      const t = Date.now() - this.t
      let progress = (t > this.duration || this.t === 0) ? 0 : t / this.duration
      progress = progress - Math.floor(progress)
      ax = -this.timingFunction(progress) * this.width
      console.log('progress', progress, ax);
    })
    this.root.addEventListener('tap', (message) => {
      this.triggerEvent('click', {
        data: this[ATTRIBUTE].src[this[STATE].position],
        position: this[STATE].position
      })
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
      // console.log('flick-message:', message);
      // const { velocity, clientX, startX } = message
      // let dragX = clientX - startX
      // dragX += Math.sign(dragX) * Math.round(velocity / 2) * this.width
      // this.timeline.reset()
      // this.timeline.start()
      // this.move(dragX - ax);

    })
    this.root.addEventListener('end', message => {
      this.timeline.resume()
      this.initInterval();
    })
  }
  dragMove(dragX) {
    const len = this.carouselItems.length;
    let position = this[STATE].position
    let current = position - ((dragX - dragX % this.width) / this.width)
    for (let offset of [-1, 0, 1]) {
      let pos = (current + offset) % len
      pos = (pos + len) % len
      const child = this.carouselItems[pos]
      child.style.transform = `translateX(${- pos * this.width + offset * this.width + dragX % this.width}px)`;
    }
  }
  dragEnd(dragX) {
    const len = this.carouselItems.length;
    const magnification = dragX % this.width;
    const direction = Math.sign(magnification)
    const progress = Math.abs(magnification / this.width);
    const min = Math.min(progress, 1 - progress) * this.width
    let position = this[STATE].position;
    position = position - Math.round(dragX / this.width);
    let next = Math.sign(progress - 0.5) * direction
    for (let offset of [0, next]) {
      let pos = (position + offset) % len;
      pos = (pos + len) % len;
      const child = this.carouselItems[pos];
      // 结束位置固定
      const endX = (offset - pos) * this.width;
      // 不管怎么移动，松手后只移动小于宽度一半的那段距离，根据移动方向在结束位置加上那段偏移可得开始位置
      const startX = endX + min * -next;
      this.timeline.add(new Animation(child.style, 'transform', startX, endX, this.duration * (1 - progress), 0, this.timingFunction, this.template))
    }
    this[STATE].position = (position + len) % len;
    this.triggerEvent('change', { position: this[STATE].position })

  }
  move() {
    const len = this.carouselItems.length;
    let currentIndex = ((this[STATE].position % len) + len) % len;
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
    this.triggerEvent('change', { position: this[STATE].position })
    this[STATE].position = currentIndex + 1;

    // console.log('---', this[STATE].position, current, next);
  }
  initInterval() {
    if (this.handler) {
      return
    }
    this.t = 0;
    this.handler = setInterval(() => {
      console.log('iiiiiiiiii');
      this.move()
    }, 3000);
  }
  render() {
    const dom = document.createElement('div');
    this.root = dom
    dom.classList.add('carousel');
    this.initCarouselItem();
    enabbleGesture(this.root)
    this.carouselItems = this.root.children;
    setTimeout(() => {
      this.width = this.root.getBoundingClientRect().width
      this.timeline.start();
      this.initInterval();
      this.initEvent();
    }, 16)
  }
  triggerEvent(type, args) {
    this[ATTRIBUTE][`on${type.replace(/^[\s\S]/, s => s.toUpperCase())}`](new CustomEvent(type, { detail: args }))
  }
}
