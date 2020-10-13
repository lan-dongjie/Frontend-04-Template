学习笔记

从用户输入url到页面显示，发生了什么
    1、浏览器首先进行DNS域名解析，拿到服务器IP地址
    2、建立tcp连接，发送请求
    3、后端接收到请求，读取文件，读数据库，获取网络接口，返回数据和页面
    4、浏览器接收页面并渲染
      a、dom解析成dom树：
        1、渐进式解析：浏览器会将解析的dom显示出来
        2、解析过程遇到外联资源（外联js,外联css,image,iframe等）
          1、非阻塞型
            a.javascript标签之后的外联css
            b.image
            c.iframe
            d.外联async javascript
          2、阻塞型
            a.内联css
            b.内联javascript
            c.外联普通javascript
            d.外联defer javascript
            e.javascript标签之前的外联css
        3、dom树构建完成后document对象会派发事件DOMContentLoaded来通知dom树已构建完成
      b、css解析成css tree
      c、将dom树和css树合成渲染树(rending tree)
      d、渲染页面（渐进式）
    5、执行js