// kmp状态机

function end(code, max, table) {
  return function (c) {
    if (code === c) {
      return max
    }
    return table[max - 1]
  }
}

function getStart(code) {
  return function start(c) {
    if (code === c) {
      return 1
    } else {
      return 0
    }
  }
}

function getStatus(code, i, table) {
  return function (c) {
    if (c === code) {
      return i + 1
    } else {
      return table[i]
    }
  }
}

function KMPStateMachine(strs, str) {
  const len = str.length;
  let table = new Array(len).fill(0), findCodeTable = [];
  // 生成初始状态函数
  findCodeTable.push(getStart(str[0]))
  for (let i = 1, j = 0; i < len; i++) {
    const code = str[i];
    // kmp，查找记录相同位置
    if (code === str[j]) {
      ++j;
      table[i] = j;
    } else if (table[j] > 0) {
      j = table[j];
    }
    // 生成后面的状态函数
    if (i < len - 1) {
      findCodeTable.push(getStatus(code, i, table))
    } else {
      findCodeTable.push(end(code, len, table));
    }
  }
  console.log('----', table);
  
  for (let i = 0, j = 0; i < strs.length; i++) {
    const findCode = findCodeTable[j];
    const next = findCode(strs[i])
    if (next === str.length) {
      return true
    } else {
      j = next
    }
  }
  return false
}
console.log( '00',findString('sadfadfasdfaupoipdfgdsaaabbaaaaaaabbbxgdfs', 'abcabcx'))

