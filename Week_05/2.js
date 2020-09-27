const regs = {
  2: {
    reg: /^0b([0-1]+$)/,
    head: /^0b/
  },
  8: {
    reg: /^0o([0-7]+$)/,
    head: /^0o/
  },
  10: {
    reg: /^[+-]?[\d]+([\.][\d]+)?([Ee][+-]?[\d]+)?$/,
    head: /^[+-]/
  },
  16: {
    reg: /^0x([\da-f]+$)/,
    head: /^0x/
  }
};

function computeTotal(numArr, radix, isdecimal, res = 0) {
  const hex = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15,
  }
  // console.log(numArr,radix,isdecimal, res = 0);
  while (numArr[0] === '0') {
    numArr.shift();
  }
  for (let i = 0, len = numArr.length - 1; i <= len; i++) {
    res += hex[numArr[i]] * ((isdecimal ? (0.1 ** (i + 1)) : (radix ** (len - i))));
  }
  return res;
}


function StringToNumber(str) {
  let strType = typeof str,
    radix;
  if (strType !== 'string' && strType !== 'number') {
    return NaN
  }

  let reg = null,
    head;
  for (const key in regs) {
    if (regs.hasOwnProperty(key)) {
      if (regs[key].reg.test(str)) {
        reg = regs[key].reg;
        radix = key;
        head = regs[key].head;
      }
    }
  }
  if (!reg) {
    throw new Error('Unsupported base');
  }
  if (!radix) {
    return NaN
  }
  let strArr = str.toLowerCase().split('e');
  let res = 0,
    base = 1;
  // 科学计数
  if (strArr.length > 1) {
    base = radix ** strArr[1];
  }

  let str0 = strArr[0];
  let PON = '';
  str0 = str0.replace(head, $1 => {
    PON = $1
    return '';
  })


  const decimal = str0.split('.');
  for (let i = 0; i < decimal.length; i++) {
    res += computeTotal(decimal[i].split(''), radix, i === 1);
  }
  res *= base;


  if (PON === '-') {
    res = -res;
  }

  console.log('str:', str, 'typeof:', typeof str, '  ===> res:', res, 'typeof:', typeof res);
  return res
}

// 10进制
const arr = ['+001e1', '4E-1', '+1e-1', '111', '-1024', '11.1', '+11e1', '-11e-3']
arr.map(str => {

  console.log(`\n10---------------------${Number(str)}`);
  StringToNumber(str);
  return str
})

console.log('\n222222-------------------------------', Number('0b001101'));
// 2进制
StringToNumber('0b001101');

// console.log(Buff);

console.log('\n888888888888888---------------------', Number('0o145'));
// 8进制
StringToNumber('0o145');

console.log('\n16----------------------------------', Number('0xaafd')); //16进制
StringToNumber('0xaafd');







function NumberToString(num, radix = 10) {
  const num_type = typeof num;
  if (num_type === 'string') {
    return num;
  }
  if (num_type !== 'number') {
    throw new Error('Number type error')
  }

  const hex = {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: 'a',
    11: 'b',
    12: 'c',
    13: 'd',
    14: 'e',
    15: 'f',
    16: 'g',
    17: 'h',
    18: 'i',
    19: 'j',
    20: 'k',
    21: 'l',
    22: 'm',
    23: 'n',
    24: 'o',
    25: 'p',
    26: 'q',
    27: 'r',
    28: 's',
    29: 't',
    30: 'u',
    31: 'v',
    32: 'w',
    33: 's',
    34: 'y',
    35: 'z',
  }
  let PON = '';
  if (num < 0) {
    num = -num;
    PON = '-';
  }
  const resArr = [];
  let decimal = 0;
  // 整数处理
  function integeirTransform(number) {
    const rounding = Math.floor(number / radix);
    const remainder = Math.floor(number % radix);
    resArr.unshift(hex[remainder]);
    rounding > 0 && integeirTransform(rounding)
  }
  integeirTransform(num);
  // 小数处理
  decimal = num - Math.floor(num);
  let max = 47;
  function decimalTransform(decimal) {
    const newNum = decimal * radix
    const rounding = Math.floor(newNum);
    resArr.push(hex[rounding]);
    const remainder = newNum - rounding;
    console.log( radix,newNum, remainder);
    if (max > 0 && remainder > 0) {
      max--;
      decimalTransform(remainder);
    }
  }
  if (decimal !== 0 ) {
    resArr.push('.');
    decimalTransform(decimal.toFixed(3));
  }
  resArr.unshift(PON);
  const res = resArr.join('');
  return res
}

// const numArr = [0xaaf, 08, 123, 12.3, 11e-1, 0.3, -0.1, 2];
// numArr.map(num => {
//   for (let n = 0; n < 36; n++) {
//     console.log('\n-------------', num, n);
//     console.log('my', NumberToString(num, n));
//     console.log('ttt', num.toString(n));
//   }
//   // console.log('\nstart---------------------',num , typeof num , '\n');
//   // console.log("--2:", num.toString(2), typeof num.toString(2));
//   // console.log("--8:", num.toString(8));
//   // console.log("--10:", num.toString(10));
//   // console.log("--16:", num.toString(16));
//   // console.log('\n---------------------------------end\n');
//   return num
// })

const num = 52.123;
for (let n = 2; n < 36; n++) {
  console.log('\n---------------------------------', n);
  console.log('my', NumberToString(num, n));
  console.log('tt', num.toString(n));
}