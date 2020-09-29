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
      discountPriceLabel="优惠价(元)"
      v-model="formValue"
      :formCheck="formCheck"
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
        style="width: 150px; padding: 0"
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
import { MessageService } from '@/services/message.service'
import ProductSetting from '../../components#/product-setting.vue'
import FormMixin from '../../components#/form.mixin'
import { merge } from 'lodash'
import moment from 'moment'
import { ruleOptions } from './discount-form.config'
export default {
  name: 'BrandAppPluginDiscountAdd',
  mixins: [FormMixin],
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
  serviceInject() {
    return {
      messageService: MessageService
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
        this.form.validateFieldsAndScroll((err, values) => {
          resolve(!err)
        })
      })
    },
    // 以下方法为日期选择范围控制
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
    }
  }
}
</script>
