const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick_handler')
const ANIMATION = Symbol('animation')
const START_TIME = Symbol('start_time')
const PAUSE_START = Symbol('pause_start')
const PAUSE_TIME = Symbol('pause_time')


export class Timeline {
	constructor() {
		this[ANIMATION] = new Set()
		this[START_TIME] = new Map()
		this.state = 'Inited'
	}
	start() {
		if (this.state !== 'Inited') {
			return
		}
		this.state = 'startd'
		let startTime = Date.now();
		this[PAUSE_TIME] = 0
		this[TICK] = () => {
			let now = Date.now();
			for (const animation of this[ANIMATION]) {
				let t;
				if (this[START_TIME].get(animation) < startTime) {
					t = now - startTime - this[PAUSE_TIME] - animation.delay
					// console.log('111111', t);
				} else {
					t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
					// console.log('2222', t);

				}
				if (animation.duration < t) {
					this[ANIMATION].delete(animation)
					t = animation.duration
					// console.log('333', t);

				}
				// console.log(t);
				if (t > 0) {
					animation.receive(t)
				}
			}
			this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
		}
		this[TICK]();
	}
	add(animation, startTime) {
		if (arguments.length < 2) {
			startTime = Date.now()
		}
		this[ANIMATION].add(animation)
		this[START_TIME].set(animation, startTime)
	}
	pause() {
		if (this.state !== 'started') {
			return
		}
		this.state = 'paused'
		this[PAUSE_START] = Date.now()
		cancelAnimationFrame(this[TICK_HANDLER])
	}
	resume() {
		if (this.state !== 'paused') {
			return
		}
		this.state = 'started'
		this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
		this[TICK]();
	}

	reset() {
		this.pause()
		this.state = 'Inited'
		this[PAUSE_TIME] = 0
		this[ANIMATION] = new Set()
		this[START_TIME] = new Map()
		this[TICK_HANDLER] = null
		this[PAUSE_START] = 0
	}
}

export class Animation {
	constructor(object, propery, startValue, endValue, duration, delay, timingFunction, template) {
		this.object = object;
		this.propery = propery
		this.startValue = startValue
		this.endValue = endValue
		this.duration = duration
		this.delay = delay;
		this.timingFunction = timingFunction || (v => v)
		this.template = template || (v => v)
	}

	receive(time) {
		let range = this.endValue - this.startValue;
		let process = this.timingFunction(time / this.duration)
		this.object[this.propery] = this.template(this.startValue + range * process);
		// console.log('this.object[this.propery]', this.object[this.propery]);
	}
}