function getSpecificityArr(specificityArr) {
  if (!specificityArr) {
    return false;
  }

  let specificity = [0, 0, 0, 0];
  specificityArr.forEach((i) => {
    specificity[i]++;
  });
  // console.log('specificity: ', specificity);
  return specificity;
}

function computeSpecificity(specificity) {
  const N = 255;
  let S = 0,
    len = specificity.length;
  for (let i = 0, j = len - 1; i < len; i++, j--) {
    S += specificity[i] * N ** j;
    // console.log(j, N ** j);
  }

  return S;
}

function getSelectorSpecificityArr(selector) {
  let specificityArr = [];
  const reg = /\S(\[|:)/g;
  // 取出id
  while (selector) {
    selector = selector.replace(/^#((?!\.)\S)*/i, ($) => {
      // console.log('111111111', $);
      specificityArr.push(1);
      if (reg.test($)) {
        specificityArr.push(1);
      }
      return '';
    });
    selector = selector.replace(/^\.\S((?!\.)\S)*/i, ($) => {
      specificityArr.push(2);

      if (reg.test($)) {
        specificityArr.push(2);
      }
      return '';
    });
    selector = selector.replace(/^\S((?!(\.|#|>))\S)*/i, ($) => {
      // console.log('333333333', $);
      $ !== '*' && specificityArr.push(3);
      return '';
    });
    selector = selector.trim();
  }
  return specificityArr;
}

function log(selector) {
  console.log(selector, getSpecificityArr(getSelectorSpecificityArr(selector)));
  // console.log(
  //   '\nselector:',
  //   selector,
  //   ',N = 255, S: ',
  //   computeSpecificity(getSpecificityArr(getSelectorSpecificityArr(selector)))
  // );
}
// getSpecificityArr('#id div .cla > a');
// log('div#a.b .c[id=x]');
const selectors = ['div#a.b .c[id=x]', '#a:not(#b)', '*.a', 'div.a'];

selectors.forEach((selector) => log(selector));
