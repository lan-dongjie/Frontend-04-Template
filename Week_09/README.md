学习笔记

为什么 first-letter 可以设置 float 之类的,而 first-line 不行呢
1、先看区别
1.first-letter 和 first-line 都作用于块级元；
2.first-letter:作用于第一行的首字符；
3.first-line：作用于第一行的所有字符；
2、由于 first-letter 只作用首个字符，所以可以拿到准确的位置及大小，而 first-line 作用于第一行所有元素，而一行的长度本身取决于很多因素，包括元素宽度，文档宽度和文本的文字大小等，也就是说，first-line 所影响的内容是按照该行内元素的样式决定了，此时设置块属性会导致不断的重新计算第一行所容许的元素，大概率会进入死循环或者计算爆栈
