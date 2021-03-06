<template>
  <div>
    <div class="shop-store-data-line"></div>
  </div>
</template>

<script>
import { toKFilter } from './filters'
import { View } from 'st-data-set'
import { Chart } from '@antv/g2'
import chartMixin from './mixin'

export default {
  mixins: [chartMixin],
  props: {
    /**
     * 数据
     * @example
     * [{date:'05-28',私教预约人数:250,私教签到人数:250,团体课排课人数:20}]
     */
    data: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 420
    },
    // 使用的字段key值数组
    fields: {
      type: Array,
      default: () => ['amount']
    },
    // 使用字段提示标题
    tooltipKey: {
      type: String
    },
    // 颜色数组
    colors: {
      type: Array,
      default: () => ['#5095FC', '#6831D7', '#06DB8C', '#872333', '#98db23']
    },
    shadowColors: {
      type: Array,
      default: () => [
        'rgba(80,149,252,.4)',
        'rgba(104,49,215,.4)',
        'rgba(6,219,140,.4)',
        'rgba(135,35,51,.4)',
        'rgba(152,219,35,.4)'
      ]
    },
    unit: {
      type: String,
      default: '元'
    }
  },
  computed: {
    colorMap() {
      return this.fields.reduce((res, field, idx) => {
        res[field] = this.colors[idx % this.colors.length]
        return res
      }, {})
    },
    shadowColorMap() {
      return this.fields.reduce((res, field, idx) => {
        res[field] = this.shadowColors[idx % this.shadowColors.length]
        return res
      }, {})
    }
  },
  methods: {
    initDv() {
      this.dv = new View()
      this.dv.source(this.data)
      this.dv.transform({
        type: 'fold',
        fields: this.fields,
        key: 'name',
        value: 'value'
      })
    },
    initChart() {
      this.chart = new Chart({
        container: this.$el,
        forceFit: true,
        height: this.height,
        padding: [40, 'auto', 32, 'auto'],
        renderer: 'svg'
      })

      this.chart.source(this.dv, {
        date: {
          tickCount: 10,
          range: [0, 1]
        },
        value: {
          tickCount: 5,
          formatter: toKFilter
        }
      })
      this.chart.scale('value', {
        min: 0
      })
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
      this.chart
        .line()
        .style('name', {
          shadowColor: name => this.shadowColorMap[name]
          // shadowBlur: 20,
          // shadowOffsetY: 4
        })
        .tooltip('name*value', (name, value) => {
          return {
            name: this.tooltipKey,
            value: value + this.unit
          }
        })
        .shape('smooth')
        .size(2)
        .position('date*value')
        .color('name', this.colors)

      this.chart.render()
    }
  }
}
</script>
