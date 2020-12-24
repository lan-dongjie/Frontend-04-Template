let http = require('http')
// let fs = require('fs')
let child_process = require('child_process')
let archiver = require('archiver')
let querystring = require('querystring')

//  https://github.com/login/oauth/authorize
child_process.exec(`start https://github.com/login/oauth/authorize?client_id=Iv1.af021f302b437824`)


// const archive = archiver('zip', {
//   zlib: { level: 9 } // Sets the compression level.
// });
// archive.directory('./sample/', false);

// 方式1
// archive.pipe(fs.createWriteStream('tmp.zip'))
// archive.finalize()
// 方式2
// fs.stat('./sample.html', (err, stats) => {
// let request = http.request({
//   hostname: "127.0.0.1",
//   port: 8082,
//   method: "POST",
//   path: '/upload',
//   header: {
//     "Content-Type": "application/octet-stream",
//     // "Content-Length": stats.size
//   }
// }, response => {
//   // console.log(response);
// })
// 方式3
// archive.pipe(request)
// archive.finalize()

// let file = fs.createReadStream('./sample.html')
// file.pipe(request)
// file.on('end', () => {
//   request.end()
// })
// })

// file.on('data', chunk => {
//   request.write(chunk)
// })
// file.on('end', () => {
//   request.end()
// })

http.createServer(function (request, response) {
  let query = querystring.parse(request.url.match(/\?([\s\S]+)$/)[1])
  if (!query.token) {
    response.end('Token not obtained.')
    return
  }
  publish(query.token)
}).listen(8083)

function publish(token) {
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  archive.directory('./sample/', false);
  let request = http.request({
    hostname: "127.0.0.1",
    port: 8082,
    method: "POST",
    path: `/publish?token=${token}`,
    header: {
      "Content-Type": "application/octet-stream",
      // "Content-Length": stats.size
    }
  }, response => {
// console.log('pp', response);
    // response.end('Publish success')
  })
  archive.pipe(request)
  archive.finalize()
  // request.end()
}