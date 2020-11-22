import { Animation, Timeline } from './animation'
import { ease, easeIn, easeOut, easeInOut } from './ease'

const arr = [
  {
    name: 'ease',
    timingFunction: ease
  },
  {
    name: 'easeIn',
    timingFunction: easeIn
  },
  {
    name: 'easeOut',
    timingFunction: easeOut
  },
  {
    name: 'easeInOut',
    timingFunction: easeInOut
  }
]

for (let i = 0; i < 4; i++) {
  let tl = new Timeline()
  tl.start()
  const dom = document.getElementById(`box${i}`);
  const { name, timingFunction } = arr[i]
  dom.innerText = name;
  tl.add(new Animation(dom.style, 'transform', 0, 500, 2000, 0.3, timingFunction, v => `translateX(${v}px)`))

}

// document.getElementById('pause').addEventListener('click', () => {
//   tl.pause();
// })
// document.getElementById('resume').addEventListener('click', () => {
//   tl.resume()
// })
// document.getElementById('reset').addEventListener('click', () => {
//   tl.reset()
// })

