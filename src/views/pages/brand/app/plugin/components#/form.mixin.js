import { typeOf } from '@/utils/type'
import { merge, isEqual } from 'lodash-es'
import { message } from 'ant-design-vue'
import { resolve } from 'core-js/fn/promise'
/**
 * formValue 数据源，
 * formCheck 数据源校验状态，{ isPass, loading, [id], [id], ...} isPass 所有表单组件是否通过校验， loading 所有组件是否校验完毕， [id] 对应组件的校验状态，id标识为组件的_uid
 * isEdit 是否是编辑状态
 * isSubmit 提交标识，保存提交按钮点击事件 修改isSubmit ,isSubmit发生变更 触发当前组件的校验方法，校验完成后执行当前组件的onSubmit方法 进而触发submit事件
 * form、decorators 可由父级传入 form、decorators，也可以在组件内部定义 _form、_decorators 来设置
 * 以上属性必传 必须要在根form组件或之上 定义并往下传
 *    page组件 ==> form父组件 ==> form子组件 ==> form孙子组件 或 form父组件 ==> form子组件 ==> form孙子组件
 *
 * 校验、提交方法
 * onSubmit submit事件专用方法，承接子组件的submit事件，输出自己的submit事件
 * validate 需要自己定义，定义自己组件校验方法，可以是 promise 返回校验状态
 * messageError 自定义校验 message抛错 公共方法
 *
 * 数据源 与 表单 的数据同步方法
 * 使用 formValueChange 同步表单数据 到 v-model
 * 使用 setFieldsValue 同步 v-model数据 到 表单
 * 使用 setValue 更新组件属性值 支持 this.setValue('formValue.product_type', 2) 和 this.setValue('{'formValue.product_type': 2, formValue.product_id: 1}) 两种调用方式
 *
 */
