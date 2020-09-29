<template>
  <st-form class="mg-t8" :form="form" labelWidth="125px">
    <st-form-item required label="活动名称">
      <st-input
        v-decorator="decorators.activity_name"
        placeholder="请输入活动名称"
        style="width: 470px"
        @change="formValueChange('activity_name', $event, formValue)"
        :maxLength="30"
      ></st-input>
    </st-form-item>
    <!-- 商品选择、商品优惠设置 -->
    <product-setting
      discountPriceLabel="秒杀价(元)"
      v-model="formValue"
      :formCheck="formCheck"
      :decorators="decorators"
      :form="form"
      :isEdit="isEdit"
      :isSubmit="isSubmit"
      @submit="onSubmit"
    ></product-setting>
    <st-form-item required label="活动时间">
      <st-range-picker
        v-decorator="decorators.dateRange"
        :options="{
          start: {
            showTime: {
              format: 'HH:mm:ss'
            },
            format: 'YYYY-MM-DD HH:mm:ss'
          },
          end: {
            showTime: {
              format: 'HH:mm:ss'
            },
            format: 'YYYY-MM-DD HH:mm:ss',
            disabledDateTime: disabledEndTime
          }
        }"
        @change="formValueChange('dateRange', $event)"
      />
    </st-form-item>
    <st-form-item label="活动库存">
      <a-checkbox v-model="isLimitStock">限制库存</a-checkbox>
      <st-input-number
        style="width: 150px"
        class="mg-l12"
        v-decorator="decorators.stock_num"
        :min="1"
        :max="99999"
        :disabled="!formValue.is_limit_stock"
        @change="formValueChange('stock_num', $event, formValue)"
      ></st-input-number>
    </st-form-item>
    <st-form-item label="单人购买限制">
      <a-checkbox v-model="isLimitBuy">限制购买</a-checkbox>
      <st-input-number
        style="width: 150px;padding: 0;"
        class="mg-l12"
        v-decorator="decorators.buy_num"
        :min="1"
        :max="999"
        :disabled="!formValue.is_limit_buy"
        @change="formValueChange('buy_num', $event, formValue)"
      >
        <span slot="addonAfter">笔订单</span>
      </st-input-number>
    </st-form-item>
    <st-form-item label="虚拟秒杀">
      <a-checkbox v-model="isVirtualSpike">到点自动抢光</a-checkbox>
      <a-date-picker
        :style="{ padding: 0, marginLeft: '8px' }"
        placeholder="请选择时间"
        format="YYYY-MM-DD HH:mm:ss"
        v-decorator="decorators.spike_time"
        :disabledDate="disabledVirDate"
        :disabledTime="disabledVirTime"
        :showTime="true"
        :showToday="false"
        :disabled="!formValue.is_virtual_spike"
        @change="formValueChange('spike_time', $event)"
      />
    </st-form-item>
    <st-form-item label="备注">
      <st-textarea
        style="min-width: 540px"
        placeholder="备注内容仅商家可见"
        v-model="formValue.description"
        :autosize="{ minRows: 2, maxRows: 3 }"
        :maxlength="200"
      ></st-textarea>
    </st-form-item>
    <slot></slot>
  </st-form>
</template>
<script>
import ProductSetting from '../../components#/product-setting.vue'
import FormMixin from '../../components#/form.mixin'
import { merge } from 'lodash'
import moment from 'moment'

