<template>
  <div style="display: inline-block">
    <div v-show="isEdit" style="display: inline-block">
      <st-input-number
        v-model="text"
        :style="{ width: `${width}px` }"
        :placeholder="placeholder"
        :float="float"
        :max="max"
        @blur="onBlur"
      >
        <div v-if="unit" slot="addonAfter" class="st-form-item-unit">
          {{ unit }}
        </div>
      </st-input-number>
      <st-button class="mg-l8" @click="onConfirm">确定</st-button>
    </div>
    <div v-show="!isEdit" style="display: inline-block">
      {{ value }}{{ unit }}
      <st-button v-if="!disabled" class="mg-l8" @click="onEdit">编辑</st-button>
    </div>
    <div style="display: inline-block; margin-left: -24px">
      <a-form-item>
        <st-input v-show="false" v-decorator="decorators[`${key}`]" />
      </a-form-item>
    </div>
  </div>
</template>
<script>
import { ruleOptions } from './editable-number.config'
export default {
  name: 'EditableNumber',
  props: {
    value: {
      type: [String, Number],
      required: true,
      default: ''
    },
    unit: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入价格'
    },
    float: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    width: {
      type: Number,
      default: 240
    },
    max: {
      type: Number,
      default: 999999.9
    }
  },
  data() {
    // 增加随机key，避免同表单重复引用，导致错误提示重复
    const r = Math.random()
      .toString(36)
      .substring(7)
    return {
      key: `isConfirmed${r}`,
      text: null,
      isEdit: false
    }
  },
  watch: {
    value(val) {
      this.text = val
    }
  },
  created() {
    this.text = this.value
  },
  computed: {
    ruleOptions,
    decorators() {
      return this.form.addDecorators(this.ruleOptions)
    }
  },
  methods: {
    onEdit() {
      this.isEdit = true
      this.form.setFieldsValue({
        [this.key]: 0
      })
    },
    onConfirm() {
      const text = this.text || '0'
      this.form.setFieldsValue({
        [this.key]: 1
      })
      this.$emit('input', text)
      this.$emit('ok', text)
      this.isEdit = false
    },
    onBlur() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.form.validateFields([this.key], {
          force: true
        })
      }, 100)
    }
  }
}
</script>
