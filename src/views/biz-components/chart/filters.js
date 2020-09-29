import { isObject } from 'lodash-es'
/**
 * 销售金额过滤器
 * 0 -> 0
 * 256 -> 256
 * 2500 -> 2.5K
 * 25000 -> 2.5万
 */
export const toKFilter = v => {
  v = Number(v)
  if (!v) return 0
  const T1 = Math.pow(10, 3)
  const T2 = Math.pow(10, 4)
  if (v >= T2) return (v / T2).toFixed(1).replace('.0', '') + '万'
  // if (v >= T1 && v) return (v / T1).toFixed(1).replace('.0', '') + 'k'
  if (v >= 0 && String(v).indexOf('.') + 1) return v.toFixed(1)
  return v
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
    key: 0,
    name: 'empty',
    value: '#E9EDF2'
  },
  {
    key: 1,
    name: '会员卡|会员卡(次卡)',
    value: '#1C97FF'
  },
  {
    key: 1,
    name: '会员卡(期卡)',
    value: '#1160D6'
  },
  {
    key: 2,
    name: '私教课|私教课(单人)',
    value: '#FF647C'
  },
  {
    key: 2,
    name: '私教课(多人)',
    value: '#AD1F85'
  },
  {
    key: 3,
    name: '团体课',
    value: '#FDAFBB'
  },
  {
    key: 4,
    name: '课程包|课程包(限次)',
    value: '#BE52F2'
  },
  {
    key: 15,
    name: '课程包(不限次)',
    value: '#DBA5F5'
  },
  {
    key: 5,
    name: '储值卡',
    value: '#FFA940'
  },
  {
    key: 6,
    name: '小班课',
    value: '#A5AFFB'
  },
  {
    key: 8,
    name: '定金',
    value: '#14B580'
  },
  {
    key: 9,
    name: '押金',
    value: '#46E2DC'
  },
  {
    key: 10,
    name: '储物柜',
    value: '#55D1FF'
  },
  {
    key: 12,
    name: '云店',
    value: '#FF7A45'
  },
  {
    key: 13,
    name: '场地预约',
    value: '#9CDD89'
  },
  {
    key: -1,
    name: '全部|总营收',
    value: '#545B94'
  },
  {
    key: -2,
    name: '其它|其他',
    value: '#C59854'
  }
]

export const setColorMap = (fieldsOpts = {}, colors, isQueue = false) => {
  // fieldsKey 为 key 的list
  const fields = fieldsOpts.fieldsKey || []
  // fieldsObj 为 key: name 对象
  const fieldsObj = fieldsOpts.fieldsObj || {}
  const colorMap = fieldsOpts.colorMap || colorObj
  const cMap = {}
  fields.map((key, idx) => {
    // isQueue 为true 代表不使用colorMap，而使用colors数组，按照当前下标从colos中取色
    if (isQueue) {
      cMap[fieldsObj[key]] = colors[idx % colors.length]
    } else if (Array.isArray(colorMap)) {
      // colorMap为数组对象
      const obj =
        // 首先匹配key，匹配到即终止
        colorMap.find(item => item.key === key) ||
        // 再匹配name，匹配到即终止
        colorMap.find(item => item.name === key) ||
        // 再判断key是否包含name，匹配到即终止
        colorMap.find(item => key && key.toString().includes(item.name)) ||
        // 再判断name是否包含key，匹配到即终止
        colorMap.find(
          item => item.name && item.name.toString().includes(key)
        ) ||
        {}
      // 如果以上没有找到匹配项，则使用colors数组，按照当前下标从colos中取色
      cMap[fieldsObj[key]] = obj.value || colors[idx % colors.length]
    } else {
      // colorMap为对象 即 key: color
      cMap[fieldsObj[key]] = colorMap[key] || colors[idx % colors.length]
    }
  })
  console.log(cMap)
  return cMap
}
