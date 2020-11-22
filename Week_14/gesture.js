let element = document.documentElement
let contexts = new Map();
let isListeningMouse = false

element.addEventListener("mousedown", event => {
  const { button } = event
  let context = Object.create(null)
  contexts.set(`mouse${1 << button}`, context)
  start(event, context);
  let mousemove = e => {
    const { buttons } = e
    let button = 1
    while (button <= buttons) {

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
        move(e, contexts.get(`mouse${1 << key}`))
      }
      button = button << 1
    }
  }
  let mouseup = e => {
    const { button, buttons } = e
    end(e, contexts.get(`mouse${1 << button}`))
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
    start(touch, context);
  }
})

element.addEventListener('touchmove', event => {
  for (const touch of event.changedTouches) {
    move(touch, contexts.get(touch.identifier));
  }
})

element.addEventListener('touchend', event => {
  for (const touch of event.changedTouches) {
    end(touch, contexts.get(touch.identifier))
    contexts.delete(touch.identifier)
  }
})
// 系统事件会打断手势，所以会有cancel
element.addEventListener('touchcancel', event => {
  for (const touch of event.changedTouches) {
    cancel(touch, contexts.get(touch.identifier))
    contexts.delete(touch.identifier)
  }
})

let start = (point, context) => {
  const { clientX, clientY } = point
  context.points = [{
    x: clientX,
    y: clientY,
    t: Date.now()
  }]
  context.startX = clientX
  context.startY = clientY
  context.isPan = false
  context.isTap = true
  context.isPress = false
  context.handler = setTimeout(() => {
    context.isPan = false
    context.isTap = false
    context.isPress = true
  }, 500)
}
let move = (point, context) => {
  const { clientX, clientY } = point
  const { startX, startY } = context
  let dx = clientX - startX, dy = clientY - startY;
  if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
    context.isPan = true
  }
  if (context.isPan) {
    console.log('isPAn');
  }
  context.points = context.points.filter(point => Date.now() - point.t < 500)
  context.points.push({
    x: clientX,
    y: clientY,
    t: Date.now()
  })
}
let end = (point, context) => {
  const { clientX, clientY } = point
  if (context.isTap) {
    disptch('tap', {})
    clearTimeout(handler)
  }
  if (context.isPan) {
    console.log('isPan');
  }
  if (context.isPress) {
    console.log('isPress');

  }
  let d, v = 0
  const points = context.points.filter(point => Date.now() - point.t < 500)
  if (points.length > 0) {
    const { x, y, t } = points[0]
    d = Math.sqrt((clientX - x) ** 2 + (clientY - y) ** 2)
    v = d / (Date.noe() - t)
  }
  if (v > 1.5) {
    context.isFlick = true
  } else {
    context.isFlick = false
  }
}
let cancel = (point, context) => {
  clearTimeout(context.handler)
}


function disptch(type, properties, point) {
  let event = new Event(type)

  for (let name in properties) {
    event[name] = properties[name]
  }

  element.dispatchEvent(Event)
}