<template>
  <div>
    <title-info v-model="titleData"></title-info>
    <div class="mg-b24">
      <span class="mg-r16" style="width:60px">选择时间</span>
      <time-day
        v-model="value.getData.member_course_times.select_time"
        :timeList="timeList"
      ></time-day>
    </div>
    <div style="display: flex;align-items: center;">
      <span style="margin-right:16px; width: 60px">节数</span>
      <input-number
        v-model="value.getData.member_course_times.range"
        :company="'次'"
        :minMax="{ min: 0, max: 1000 }"
      ></input-number>
    </div>
  </div>
</template>
<script>
import inputNumber from './input-number.vue'
import titleInfo from './title-info.vue'
import timeDay from './time-day'

export default {
  props: {
    value: Object
  },
  components: {
    titleInfo,
    inputNumber,
    timeDay
  },
  data() {
    return {
      titleData: {
        title: '上课节数',
        info: '在以下时间范围内，用户的上课节数'
      },
      timeList: [
        { value: 7, name: ' 近7天' },
        { value: 15, name: '近15天' },
        { value: 30, name: '近30天' },
        { value: -1, name: '自定义' }
      ]
    }
  }
}
</script>
