<template>
  <st-modal :title="modalTitle" width="568px" v-model="show">
    <div :class="bModal()">
      <st-form :form="form">
        <st-form-item label="报名标题">
          <a-input
            placeholder="请输入报名项"
            v-decorator="decorators.extra_name"
          ></a-input>
        </st-form-item>
        <st-form-item label="报名类型">
          <a-radio-group
            @change="onChangeExtraType"
            v-decorator="decorators.extra_type"
          >
            <a-radio :value="0">单行文本</a-radio>
            <a-radio :value="1">多行文本</a-radio>
            <a-radio :value="2">单选</a-radio>
            <a-radio :value="3">多选</a-radio>
          </a-radio-group>
        </st-form-item>
        <st-form-item v-if="isShowSignUp" label="报名选项">
          <a-input-group compact>
            <a-input
              v-model="option"
              style="width: 80%"
              placeholder="请填写报名选项"
            />
            <st-button @click="onCLickGetOption">新增</st-button>
          </a-input-group>
          <div class="option-group-wrap">
            <div
              size="small"
              :key="index"
              class="mg-r8 option-tip"
              v-for="(item, index) in extra_info"
            >
              <span class="tip">{{ item }}</span>
              <span class="mg-l8" @click="onCLickDelOption(item)">x</span>
            </div>
          </div>
        </st-form-item>
        <st-form-item class="mg-b0" label="是否必填">
          <a-radio-group v-decorator="decorators.extra_require">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="2">否</a-radio>
          </a-radio-group>
        </st-form-item>
      </st-form>
    </div>
    <template slot="footer">
      <st-button @click="show = false">取消</st-button>
      <st-button @click="onSubmit" type="primary">
        确定
      </st-button>
    </template>
  </st-modal>
</template>
<script>
import { ruleOptions } from './add-signup.config'
import { PatternService } from '@/services/pattern.service'
import { MessageService } from '@/services/message.service'
const uuidv1 = require('uuid/v1')
export default {
  name: 'ModalAddTicket',
  bem: {
    bModal: 'modal-marketing-add-signup'
  },
  serviceInject() {
    return {
      pattern: PatternService,
      msg: MessageService
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      extraTypeList: ['text', 'textarea', 'radio', 'checkbox'],
      form,
      decorators,
      show: false,
      ticketType: 1,
      option: '',
      extraType: 1,
      extra_info: []
    }
  },
  props: {
    modalTitle: {
      type: String,
      default: '报名信息设置'
    },
    extra_sort: Number,
    signUpList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    isShowSignUp() {
      return this.extraType === 2 || this.extraType === 3
    }
  },
  methods: {
    onCLickDelOption(value) {
      this.extra_info = this.extra_info.filter(item => item !== value)
    },
    onCLickGetOption() {
      if (this.extra_info.length >= 10) {
        this.msg.error({ content: '报名的选项最多新增10个选项值' })
        return
      }
      if (!this.option) {
        this.msg.error({ content: '报名选项不能为空' })
        return
      }
      if (!this.pattern.CN_EN_NUM('1-15').test(this.option)) {
        this.msg.error({ content: '请输入1~15个字符' })
        return
      }
      if (!this.extra_info.includes(this.option)) {
        this.extra_info.push(this.option)
        this.option = ''
      } else {
        this.msg.error({ content: '选项重复,请重新填写' })
      }
    },
    onChangeExtraType(e) {
      this.extraType = e.target.value
    },
    isUniq(name) {
      let bool = false
      this.signUpList.forEach(item => {
        bool = item.extra_name === name
      })
      return bool
    },
    onSubmit() {
      this.form.validate().then(values => {
        if (this.isUniq(values.extra_name)) {
          this.msg.error({ content: '标题名重复请重新填写' })
          return
        }
        this.show = false
        const obj = {
          extra_name: values.extra_name,
          extra_require: values.extra_require,
          extra_default_value: '',
          extra_sort: this.extra_sort,
          extra_info: this.extra_info,
          extra_type: this.extraTypeList[values.extra_type],
          extra_key: uuidv1(values)
        }
        this.$emit('show', obj)
        this.$emit('submit', obj)
      })
    }
  }
}
</script>
