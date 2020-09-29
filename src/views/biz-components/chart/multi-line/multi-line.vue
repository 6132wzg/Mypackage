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
  <div class="multi-line"></div>
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

export default {
  name: 'MultiLine',
  mixins: [chartMixin],
  props: {
    /**
     * @example
     * fold 为false [{date:'05-28', key: 2, name: '私教课', value: 20}, {date:'05-28', key: 3, name: '团体课', value: 50}]
     * fold 为true [{date:'05-28', 私教课:20, 团体课:50, 储值卡:78}]
     * fold 为true [{date:'05-28', 2:20, 3:50, 5:78}]          2、3、5 分别为 私教课 团体课 储值卡，需通过自定义dataItem 格式化
     * fold 为true时 fields不能为空, 用于展开数据
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
          date: 'date' // x轴值
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
    max: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      type: 'MultiLine',
      dv: new View()
      // MAX: 0
    }
  },
  computed: {
    isEmpty() {
      return !this.data || !this.data.length
    },
    dataSource() {
      // 数据为空时，默认添加一项空数据，保证空统计图的绘制
      if (!this.data || !this.data.length) {
        return [{ key: 0, name: '', value: 0, date: '' }, ...this.data]
      }
      return this.data
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
      const data = this.fold ? this.dv.rows : this.dataSource
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
      const maxValue = this.dv.rows.length ? this.dv.max('value') : this.max
      return maxValue > this.max ? maxValue : this.max
    }
  },
  methods: {
    toKFilter(val, unit = '') {
      const n = toKFilter(val)
      return n.toString().indexOf('万') >= 0 ? n : n + unit
    },
    thousandsFilter,
    initDv() {
      this.dv.source(this.dataSource)
      if (this.fold) {
        this.dv.transform({
          type: 'fold',
          fields: this.$fieldsOpts.fieldsName,
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
          ;(row.$idx = index), (row.value = +row.value)
          return this.dataItem ? this.dataItem(row) : row
        }
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
        padding: [8, 160, 'auto', 'auto'],
        renderer: 'svg'
      })
      if (this.isEmpty) {
        this.chart.tooltip(false)
        this.chart.legend('name', false)
      }
      this.chart.render()
    },
    // 更新opts配置 需要重新计算最新的opts、并重新渲染
    changeData() {
      this.chart.destroy()
      this.renderChart()
    }
  }
}
</script>
