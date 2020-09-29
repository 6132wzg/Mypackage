<template>
  <div class="brand-stat-line"></div>
</template>

<script>
import { toKFilter, thousandsFilter, setColorMap } from './filters'
import { View } from 'st-data-set'
import { Chart } from '@antv/g2'
import chartMixin from './mixin'

export default {
  name: 'BrandStatLine',
  mixins: [chartMixin],
  props: {
    /**
     * @example
     * fold 为false [{date:'05-28', name: '私教课', value: 20}, {date:'05-28', name: '团体课', value: 50}]
     * fold 为true [{date:'05-28',私教课:20,团体课:50,储值卡:78}]
     * fold 为true时 fields不能为空
     */
    fold: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 280
    },
    // 数组排序对应颜色顺序，设置对应字段的颜色；当fold为true时 fields又作为展开字段集,用于字段的展开
    fields: {
      type: [Boolean, Array],
      default: () => ['其他', '全部']
    },
    colorKey: {
      type: String,
      default: 'name'
    },
    // 颜色数组
    colors: {
      type: Array,
      default: () => [
        '#3F66F6',
        '#798AFF',
        '#06DB8C',
        '#77FF74',
        '#B8F10F',
        '#FFE679',
        '#FFB946',
        '#FF6466',
        '#C87FFF',
        '#484F83'
      ]
    },
    colorMap: {
      type: [Object, Boolean],
      default: false
    },
    max: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      // MAX: 0
    }
  },
  computed: {
    $fields() {
      let fields = []
      if (!this.fields) return [...new Set(this.data.map(item => item.name))]
      if (this.fields.length) {
        fields = [...this.fields, ...new Set(this.data.map(item => item.name))]
      }
      return fields
    },
    // 构造颜色map
    $colorMap() {
      if (this.colorMap) return this.colorMap
      return setColorMap(this.$fields || [], this.colors)
    },
    // 构造阴影颜色map
    shadowColors() {
      const shadowColorMap = {}
      for (let key in this.$colorMap) {
        shadowColorMap[key] = this.colorToRgba(this.$colorMap[key], 0.4)
      }
      // this.$fields.map((key, idx) => {
      //   shadowColorMap[key] = this.colorToRgba(
      //     this.colors[idx % this.colors.length],
      //     0.4
      //   )
      // })
      return shadowColorMap
    },
    MAX() {
      const maxValue = this.dv.max('value')
      return maxValue > this.max ? maxValue : this.max
    }
  },
  methods: {
    initDv() {
      this.dv = new View()
      this.dv.source(this.data)
      if (this.fold) {
        this.dv.transform({
          type: 'fold',
          fields: this.$fields,
          key: 'name',
          value: 'value'
        })
      }
      this.dv.transform({
        type: 'map',
        callback: (row, index) => {
          ;(row.$idx = index), (row.value = +row.value)
          return row
        }
      })
    },
    changeData() {
      this.chart.destroy()
      this.initChart()
    },
    initChart() {
      this.getChartInstance()
      this.chart.source(this.dv, {
        date: {
          tickCount: 7,
          range: [0, 1]
        },
        value: {
          max: +this.MAX,
          min: 0,
          tickCount: 8,
          formatter: toKFilter,
          sync: true
        }
      })
      this.setAxis()
      this.setLegend()
      this.getLineChart()
      this.chart.render()
    },
    getChartInstance() {
      this.chart = new Chart({
        container: this.$el,
        forceFit: true,
        height: this.height,
        padding: [8, 160, 'auto', 'auto'],
        renderer: 'svg'
      })
    },
    setAxis() {
      this.chart.axis('date', {
        label: {
          textStyle: {
            fill: '#9BACB9'
          }
        },
        tickLine: {
          lineWidth: 0,
          length: 0
        }
      })
      this.chart.axis('value', {
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
      })
    },
    setLegend() {
      this.chart.legend('name', {
        position: 'right-center',
        itemWidth: 80,
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
      })
    },
    getLineChart() {
      this.chart
        .line()
        .style(`name*${this.colorKey}`, {
          shadowColor: (name, key) => {
            console.log('shadowColor', name, key)
            return this.shadowColors[name]
          },
          shadowBlur: 20,
          shadowOffsetY: 4
        })
        .tooltip('name*value', (name, value) => {
          return {
            name,
            value: '¥' + thousandsFilter(value)
          }
        })
        .shape('smooth')
        .size(2)
        .position('date*value')
        .color(`name*${this.colorKey}`, (name, key) => {
          console.log('color', name, key)
          return this.$colorMap[name]
        })
    },

    colorToRgba(str = '', opacity) {
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
  }
}
</script>
