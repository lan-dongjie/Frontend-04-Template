const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('end', () => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('Hello word!\n')
  }).on('connect',  () => {
    console.log('已连接');
  }).on('data',(chunk) => {
    console.log('-----', chunk);
    body.push(chunk.toString());
  }).on('abort',  () => {
    console.log('abort');
  }).on('continue',  () => {
    console.log('continue');
  }).on('information',  () => {
    console.log('已连information接');
  }).on('socket',  () => {
    console.log('socket');
  }).on('response',  () => {
    console.log('response');
  }).on('timeout',  () => {
    console.log('timeout');
  }).on('upgrade',  () => {
    console.log('upgrade');
  })
}).listen(3000);
console.log('Server started')


// var net = require('net');

// var PORT = 3000;
// var HOST = '127.0.0.1';

// // tcp服务端
// var server = net.createServer(function(socket){
//     console.log('服务端：收到来自客户端的请求');

//     socket.on('data', function(data){
//         console.log('服务端：收到客户端数据，内容为{'+ data +'}');
//         // 给客户端返回数据
//         socket.write('你好，我是服务器！');
//     });

//     socket.on('close', function(){
//          console.log('服务端：客户端连接断开');
//     });
// });
// server.listen(PORT, HOST, function(){
//     console.log('服务端：开始监听来自客户端的请求');
// });
