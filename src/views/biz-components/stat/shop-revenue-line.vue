<template>
  <div class="stat-shop-revenue-line"></div>
</template>

<script>
import { toKFilter, thousandsFilter } from './filters'
import { View } from 'st-data-set'
import { Chart } from '@antv/g2'
import chartMixin from './mixin'

export default {
  mixins: [chartMixin],
  props: {
    /**
     * @example
     * [{date:'05-28',私教课:20,团体课:50,储值卡:78}]
     */
    data: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 280
    },
    // 使用的字段key值数组
    fields: {
      type: Array,
      default: () => {
        const member_card = this.$c('member_card')
        return [
          '私教课',
          '团体课',
          '课程包',
          member_card,
          '云店',
          '定金',
          '押金',
          '其它'
        ]
      }
    },
    // 颜色数组
    colors: {
      type: Array,
      default: () => [
        '#4677F9',
        '#06DB8C',
        '#009DFF',
        '#B8F10F',
        '#3F66F6',
        '#FF6466'
      ]
    },
    shadowColors: {
      type: Array,
      default: () => [
        'rgba(70,119,249,.4)',
        'rgba(6,219,140,.4)',
        'rgba(0,157,255,.4)',
        'rgba(184,241,15,.4)',
        'rgba(63,102,246,.4)',
        'rgba(255,100,102,.4)'
      ]
    },
    max: {
      type: Number,
      default: 16
    }
  },
  data() {
    return {
      // MAX: 0
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
      this.dv.transform({
        type: 'fold',
        fields: this.fields,
        key: 'name',
        value: 'value'
      })
      console.log(this.dv)
    },
    changeData() {
      this.chart.destroy()
      this.initChart()
    },
    initChart() {
      this.chart = new Chart({
        container: this.$el,
        forceFit: true,
        height: this.height,
        padding: [8, 16, 100, 'auto'],
        renderer: 'svg'
      })
      this.chart.source(this.dv, {
        date: {
          tickCount: 10,
          range: [0, 1]
        },
        value: {
          max: +this.MAX,
          tickCount: 5,
          formatter: toKFilter
        }
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
      this.chart.legend('name', {
        position: 'bottom-left',
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
      this.chart
        .line()
        .style('name', {
          shadowColor: name => this.shadowColorMap[name],
          // shadowColor: '#70b2ec',
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
        .color('name', this.colors)

      this.chart.render()
    }
  }
}
</script>
