<!-- 倒计时 -->
<!-- 使用方式 <st-clock :value="time" format="[DD天]hh:mm:ss"></st-clock> -->
<template>
  <span>
    <slot v-bind:timer="timeValue" v-bind:timerFormat="timer">{{ timer }}</slot>
  </span>
</template>

<script>
import { typeOf } from '@/utils/type'
export default {
  name: 'StClock',
  props: {
    // 倒计时显示格式， 使用 [] 括起来的当值小于等于0时隐藏, 如: [DD天]hh:mm:ss  如果天数小于等于0 则将其变为 hh:mm:ss
    format: {
      type: String,
      default: 'DD天 hh小时 mm分钟 ss秒'
    },
    value: {
      type: Number,
      default: 0
    },
    // 倒计时刷新一次的时间间隔 单位为毫秒， 默认1000即1秒
    sp: {
      type: Number,
      default: 1000
    }
  },
  computed: {
    timeUnitMap() {
      return {
        'Y+': 1000 * 60 * 60 * 24 * 30 * 365,
        'M+': 1000 * 60 * 60 * 24 * 30,
        'D+': 1000 * 60 * 60 * 24,
        'h+': 1000 * 60 * 60,
        'm+': 1000 * 60,
        's+': 1000,
        fs: 100,
        ds: 10,
        ms: 1
      }
    },
    // 获取最大单位
    unit() {
      // 默认为天
      let unit = 'D+'
      let list = JSON.parse(JSON.stringify(this.timeFormatMap))
      list.reverse().map(key => {
        let ret = new RegExp('(' + key + ')').exec(this.format)
        if (ret) unit = key
      })
      return unit
    },
    // 根据最大单位计算当前倒计时各单位对应的值
    timeValue() {
      const index = this.timeFormatMap.indexOf(this.unit)
      const timeFormatMap = this.timeFormatMap.slice(index)
      let time = this.time
      let data = {}
      timeFormatMap.map(key => {
        data[key] =
          time > this.timeUnitMap[key]
            ? parseInt(time / this.timeUnitMap[key]) || 0
            : 0
        time = time - data[key] * this.timeUnitMap[key]
      })
      return data
    },
    timer() {
      let format = this.format
      format.trim()
      for (let k in this.timeValue) {
        let ret = new RegExp('(' + k + ')').exec(format)
        let reg = new RegExp('(\\[.*' + k + '.*\\])').exec(format)
        // 如果去除匹配项等于0并被[]括着的选项 如 [DD天] hh:mm:ss  如果天数小于等于0 则将其去掉 变为hh:mm:ss
        if (reg) {
          format = format.replace(
            reg[0],
            this.timeValue[k] <= 0 ? '' : reg[0].replace(/(^\[|\]$)/g, '')
          )
          format.trim()
        }
        if (ret) {
          format = format.replace(
            ret[1],
            ret[1].length == 1 && !this.singleFormat.includes(k)
              ? this.timeValue[k]
              : (this.timeValue[k] || 0).toString().padStart(ret[1].length, '0')
          )
        }
      }
      return format
    }
  },
  watch: {
    // value 发生变更重置倒计时
    value: {
      handler(newVal, oldVal) {
        if (newVal === oldVal) return
        // 取整
        this.time = Math.abs(newVal)
        this.init()
      }
    }
  },
  data() {
    return {
      timerLoop: null,
      timeFormatMap: ['Y+', 'M+', 'D+', 'h+', 'm+', 's+', 'fs', 'ds', 'ms'],
      // 不需要补0的单位
      singleFormat: ['fs', 'ds', 'ms'],
      time: 0
    }
  },
  mounted() {
    clearInterval(this.timerLoop)
    this.time = Math.abs(this.value)
    this.init()
  },
  methods: {
    init() {
      clearInterval(this.timerLoop)
      this.timerLoop = setInterval(() => {
        this.time = this.time - this.sp
        if (this.time <= 0) {
          clearInterval(this.timerLoop)
          this.$emit('end')
        }
      }, this.sp)
    }
  },
  beforeDestroy() {
    clearInterval(this.timerLoop)
  }
}
</script>
