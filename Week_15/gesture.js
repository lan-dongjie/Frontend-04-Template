

export class Disptcher {
  constructor(element) {
    this.element = element
  }
  disptch(type, properties) {
    let event = new Event(type)

    for (let name in properties) {
      event[name] = properties[name]
    }
    this.element.dispatchEvent(event)
  }
}

export class Listener {
  constructor(element, recognizer) {
    let contexts = new Map();
    let isListeningMouse = false
    element.addEventListener("mousedown", event => {
      let { button } = event
      button += 1
      let context = Object.create(null)
      // console.log('00', `mouse${1 << button}`, button);
      contexts.set(`mouse${1 << button}`, context)
      recognizer.start(event, context);
      let mousemove = e => {
        const { buttons } = e
        let button = 1
        while (button <= buttons) {
          // console.log(buttons, button);
          if (button & buttons) {
            let key
            // 中键右键值和down的相反
            if (button === 2) {
              key = 4
            } else if (button === 4) {
              key = 2
            } else {
              key = button
            }
            // console.log('end', buttons, button, key, `mouse${1 << key}`, contexts.get(`mouse${1 << key}`));
            // if (contexts.get(`mouse${1 << key}`)) {
            recognizer.move(e, contexts.get(`mouse${1 << key}`))
            // }
          }
          button = button << 1
        }
      }
      let mouseup = e => {
        let { button, buttons } = e
        button += 1
        console.log('----');
        recognizer.end(e, contexts.get(`mouse${1 << button}`))
        contexts.delete(`mouse${1 << button}`)
        // 如果鼠标按下的键都弹起了才取消事件
        if (buttons === 0) {
          isListeningMouse = false
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
        }
      }
      if (!isListeningMouse) {
        isListeningMouse = true
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
      }
    })


    element.addEventListener('touchstart', event => {
      for (const touch of event.changedTouches) {
        let context = Object.create(null)
        contexts.set(touch.identifier, context)
        recognizer.start(touch, context);
      }
    })

    element.addEventListener('touchmove', event => {
      for (const touch of event.changedTouches) {
        recognizer.move(touch, contexts.get(touch.identifier));
      }
    })

    element.addEventListener('touchend', event => {
      for (const touch of event.changedTouches) {
        recognizer.end(touch, contexts.get(touch.identifier))
        contexts.delete(touch.identifier)
      }
    })
    // 系统事件会打断手势，所以会有cancel
    element.addEventListener('touchcancel', event => {
      for (const touch of event.changedTouches) {
        recognizer.cancel(touch, contexts.get(touch.identifier))
        contexts.delete(touch.identifier)
      }
    })
  }
}

export class Recognizer {
  constructor(disptcher) {
    this.disptcher = disptcher
  }
  start(point, context) {
    const { clientX, clientY } = point
    context.points = [{
      x: clientX,
      y: clientY,
      t: Date.now()
    }]
    this.disptcher.disptch('start', { clientX, clientY })
    context.startX = clientX
    context.startY = clientY
    context.isPan = false
    context.isTap = true
    context.isPress = false
    context.handler = setTimeout(() => {
      context.isPan = false
      context.isTap = false
      context.isPress = true
      this.disptcher.disptch('press', {})
    }, 500)
  }
  move(point, context) {
    const { clientX, clientY } = point
    let { startX, startY, isVertical } = context
    let dx = clientX - startX, dy = clientY - startY;
    // console.log(context.isPan, dx ** 2 + dy ** 2, '----');
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isPan = true
      context.isTap = false
      context.isPress = false
      isVertical = Math.abs(dx) < Math.abs(dy)
      context.isVertical = isVertical
      // ; console.log('isVertical', isVertical, context.isVertical);
      this.disptcher.disptch('panstart', {
        startX,
        startY,
        clientX,
        clientY,
        isVertical
      })
    }
    if (context.isPan) {
      clearTimeout(context.handler)
      this.disptcher.disptch('pan', {
        startX,
        startY,
        clientX,
        clientY,
        isVertical
      })
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500)
    context.points.push({
      x: clientX,
      y: clientY,
      t: Date.now()
    })
  }
  end(point, context) {
    const { clientX, clientY } = point
    const { startX, startY, isVertical } = context

    if (context.isTap) {
      this.disptcher.disptch('tap', {})
      clearTimeout(context.handler)
    }

    if (context.isPress) {
      this.disptcher.disptch('pressend', {})
    }
    let d, v = 0
    const points = context.points.filter(point => Date.now() - point.t < 500)
    if (points.length > 0) {
      const { x, y, t } = points[0]
      d = Math.sqrt((clientX - x) ** 2 + (clientY - y) ** 2)
      v = d / (Date.now() - t)
    }
    const disptchData = {
      startX,
      startY,
      clientX,
      clientY,
      isVertical: context.isVertical,
      isFlick: context.isFlick
    }
    if (v > 1.5) {
      context.isFlick = true
      disptchData.isFlick = context.isFlick
      disptchData.velocity = v
      this.disptcher.disptch('flick', disptchData)
    } else {
      context.isFlick = false
    }
    disptchData.isFlick = context.isFlick
    console.log('context.isPan', context, context.isPan);
    if (context.isPan) {
      this.disptcher.disptch('panend', disptchData)
    }
    this.disptcher.disptch('end', disptchData)
  }
  cancel(point, context) {
    clearTimeout(context.handler)
    this.disptcher.disptch('cancel', {})
  }

}

export function enabbleGesture(element) {
  return new Listener(element, new Recognizer(new Disptcher(element)))
}