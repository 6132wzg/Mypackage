<template>
  <st-panel>
    <seckill-form
      v-model="formValue"
      :form="form"
      :formCheck="formCheck"
      :isSubmit="isSubmit"
      @submit="onSubmit"
    >
      <st-form-item labelFix>
        <st-button
          type="primary"
          :loading="loading.addSeckill || formCheck.loading"
          @click="onSave"
        >
          保存
        </st-button>
      </st-form-item>
    </seckill-form>
  </st-panel>
</template>
<script>
import SeckillForm from './components#/seckill-form.vue'
import { ruleOptions } from './components#/seckill-form.config'
import { AddService } from './add.service'
import { pick } from 'lodash'

export default {
  name: 'BrandAppPluginSeckillAdd',
  bem: {
    b: 'brand-app-plugin-seckill-add'
  },
  components: {
    SeckillForm
  },
  serviceInject() {
    return {
      service: AddService
    }
  },
  rxState() {
    return {
      loading: this.service.loading$
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      isSubmit: 0,
      formCheck: {
        loading: false
      },
      formValue: {
        activity_name: '',
        product_type: 1,
        product_id: '',
        limit_course_num: 1,
        discount_info: [], // {product_sku_id,  discount_price}
        start_time: null,
        end_time: null,
        is_limit_stock: 0,
        stock_num: 0,
        is_limit_buy: 0,
        buy_num: 0,
        is_virtual_spike: 0,
        virtual_spike_time: null,
        description: ''
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log('add-watch-formValue-change', { ...this.formValue })
      this.form.setFieldsValue({
        product_type: this.formValue.product_type
      })
    })
  },
  methods: {
    // 触发提交
    onSave() {
      this.isSubmit++
    },
    // 提交请求
    onSubmit(formValue, formCheck) {
      console.log('校验结果', formCheck)
      console.log('表单数据', { ...this.formValue }, { ...formValue })
      if (formCheck.isPass) {
        this.service
          .addSeckill({ ...this.formValue, ...formValue })
          .subscribe(() => {
            this.$router.push({
              path: './list'
            })
          })
      }
    }
  }
}
</script>
