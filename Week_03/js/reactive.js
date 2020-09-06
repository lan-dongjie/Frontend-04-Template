let callbacks = new Map();
let reactivities = new Map();
let usedReactivties = [];

function effect(callback) {
  // 清除
  usedReactivties = [];
  // 触发收集
  callback();
  for (const reactivity of usedReactivties) {
    if (!(callbacks.has(reactivity[0]))) {
      callbacks.set(reactivity[0], new Map());
    }
    if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
      callbacks.get(reactivity[0]).set(reactivity[1], []);
    }
    callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
  }
}

function reactive(obj) {
  if (reactivities.has(obj)) {
    return reactivities.get(obj)
  }
  let reactity = new Proxy(obj, {
    set(obj, prop, val) {
      obj[prop] = val;
      if (callbacks.has(obj)) 
        if (callbacks.get(obj).has(prop)) {
          const cbs = callbacks.get(obj).get(prop);
          for (const cb of cbs) {
            cb();
          }
        }
          
      return obj[prop];
    },
    get(obj, prop) {
      usedReactivties.push([obj, prop]);
      if (typeof obj[prop] === 'object') {
        return reactive(obj[prop]);
      }
      return obj[prop];
    }
  })
  reactivities.set(obj, reactity);
  return reactity
}