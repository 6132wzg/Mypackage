<template>
  <div :class="b()">
    <a-radio-group v-model="recent">
      <a-radio-button
        v-for="item in days"
        :value="item.value || item"
        :key="item.value || item"
      >
        {{ item.label || label.replace('$', item) }}
      </a-radio-button>
    </a-radio-group>
    <a-range-picker
      v-if="showRangePicker"
      :class="[b('range'), { active: !recent }]"
      @change="recentChange"
      v-model="dateRange"
      v-bind="$attrs"
      :disabledDate="disabledDate"
      @calendarChange="calendarChange"
    />
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'StRecentRadioGroup',
  bem: {
    b: 'st-recent-radio-group'
  },
  props: {
    // radio的文案自定义
    label: {
      type: String,
      default: '近$天'
    },
    /**
     * type、unit、showBtnRangeDate 三个参数用于 当选择radio枚举时 在rangepiker里展示 当前选项的日期范围
     * showBtnRangeDate 是否展示枚举范围
     * type 可设置 subtract、add 分别代表 日期往前推算、日期往后推算
     * unit 可设置 days、 months、 weeks、years 等 代表日期推算的单位
     */
    type: {
      type: String,
      default: 'subtract'
    },
    unit: {
      type: String,
      default: 'days'
    },
    showBtnRangeDate: {
      type: Boolean,
      default: true
    },
    // 日期选择范围限定，默认不限制日期选择范围，单位固定为 天(days)
    range: {
      type: [Number, Boolean],
      default: 180
    },
    disabledNow: {
      type: Boolean,
      default: false
    },
    // 是否展示时间范围选择组件
    showRangePicker: {
      type: Boolean,
      default: true
    },
    days: {
      type: Array,
      default: () => {
        return [7, 30, 90]
      }
    },
    value: {
      type: Object,
      default: () => {
        return {
          day: undefined,
          start_date: undefined,
          end_date: undefined
        }
      }
    },
    customRadioItem: {
      type: Boolean,
      default: false,
      descirption: '是否自定义筛选项名称'
    },
    defaultRecent: {
      type: Number,
      default: 7
    }
  },
  data() {
    return {
      recent: this.days[0],
      dateRange: this.showRangePicker ? this.computeDateRange(this.days[0]) : []
    }
  },
  watch: {
    recent(newValue) {
      if (newValue && newValue !== 0) {
        this.$emit('change', {
          recently_day: newValue,
          start_date: undefined,
          end_date: undefined
        })
        this.dateRange = this.computeDateRange(newValue)
      }
    }
  },
  computed: {
    cValue() {
      // value 字段转译 默认值如下， 可单独传参数设置
      const {
        _day = 'day',
        _start_date = 'start_date',
        _end_date = 'end_date'
      } = this.$attrs
      return {
        day: this.value[_day],
        start_date: this.value[_start_date],
        end_date: this.value[_end_date]
      }
    }
  },
  mounted() {
    if (this.defaultRecent) {
      this.recent = this.defaultRecent
    }
    if (this.cValue.day) {
      this.recent = this.cValue.day
      this.dateRange = this.computeDateRange(this.recent)
    }
    if (this.cValue.start_date && this.cValue.end_date) {
      this.recent = false
      this.dateRange = [
        moment(this.cValue.start_date),
        moment(this.cValue.end_date)
      ]
    }
  },
  methods: {
    moment,
    // 当选择的是radio时 的 日期范围推算
    computeDateRange(rangeDate) {
      if (this.showRangePicker && this.showBtnRangeDate) {
        let start = this.type === 'subtract' ? rangeDate : 1
        let end = this.type === 'subtract' ? 1 : rangeDate
        if (!this.disabledNow) {
          start = this.type === 'subtract' ? rangeDate - 1 : 0
          end = this.type === 'subtract' ? 0 : rangeDate - 1
        }
        return [
          moment()[this.type](start, this.unit),
          moment()[this.type](end, this.unit)
        ]
      }
      return []
    },
    // 日期面板变化时的回调
    calendarChange(val) {
      this.dateRange = val
    },
    recentChange(date, dateString) {
      this.recent = false
      this.$emit('change', {
        start_date: dateString[0],
        end_date: dateString[1],
        recently_day: undefined
      })
    },
    disabledDate(current) {
      const { dateRange, range, disabledNow, type } = this
      const start = dateRange[0]
      const end = dateRange[1]
      if (this.$attrs.disabledDate) {
        return this.$attrs.disabledDate(current, {
          range,
          dateRange,
          disabledNow,
          type
        })
      }
      if (
        range > 0 &&
        start &&
        !end &&
        (current > moment(start).add(range, 'days') ||
          current < moment(start).subtract(range, 'days'))
      ) {
        return true
      }
      if (
        type === 'subtract' &&
        current &&
        (disabledNow
          ? current.format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD')
          : current > moment())
      )
        return true
      if (
        type === 'add' &&
        current &&
        (disabledNow
          ? current.format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD')
          : current < moment())
      )
        return true
      return current && current > moment()
    }
  }
}
</script>
