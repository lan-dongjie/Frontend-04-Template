let http = require('http')
let https = require('https')

// let fs = require('fs')
let querystring = require('querystring')
let unzipper = require('unzipper')
//用code  换token
function auth(request, response) {
  let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1])
  console.log('query', query);
  if (!query.code) {
    response.end('404')
    return
  }
  getToken(query.code, function (info) {
    // console.log('---', info);
    // response.write(JSON.stringify(info))
    response.write(`<a href="http://localhost:8083/?token=${info.access_token}">publish</a>`)
    response.end()
  })
}
//  https://github.com/login/oauth/access_token
function getToken(code, callback) {
  console.log('code', code);
  let request = https.request({
    hostname: "github.com",
    path: `/login/oauth/access_token?code=${code}&client_id=Iv1.af021f302b437824&client_secret=ec982e17be11f5c70ff9d3605925eea2e163da51`,
    port: 443,
    method: 'POST'
  }, function (response) {
    let body = ''
    response.on("data", chunk => {
      body += chunk.toString()
      console.log('body', body);
    })
    response.on("end", chunk => {
      callback(querystring.parse(body))
      // response.end()
    })
  })
  request.end()
}
function getUser(token, callback) {
  let request = https.request({
    hostname: "api.github.com",
    path: `/user`,
    port: 443,
    method: 'GET',
    headers: {
      "Authorization": `token ${token}`,
      "User-Agent": "ldj-toy-app",
    }
  }, function (response) {
    let body = ''
    response.on("data", chunk => {
      body += chunk.toString()
    })
    response.on("end", () => {
      // console.dir( body);
      callback(JSON.parse(body))
    })
  })
  request.end()
}
function publish(request, response) {
  let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1])
  // console.log('publish', request.url);
  // response.end()
  // return
  getUser(query.token, info => {
    console.dir(info);
    if (info.login === 'lan-dongjie') {
      upload(request, response)
    } else {
      response.end('Wrong user')
    }
  })

}

function upload(request, response) {
  // console.log('request', request);
  request.pipe(unzipper.Extract({ path: '../server/public/' }))
  request.on('end', function () {
    response.end('success')
  })
}
http.createServer(function (request, response) {
  // console.log('req', request.headers);
  // let outFile = fs.createWriteStream("../server/public/index.html")
  // let outFile = fs.createWriteStream("../server/public/tmp.zip")

  // request.pipe(outFile)
  // request.on('data', chunk => {
  //   outFile.write(chunk)
  // })
  // request.on('end', () => {
  //   outFile.end()
  //   response.end('success')
  // })
  // request.pipe(unzipper.Extract({ path: '../server/publish/' }))
  if (request.url === '/upload') {
    return publish(request, response)
  }
  if (request.url.match(/^\/auth\?/)) {
    return auth(request, response)
  }
  if (request.url.match(/^\/publish\?/)) {
    return publish(request, response)
  }
  response.end('404')
}).listen(8082)