import { ruleOptions } from './seckill-form.config'
export default {
  name: 'BrandAppPluginSeckillAdd',
  mixins: [FormMixin],
  bem: {
    b: 'brand-app-plugin-seckill-add'
  },
  components: {
    ProductSetting
  },
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  // 数据源与表单数据之间格式转换
  computed: {
    decorators() {
      return this.form.decorators(ruleOptions)
    },
    startTime: {
      get() {
        return this.formValue.start_time
          ? moment(this.formValue.start_time)
          : undefined
      },
      set(value) {
        this.formValue.start_time = value.format('YYYY-MM-DD HH:mm:ss')
      }
    },
    endTime: {
      get() {
        return this.formValue.end_time
          ? moment(this.formValue.end_time)
          : undefined
      },
      set(value) {
        this.formValue.end_time = value.format('YYYY-MM-DD HH:mm:ss')
      }
    },
    spike_time: {
      get() {
        return this.formValue.virtual_spike_time
          ? moment(this.formValue.virtual_spike_time)
          : null
      },
      set(value) {
        this.formValue.virtual_spike_time = value.format('YYYY-MM-DD HH:mm:ss')
      }
    },
    isLimitStock: {
      get() {
        return this.formValue.is_limit_stock ? true : false
      },
      set(value) {
        this.formValue.is_limit_stock = value ? 1 : 0
        this.$nextTick(() => {
          if (!value) {
            this.form.validateFields(['stock_num'], { force: true })
            this.form.setFieldsValue({ stock_num: 0 })
          }
        })
      }
    },
    isLimitBuy: {
      get() {
        return this.formValue.is_limit_buy ? true : false
      },
      set(value) {
        this.formValue.is_limit_buy = value ? 1 : 0
        this.$nextTick(() => {
          if (!value) {
            this.form.validateFields(['buy_num'], { force: true })
            this.form.setFieldsValue({ buy_num: 0 })
          }
        })
      }
    },
    isVirtualSpike: {
      get() {
        return this.formValue.is_virtual_spike ? true : false
      },
      set(value) {
        this.formValue.is_virtual_spike = value ? 1 : 0
        value || this.form.validateFields(['spike_time'], { force: true })
      }
    },
    dateRange: {
      get() {
        const start = this.formValue.start_time
          ? moment(this.formValue.start_time)
          : undefined
        const end = this.formValue.end_time
          ? moment(this.formValue.end_time)
          : undefined
        return [start, end]
      },
      set(value) {
        console.log(value)
        this.formValue.start_time = value[0]
          ? value[0].format('YYYY-MM-DD HH:mm:ss')
          : undefined
        this.formValue.end_time = value[1]
          ? value[1].format('YYYY-MM-DD HH:mm:ss')
          : undefined
      }
    }
  },
  mounted() {},
  methods: {
    moment,
    // 自定义的数据格式校验
    validate() {
      return new Promise((resolve, reject) => {
        this.form.validateFieldsAndScroll({ force: true }, (err, values) => {
          resolve(!err)
        })
      })
    },
    dateRangeCheck() {
      if (!this.formValue.start_time || !this.formValue.end_time) {
        this.messageError({ content: '请设置活动时间' })
        return false
      }
      return true
    },
    virDateCheck() {
      if (
        moment(this.formValue.virtual_spike_time).valueOf() <=
          moment(this.formValue.start_time).valueOf() ||
        moment(this.formValue.virtual_spike_time).valueOf() >=
          moment(this.formValue.end_time).valueOf()
      ) {
        this.messageError({ content: '秒杀时间必须在活动时间范围内' })
        return false
      }
      return true
    },
    buyCheck() {
      if (this.formValue.is_limit_buy === 1 && this.formValue.buy_num <= 0) {
        this.messageError({ content: '请设置单人购买笔数' })
        return false
      }
      return true
    },
    stockCheck() {
      if (
        this.formValue.is_limit_stock === 1 &&
        this.formValue.stock_num <= 0
      ) {
        this.messageError({ content: '请设置活动库存' })
        return false
      }
      return true
    },
    // 以下方法为 时间范围控制
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    // disabledEndDate(newEndValue) {
    //   return newEndValue.format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')
    // },
    disabledEndTime() {
      let hour = 0
      let min = 0
      let sec = 0
      if (
        moment(this.formValue.start_time).format('YYYY-MM-DD') ===
        moment(this.formValue.end_time).format('YYYY-MM-DD')
      ) {
        hour = moment(this.formValue.start_time).hours()
        if (
          moment(this.formValue.start_time).format('YYYY-MM-DD HH') ===
          moment(this.formValue.end_time).format('YYYY-MM-DD HH')
        ) {
          min = moment(this.formValue.start_time).minutes()
        }
        if (
          moment(this.formValue.start_time).format('YYYY-MM-DD HH:mm') ===
          moment(this.formValue.end_time).format('YYYY-MM-DD HH:mm')
        ) {
          sec = moment(this.formValue.start_time).seconds() + 1
        }
      }
      return {
        disabledHours: () => this.range(0, hour),
        disabledMinutes: () => this.range(0, min),
        disabledSeconds: () => this.range(0, sec)
      }
    },
    disabledVirDate(current) {
      return (
        current.format('YYYY-MM-DD') <
          moment(this.formValue.start_time).format('YYYY-MM-DD') ||
        current.format('YYYY-MM-DD') >
          moment(this.formValue.end_time).format('YYYY-MM-DD')
      )
    },
    disabledVirTime() {
      let hour = 0
      let min = 0
      let sec = 0
      if (
        moment(this.formValue.start_time).format('YYYY-MM-DD') ===
        moment(this.formValue.virtual_spike_time).format('YYYY-MM-DD')
      ) {
        hour = moment(this.formValue.start_time).hours()
        if (
          moment(this.formValue.start_time).format('YYYY-MM-DD HH') ===
          moment(this.formValue.virtual_spike_time).format('YYYY-MM-DD HH')
        ) {
          min = moment(this.formValue.start_time).minutes()
        }
        if (
          moment(this.formValue.start_time).format('YYYY-MM-DD HH:mm') ===
          moment(this.formValue.virtual_spike_time).format('YYYY-MM-DD HH:mm')
        ) {
          sec = moment(this.formValue.start_time).seconds() + 1
        }
        return {
          disabledHours: () => this.range(0, hour),
          disabledMinutes: () => this.range(0, min),
          disabledSeconds: () => this.range(0, sec)
        }
      }
      if (
        moment(this.formValue.end_time).format('YYYY-MM-DD') ===
        moment(this.formValue.virtual_spike_time).format('YYYY-MM-DD')
      ) {
        ;(hour = 24), (min = 60), (sec = 60)
        hour = moment(this.formValue.end_time).hours() + 1
        if (
          moment(this.formValue.end_time).format('YYYY-MM-DD HH') ===
          moment(this.formValue.virtual_spike_time).format('YYYY-MM-DD HH')
        ) {
          min = moment(this.formValue.end_time).minutes() + 1
        }
        if (
          moment(this.formValue.end_time).format('YYYY-MM-DD HH:mm') ===
          moment(this.formValue.virtual_spike_time).format('YYYY-MM-DD HH:mm')
        ) {
          sec = moment(this.formValue.end_time).seconds()
        }
        return {
          disabledHours: () => this.range(hour, 24),
          disabledMinutes: () => this.range(min, 60),
          disabledSeconds: () => this.range(sec, 60)
        }
      }
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
        disabledSeconds: () => []
      }
    }
  }
}
</script>
