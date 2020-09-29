export function chartConfig(this: any) {
  const config = {
    options: {
      scales: {
        type: {
          nice: true
        },
        value: {
          max: +this.MAX,
          min: 0,
          tickCount: 6,
          formatter: this.toKFilter,
          sync: true
        },
        value2: {
          max: +this.MAX2,
          min: 0,
          tickCount: 6,
          formatter: val => this.toKFilter(val, this.unit2 || '元'),
          sync: true
        }
      },
      axes: {
        type: {
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
        },
        value2: {
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
      // tooltip: {
      //   useHtml: true,
      //   shared: true, // 合并数据
      //   showCrosshairs: true, // 展示辅助线
      //   itemTpl: `<li class="g2-tooltip-list-item" data-index="" style="list-style-type: none; padding: 0px; margin: 12px 0px;display: {hide}">
      //               <svg class="g2-tooltip-marker" style="background: {color}; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;"></svg>
      //               <span class="g2-tooltip-name">{name}</span>:
      //               <span class="g2-tooltip-value" style="display: inline-block; float: right; margin-left: 30px;">{value}</span>
      //             </li>`
      // },
      legends: {
        name: {
          position: 'right',
          useHtml: true,
          itemTpl: () => {
            return (
              '<li class="g2-legend-list-item item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
              `<span class="g2-legend-marker" style="background-color:{color};"></span>` +
              ` <span class="g2-legend-text">{value}</span>` +
              '</li>'
            )
          }
        },
        name2: {
          position: 'right',
          offsetY: -12,
          useHtml: true,
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
          type: 'interval',
          adjust: 'stack',
          position: 'type*value',
          color: {
            field: `name`,
            callback: name => {
              // console.log('color', name, this.$colorMap, this.$colorMap[name])
              return this.$colorMap[name]
            }
          },
          tooltip: {
            field: 'name*value',
            callback: (name, value) => {
              return {
                name,
                value: this.thousandsFilter(value)
              }
            }
          },
          size: 40
        },
        {
          type: 'line',
          position: 'type*value2',
          color: {
            field: `name2`,
            callback: name => {
              // console.log('color', name, this.$colorMap, this.$colorMap[name])
              return this.$colorMap[name]
            }
          },
          style: {
            field: `name2`,
            cfg: {
              shadowColor: name => {
                return this.shadowColors[name]
              },
              shadowBlur: 20,
              shadowOffsetY: 4
            }
          },
          tooltip: {
            field: 'name2*value2',
            callback: (name, value) => {
              return {
                name,
                value: '¥' + this.thousandsFilter(value)
              }
            }
          },
          size: 2,
          shape: 'smooth'
        },
        {
          type: 'point',
          position: 'type*value2',
          color: {
            field: `name2`,
            callback: name => {
              // console.log('color', name, this.$colorMap, this.$colorMap[name])
              return this.$colorMap[name]
            }
          },
          style: {
            field: `name`,
            shadowColor: name => {
              return this.shadowColors[name]
            },
            shadowBlur: 20,
            shadowOffsetY: 4
          },
          tooltip: false,
          size: 3,
          shape: 'circle'
        }
      ]
    }
  }
  console.log('config', config, this)
  return config
}
