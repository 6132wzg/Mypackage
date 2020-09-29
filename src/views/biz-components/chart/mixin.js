import G2 from '@antv/g2'
import { ChartConfig } from './config'
import { merge } from 'lodash-es'
export default {
  props: {
    /**
     * 图表id
     */
    id: {
      type: String,
      default: 'chart'
    },
    /**
     * 图表数据
     */
    data: {
      type: Array,
      default() {
        return []
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    data: {
      deep: true,
      handler(newData) {
        if (!this.chart) {
          this.initDv()
          this.initOpts()
          this.renderChart()
        } else {
          this.initDv()
          this.initOpts()
          this.chart.changeData(this.dv)
          this.changeData && this.changeData() // 自定义的changeData
        }
      }
    }
  },

  data() {
    return {
      opts: {}
    }
  },
  created() {
    this.initDv()
    this.initOpts()
  },
  mounted() {
    if (this.data.length) {
      this.renderChart()
    }
  },
  methods: {
    initOpts() {
      G2.track(false) // 关闭打点监控
      // 获取默认配置项 并与 传入的配置项进行深度合并，
      // (默认配置项可以从自定义组件的 getChartConfig 中获取， 也可以从默认的配置文件中根据 组件的this.type 获取相应的配置)
      // 如果组件的配置参数在单独的配置文件中 则这个方法必须设置
      ;(this.chartConfig = this.getChartConfig
        ? this.getChartConfig()
        : ChartConfig.apply(this)),
        (this.opts = merge(this.chartConfig, this.options))
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  }
}
