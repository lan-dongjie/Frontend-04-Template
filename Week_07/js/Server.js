const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('end', () => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(`<html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>demo</title>
      <style>
        html body {
          font-size: 16px;
          color: #666;
        }
    
        body div span {
          color: red;
        }
    
        h1 {
          color: aquamarine;
        }
    
        .a {
          font-size: 20px;
        }
    
        span.a {
          font-size: 12px;
        }
    
        .a#span-id {
          font-size: 18px;
        }
    
        .test,#my-id {
          background-color: cornflowerblue;
          font-size: 14px;
        }
    
        #my-id.b.c.d {
          font-size: 30px;
        }
    
        .test span {
          display: inline-block;
          color: #fff;
          padding: 0 10px;
        }
      </style>
    </head>
    
    <body>
      <h1>Hello work</h1>
      <div class="a">a</div>
      <div class="test">test<span>GGG</span></div>
      <div class="test" style="background-color: aquamarine;font-size: 12px;">test<span>GGG</span></div>
      <div id="my-id" class="a b c d">id</div>
      <span class="a">span</span>
      <span class="a" id="span-id">span-id</span>
    </body>
    
    </html>`)
  }).on('data',(chunk) => {
    body.push(chunk.toString());
  })
}).listen(3000);
console.log('Server started')

