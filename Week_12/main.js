import { createElement } from './frameWork';
import Carousel from './Carousel';

const imgs = [];
for (let i = 0; i < 8; i++) {
  imgs.push(`./img/${i}.jpg`);
}

let App = <Carousel src={imgs} />;

App.mountTo(document.body);
