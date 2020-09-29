<template>
  <st-modal
    title="我的银行卡"
    v-model="show"
    width="484px"
    wrapClassName="modal-front-add-member"
  >
    <st-form :form="form" labelWidth="66px">
      <st-form-item label="开户银行" required>
        <a-select palceholder="请选择">
          <a-select-option :value="1"></a-select-option>
          <a-select-option :value="2"></a-select-option>
          <a-select-option :value="3"></a-select-option>
        </a-select>
      </st-form-item>
      <st-form-item label="开户城市" required>
        <a-cascader
          :options="options"
          v-decorator="decorators.cascader"
          :fieldNames="fieldNames"
          placeholder="请选择省/市/区/县"
        />
      </st-form-item>
      <st-form-item label="支行名称" required>
        <a-input
          v-decorator="decorators.mobile"
          placeholder="请输入支行名称"
        ></a-input>
      </st-form-item>
      <st-form-item label="开户名称" required>
        <a-input
          v-decorator="decorators.mobile"
          placeholder="请输入开户名称"
        ></a-input>
      </st-form-item>
      <st-form-item label="银行卡号" required>
        <a-input
          v-decorator="decorators.mobile"
          placeholder="请输入银行卡号"
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
      <st-form-item label="登陆密码" required>
        <a-input
          type="password"
          v-decorator="decorators.member_name"
          placeholder="请输入登陆密码"
        ></a-input>
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
import { MyBankCardService } from './my-bank-card.service'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from './my-bank-card.config'
import InputPhone from '@/views/biz-components/account/input-phone/input-phone'
import InputPhoneCode from '@/views/biz-components/account/input-phone-code/input-phone-code'
import { RegionService } from '@/services/region.service'
export default {
  name: 'ModalBrandFinanceWithdraw',
  bem: {
    add: 'modal-front-add-member'
  },
  serviceInject() {
    return {
      pattern: PatternService,
      myBankCardService: MyBankCardService,
      regionService: RegionService
    }
  },
  rxState() {
    return {
      loading: this.myBankCardService.loading$,
      parent_types: this.myBankCardService.parent_types$
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
      disabledParentMobile: false,
      fieldNames: { label: 'name', value: 'id', children: 'children' },
      options: []
    }
  },
  mounted() {
    this.regionService.getRegions().subscribe(() => {
      this.options = JSON.parse(window.localStorage.getItem('regionTree'))
    })
  },
  methods: {
    onChangeParentMobile(val) {
      setTimeout(() => {
        this.form.validate(['parent_mobile']).then(values => {
          val.mobile = val.phone
          this.myBankCardService.getParentInfoByPhone(val).subscribe(res => {
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
        this.myBankCardService
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
    },
    getDistrictInfo(cascader = []) {
      const province = this.options.filter(item => item.id === cascader[0])
      const city = province[0].children.filter(item => item.id === cascader[1])
      const district = city[0].children.filter(item => item.id === cascader[2])
      return {
        province_name: province[0].name,
        city_name: city[0].name,
        district_name: district[0].name
      }
    }
  }
}
</script>
