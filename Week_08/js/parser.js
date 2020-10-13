const css = require('css')
const {layout} = require('./Layout')

const EOF = Symbol('EOF')
const tagRex = /^[(a-zA-Z)|(1-6)]$/
const attrRex = /^[\t\n\f ]$/
let currentToken = null,
  currentAttribue = null,
  currentTextNode = null,
  Space = '\u0000';

let stack = [{
  type: 'document',
  children: []
}]
let rules = []

function addCSSRules(text) {
  let ast = css.parse(text)

  // console.dir(ast.stylesheet.rules);
  rules.push(...ast.stylesheet.rules)
  // console.log('rules', rules);
}

function partSelector(selector) {
  let selectorId = '', selectorClassName = [];
  // 取出id
  selector = selector.replace(/#((?!\.)\S)*/g, $ => {
    selectorId = $;
    return ''
  })
  // /\.\S((?!\.|#)\S)*/g
  // 取出class,剩下tagName(如果有的话)
  selector = selector.replace(/\.\S((?!\.)\S)*/g, $ => {
    selectorClassName.push($.replace(/^./, ''));
    return ''
  })

  return {
    selectorId,
    selectorClassName,
    selectorTagName: selector
  }
}

function match(element, selector) {
  if (!selector || element.type === 'document') {
    return false
  }
  // id, class, tagName
  let is_same = [false, false, false];
  const { attributes, tagName } = element;
  const id = attributes.filter(attr => attr.name === 'id')[0];
  let className = attributes.filter(attr => attr.name === 'class')[0];
  const {
    selectorId,
    selectorTagName,
    selectorClassName,
  } = partSelector(selector);

  if (selectorId ) {
    if (id && selectorId === `#${id.value}`) {
      is_same[0] = true
    }
  } else {
    is_same[0] = true
  }
  const len = selectorClassName.length
  if (len && className) {
    className = className.value.split(' ');
    for (let i = 0, j = 0; i < len; i++) {
      if (className.includes(selectorClassName[i])) {
        j++
      }
      if (j === len) {
        is_same[1] = true
      }
    }
  } else if (len === 0) {
    is_same[1] = true
  }
  
  if (selectorTagName) {
    if(tagName === selectorTagName)
      is_same[2] = true
  } else {
    is_same[2] = true
  }
  // console.log('-------ssssssss', is_same);
  if (!is_same.includes(false)) {
    return true
  }

  return false
}

function getInlineStyle(element) {
  let computeStyle = {};
  const {
    attributes
  } = element;
  const inlineStyle = attributes.filter(attr => attr.name === 'style')[0]
  if (inlineStyle) {
    // console.log('inlineStyle-----------', inlineStyle);
    const styles = inlineStyle.value.split(';');
    // console.log('styles', styles);
    for (let i = 0; i < styles.length; i++) {
      const style = styles[i];
      const [k, v] = style.split(':');
      computeStyle[k.trim()] = {
        specificity: [1, 0, 0, 0],
        value: v
      }
    }
  }
  // console.log('computeStyle', computeStyle);
  element.computeStyle = computeStyle
}

function specificity(selectorParts) {
  let p = [0, 0, 0, 0];
  // console.log('part', selectorParts);
  for (const part of selectorParts) {
    const {
      selectorId,
      selectorTagName,
      selectorClassName,
    } = partSelector(part)
    // console.log('/nselectorParts----:',selectorParts,part, selectorId, selectorClassName);
    if (selectorId) {
      p[1] += 1;
    } 
    if (selectorClassName.length) {
      p[2] += selectorClassName.length;
    } 
    if (selectorTagName) {
      p[3] += 1;
    }
  }
  return p
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }

  return sp1[3] - sp2[3]
}

function computeCSS(element) {
  const elements = stack.slice().reverse();
  // console.log('elements', elements);
  if (!element.computeStyle) {
    getInlineStyle(element)
  }
  // console.log('rules', rules);
  rule_for: for (const rule of rules) {
    selector_for: for (const selector of rule.selectors) {
      let selectorParts = selector.split(' ').reverse();
      // console.log('selectorParts------:', selectorParts[0],'\n', element);
      if (!match(element, selectorParts[0])) {
        continue selector_for
      }
      // console.log('yyyyyyyyyyyy\n');
      let j = 1;
      let matched = selectorParts.length > j ? false : true;
        
      if (!matched) {
        for (let i = 0; i < elements.length; i++) {
          // console.log('----',elements[i].type,selectorParts, selectorParts[j]);
          if (match(elements[i], selectorParts[j])) {
            j++
            if (j === selectorParts.length) {
              matched = true
              break
            }
          }
        }
      }
      

      if (matched) {
        let { computeStyle } = element;
        // console.log('--------', selectorParts);
        const sp = specificity(selectorParts)
        for (const declaration of rule.declarations) {
          const { property, value } = declaration;
          let styleItem = computeStyle[property]
          if (!styleItem) {
            computeStyle[property] = {
              specificity: sp,
              value
            };
          } else if (compare(styleItem.specificity, sp) < 0) {
            styleItem.specificity = sp;
            styleItem.value = value;
            // console.log('\n-------',selectorParts, value);
          }
        }
      }
    }
  }
  // console.log('s------------');
  // console.dir(JSON.stringify(element));
  // console.log('e------------\n');
}

