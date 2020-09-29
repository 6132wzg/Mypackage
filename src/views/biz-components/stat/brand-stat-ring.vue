<template>
  <div class="brand-stat-ring"></div>
</template>

<script>
import { Chart } from '@antv/g2'
import { View } from 'st-data-set'
import chartMixin from './mixin'
import { decimalFilter, setColorMap } from './filters'
import StHelpTooltip from '@/views/components/help-tooltip/help-tooltip'

export default {
  name: 'BrandStatRing',
  mixins: [chartMixin],
  data() {
    return {
      intervalStack: {},
      resize: -99
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
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
    legend: {
      type: Object,
      default: () => {}
    },
    guide: {
      type: Object,
      default: () => {}
    },
    fields: {
      type: [Array, Boolean],
      default: () => [
        '会员卡',
        '私教课',
        '团体课',
        '储值卡',
        '课程包',
        '定金',
        '押金',
        '储物柜',
        '云店',
        '小班课',
        '其他',
        '全部'
      ]
    },
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
        '#5E83AC',
        '#FF6466',
        '#04A0AF',
        '#C87FFF',
        '#484F83'
      ]
    },
    colorKey: {
      type: String,
      default: 'name'
    },
    colorMap: {
      type: [Object, Boolean],
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
  computed: {
    dataSource() {
      //传入的总计为0时，多一个环形图为0的灰色环形图
      if (this.total == 0 || !this.total) {
        return [{ name: 'empty', value: 1 }, ...this.data]
      }
      return [{ name: 'empty', value: 0 }, ...this.data]
    },
    $fields() {
      let fields = []
      if (!this.fields) return [...new Set(this.data.map(item => item.name))]
      if (this.fields.length) {
        fields = [...this.fields, ...new Set(this.data.map(item => item.name))]
      }
      return fields
    },
    $colorMap() {
      if (this.colorMap) return this.colorMap
      // const colorMap = {}
      // this.$fields.map((key, idx) => {
      //   colorMap[key] = this.colors[idx % this.colors.length]
      // })
      return setColorMap(this.$fields || [], this.colors)
    },
    $option() {
      return {
        legend: {
          position: 'right-center',
          layout: 'line', // line 同行  vertical 分上下两行
          ...this.legend
        },
        guide: {
          layout: '', // reverse 上下文案反转
          ...this.guide
        }
      }
    }
  },
  methods: {
    initDv() {
      this.dv = new View()
      this.dv.source(this.dataSource)
      this.dv
        .transform({
          type: 'map',
          callback(row) {
            row.value = +(row.value || 0)
            return row
          }
        })
        .transform({
          type: 'percent',
          field: 'value', // 统计销量
          dimension: 'name', // 每年的占比
          as: 'percent' // 结果存储在 percent 字段
        })
    },
    initChart() {
      // chart初始化实例
      this.getChartInstance()
      // 加载数据
      this.chart.source(this.dv, {
        value: {
          formatter: v => (this.unitBack ? v + this.unit : this.unit + v)
        }
      })
      // 设置坐标系
      this.setCoord()
      // 设置提示信息
      this.setTooltip()
      // 设置图例
      this.setLegend()
      // 设置复制元素
      this.setGuideHtml()
      // 设置渲染环形图
      this.getintervalStack()
    },
    getintervalStack() {
      // 环形图初始化
      this.intervalStack = this.chart
        .intervalStack()
        .style({
          fillOpacity: 1,
          cursor: 'pointer'
        })
        .tooltip('name*percent', function(name, percent) {
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
        })
        .position('value')
        // .color(`name*${this.colorKey}`, ['#E9EDF2', ...this.colors])
        .color(
          `name*${this.colorKey}`,
          !this.fields
            ? ['#E9EDF2', ...this.colors]
            : (name, key) => {
                if (this.total == 0 || !this.total) return '#E9EDF2'
                // console.log('color', name, key, this.$colorMap[name])
                return this.$colorMap[name]
              }
        )
        .select(false)
        .active({
          style: {
            fillOpacity: 1,
            lineWidth: 8
          }
        })
      this.chart.render()
      // 自定义监听环形图事件
      this.chartEvent()
    },
    getChartInstance() {
      this.chart = new Chart({
        container: this.$el,
        forceFit: true,
        padding: this.padding,
        height: this.height
      })
    },
    setTooltip() {
      this.chart.tooltip({
        showTitle: false,
        itemTpl: `<li class="tooltip-item-{name}">
                    <span style="background-color:{color};" class="g2-tooltip-marker"></span>
                    {name}
                    <span class="st-g2-tooltip-value">| {percent}</span>
                  </li>`
      })
    },
    setCoord() {
      this.chart.coord('theta', {
        innerRadius: 0.65
      })
    },
    valFormat(val) {
      return Number((+val).toFixed(1)).toLocaleString()
    },
    setLegend() {
      this.chart.legend({
        position: this.$option.legend.position,
        useHtml: true,
        itemTpl: (name, color, checked, index) => {
          const row = this.dv.findRow({ name })
          const value = this.valFormat(row.value)
          const tooltipId = this.tooltipMap && this.tooltipMap[row.key]
          return `<li class="g2-legend-list-item item-{originValue} item-{index} {checked} ${
            this.$option.legend.layout
          }" data-color="{originColor}" data-value="{originValue}">
                    <div>
                      <i class="g2-legend-marker" style="background-color:{color};"></i>
                      <span class="g2-legend-text">${name}</span>
                      <span id='legend-{index}'></span>
                    </div>
                    <div class='legend-right'>
                      <span class='legend-percent'>${
                        this.unitBack ? value + this.unit : this.unit + value
                      }</span>
                    </div>
                  </li>`
        },
        onHover: ev => {
          // 总计为 0 是阻止事件继续执行hover
          if (!this.total) return
          const $s = this.$el.querySelector.bind(this.$el)
          const name = ev.item.value
          const row = this.dv.findRow({ name })
          const shapes = ev.shapes
          const geom = ev.geom
          const legend = ev.currentTarget
          // 选中对应单元
          this.total && geom.setShapesActived(shapes)
          legend.addEventListener('mouseleave', () => {
            this.resetTotal()
          })
          $s('.guide-value').textContent = this.valFormat(row.value)
          $s('.guide-name-text').textContent = row.name
          $s('.guide-name-tooltip').setAttribute('style', 'display: none')
        }
      })
    },
    setGuideHtml() {
      // 总计的自定义DOM
      this.chart.guide().html({
        position: ['50%', '50%'],
        html: () => {
          this.resize = Math.random()
          return `<div class='guide ${
            this.$option.guide.layout
          }' style='width: ${this.height / 2}px'>
                    <div class='guide-name'>
                      <span class="guide-name-text">${this.totalName}</span>
                      <span class="guide-name-tooltip" id="guide-name-tooltip${
                        this.tooltipId
                      }"></span>
                    </div>
                    <div class='guide-title'>
                      <span class='guide-unit' style="display: ${
                        this.unitBack ? 'none' : 'inline-block'
                      }">${this.unit}</span>
                      <span class='guide-value'>${this.valFormat(this.total) ||
                        0}</span>
                      <span class='guide-unit' style="display: ${
                        !this.unitBack ? 'none' : 'inline-block'
                      }">${this.unit}</span>
                    </div>
                  </div>`
        }
      })
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
          this.intervalStack.clearActivedShapes(shape)
        }
        this.setUnit(ev)
      })
      // 鼠标离开显示总值
      this.chart.on('interval:mouseleave', e => {
        this.resetTotal()
      })
    }
  },
  beforeDestroy() {
    if (this.chart) {
      // 注销图形所有事件
      this.chart.off()
    }
  }
}
</script>
