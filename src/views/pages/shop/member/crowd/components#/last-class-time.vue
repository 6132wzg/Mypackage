<template>
  <div>
    <title-info v-model="titleData"></title-info>
    <span style="margin-right:16px">选择时间</span>
    <time-day
      v-model="value.getData.last_course_time"
      :timeList="timeList"
    ></time-day>
  </div>
</template>
<script>
import timeDay from './time-day'
import titleInfo from './title-info.vue'
export default {
  props: {
    value: Object
  },
  components: {
    titleInfo,
    timeDay
  },
  data() {
    return {
      titleData: {
        title: '最后一次上课时间',
        info: '选择自然日内，最后一次上课的用户'
      },
      timeList: [
        { value: 7, name: ' 近7天' },
        { value: 15, name: '近15天' },
        { value: 30, name: '近30天' },
        { value: -1, name: '自定义' }
      ]
    }
  },
  methods: {},
  mounted() {}
}
</script>
