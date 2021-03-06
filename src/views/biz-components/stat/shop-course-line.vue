<template>
  <div class="stat-shop-course-line"></div>
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
      default: 280
    },
    // 使用的字段key值数组
    fields: {
      type: Array,
      default() {
        const smallCourse = this.$c('small_course')
        return [
          '团体课可预约人数',
          '团体课签到人数',
          '团体课预约人数',
          '私教课签到人数',
          '私教课预约人数',
          `${smallCourse}签到人数`,
          `${smallCourse}预约人数`
        ]
      }
    },
    // 颜色数组
    colors: {
      type: Array,
      default: () => [
        '#5095FC',
        '#6831D7',
        '#06DB8C',
        '#872333',
        '#98db23',
        '#8f23f3',
        '#9ddf33'
      ]
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
        padding: [80, 16, 32, 'auto'],
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
        position: 'top-left',
        useHtml: true,
        offsetY: -16,
        // offsetX: -22,
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
          shadowBlur: 20,
          shadowOffsetY: 4
        })
        .tooltip('name*value', (name, value) => {
          return {
            name,
            value: value + '人'
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
