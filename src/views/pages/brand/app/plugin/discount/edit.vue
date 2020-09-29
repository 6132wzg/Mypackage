<template>
  <st-panel>
    <discount-form
      isEdit
      v-model="formValue"
      :form="form"
      :formCheck="formCheck"
      :isSubmit="isSubmit"
      @submit="onSubmit"
    >
      <st-form-item labelFix>
        <st-button
          type="primary"
          :loading="loading.editDiscount || formCheck.loading"
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
import { ruleOptions } from './components#/discount-form.config'
import { EditService } from './edit.service'
import { pick, isEqual } from 'lodash'
import moment from 'moment'

export default {
  name: 'BrandAppPluginDiscountEdit',
  bem: {
    b: 'brand-app-plugin-discount-edit'
  },
  components: {
    DiscountForm
  },
  serviceInject() {
    return {
      service: EditService
    }
  },
  rxState() {
    return {
      loading: this.service.loading$,
      info: this.service.info$
    }
  },
  data() {
    const form = this.$stForm.create()
    return {
      form,
      formCheck: {
        loading: false
      },
      isSubmit: 0
    }
  },
  computed: {
    formValue() {
      return this.info
    }
  },
  watch: {
    formValue: {
      handler(newVal, oldVal) {
        if (isEqual(newVal, oldVal)) return
        this.$nextTick(() => {
          console.log('edit-watch-formValue-change', { ...newVal })
          this.form.setFieldsValue({
            ...pick(newVal, [
              'activity_name',
              'product_type',
              'product_id',
              'limit_course_num',
              'stock_num',
              'buy_num'
            ]),
            dateRange: [newVal.start_time, newVal.end_time]
          })
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
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
          .editDiscount({ ...this.formValue, ...formValue })
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
