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
        #container {
          width: 800px;
          height: 600px;
          background-color: rgb(255, 255, 255);
        }
        .flex {
          display: flex;
        }
        .flex-1 {
          flex: 1;
          background-color: rgb(218, 165, 32);
        }
        .flex-2 {
          flex: 2;
          background-color: rgb(173, 255, 47);
        }
        .box{
          width: 300px;
          height: 200px;
          background-color: rgb(0, 128, 0);
        }
      </style>
    </head>
    
    <body>
      <div id="container" class="flex">
        <div class="box"></div>
        <div class="flex-1"></div>
        <div class="flex-2"></div>
      </div>
    </body>
    
    </html>`)
  }).on('data',(chunk) => {
    body.push(chunk.toString());
  })
}).listen(3000);
console.log('Server started')

