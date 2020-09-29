<template>
  <span>
    <a-radio-group @change="onChangeRadio" v-model="radioValue">
      <a-radio-button
        v-for="(item, index) in timeList"
        :key="index"
        :value="item.value"
      >
        {{ item.name }}
      </a-radio-button>
    </a-radio-group>
    <a-range-picker
      v-if="radioValue === -1"
      @change="onChange"
      :format="format"
      :value="
        value.min ? [moment(value.min, format), moment(value.max, format)] : []
      "
      style="margin-left:8px;margin-top:8px;"
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
    timeList: {
      type: Array,
      default: () => {
        return [
          { value: 7, name: '未来7天' },
          { value: 30, name: '未来30天' },
          { value: 90, name: '未来90天' },
          { value: -1, name: '自定义' }
        ]
      }
    },
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
      this.radioText = this.timeList.find(
        item => item.value === this.radioValue
      ).name
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
  },
  mounted() {}
}
</script>
