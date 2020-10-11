function getStyle(element) {
  if (!element.style) {
    element.style = {}
  }
  for (const prop in element.computeStyle) {
    // let p = element.computeStyle.value;
    element.style[prop] = element.computeStyle[prop].value;
    const value = element.style[prop].toString()
    if (value.match(/px$/)) {
      element.style[prop] = parseInt(value)
    }
    if (value.match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(value)
    }
  }
  return element.style
}

function layout(element) {
  if (!element.computeStyle) {
    return
  }
  let elementStyle = getStyle(element)

  if (elementStyle.display !== 'flex') {
    return
  }
  console.log('element',element.children);
  let items = element.children.filter(e => e.type === 'element')

  items.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0)
  })

  let style = elementStyle,
    auto = 'auto';
  ['width', 'height'].forEach(size => {
    if (style[size] === auto || style[size] === '') {
      style[size] = null
    }
  })

  let {
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    alignContent
  } = style;
  if (!flexDirection || flexDirection === auto) {
    style.flexDirection = 'row'
  }
  if (!alignItems || alignItems === auto) {
    style.alignItems = 'stretch'
  }
  if (!justifyContent || justifyContent === auto) {
    style.justifyContent = 'flex-start'
  }
  if (!flexWrap || flexWrap === auto) {
    style.flexWrap = 'nowrap'
  }
  if (!alignContent || alignContent === auto) {
    style.alignContent = 'stretch'
  }

  let mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase;
  if (style.flexDirection === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1
    mainBase = 0

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'letf'
    crossEnd = 'right'
  }

  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = -1
    mainBase = style.height

    crossSize = 'width'
    crossStart = 'letf'
    crossEnd = 'right'
  }

  if (style.flexWrap === 'wrap-reverse') {
    const tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossSign = 1;
    crossBase = 0;
  }

  let isAutoMainSize = false;
  // 没设置主轴，由元素撑开
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let itemStyle = getStyle(item);
      if (itemStyle[mainSize] !== null || itemStyle[mainSize]) {
        elementStyle[mainSize] = elementStyle[mainSize]
      }      
    }
    isAutoMainSize = true
  }

  // 分行
  let flexLine = [], flexLines = [flexLine]
  // 主轴剩余空间，交叉轴剩余空间
  let mainSpace = elementStyle[mainSize], crossSpace = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      // 取行高（取最高的那个）
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void(0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(item)
    } else {
      // 子元素比主轴大的取主轴值
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }
      // 剩下空间放不下元素时的处理（换行）
      if (mainSpace < itemStyle[mainSize]) {
        // 记录当前行的剩余空间（主轴和交叉轴的剩余空间）
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        // 换行
        flexLine = [item]
        flexLines.push(flexLine)
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(item)
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void(0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      mainSpace -= itemStyle[mainSize]
    }
  }
  flexLine.mainSpace = mainSpace;
  // 分行 --------end

  // 计算宽(高)度
  if (mainSpace < 0) {
    // 主轴剩余空间小于0，做等比压缩
    let scale = style[mainSize] / (style[mainSize] - mainSpace);
    let currentMain = mainBase;
    // 循环处理每个元素
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let itemStyle = getStyle(item);
      
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale;

      // 设置位置
      itemStyle[mainStart] = currentMain
      itemStyle[mainEnd] = itemStyle[mainStart] * mainSign * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    }
  } else {
    flexLines.forEach(items => {
      let {mainSpace} = items
      let flexTotal = 0
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let {flex} = getStyle(item);
        if (flex !== null && (flex !== void 0)) {
          flexTotal += flex;
          continue
        }
      }

      if (flexTotal > 0) {
        let currentMain = mainBase
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          let itemStyle = getStyle(item)
          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle
          }
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] * mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd]
        }
      } else {
        let currentMain = mainBase, step = 0
        if (style.justifyContent === 'flex-start') {
          step = 0
        }
        if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase
          step = 0
        }

        if (style.justifyContent === 'center') {
          currensteptMain = mainSpace / 2 * mainSign + mainBase
        }
        // 元素之间间隔
        if (style.justifyContent === 'space-between') {
          step = mainSpace / (items.length - 1) * mainSign
        }
        // 元素前后间隔
        if (style.justifyContent === 'space-around') {
          step = mainSpace / items.length * mainSign
          currentMain = step / 2 + mainBase
        }

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          let itemStyle = getStyle(item);
          itemStyle[mainStart, currentMain]
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }


  if (!style[crossSize]) {
    crossSpace = 0;
    elementStyle[crossSize] = 0
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] += flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize]
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }

  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize]
  } else {
    crossBase = 0
  }

  let lineSize = style[crossSize] / flexLines.length
  let step = 0;
  if (style.alignContent === 'flex-start') {
    crossBase += 0
  }
  if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace
  }
  if (style.alignContent === 'center') {
    crossBase += crossSign * crossSpace / 2
  }
  if (style.alignContent === 'space-between') {
    crossBase += 0
    step = crossSpace / (flexLines.length - 1)
  }
  if (style.alignContent === 'space-around') {
    step = crossSpace / flexLines.length
    crossBase += crossSign * step / 2
  }
  if (style.alignContent === 'stretch') {
    crossBase += 0
    step = 0
  }

  flexLines.forEach(items => {
    let lineCrossSize = style.alignContent === 'stretch' ? items.crossSpace + crossSpace / flexLines.length : items.crossSpace

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let itemStyle = getStyle(item)
      let align = itemStyle.alignSelf || style.alignItems

      if (item === null) {
        itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0
      }

      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }
      if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
      }
      if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }
      if (align === 'stretch') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : 0)
        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
      }
    }
    crossBase += crossSign * (lineCrossSize + step)
  })
}

module.exports = {
  layout
}