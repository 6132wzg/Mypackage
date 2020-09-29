<template>
  <st-form-item :labelGutter="labelGutter" required>
    <template slot="label">
      合同编号
      <st-help-tooltip id="TSSD001" />
    </template>
    <div v-show="isEdit">
      <a-input
        style="width: 240px"
        placeholder="请输入合同编号"
        v-decorator="decorators.contract_number"
        @change="onChange"
      />
      <st-button class="mg-l8" @click="onConfirm">确定</st-button>
    </div>
    <div v-show="!isEdit">
      {{ value }}
      <st-button class="mg-l8" @click="onEdit">编辑</st-button>
    </div>
  </st-form-item>
</template>
<script>
import { ruleOptions } from './editable-contract-number.config'
export default {
  props: {
    value: {
      type: String,
      required: true,
      default: ''
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    labelGutter: {
      type: String,
      default: '24px'
    }
  },
  data() {
    return {
      isEdit: false,
      contractNumber: ''
    }
  },
  watch: {
    value(val) {
      this.setContractNumber(val)
    }
  },
  computed: {
    ruleOptions,
    decorators() {
      return this.form.addDecorators(this.ruleOptions)
    }
  },
  methods: {
    setContractNumber(val = '') {
      this.form.setFieldsValue({
        contract_number: val
      })
      this.contractNumber = val
    },
    onEdit() {
      this.isEdit = true
    },
    onConfirm() {
      this.form.validateFields(['contract_number']).then(() => {
        this.isEdit = false
        this.$emit('ok', this.contractNumber)
      })
    },
    onChange(e) {
      const contractNumber = e.target.value
      this.setContractNumber(contractNumber)
      this.$emit('input', contractNumber)
      this.$emit('change', contractNumber)
    }
  }
}
</script>
