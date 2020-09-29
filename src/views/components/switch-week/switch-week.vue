<template>
  <div :class="b()">
    <st-button @click="onClickPre" width="32px" :disabled="startDisabled">
      <a-icon type="left" />
    </st-button>

    <span :class="b('text-content')">{{ rangeTime }}</span>

    <st-button @click="onClickNext" width="32px" :disabled="endDisabled">
      <a-icon type="right" />
    </st-button>
  </div>
</template>
<script>
export default {
  name: 'StSwitchWeek',

  bem: {
    b: 'st-switch-week'
  },
  props: {
    startDate: {
      type: String
    },
    limitStartDate: {
      type: String,
      default: moment()
        .subtract(moment().format('E') - 1, 'days')
        .format('YYYY-MM-DD')
    },
    limitWeeks: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      startTime: '',
      rangeTime: ''
    }
  },
  created() {
    let weekOfday = moment().format('E') // 今天是本周第几天
    let mondayTime = moment()
      .subtract(weekOfday - 1, 'days')
      .format('YYYY-MM-DD') // 周一日期
    this.startTime = this.startDate ? this.startDate : mondayTime
  },
  computed: {
    startDisabled() {
      let preStarDate = moment(this.startTime)
        .subtract(7, 'days')
        .format('YYYY-MM-DD')
      return moment(preStarDate) < moment(this.limitStartDate)
    },
    endDisabled() {
      let nextStartDate = moment(this.startTime)
        .add(7, 'days')
        .format('YYYY-MM-DD')
      let nextLimitStartDate = moment(this.limitStartDate)
        .add((this.limitWeeks - 1) * 7, 'days')
        .format('YYYY-MM-DD')
      return moment(nextStartDate) > moment(nextLimitStartDate)
    },
    endTime() {
      return moment(this.startTime)
        .add(6, 'days')
        .format('YYYY-MM-DD')
    }
  },

  watch: {
    startTime() {
      let start = moment(this.startTime).format('YYYY/MM/DD')
      let end = moment(this.endTime).format('YYYY/MM/DD')
      this.rangeTime = `${start}~${end}`
    }
  },
  methods: {
    onClickPre() {
      this.startTime = moment(this.startTime)
        .subtract(7, 'days')
        .format('YYYY-MM-DD')
      this.$emit('pre', {
        start_date: this.startTime,
        end_date: this.endTime
      })
    },
    onClickNext() {
      this.startTime = moment(this.startTime)
        .add(7, 'days')
        .format('YYYY-MM-DD')
      this.$emit('next', {
        start_date: this.startTime,
        end_date: this.endTime
      })
    }
  }
}
</script>
