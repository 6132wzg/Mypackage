<template>
  <st-panel>
    <discount-form
      v-model="formValue"
      :form="form"
      :formCheck="formCheck"
      :isSubmit="isSubmit"
      @change="onChange"
      @submit="onSubmit"
    >
      <st-form-item labelFix>
        <st-button
          type="primary"
          :loading="loading.addDiscount || formCheck.loading"
          @click="onSave"
        >
          保存
        </st-button>
      </st-form-item>
    </discount-form>
  </st-panel>
</template>
<script>
import DiscountForm from './components#/discount-form.vue'
import { AddService } from './add.service'
import { pick } from 'lodash'

export default {
  name: 'BrandAppPluginDiscountAdd',
  bem: {
    b: 'brand-app-plugin-discount-add'
  },
  components: {
    DiscountForm
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
    onChange(e) {
      console.log('add-formValue-change', e, { ...this.formValue })
    },
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
          .addDiscount({ ...this.formValue, ...formValue })
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
