let http = require('http')
let fs = require('fs')


http.createServer(function (request, response) {
  // console.log('req', request.headers);
  let outFile = fs.createWriteStream("../server/public/index.html")
  request.on('data', chunk => {
    console.log('chunk', chunk);
    outFile.write(chunk)
  })
  request.on('end', () => {
    outFile.end()
    response.end('success')
  })
}).listen(8082)