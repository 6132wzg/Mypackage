<template>
  <div class="stat-brand-simple-line"></div>
</template>

<script>
import chartMixin from './mixin'
import { Chart } from '@antv/g2'
import { View } from 'st-data-set'
export default {
  mixins: [chartMixin],
  props: {
    /**
     * @example
     * [
        { name: '1', value: 102  },
        { name: '2', value: 12  },
        { name: '3', value: 50  },
        { name: '4', value: 30  },
        { name: '5', value: 7  },
        { name: '6', value: 6  },
        { name: '7', value: 10  }
      ]
     */
    data: {
      type: Array,
      default: () => []
    },
    unit: {
      type: String,
      default: '元'
    },
    color: {
      type: String,
      default: '#3F67F5'
    },
    height: {
      type: Number,
      default: 68
    }
  },
  methods: {
    initDv() {
      this.dv = new View()
      this.dv.source(this.data)
      this.dv.transform({
        type: 'map',
        callback(row) {
          row.value = +row.value
          return row
        }
      })
      console.log(this.data)
    },
    initChart() {
      this.chart = new Chart({
        container: this.$el,
        forceFit: true,
        height: this.height,
        renderer: 'svg',
        padding: 'auto'
      })
      const maxValue = this.dv.max('value')
      this.chart.source(this.dv, {
        value: {
          min: 0,
          max: maxValue * 1.1
        }
      })
      this.chart.axis('value', false)
      this.chart.axis('name', {
        nice: true,
        label: false,
        grid: {
          lineStyle: {
            stroke: '#EBEFF4',
            lineWidth: 1
          }
        },
        line: {
          lineWidth: 0
        },
        tickLine: {
          lineWidth: 0,
          length: 0
        }
      })
      this.chart.scale('name', {
        range: [0, 1]
      })
      this.chart.tooltip({
        showTitle: false,
        useHtml: true,
        itemTpl:
          `<li class='tooltip-item' data-index={index} style='background-color:${this.color};'>` +
          `<span class='g2-tooltip-value'>{value}${this.unit}</span>` +
          `</li>`
      })

      this.chart
        .line()
        .shape('smooth')
        .color(this.color)
        .position('name*value')

      this.chart
        .line()
        .shape('smooth')
        .color(this.color)
        .style({
          shadowColor: this.color,
          shadowBlur: 20,
          shadowOffsetY: 4,
          opacity: 0.5
        })
        .position('name*value')

      this.chart.render()
    }
  }
}
</script>
