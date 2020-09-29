export const chartConfig = vm => ({
  options: {
    scales: {
      date: {
        tickCount: 7,
        range: [0, 1]
      },
      value: {
        max: +vm.MAX,
        min: 0,
        tickCount: 8,
        formatter: val => vm.toKFilter(val, vm.unit || '元'),
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
            // console.log('color', name, vm.$colorMap, vm.$colorMap[name])
            return vm.$colorMap[name]
          }
        },
        style: {
          field: `name`,
          cfg: {
            shadowColor: name => {
              return vm.shadowColors[name]
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
              value: '¥' + vm.thousandsFilter(value)
            }
          }
        },
        size: 2,
        shape: 'smooth'
      }
    ]
  }
})
