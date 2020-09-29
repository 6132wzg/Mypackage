<template>
  <st-modal title="新增体态图" v-model="show" width="500px">
    <st-form :form="form" labelAuto>
      <st-form-item label="体态图名称" required>
        <a-input max="10" v-decorator="decorators.inputLabel" />
      </st-form-item>
    </st-form>
    <template slot="footer">
      <st-button @click="show = false">取消</st-button>
      <st-button
        @click="onSubmit"
        :loading="loading.addBodyLabel"
        type="primary"
      >
        确定
      </st-button>
    </template>
  </st-modal>
</template>
<script>
import { NewLableService } from './new-label.service'
import { ruleOptions } from './new-label.config'
export default {
  serviceInject() {
    return {
      Service: NewLableService
    }
  },
  rxState() {
    return {
      loading: this.Service.loading$
    }
  },
  components: {},
  name: 'newLable',
  props: {
    selectedRowData: {
      type: Array
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false
    }
  },
  methods: {
    onSubmit() {
      this.form.validate().then(values => {
        this.Service.addBodyLabel(values.inputLabel).subscribe(state => {
          this.show = false
          this.$emit('success', true)
        })
      })
    }
  }
}
</script>
