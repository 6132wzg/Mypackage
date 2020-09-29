// chart 属性 方法 说明 https://g2-v3.antv.vision/zh/docs/api/chart
// container: {string} | {HTMLDivElement},
// width?: {number},
// height?: {number},
// padding?: {object} | {number} | {array},
// background?: {object},
// plotBackground?: {object},
// forceFit?: {boolean},
// animate?: {boolean},
// pixelRatio?: {number},
// data?: {array} | {DataSet.View},
// theme?: {string} | {object},
// renderer?: {string},
// options 配置声明及示例 https://g2-v3.antv.vision/zh/docs/api/options/
// options = {
//   scales: { // 列定义声明
//     type: {string}, // 指定数据类型，可声明的类型为：identity、linear、cat、time、timeCat、log、pow
//     alias: {string}, // 数据字段的别名
//     formatter: {function}, // 格式化文本内容
//     range: {array}, // 输出数据的范围，默认[ 0, 1 ]，格式为 [ min, max ]，min 和 max 均为 0 至 1 范围的数据。
//     tickCount: {number}, // 设置坐标轴上刻度点的个数
//     ticks: {array}, // 用于指定坐标轴上刻度点的文本信息，当用户设置了 ticks 就会按照 ticks 的个数和文本来显示
//     sync: {boolean} // 当 chart 存在不同数据源的 view 时，用于统一相同数据属性的值域范围
//   },
//   coord: {object}, // 坐标系配置
//   axes: {object}, // 坐标轴配置
//   legends: {object}, // 图例配置
//   guides: {array}, // 图表辅助元素配置
//   filters: {object}, // 数据过滤配置
//   tooltip: {object}, // 提示信息配置
//   facet: {object}, // 分面配置
//   geoms: {array} // 图形语法相关配置

import { toKFilter, thousandsFilter, setColorMap, colorToRgba } from './filters'
export function ChartConfig(this: any) {
  let config = new Object()
  config = {
    defaultMultiLineOptions: {
      options: {
        scales: {
          date: {
            tickCount: 7,
            range: [0, 1]
          },
          value: {
            max: +this.MAX,
            min: 0,
            tickCount: 8,
            formatter: val => this.toKFilter(val, this.unit || '元'),
            sync: true
          }
        },
        axes: {
          date: {
            label: {
              textStyle: {
                fill: '#9BACB9'
              }
            },
            tickLine: {
              lineWidth: 0,
              length: 0
            }
          },
          value: {
            label: {
              textStyle: {
                fill: '#9BACB9'
              }
            },
            grid: {
              lineStyle: {
                lineWidth: 0.5,
                lineDash: [0, 0]
              }
            }
          }
        },
        legends: {
          name: {
            position: 'right-center',
            useHtml: true,
            textStyle: {
              fill: '#3E4D5C'
            },
            itemTpl: () => {
              return (
                '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
                `<span class="g2-legend-marker" style="background-color:{color};"></span>` +
                ` <span class="g2-legend-text">{value}</span>` +
                '</li>'
              )
            }
          }
        },
        geoms: [
          {
            type: 'line',
            position: 'date*value',
            color: {
              field: `name`,
              callback: name => {
                // console.log('color', name, this.$colorMap, this.$colorMap[name])
                return this.$colorMap[name]
              }
            },
            style: {
              field: `name`,
              cfg: {
                shadowColor: name => {
                  return this.shadowColors[name]
                },
                shadowBlur: 20,
                shadowOffsetY: 4
              }
            },
            tooltip: {
              field: 'name*value',
              callback: (name, value) => {
                return {
                  name,
                  value: '¥' + thousandsFilter(value)
                }
              }
            },
            size: 2,
            shape: 'smooth'
          }
        ]
      }
    }
  }
  /**
   * 找到对应 type 的默认配置，例如 chartConfig.defaultLineConfig
   */
  return config[
    `default${this.type
      .replace(/(^[a-z]|\-[a-z])/, i => i.toUpperCase())
      .replace('-', '')}Options`
  ]
}
