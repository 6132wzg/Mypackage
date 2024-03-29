<template>
  <div class="st-range-picker">
    <a-date-picker
      :disabled="startOptions.disabled"
      :disabledDate="disabledStartDate"
      :disabledTime="startOptions.disabledDateTime"
      :showTime="startOptions.showTime"
      :placeholder="startOptions.placeholder"
      :format="startOptions.format"
      v-model="startValue"
      @openChange="handleStartOpenChange"
      v-bind="{
        ...(useBodyContainer
          ? {}
          : {
              getCalendarContainer: triggerNode => {
                return triggerNode.parentNode
              }
            })
      }"
    />
    &nbsp;~&nbsp;
    <a-date-picker
      :disabled="endOptions.disabled"
      :disabledDate="disabledEndDate"
      :disabledTime="endOptions.disabledDateTime"
      :showTime="endOptions.showTime"
      :placeholder="endOptions.placeholder"
      :format="endOptions.format"
      v-model="endValue"
      :open="endOpen"
      @openChange="handleEndOpenChange"
      v-bind="{
        ...(useBodyContainer
          ? {}
          : {
              getCalendarContainer: triggerNode => {
                return triggerNode.parentNode
              }
            })
      }"
    />
  </div>
</template>

<script>
import { merge } from 'lodash-es'
export default {
  name: 'StRangePicker',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    /**
     * 模型值，使用[YYYY-MM-DD,YYYY-MM-DD]
     */
    value: {
      type: Array
    },
    disabledDays: {
      type: [Number, String],
      default: 0
    },
    options: {
      type: Object,
      default: () => ({
        start: {
          // ...
        },
        end: {
          // ...
        }
      })
    },
    // useBodyContainer 是否使用body作为父级定位，默认为组件父级定位
    useBodyContainer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      endOpen: false
    }
  },
  computed: {
    startOptions() {
      return merge(
        {
          showTime: false,
          disabledBegin: null,
          disabledDateTime: undefined,
          placeholder: '开始日期',
          disabled: false,
          format: 'YYYY-MM-DD'
        },
        this.options.start
      )
    },
    endOptions() {
      return merge(
        {
          showTime: false,
          disabledDate: undefined,
          disabledDateTime: undefined,
          placeholder: '结束日期',
          disabled: false,
          format: 'YYYY-MM-DD'
        },
        this.options.end
      )
    },
    startValue: {
      get() {
        if (!this.value || !this.value[0]) {
          return null
        }
        return moment(this.value[0])
      },
      set(newVal) {
        this.$emit('change', [newVal, this.endValue])
      }
    },
    endValue: {
      get() {
        if (!this.value || !this.value[1]) {
          return null
        }
        return moment(this.value[1])
      },
      set(newVal) {
        this.$emit('change', [this.startValue, newVal])
      }
    }
  },
  methods: {
    disabledStartDate(newStartValue) {
      if (this.startOptions.disabledBegin) {
        return (
          newStartValue.valueOf() <
          moment(this.startOptions.disabledBegin).valueOf()
        )
      }
      if (!newStartValue || !this.endValue) {
        return false
      }
      return newStartValue.valueOf() > this.endValue.valueOf()
    },
    disabledEndDate(newEndValue) {
      if (!newEndValue || !this.startValue) {
        return false
      }
      if (+this.disabledDays > 0) {
        return (
          moment(this.startValue)
            .add(+this.disabledDays, 'days')
            .valueOf() < newEndValue.valueOf() ||
          moment(this.startValue).valueOf() > newEndValue.valueOf()
        )
      }
      if (moment(this.startValue).valueOf() > newEndValue.valueOf()) {
        return true
      }
      if (this.endOptions.disabledDate) {
        return this.endOptions.disabledDate(newEndValue, [
          this.startValue,
          newEndValue
        ])
      }
      return false
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    }
  }
}
</script>
