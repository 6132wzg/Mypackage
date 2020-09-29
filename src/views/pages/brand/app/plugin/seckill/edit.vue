<template>
  <st-panel>
    <seckill-form
      isEdit
      v-model="formValue"
      :formCheck="formCheck"
      :form="form"
      :isSubmit="isSubmit"
      @change="onChange"
      @submit="onSubmit"
    >
      <st-form-item labelFix>
        <st-button
          type="primary"
          :loading="loading.editSeckill || formCheck.loading"
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
import { EditService } from './edit.service'
import { pick, isEqual } from 'lodash'
import moment from 'moment'

export default {
  name: 'BrandAppPluginSeckillEdit',
  bem: {
    b: 'brand-app-plugin-seckill-edit'
  },
  components: {
    SeckillForm
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
  computed: {
    formValue() {
      return this.info
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
  watch: {
    formValue: {
      handler(newVal, oldVal) {
        if (isEqual(newVal, oldVal)) return
        this.$nextTick(() => {
          this.form.setFieldsValue({
            ...pick(newVal, [
              'activity_name',
              'product_type',
              'product_id',
              'limit_course_num',
              'stock_num',
              'buy_num'
            ]),
            spike_time: newVal.virtual_spike_time
              ? moment(newVal.virtual_spike_time)
              : null,
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
    onChange(e) {
      console.log('info-change', e, { ...this.info })
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
          .editSeckill({ ...this.formValue, ...formValue })
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
