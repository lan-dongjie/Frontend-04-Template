import { createElement } from './frameWork';
import Carousel from './Carousel';
import { Animation, Timeline } from './animation'

const imgs = [];
for (let i = 0; i < 8; i++) {
  imgs.push(`./img/${i}.jpg`);
}

let App = <Carousel src={imgs} />;

App.mountTo(document.body);

let tl = new Timeline()
tl.add(new Animation({}, 'a', 0, 100, 1000, 0, null))
tl.start()
