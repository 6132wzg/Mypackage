<template>
  <span>
    <a-radio-group @change="onChangeRadio" v-model="radioValue">
      <a-radio-button :value="7">未来7天</a-radio-button>
      <a-radio-button :value="30">未来30天</a-radio-button>
      <a-radio-button :value="90">未来90天</a-radio-button>
      <a-radio-button :value="-1">自定义</a-radio-button>
    </a-radio-group>
    <a-range-picker
      v-if="radioValue === -1"
      @change="onChange"
      :format="format"
      :value="
        value.min ? [moment(value.min, format), moment(value.max, format)] : []
      "
      class="mg-r8 mg-t8"
      :allowClear="true"
      :disabledDate="disabledDate"
    />
  </span>
</template>
<script>
import moment from 'moment'
export default {
  model: {
    type: 'value',
    event: 'dataChangge'
  },
  props: {
    value: Object,
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    }
  },
  data() {
    return {
      radioValue: '',
      radioText: ''
    }
  },
  created() {
    if (this.value) {
      this.radioValue = this.value.value
    }
  },
  methods: {
    moment,
    onChangeRadio(data) {
      if (this.radioValue === 7) {
        this.radioText = '未来7天'
      } else if (this.radioValue === 30) {
        this.radioText = '未来30天'
      } else if (this.radioValue === 90) {
        this.radioText = '未来90天'
      } else if (this.radioValue === -1) {
        this.radioText = '自定义'
      } else {
        this.radioText = ''
      }
      this.value.min = ''
      this.value.max = ''
      this.value.name = this.radioText
      this.value.value = this.radioValue
    },
    onChange(data, str) {
      this.value.min = str[0]
      this.value.max = str[1]
    },
    disabledDate(endDate) {
      return (
        endDate.format('YYYY-MM-DD') <
        moment()
          // .subtract(1, 'd')
          .format('YYYY-MM-DD')
      )
    }
  }
}
</script>
