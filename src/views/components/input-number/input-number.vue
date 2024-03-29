<template>
  <a-input
    :placeholder="placeholder"
    type="text"
    :value="number"
    @change="numberChange"
    @blur="numberBlur"
    @focus="numberFocus"
    :disabled="disabled"
    maxlength="12"
    :class="'st-input-number__' + useType"
  >
    <template slot="addonBefore">
      <slot name="addonBefore"></slot>
    </template>
    <template slot="addonAfter">
      <slot name="addonAfter"></slot>
    </template>
  </a-input>
</template>
<script>
import { isNumber } from 'lodash-es'
export default {
  name: 'StInputNumber',
  bem: {
    input: 'st-input-number'
  },
  props: {
    /**
     * 定义输出值的类型， text 字符串， number 数字
     */
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default() {
        return ''
      }
    },
    min: {
      type: Number,
      default() {
        return 0
      }
    },
    max: {
      type: [String, Number],
      default() {
        return 999999999999
      }
    },
    value: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    /**
     * input-number是否允许有小数。允许一位小数
     */
    float: {
      type: [Boolean, Number],
      default() {
        return false
      }
    },
    useType: {
      type: String,
      default: 'default'
    }
  },
  watch: {
    value: {
      deep: true,
      handler(newVal, oldVal) {
        this.init(newVal)
      }
    }
  },
  created() {
    this.init(this.value)
  },
  data() {
    return {
      number: ''
    }
  },
  methods: {
    init(data) {
      this.number = data
    },
    numberBlur(e) {
      switch (e.target.value) {
        case null:
        case undefined:
        case '':
        case '.':
          this.number = ''
          this.triggerChange()
          this.$emit(
            'blur',
            this.type === 'text' ? `${this.number}` : Number(this.number)
          )
          break
        default:
          if (!this.float) {
            this.number = parseInt(+e.target.value, 10)
            this.number = this.min > this.number ? this.min : this.number
            this.number = this.max < this.number ? this.max : this.number
          } else {
            this.number = parseInt(+e.target.value * 10, 10) / 10
            this.number = this.min > this.number ? this.min : this.number
            this.number = this.max < this.number ? this.max : this.number
          }
          this.number += ''
          this.triggerChange()
          this.$emit(
            'blur',
            this.type === 'text' ? `${this.number}` : Number(this.number)
          )
      }
    },
    numberFocus(e) {
      this.$emit('focus')
    },
    numberChange(e) {
      // 控制不能输入非数字
      const PATTERN_NUMBER = /^(\d+(\.\d?)?|\.\d?)$/ // 包含小数的数字  匹配 1.1 / 1. / .1 三种形式
      if (
        !PATTERN_NUMBER.test(e.target.value) &&
        e.target.value !== '' &&
        e.target.value !== '.'
      ) {
        console.log('到这里来了', e)
        return
      }
      this.number = `${e.target.value}`
      this.triggerChange()
    },
    triggerChange() {
      this.$emit(
        'change',
        this.type === 'text' ? `${this.number}` : Number(this.number)
      )
      this.$emit(
        'input',
        this.type === 'text' ? `${this.number}` : Number(this.number)
      )
    }
  }
}
</script>
