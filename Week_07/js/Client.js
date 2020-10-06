const Request = require('./Request')

const {parseHTML} = require('./parser')



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
  // console.log('response', response);
  const dom = parseHTML(response.body);
}();
