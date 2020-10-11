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
          height: 300px;
        }
        .flex {
          display: flex;
        }
        .flex-1 {
          flex: 1;
          background-color: goldenrod;
        }
        .flex-2 {
          flex: 2;
          background-color: greenyellow;
        }
        .box{
          width: 300px;
          background-color: green;
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

