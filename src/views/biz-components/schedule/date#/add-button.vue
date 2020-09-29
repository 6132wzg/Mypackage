<template>
  <div @click="onClick" class="add-schedule-button">
    <div class="icon mg-b8">
      <st-icon type="add"></st-icon>
    </div>
    <slot>{{ title }}</slot>
  </div>
</template>

<script>
import { TIME_UNIT } from '@/constants/course/team'
export default {
  name: 'AddButton',
  data() {
    return {
      TIME_UNIT
    }
  },
  props: {
    title: {
      type: String,
      defalut: '新增课程排期'
    },
    date: {
      type: Object,
      default: () => {
        return {}
      }
    },
    time: {
      type: Number,
      default: 0
    }
  },
  computed: {
    cDate() {
      let tempTime = ''
      let weekOfday = moment(this.date.date).format('E')
      // 日期选择的是‘日’时候，不用减多少天
      let tempDate =
        this.$searchQuery.time_unit === this.TIME_UNIT.TIME_DAY
          ? moment(this.date.date).format('YYYY-MM-DD')
          : moment(this.date.date)
              .subtract(weekOfday - this.date.week, 'days')
              .format('YYYY-MM-DD')
      tempTime = `0${this.time - 1}:00`
      tempTime = tempTime.slice(tempTime.length - 5)
      return moment(`${tempDate} ${tempTime}`)
    }
  },
  methods: {
    onClick() {
      this.$emit('change', this.cDate)
    }
  }
}
</script>
