学习笔记

1、作业
  2：带括号的四则运算产生式
    <B>::=<N>|'('<A>')'
    <M>::=<B>|<M>'*'<B>|<M>'/'<B>
    <A>::=<M>|<A>'+'<M>|<A>'-'<M>
  8: 
    1、字节
      1个字节：Unicode码为0 - 127
      2个字节：Unicode码为128 - 2047
      3个字节：Unicode码为2048 - 0xFFFF
      4个字节：Unicode码为65536 - 0x1FFFFF
      5个字节：Unicode码为0x200000 - 0x3FFFFFF
      6个字节：Unicode码为0x4000000 - 0x7FFFFFFF
    2、具体的补位码如下,"x"表示空位，用来补位的。
      0xxxxxxx
      110xxxxx 10xxxxxx
      1110xxxx 10xxxxxx 10xxxxxx
      11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx