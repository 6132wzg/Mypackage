/**
 * 销售金额过滤器
 * 0 -> 0
 * 256 -> 256
 * 2500 -> 2.5K
 * 25000 -> 2.5万
 */
export const toKFilter = v => {
  v = Number(v)
  if (!v) {
    return 0
  }
  const T1 = Math.pow(10, 3)
  const T2 = Math.pow(10, 4)

  if (v >= T2) {
    return (v / T2).toFixed(1).replace('.0', '') + '万'
  }
  if (v >= T1 && v) {
    return (v / T1).toFixed(1).replace('.0', '') + 'k'
  }
  if (v >= 0 && String(v).indexOf('.') + 1) {
    return v.toFixed(1)
  }
}

/**
 * 千分位过滤器
 */
export const thousandsFilter = (v, fixed = 1) => {
  const result = Number(v)
    .toFixed(fixed)
    .replace(/\B(?=(?:\d{3})+\b)/g, ',')
    .replace(/[\.]?0+$/, '')
  return result
}

/**
 * 小数点保留1位, 并去除小数点后多余的0
 */
export const decimalFilter = (v, fixed = 1) => {
  if (!v) return 0
  const result = Number(v).toFixed(fixed)
  return result
}

export const colorToRgba = (str = '', opacity = 1) => {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  let color = str.toLowerCase()
  if (reg.test(color)) {
    if (color.length === 4) {
      let colorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
      }
      color = colorNew
    }
    let colorChange = []
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
    }
    return `RGB(${colorChange.join(',')},${opacity})`
  } else {
    return color
  }
}

const colorObj = [
  {
    name: '会员卡',
    value: '#1C97FF'
  },
  {
    name: '会员卡(次卡)',
    value: '#1C97FF'
  },
  {
    name: '会员卡(期卡)',
    value: '#1160D6'
  },
  {
    name: '私教课',
    value: '#FF647C'
  },
  {
    name: '私教课(单人)',
    value: '#FF647C'
  },
  {
    name: '私教课(多人)',
    value: '#AD1F85'
  },
  {
    name: '团体课',
    value: '#FDAFBB'
  },
  {
    name: '储值卡',
    value: '#FFA940'
  },
  {
    name: '课程包',
    value: '#BE52F2'
  },
  {
    name: '课程包(限次)',
    value: '#BE52F2'
  },
  {
    name: '课程包(不限次)',
    value: '#DBA5F5'
  },
  {
    name: '定金',
    value: '#14B580'
  },
  {
    name: '押金',
    value: '#46E2DC'
  },
  {
    name: '云店',
    value: '#FF7A45'
  },
  {
    name: '其它',
    value: '#C59854'
  },
  {
    name: '其他',
    value: '#C59854'
  },
  {
    name: '总营收',
    value: '#545B94'
  },
  {
    name: '小班课',
    value: '#A5AFFB'
  },
  {
    name: '储物柜',
    value: '#55D1FF'
  },
  {
    name: '场地预约',
    value: '#9CDD89'
  }
]

export const setColorMap = (fields, colors) => {
  const colorMap = {}
  fields.map((name, idx) => {
    const obj =
      colorObj.find(item => item.name === name) ||
      colorObj.find(item => name.includes(item.name)) ||
      {}
    colorMap[name] = obj.value || colors[idx % colors.length]
  })
  return colorMap
}
