<template>
  <div>
    <title-info v-model="titleData"></title-info>
    <div style="display: flex;align-items: center;">
      <span style="margin-right:16px">剩余次数</span>
      <input-number
        v-model="value.getData.member_card_remain_times"
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
  model: {
    type: 'value',
    event: 'dataChangge'
  },
  props: {
    value: Object
  },
  components: {
    titleInfo,
    inputNumber
  },
  data() {
    return {
      inputnumber2: '',
      inputnumber1: '',
      titleData: {
        title: `${this.$c('member_card')}剩余次数`,
        info: `${this.$c('member_card')}剩余次数在以下范围的用户`
      }
    }
  },
  methods: {
    selectionFun(item) {
      this.value.selectionData = item
    },
    onChange(date, dateString) {
      console.log(date, dateString)
      this.$emit('dataChangge', this.value)
    }
  },
  mounted() {}
}
</script>
