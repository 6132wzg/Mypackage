<template>
  <div>
    <title-info v-model="titleData"></title-info>
    <span style="margin-right:16px">时间范围</span>
    <time-day-future
      v-model="value.getData.package_expiring"
      :timeList="timeList"
    ></time-day-future>
  </div>
</template>
<script>
import timeDayFuture from './time-day-future.vue'
import titleInfo from './title-info.vue'
export default {
  props: {
    value: Object
  },
  components: {
    titleInfo,
    timeDayFuture
  },
  data() {
    return {
      titleData: {
        title: '课程包即将到期',
        info: '选择自然日内，课程包即将到期的用户'
      },
      timeList: [
        { value: 7, name: '未来7天' },
        { value: 15, name: '未来15天' },
        { value: 30, name: '未来30天' },
        { value: -1, name: '自定义' }
      ]
    }
  },
  methods: {},
  mounted() {}
}
</script>
