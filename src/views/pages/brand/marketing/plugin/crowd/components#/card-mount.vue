<template>
  <div :class="bCardMount()">
    <title-info v-model="titleData"></title-info>
    <div :class="bCardMount('content')">
      <span class="mg-r16">剩余金额</span>
      <input-number
        v-model="value.getData.deposit_remain_money"
        :company="'元'"
        :minMax="{ min: 0, max: 100000 }"
      ></input-number>
    </div>
  </div>
</template>
<script>
import inputNumber from './input-number.vue'
import titleInfo from './title-info.vue'
export default {
  bem: {
    bCardMount: 'crowd-component-card-mount'
  },
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
      titleData: {
        title: '储值卡剩余金额',
        info: '储值卡剩余金额在以下范围的用户'
      },
      inputnumber2: '',
      inputnumber1: ''
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
