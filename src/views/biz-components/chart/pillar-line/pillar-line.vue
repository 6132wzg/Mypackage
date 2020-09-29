<template>
  <div class="plillar-line"></div>
</template>

<script>
import {
  toKFilter,
  thousandsFilter,
  setColorMap,
  colorToRgba
} from '../filters'
import { View } from 'st-data-set'
import { Chart } from '@antv/g2'
import chartMixin from '../mixin'
import { chartConfig } from './pillar-line.config'

export default {
  name: 'PillarLine',
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
          name2: 'name2', // 图例名
          key2: 'key2', // 图例name对应key值
          value2: 'value2', // y2轴值
          type: 'type' // x轴值
        }
      }
    },
    height: {
      type: Number,
      default: 280
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
    fieldKey2: {
      type: String,
      default: 'key2'
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
    // 是否按照颜色数组的顺序 循环设置图例颜色（即图例顺序与colors顺序一一对应），默认为false，根据图例key设置图例颜色
    colorIsQueue: {
      type: Boolean,
      default: false
    },
    colorMap: {
      type: [Object, Array, Boolean],
      default: false
    },
    max: {
      type: Number,
      default: 10
    },
    max2: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      type: 'PillarLine',
      dv: new View()
    }
  },
  computed: {
    dataSource() {
      // 数据为空时，默认添加一项空数据，保证空统计图的绘制
      if (!this.data || !this.data.length) {
        return [{ key: 0, name: '', value: 0, type: '' }, ...this.data]
      }
      return this.data
    },
    $fieldsOpts() {
      let fieldsKey = []
      let fieldsName = []
      let fieldsObj = {}
      const data = this.fold ? this.dv.rows : this.dataSource
      data.map(item => {
        fieldsKey.push(item[this.fieldKey])
        fieldsName.push(item.name)
        fieldsObj[item[this.fieldKey]] = item.name
        fieldsKey.push(item[this.fieldKey2])
        fieldsName.push(item.name2)
        fieldsObj[item[this.fieldKey2]] = item.name2
      })
      if (this.fields.length) {
        fieldsKey = [...this.fields, ...fieldsKey]
      }
      fieldsKey = [...new Set(fieldsKey)]
      fieldsName = [...new Set(fieldsName)]
      console.log('fieldsOpts', fieldsKey)
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
    // 构造阴影颜色map
    shadowColors() {
      const shadowColorMap = {}
      for (let key in this.$colorMap) {
        shadowColorMap[key] = colorToRgba(this.$colorMap[key], 0.4)
      }
      return shadowColorMap
    },
    // y轴 最大值设置
    MAX() {
      let maxValue = this.max
      const maxValMap = {}
      this.dv.rows.map(item => {
        maxValMap[item.type]
          ? (maxValMap[item.type] += item.value)
          : (maxValMap[item.type] = +item.value)
      })
      Object.keys(maxValMap).map(key => {
        maxValMap[key] > maxValue && (maxValue = maxValMap[key])
      })
      console.log('MAX', maxValue)
      return maxValue
    },
    MAX2() {
      const maxValue = this.dv.rows.length ? this.dv.max('value2') : this.max
      console.log('MAX2', maxValue)
      return maxValue > this.max2 ? maxValue : this.max2
    }
  },
  methods: {
    toKFilter(val, unit = '') {
      const n = toKFilter(val)
      return n.toString().indexOf('万') >= 0 ? n : n + unit
    },
    thousandsFilter,
    // getChartConfig,
    // 格式化数据
    initDv() {
      this.dv = new View()
      this.dv.source(this.dataSource)
      if (this.fold) {
        this.dv.transform({
          type: 'fold',
          fields: this.fields,
          key: 'name',
          value: 'value'
        })
      }
      this.dv.transform({
        type: 'map',
        callback: (row, index) => {
          // 根据自定义配置项 格式化数据
          for (let key in this.dataItemKeyMap) {
            const itemDt = row[this.dataItemKeyMap[key]]
            if (itemDt) row[key] = itemDt
          }
          ;(row.$idx = index),
            (row.value = +row.value),
            (row.value2 = +row.value2)
          return this.dataItem ? this.dataItem(row) : row
        }
      })
    },
    // 创建图表实例
    renderChart() {
      console.log('chart init', this.dv.rows)
      this.chart = new Chart({
        ...this.opts,
        container: this.$el,
        data: this.dv,
        forceFit: true,
        height: this.height,
        padding: ['auto', 160, 'auto', 'auto']
        // renderer: 'svg'
      })
      if (this.isEmpty) {
        this.chart.tooltip(false)
        this.chart.legend('name', false)
        this.chart.legend('name2', false)
      }
      this.chart.render()
    },
    // 更新opts配置 需要重新计算最新的opts、并重新渲染
    changeData() {
      this.chart.destroy()
      this.renderChart()
    },
    // 如果配置参数在单独的配置文件中这个方法必须设置
    getChartConfig() {
      // chartConfig 输出配置参数的方法
      return chartConfig.apply(this)
    },
    // 设置交互
    setInteraction(chart) {
      chart.interaction('element-highlight-by-color')
    }
  }
}
</script>
