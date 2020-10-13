const Request = require('./js/Request')
const images = require("images");
const {parseHTML} = require('./js/parser')
const {render} = require('./js/render')



void async function () {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 3000,
    path: '/',
    headers: {
      ["X-Foo2"]: "customed"
    },
    body: {
      name: 'YY'
    }
  })
  let response = await request.send();
  const dom = parseHTML(response.body);
  // console.dir(dom.children[0].children[3].children[1].children[3]);
  let viewport = images(1000, 800)
  render(viewport, dom.children[0].children[3].children[1])
  viewport.save('viewport.jpg')
}();
