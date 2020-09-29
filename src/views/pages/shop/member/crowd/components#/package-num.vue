<template>
  <div>
    <title-info v-model="titleData"></title-info>
    <div style="display: flex;align-items: center;">
      <span style="margin-right:16px">剩余次数</span>
      <input-number
        v-model="value.getData.package_remain_times"
        :company="'次'"
        :minMax="{ min: 0, max: 1000 }"
      ></input-number>
    </div>
  </div>
</template>
<script>
import inputNumber from './input-number.vue'
import titleInfo from './title-info.vue'
export default {
  props: {
    value: Object
  },
  components: {
    titleInfo,
    inputNumber
  },
  data() {
    return {
      titleData: {
        title: '课程包剩余次数',
        info: '课程包剩余次数在以下范围的用户'
      }
    }
  },
  methods: {},
  mounted() {}
}
</script>