export default {
  model: {
    props: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    formCheck: {
      type: Object,
      default: () => ({
        isPass: false,
        loading: false,
        result: {}
      })
    },
    isSubmit: {
      type: Number,
      defalut: 0
    },
    isEdit: {
      type: Boolean,
      defalut: false
    }
  },
  computed: {
    // 双向绑定值
    formValue: {
      get() {
        return this.value
      }
    }
  },
  watch: {
    // 监听数据源变更，向外抛出change事件
    formValue: {
      deep: true,
      handler(newVal, oldVal) {
        if (!newVal || isEqual(newVal, oldVal)) return
        this.$emit('change', newVal)
      }
    },
    // isSubmit 保存提交按钮点击事件 修改isSubmit,触发校验、进而触发submit事件
    isSubmit: {
      handler(newVal, oldVal) {
        if (isEqual(newVal, oldVal)) return
        if (!this.formCheck.result) this.formCheck.result = {}
        // 检验前重置当前组件的校验状态
        this.formCheck.result[this._uid] = false
        // submit前 先执行校验方法，校验方法执行完成后执行onSubmit触发submit事件
        const validator = this.validate && this.validate()
        if (validator && validator.then) {
          // 异步校验设置loading状态
          this.formCheck.result[this._uid] = 'loading'
          validator
            .then(flag => {
              console.log(this.$vnode.tag + '  组件触发校验, 结果为' + flag)
              this.formCheck.result[this._uid] = flag
              this._onSubmit(this.formValue, this.formCheck)
            })
            .catch(err => {
              console.log(this.$vnode.tag + '  组件触发校验, 结果为' + false)
              this.formCheck.result[this._uid] = false
              this._onSubmit(this.formValue, this.formCheck)
            })
        } else {
          console.log(this.$vnode.tag + '  组件触发校验, 结果为' + validator)
          this.formCheck.result[this._uid] = validator
          this._onSubmit(this.formValue, this.formCheck)
        }
      }
    }
  },
  data() {
    return {
      _DelayTimer: null,
      _ErrorTimer: null
    }
  },
  methods: {
    /**
     * onSubmit 除了本组件validate执行后会执行， 也是子组件的submit事件的方法
     * 即 孙子的submit事件 --> 子组件的onSumit方法, 触发子组件submit事件 --> 父组件的onSumbit方法
     * @param values 数据源
     * @param formCheck 所有表单组件的校验状态以及所有状态汇总后的最终状态，
     * { isPass, loading, [id], [id], ...} isPass 所有表单组件是否通过校验， loading 所有组件是否校验完毕， [id] 对应组件的校验状态，id标识为组件的_uid
     */
    // 子组件的submit事件绑定方法，合并子组件的校验结果后 再向外抛本组件的submit事件
    onSubmit(values, formCheck) {
      merge(this.formCheck.result, formCheck.result)
      this._onSubmit(values, this.formCheck)
    },
    _onSubmit(values, formCheck) {
      console.log(this.formCheck)
      // if (!formCheck.isPass) return
      this.$nextTick(() => {
        clearTimeout(this._DelayTimer)
        this._DelayTimer = setTimeout(() => {
          let loading = false
          let isPass = true
          this.formCheck.result &&
            Object.keys(this.formCheck.result).map(formId => {
              if (
                formId !== 'isPass' &&
                formId !== 'loading' &&
                (!this.formCheck.result[formId] ||
                  this.formCheck.result[formId] === 'loading')
              )
                isPass = false
              if (this.formCheck.result[formId] === 'loading') loading = true
            })
          this.formCheck.loading = loading
          this.formCheck.isPass = isPass
          this.$emit('submit', values, this.formCheck)
        })
      })
    },
    validateFields(fields) {
      if (!fields) fields = Object.keys(this.customDecorators)
      let checkList = []
      fields.map(field => {
        if (
          !this.customDecorators[field] ||
          !this.customDecorators[field].validator
        ) {
          console.log(`${field} validator不存在`)
        } else {
          const item = this.validateField(field)
          checkList.push(item)
        }
      })
      return new Promise((resolve, reject) => {
        Promise.all(checkList).then(err => {
          err = err.filter(item => !!item)
          resolve(err.length ? err : null)
        })
      })
    },
    validateField(field, value) {
      return new Promise((resolve, reject) => {
        if (
          !this.customDecorators[field] ||
          !this.customDecorators[field].validator
        ) {
          console.log(`${field} validator不存在`)
          resolve(true)
          return
        }
        this.$nextTick(() => {
          console.log(this.getValue(field))
          const msg = this.customDecorators[field].validator.apply(this, [
            field,
            value || this.getValue(field),
            this.formValue
          ])
          const result = {
            validateStatus: msg ? 'error' : '',
            help: msg || ''
          }
          this.customDecorators[field].checkResult = result
          resolve(msg ? result : null)
        })
      })
    },
    /**
     * @param key 表单绑定的值的 key
     * @param e   表单值
     * @param arg1 可以是 cb 也可以是target
     * @param arg2 是target 默认为this
     * @param cb  处理当前表单逻辑的回调
     * @param target  数据源，默认设置、更新this上 key对应的属性
     * 用于使用 v-decorator 绑定表单的 change事件，在其值发生变更后也同步一份到 formValue 上
     * 用法：@change="valueChange('formValue.product_id', $event, onMemberChange, formValue)"
     */
    formValueChange(key, val, arg1 = null, arg2 = this) {
      console.log(key, val, arg1, arg2)
      let cb = null,
        target = this
      if (arg1 && typeOf(arg1) !== 'function') target = arg1
      if (arg1 && typeOf(arg1) === 'function')
        (cb = arg1), (target = arg2 || this)
      this.setValue(key, val, target)
      cb && cb(val, key)
    },
    /**
     * formValue 集联更新值 需要用 此方法同步 form属性和v-model绑定值
     * 如：v-decorators="formValue.product_type" 与 v-decorators="formValue.product_id" product_type 变更需要 更新product_id的值
     * 更新product_id的值 需要更新form表单，也需要更新formValue
     * @param key 字符串 或 对象
     * @param value
     * 用法：this.setFieldsValue('formValue.product_type', 2) 或 this.setFieldsValue({'formValue.product_type': 2, formValue.product_id: 1})
     */
    setFieldsValue(key, value) {
      this.setValue(key, value, this.formValue)
      console.log('setFieldsValue', key, value)
      this.$nextTick(() => {
        setTimeout(() => {
          if (!this.form) throw `form 不存在`
          this.form &&
            this.form.setFieldsValue(
              typeOf(key) === 'string' ? { [key]: value } : key
            )
        })
      })
    },
    /**
     * 更新组件属性值，支持类似 form 的 setFieldsValue 方式
     * 如：this.setValue('formValue.product_type', 2)   ===>   this.formValue.product_type = 2
     * 如：this.setValue('{'formValue.product_type': 2, formValue.product_id: 1})   ===>   this.formValue.product_type = 2; this.formValue.product_id = 1
     */
    setValue(key, value, target = this) {
      console.log('single-formValue-change', key, value)
      if (typeOf(key) === 'string') {
        const keyArr = key.split('.')
        const len = keyArr.length - 1
        keyArr.reduce((cur, key, index) => {
          if (!cur[key] && index < len) {
            throw `${key}不存在`
          }
          if (index === len) {
            // 如果 要更新的值， 新值都是对象且不是moment对象则合并， 否则直接覆盖
            if (
              typeOf(cur[key]) === 'object' &&
              typeOf(value) === 'object' &&
              !cur[key]._isAMomentObject &&
              !value._isAMomentObject
            ) {
              merge(cur[key], value)
            } else {
              cur[key] = value
            }
          }
          return cur[key]
        }, target)
      } else {
        Object.keys(key).map(k => {
          this.setValue(k, key[k])
        })
      }
    },
    getValue(key) {
      const keyArr = key.split('.')
      const len = keyArr.length - 1
      return keyArr.reduce((cur, key, index) => {
        if (!cur[key] && index < len) {
          throw `${key}不存在`
        }
        return cur[key]
      }, this)
    },
    messageError(config = {}) {
      // TODO: 可添加 msgIsShow 判断控制 一次只抛第一个错误信息
      if (!config.content) return
      message.error(config.content, config.duration)
      // this.msgIsShow = true
      // this._ErrorTimer = setTimeout(() => {
      //   this.msgIsShow = false
      //   message.error(config.content, config.duration)
      // }, 2000)
    }
  }
}
