<template>
  <div
    class="st-time-picker"
    @mounseover="onMouseOver"
    @mousedown="onMouseDown"
  >
    <template v-for="i in 49">
      <item
        @change="onChange"
        @down="onDown"
        :checkArr="checkArr"
        :views="views"
        :isDrag="isDrag"
        :isEnter="isEnter"
        :key="i"
        :time="i - 1"
      ></item>
    </template>
  </div>
</template>

<script>
import item from './time-picker-item'
import { cloneDeep } from 'lodash-es'
export default {
  name: 'StScheduleTimePicker',
  model: {
    prop: 'values',
    event: 'change'
  },
  data() {
    return {
      isDrag: false,
      isEnter: false,
      checkArr: [],
      views: []
    }
  },
  components: {
    item
  },
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    checkArr(n) {
      this.views = this.rangeTime(n).views
      this.$emit('change', this.rangeTime(n).values)
    }
  },
  methods: {
    formatTime(val) {
      let tail = val % 2 > 0 ? '30' : '00'
      let value = Math.floor(val / 2)
      return value < 10 ? `0${value}:${tail}` : `${value}:${tail}`
    },
    rangeTime(checkArr) {
      let values = []
      let start = -1
      let end = 0
      let rangeArr = []
      let views = []
      let ca = cloneDeep(checkArr)
      ca[ca.length] = false
      for (let i = 0; i < ca.length; i++) {
        if (ca[i] && start === -1) {
          start = i - 1
        }
        if (start !== -1 && ca[i]) {
          end = i
        }
        if (!ca[i] && start !== -1 && end) {
          rangeArr.push({
            start_time: `${this.formatTime(start)}`,
            end_time: `${this.formatTime(end)}`
          })
          const view = `#${start}#start---#${end}#end`
          views.push(view)
          start = -1
        }
      }
      return { values: rangeArr, views }
    },
    onMouseDown() {
      this.isDrag = true
    },
    onMouseOver() {
      this.isDrag = false
    },
    onDown(isEnter) {
      this.isEnter = isEnter
    },
    onChange(val) {
      this.$set(this.checkArr, val.time, val.isActive)
    }
  },
  mounted() {
    window.addEventListener('mouseup', () => {
      this.isDrag = false
    })
    this.$nextTick().then(() => {
      if (!this.values.length) return
      this.views = this.values.map(item => {
        const startTime = item.start_time.split(':')
        const endTime = item.end_time.split(':')
        let start =
          startTime[1] === '30' ? 2 * +startTime[0] + 1 : 2 * +startTime[0]
        let end = endTime[1] === '30' ? 2 * +endTime[0] + 1 : 2 * +endTime[0]
        for (let i = 0; i < 49; i++) {
          if (i > start && i <= end) {
            this.$set(this.checkArr, i, true)
          }
        }
        return `#${start}#start---#${end}#end`
      })
    })
  }
}
</script>