function emit(token) {
  // console.log(token);
  const top = stack[stack.length - 1]
  if (token.type === 'startTag') {
    let element = {
      type: token.tagName,
      children: [],
      attributes: [],
      tagName: token.tagName
    }
    for (const p in token) {
      if (p !== 'type' || p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    computeCSS(element)
    top.children.push(element)

    if (!token.isSelfClosing) {
      stack.push(element)
    }
    currentTextNode = null
  } else if (token.type === 'endTag') {
    if (token.tagName !== top.type) {
      throw new Error("Tag start end doesn't match!")
    } else {
      if (top.type === 'style') {
        addCSSRules(top.children[0].content)
      }
      // console.log('\ntopsssssssssssssss', top.type, 'eeeeeeeeeeeeee\n');
      layout(top)
      stack.pop();
    }
    currentTextNode = null
  } else if (token.type === 'text') {
    if (!currentTextNode) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(tagRex)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
    }
    return tagName(c)
  } else {
    return
  }
}

function endTagOpen(c) {
  if (c.match(tagRex)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if (c === '>') {

  } else if (c === EOF) {

  } else {

  }
}

function tagName(c) {
  if (c.match(attrRex)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c.match(tagRex)) {
    currentToken.tagName += c
    return tagName
  } else if (c === '>') {
    emit(currentToken);
    metaClosing(c)
    return data
  } else {
    return tagName
  }
}

function beforeAttributeName(c) {
  // tab、换行、禁止符、空格
  if (c.match(attrRex)) {
    return beforeAttributeName
  } else if (c === '>' || c === '/' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeName
  } else {
    currentAttribue = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function afterAttributeName(c) {
  if (c.match(attrRex) || c === '/' || c === '>' || c === EOF) {
    currentAttribue.value = currentAttribue.name
    currentToken[currentAttribue.name] = currentAttribue.value
    emit(currentToken)
    metaClosing(c)
    return data
  }
}

function attributeName(c) {
  if (c.match(attrRex) || c === '/' || c === '>' || c === EOF) {
    metaClosing(c)
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === Space) {

  } else if (c === '"' || c === '' || c === '<') {

  } else {
    currentAttribue.name += c
    return attributeName
  }
}

function beforeAttributeValue(c) {
  if (c.match(attrRex) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue(c)
  } else if (c === '"') {
    return doubleQuotedAttributeValue
  } else if (c === '\'') {
    return singQuotedAttributeValue
  } else if (c === '>') {

  } else {
    return UnquotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribue.name] = currentAttribue.value;
    return afterQuotedAttributeValue
  } else if (c === Space) {

  } else if (c === EOF) {

  } else {
    currentAttribue.value += c;
    return doubleQuotedAttributeValue
  }
}

function singQuotedAttributeValue(c) {
  if (c === '\'') {
    currentToken[currentAttribue.name] = currentAttribue.value;
    return afterQuotedAttributeValue
  } else if (c === Space) {

  } else if (c === EOF) {

  } else {
    currentAttribue.value += c;
    return singQuotedAttributeValue
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(attrRex)) {
    currentToken[currentAttribue.name] = currentAttribue.value;
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribue.name] = currentAttribue.value;
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribue.name] = currentAttribue.value;
    emit(currentToken)
    metaClosing(c)
    return data
  } else if (c === Space) {

  } else if (c === '"' || c === '\'' || c === '' || c === '<') {

  } else if (c === EOF) {

  } else {
    currentAttribue.value += c;
    return UnquotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(attrRex)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribue.name] = currentAttribue.value
    emit(currentToken)
    metaClosing(c)
    return data
  } else if (c === EOF) {

  } else {
    currentAttribue.value += c
    return doubleQuotedAttributeValue
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    return data
  } else if (c === EOF) {

  } else {

  }
}
// 处理meta闭合
function metaClosing(c) {
  if (c === '>' && currentToken.tagName === 'meta') {
    currentToken = {
      type: 'endTag',
      tagName: currentToken.tagName,
      isSelfClosing: true
    }
    emit(currentToken)
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data
  for (const c of html) {
    // console.log('cccc', c);
    state = state(c)
  }
  state = state(EOF)
  // console.log(JSON.stringify(stack[0]));
  return stack[0]
}