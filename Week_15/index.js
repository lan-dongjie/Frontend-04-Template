import { createElement } from './frameWork';
import Carousel from './Carousel';


const imgs = [];
for (let i = 0; i < 8; i++) {
  imgs.push(`./img/${i}.jpg`);
}

let App = <Carousel
  src={imgs}
  onClick={e => console.log('click', e.detail)}
  onChange={e => console.log('change', e.detail.position)} />;

App.mountTo(document.body);

// let tl = new Timeline()
// tl.add(new Animation({}, 'a', 0, 100, 1000, 0, null))
// tl.start()
