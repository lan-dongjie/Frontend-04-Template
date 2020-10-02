学习笔记


1、write发送给服务端的数据要保持下面结构，否则无法解析，注意模板语法会将换行解析成\n,也可以将换行替换成\n
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
  }
}