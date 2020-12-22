let http = require('http')
let fs = require('fs')
let file = fs.createReadStream('./sample.html')

let req = http.request({
  hostname: "127.0.0.1",
  port: 8082,
  method: "POST",
  header: {
    "Content-Type": "application/octet-stream",
  }
}, response => {
  console.log(response);
})

file.on('data', chunk => {
  console.log(chunk.toString());
  req.write(chunk)
})
file.on('end', () => {
  // console.log(chunk.toString());
  req.end()
})