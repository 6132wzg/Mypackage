<template>
  <!-- 支持售卖时间 -->
  <div class="biz-package-form__sale-time">
    <st-form-item
      :label="label"
      :labelWidth="labelWidth || '148px'"
      :required="isForever"
    >
      <a-radio-group
        @change="onChange"
        v-decorator="decorators.is_permanent_sale"
      >
        <a-radio
          v-for="item of buyTimeTypeOptions"
          :key="item.value"
          :value="item.value"
        >
          <span>{{ item.label }}</span>
        </a-radio>
      </a-radio-group>
    </st-form-item>
    <template v-if="isForever">
      <div>
        <st-form-item class="input-number-pd0" label="">
          <a-range-picker
            class="mg-l8"
            v-decorator="decorators.sale_time"
            :disabledDate="disabledDate"
            :format="dateFormat"
          />
        </st-form-item>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'BuyTimeFormItem',
  data() {
    return {
      FOREVER: 1,
      RANGE_TINE: 0,
      dateFormat: 'YYYY-MM-DD',
      isForever: false
    }
  },
  props: {
    decorators: {
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      default: '支持售卖时间'
    },
    labelWidth: {
      type: String,
      default: ''
    }
  },
  computed: {
    buyTimeTypeOptions() {
      return [
        { label: '永久售卖', value: this.FOREVER },
        { label: '限时售卖', value: this.RANGE_TINE }
      ]
    }
  },
  methods: {
    disabledDate(current) {
      // 不使用format就是毫秒比较，就选择不了当天了
      return (
        moment().format(this.dateFormat) >
        moment(current).format(this.dateFormat)
      )
    },
    onChange(event) {
      this.isForever = event.target.value === this.RANGE_TINE
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.isForever = !this.decorators.is_permanent_sale[1].initialValue
    })
  }
}
</script>
