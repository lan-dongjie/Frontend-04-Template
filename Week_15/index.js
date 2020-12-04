import { createElement } from './frameWork';
import Carousel from './Carousel';
import Button from './Button';
import List from './List';


const imgs = [];
for (let i = 0; i < 8; i++) {
  imgs.push(`./img/${i}.jpg`);
}

let App = <Carousel
  src={imgs}
  onClick={e => console.log('click', e.detail)}
  onChange={e => console.log('change', e.detail.position)} />;
App.mountTo(document.body);

let btn = <Button onClick={() => console.log('Button click')}> Button</Button >
btn.mountTo(document.body);

const list = [];
for (let i = 0; i < 8; i++) {
  list.push({ src: `./img/${i}.jpg`, url: 'https://time.geekbang.org/', title: `title-${i}` });
}

(<List data={list}>{
  (record) => {
    return <div>
      <img src={record.src} /><a href={record.url}>{record.title}</a>
    </div>
  }
}
</List >).mountTo(document.body);
// let tl = new Timeline()
// tl.add(new Animation({}, 'a', 0, 100, 1000, 0, null))
// tl.start()
