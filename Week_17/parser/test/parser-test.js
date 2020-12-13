import { parseHTML } from '../src/parser.js'
var assert = require('assert');

describe('parse html:', function () {
  const strs = [
    { str: '<meta http-equiv="charset" content="iso-8859-1">', tagName: 'meta' },
    { str: '<a/>', tagName: 'a' },
    { str: "<a href='//baidu.com'/>", tagName: 'a' },
    { str: "<a href='//baidu.com' id='gg'/>", tagName: 'a' },
    { str: "<a href='//baidu.com' id='gg' />", tagName: 'a' },
    { str: '<a id="aaaadd" href="//baidu.com"/>', tagName: 'a' },
    { str: '<a id="aaaadd"/>', tagName: 'a' },
    { str: '<a />', tagName: 'a' },
    { str: '<a  id/>', tagName: 'a' },
    { str: '<a id= "aa"/>', tagName: 'a' },
    { str: '<a>></>', tagName: 'a' },
    { str: '<style>.aaa {width: 100px;}</style>', tagName: 'style' },
    { str: '<style>.aaa {width: 100px;}</styles>', tagName: '' },
    {
      str: `<a id="g"
    href/>`, tagName: 'a'
    },
    { str: '<a =id href=/>', tagName: 'a' },
    { str: '<a></a>', tagName: 'a' },
    { str: '<a class="dsfdsf" id="gg"></a>', tagName: 'a' },
    { str: '<a id="aaaadd" />', tagName: 'a' },
    { str: '<a data=p ></a>', tagName: 'a' },
    { str: '<a data=data></a>', tagName: 'a' },
    { str: '<a data=data/>', tagName: 'a' },
    { str: '<a data=data />', tagName: 'a' },
  ]
  strs.forEach((item, i) => {
    const { str, tagName } = item
    it(str, function () {
      const tree = parseHTML(str)
      console.log('iii', i, tree);
      if (tagName !== 'meta') {

        tagName && assert.equal(tree.children[0].tagName, tagName);
      }
    });
  })
});