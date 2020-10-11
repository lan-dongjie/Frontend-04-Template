const Request = require('./js/Request')
var images = require("images");
const {parseHTML} = require('./js/parser')

function render (view, dom) {
  console.log('(view, dom',view, dom);
}


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
  console.log('dom', JSON.stringify(dom));
  if (!dom) {
    return
  }
  let viewport = images(1000, 800)
  render(viewport, dom.children[0].children[3].children[1].children[3])
  viewport.save('viewport.jpg')
}();
