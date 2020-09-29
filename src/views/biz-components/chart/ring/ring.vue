<!-- 多维度曲线统计图
  数据格式：
    data[]
      item{}
        name  图例名
        key   图例name对应key值
        value y轴值
        x     x轴值
  或 fold属性 为 true 代表数据格式为折叠形式，需通过自定义 dataItem 格式化展开后的数据 以组成上面格式的数据
    data[]
      item{}
        name: value 组合
        key:  value 组合
        x     x轴值
  -->

<template>
  <div class="chart-ring"></div>
</template>

<script>
import { View } from 'st-data-set'
import { Chart } from '@antv/g2'
import {
  toKFilter,
  thousandsFilter,
  setColorMap,
  colorToRgba
} from '../filters'
import chartMixin from '../mixin'
import { chartConfig } from './ring.config'

export default {
  name: 'MultiLine',
  mixins: [chartMixin],
  props: {
    data: {
      type: Array,
      default: () => []
    },
    dataItem: {
      type: Function,
      default: row => row
    },
    // 设置 图例、x轴、y轴 对应的key值
    dataItemKeyMap: {
      type: Object,
      default: () => {
        return {
          name: 'name', // 图例名
          key: 'key', // 图例name对应key值
          value: 'value', // y轴值
          x: 'date' // x轴值
        }
      }
    },
    total: {
      type: [Number, String],
      default: 0
    },
    unitBack: {
      type: Boolean,
      default: false
    },
    unit: {
      type: String,
      default: '¥'
    },
    totalName: {
      type: String,
      default: ''
    },
    tooltipId: {
      type: String,
      default: ''
    },
    tooltipMap: {
      type: Object,
      default: () => {}
    },
    // 数组排序对应颜色顺序，设置对应字段的颜色；当fold为true时 fields又作为展开字段集,用于字段的展开
    fields: {
      type: [Boolean, Array],
      default: () => []
    },
    fieldKey: {
      type: String,
      default: 'key'
    },
    // 颜色配置数组
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
    // 是否按照颜色数组的顺序 循环设置图例颜色（即图例顺序与colors顺序一一对应），默认为false，根据图例key设置图例颜色
    colorIsQueue: {
      type: Boolean,
      default: false
    },
    colorMap: {
      type: [Object, Array, Boolean],
      default: false
    },
    height: {
      type: Number,
      default: 210
    },
    padding: {
      type: [Array, Number],
      default: () => ['auto', 185, 'auto', 'auto']
    }
  },
  watch: {
    // 当浏览器窗口变小时，tooltip会消失问题
    resize() {
      this.$nextTick(() => {
        const tooltipMap = this.tooltipMap
        for (let key in tooltipMap) {
          tooltipMap[key] &&
            new Vue({
              components: {
                StHelpTooltip
              },
              render: h => <st-help-tooltip id={tooltipMap[key]} />
            }).$mount(`#legend-${key}`)
        }
        if (this.tooltipId) {
          const $s = this.$el.querySelector.bind(this.$el)
          const component = new Vue({
            components: {
              StHelpTooltip
            },
            render: h => <st-help-tooltip id={this.tooltipId} />
          }).$mount()
          $s(`#guide-name-tooltip${this.tooltipId}`).appendChild(component.$el)
        }
      })
    }
  },
  data() {
    return {
      type: 'Ring',
      dv: new View()
    }
  },
  computed: {
    dataSource() {
      //传入的总计为0时，多一个环形图为0的灰色环形图
      if (this.total == 0 || !this.total) {
        return [{ key: 0, name: 'empty', value: 1, percent: 1 }, ...this.data]
      }
      return [{ key: 0, name: 'empty', value: 0, percent: 0 }, ...this.data]
    },
    /**
     * 图例枚举配置获取
     * fieldsKey  为图例名对应的key值数组
     * fieldsName 为图例名 数组                用于数据展开的依据
     * fieldsObj  为图例名与其key值 的对应关系
     * */
    $fieldsOpts() {
      let fieldsKey = []
      let fieldsName = []
      let fieldsObj = {}
      const data = this.dataSource
      data.map(item => {
        fieldsKey.push(item[this.fieldKey])
        fieldsName.push(item.name)
        fieldsObj[item[this.fieldKey]] = item.name
      })
      if (this.fields.length) {
        fieldsKey = [...this.fields, ...fieldsKey]
      }
      fieldsKey = [...new Set(fieldsKey)]
      fieldsName = [...new Set(fieldsName)]

      return {
        colorMap: this.colorMap,
        fieldsKey,
        fieldsName,
        fieldsObj
      }
    },
    // 构造颜色map
    $colorMap() {
      // 根据 图例枚举，以图例name为key值，生成图例颜色map对应关系
      return setColorMap(this.$fieldsOpts, this.colors, this.colorIsQueue)
    },
    opt$() {
      const { legend = {}, guide = {} } = this.$attrs
      return {
        legend: {
          position: 'right-center',
          layout: 'line', // line 同行  vertical 分上下两行
          ...legend
        },
        guide: {
          layout: '', // reverse 上下文案反转
          ...guide
        }
      }
    }
  },
  methods: {
    initDv() {
      this.dv.source(this.dataSource)
      this.dv
        .transform({
          type: 'map',
          callback: (row, index) => {
            // 根据自定义配置项 格式化数据
            for (let key in this.dataItemKeyMap) {
              const itemDt = row[this.dataItemKeyMap[key]]
              if (itemDt) row[key] = itemDt
            }
            ;(row.$idx = index), (row.value = +(row.value || 0))
            return this.dataItem ? this.dataItem(row) : row
          }
        })
        .transform({
          type: 'percent',
          field: 'value', // 统计销量
          dimension: 'name', // 每年的占比
          as: 'percent' // 结果存储在 percent 字段
        })
    },

    renderChart() {
      console.log('chart init', this.dv.rows)
      this.chart = new Chart({
        ...this.opts,
        container: this.$el,
        data: this.dv,
        forceFit: true,
        height: this.height,
        padding: ['auto', 185, 'auto', 'auto']
      })
      if (this.isEmpty) {
        this.chart.tooltip(false)
        this.chart.legend('name', false)
      }
      this.chart.render()
      this.chartEvent()
    },
    // 如果配置参数在单独的配置文件中这个方法必须设置
    getChartConfig() {
      // chartConfig 输出配置参数的方法
      return chartConfig(this)
    },
    // 更新opts配置 需要重新计算最新的opts、并重新渲染
    changeData() {
      this.chart.destroy()
      this.renderChart()
    },
    valFormat(val) {
      return Number((+val).toFixed(1)).toLocaleString()
    },
    resetTotal() {
      const $s = this.$el.querySelector.bind(this.$el)
      $s('.guide-value').textContent = this.valFormat(this.total) || 0
      // 总计的时候显示tooltip
      $s('.guide-name-tooltip').setAttribute(
        'style',
        this.tooltipId ? 'display: inline' : 'display: none'
      )
      $s('.guide-name-text').textContent = this.totalName
    },
    setUnit(e) {
      const $s = this.$el.querySelector.bind(this.$el)
      // 当环形图总计都是零的时候隐藏tooltip
      if (e.data._origin.name === 'empty') {
        $s('.g2-tooltip').setAttribute('style', 'display: none')
        return
      }
      const origin = e.data._origin
      const shapes = e.shapes
      const geom = e.geom

      $s('.guide-value').textContent = this.valFormat(origin.value)
      $s('.guide-name-text').textContent = origin.name
      // 不是总计的时候隐藏tooltip
      $s('.guide-name-tooltip').setAttribute('style', 'display: none')
    },
    chartEvent() {
      // 鼠标进入环形显示相关的值
      this.chart.on('interval:mouseenter', ev => {
        const shape = ev.shape
        const origin = ev.data._origin
        if (origin.name === 'empty') {
          this.chart.getAllGeoms()[0].clearActivedShapes(shape)
        }
        this.setUnit(ev)
      })
      // 鼠标离开显示总值
      this.chart.on('interval:mouseleave', e => {
        this.resetTotal()
      })
    }
  }
}
</script>
