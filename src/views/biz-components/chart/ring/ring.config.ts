export const chartConfig = vm => ({
  options: {
    scales: {
      value: {
        formatter: v => (vm.unitBack ? v + vm.unit : vm.unit + v)
      }
    },
    coord: {
      type: 'theta',
      cfg: {
        innerRadius: 0.65
      }
    },
    tooltip: {
      showTitle: false,
      itemTpl: `<li class="tooltip-item-{name}">
                    <span style="background-color:{color};" class="g2-tooltip-marker"></span>
                    {name}
                    <span class="st-g2-tooltip-value">| {percent}</span>
                  </li>`
    },
    legends: {
      name: {
        position: vm.opt$.legend.position,
        // position: 'right-center',
        // itemWidth: 160,
        useHtml: true,
        // textStyle: {
        //   fill: '#3E4D5C'
        // },
        itemTpl: (name, color, checked, index) => {
          const row = vm.dv.findRow({ name })
          const value = vm.valFormat(row.value)
          const tooltipId = vm.tooltipMap && vm.tooltipMap[row.key]
          return `<li class="g2-legend-list-item item-{originValue} item-{index} {checked} ${
            vm.opt$.legend.layout
          }" data-color="{originColor}" data-value="{originValue}">
                    <div>
                      <i class="g2-legend-marker" style="background-color:{color};"></i>
                      <span class="g2-legend-text">${name}</span>
                      <span id='legend-{index}'></span>
                    </div>
                    <div class='legend-right'>
                      <span class='legend-percent'>${
                        vm.unitBack ? value + vm.unit : vm.unit + value
                      }</span>
                    </div>
                  </li>`
        },
        onHover: ev => {
          console.log(ev)
          // 总计为 0 是阻止事件继续执行hover
          if (!vm.total) return
          const $s = vm.$el.querySelector.bind(vm.$el)
          const name = ev.item.value
          const row = vm.dv.findRow({ name })
          const shapes = ev.shapes
          const geom = ev.geom
          const legend = ev.currentTarget
          // 选中对应单元
          vm.total && geom.setShapesActived(shapes)
          legend.addEventListener('mouseleave', () => {
            vm.resetTotal()
          })
          $s('.guide-value').textContent = vm.valFormat(row.value)
          $s('.guide-name-text').textContent = row.name
          $s('.guide-name-tooltip').setAttribute('style', 'display: none')
        }
      }
    },
    guides: [
      {
        type: 'html',
        position: ['50%', '50%'],
        html: () => {
          vm.resize = Math.random()
          console.log(vm)
          return `<div class='guide ${
            vm.opt$.guide.layout
          }' style='width: ${vm.height / 2}px'>
                    <div class='guide-name'>
                      <span class="guide-name-text">${vm.totalName}</span>
                      <span class="guide-name-tooltip" id="guide-name-tooltip${
                        vm.tooltipId
                      }"></span>
                    </div>
                    <div class='guide-title'>
                      <span class='guide-unit' style="display: ${
                        vm.unitBack ? 'none' : 'inline-block'
                      }">${vm.unit}</span>
                      <span class='guide-value'>${vm.valFormat(vm.total) ||
                        0}</span>
                      <span class='guide-unit' style="display: ${
                        !vm.unitBack ? 'none' : 'inline-block'
                      }">${vm.unit}</span>
                    </div>
                  </div>`
        }
      }
    ],
    geoms: [
      {
        type: 'intervalStack',
        position: 'value',
        active: {
          style: {
            fillOpacity: 1,
            lineWidth: 8
          }
        },
        select: false,
        color: {
          field: 'name',
          callback: (name, key) => {
            // if (vm.total == 0 || !vm.total) return '#E9EDF2'
            // console.log('color', name, key, vm.$colorMap[name])
            return vm.$colorMap[name]
          }
        },
        style: {
          fillOpacity: 1,
          cursor: 'pointer'
        },
        tooltip: {
          field: 'name*percent',
          callback: (name, percent) => {
            return {
              name,
              percent: (function(p) {
                // 百分比处理，精确至 0.001%（最小值）
                const r = 10
                let u = 1,
                  i = 0
                p = p * 100
                while (p < u && i < 3) {
                  u = u / 10
                  i++
                }
                if (p < u) p = u
                return (i <= 0 ? Math.floor(p) : p.toFixed(i)) + '%'
              })(percent)
            }
          }
        }
      }
    ]
  }
})
