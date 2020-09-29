<template>
  <st-modal
    title="提现"
    v-model="show"
    width="484px"
    wrapClassName="modal-front-add-member"
  >
    <st-form :form="form" labelWidth="66px">
      <st-form-item label="提现金额" required>
        <st-input-number
          v-decorator="decorators.member_name"
          placeholder="请输入提现金额"
        ></st-input-number>
      </st-form-item>
      <st-form-item label="登陆密码" required>
        <a-input
          type="password"
          v-decorator="decorators.member_name"
          placeholder="请输入登陆密码"
        ></a-input>
      </st-form-item>
      <st-form-item label="手机号" required>
        <input-phone
          size="default"
          v-decorator="decorators.mobile"
          placeholder="请输入手机号"
        ></input-phone>
      </st-form-item>
      <st-form-item label="验证码" required class="mg-b0">
        <input-phone-code
          size="default"
          v-decorator="decorators.mobile"
          placeholder="请输入验证码"
        ></input-phone-code>
      </st-form-item>
    </st-form>
    <template slot="footer">
      <st-button @click="show = false">取消</st-button>
      <st-button @click="onSubmit" :loading="loading.addMember" type="primary">
        确定
      </st-button>
    </template>
  </st-modal>
</template>
<script>
import { WithdrawService } from './withdraw.service'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from './withdraw.config'
import InputPhone from '@/views/biz-components/account/input-phone/input-phone'
import InputPhoneCode from '@/views/biz-components/account/input-phone-code/input-phone-code'
export default {
  name: 'ModalBrandFinanceWithdraw',
  bem: {
    add: 'modal-front-add-member'
  },
  serviceInject() {
    return {
      pattern: PatternService,
      withdrawService: WithdrawService
    }
  },
  rxState() {
    return {
      loading: this.withdrawService.loading$,
      parent_types: this.withdrawService.parent_types$
    }
  },
  components: {
    InputPhone,
    InputPhoneCode
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      personModel: 0,
      disabledParentMobile: false
    }
  },
  methods: {
    onChangeParentMobile(val) {
      setTimeout(() => {
        this.form.validate(['parent_mobile']).then(values => {
          val.mobile = val.phone
          this.withdrawService.getParentInfoByPhone(val).subscribe(res => {
            if (res.exists) {
              this.disabledParentMobile = true
              this.form.setFieldsValue({
                parent_name: res.info.member_name
              })
            } else {
              this.disabledParentMobile = false
              this.form.setFieldsValue({
                parent_name: ''
              })
            }
          })
        })
      })
    },
    onChangeModel(val) {
      this.personModel = val
    },
    onSubmit() {
      this.form.validate().then(values => {
        this.withdrawService
          .addMember({
            member_name: values.member_name,
            mobile: values.mobile ? values.mobile.phone : undefined,
            is_minors: values.is_minors,
            parent_username: values.parent_name,
            parent_mobile: values.parent_mobile
              ? values.parent_mobile.phone
              : undefined,
            parent_country_prefix: values.parent_mobile
              ? values.parent_mobile.code_id
              : undefined,
            parent_user_role: values.parent_user_role
          })
          .subscribe(res => {
            this.show = false
            this.$emit('success', {
              id: res.info.member_id,
              name: values.member_name
            })
          })
      })
    }
  }
}
</script>
