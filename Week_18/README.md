学习笔记

虚拟机启动
  service ssh start
  默认监听22端口

虚拟机配置
  1、ifconig查看虚拟机ip
  2、全局设定-> 网络 -> 新建NAT网络 -> 端口转发 -> 子系统ip填查到的虚拟机ip，端口填当前使用的
    a.转发配置多个，如server的3000对应8080
  3、虚拟机 -> 设置 -> 连接方式选NAT网络 -> 界面名称选第二步设置的

拷贝server文件：
  1、虚拟机先创建文件夹server
  2、server项目下执行scp -P 8022 -r ./* ldj@127.0.0.1:/home/ldj/server
