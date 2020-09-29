<template>
  <st-modal
    :class="bModal()"
    :title="title"
    v-model="show"
    @ok="save"
    :confirmLoading="loading.sendCoupon"
  >
    <st-form :form="form">
      <st-form-item
        label="接受对象"
        :class="bModal('form')"
        :help="curUser === USER_TYPES.MOBILE ? '必须为系统内会员的手机号' : ''"
      >
        <a-radio-group
          v-decorator="decorators.type"
          @change="getCurPrizUserType"
        >
          <a-radio
            v-for="(item, index) in userType"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>

        <all-member-select
          style="width: 290px; margin-top: 12px"
          v-if="curUser === USER_TYPES.USER"
          type="brand"
          placeholder="输入手机号或会员名搜索"
          isNormalStyle
          useBodyContainer
          @change="onMemberSelect"
        ></all-member-select>

        <st-textarea
          class="mg-t8"
          v-if="curUser === USER_TYPES.MOBILE"
          v-model="tel"
          :max-rows="1000"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="输入手机号,每行一个"
        ></st-textarea>

        <a-radio-group
          :class="bModal('scroll')"
          v-decorator="decorators.send_value"
          v-show="curUser === USER_TYPES.CROWD"
        >
          <a-radio-button
            :class="bModal('scroll-btn')"
            class="mg-r8"
            v-for="(item, index) in crowdList"
            :key="index"
            :value="item.crowd_id"
          >
            {{ item.crowd_name }}
          </a-radio-button>
        </a-radio-group>
        <span :class="bModal('scroll-add')" v-if="curUser === USER_TYPES.CROWD">
          <span :class="bModal('scroll-not')">不满足？</span>
          <a @click="goCrowd" class="cursor-pointer">去新增人群</a>
        </span>
      </st-form-item>
      <st-form-item
        label="选择优惠券"
        help="定向发券不扣除优惠券剩余数量"
        required
      >
        <coupon-select
          isInit
          :isSelectFirst="!!couponId"
          :value="couponId"
          style="width: 290px"
          useBodyContainer
          placeholder="搜索选择优惠券"
          @change="onCouponSelectChange"
        ></coupon-select>
      </st-form-item>
    </st-form>
  </st-modal>
</template>
<script>
import { ruleOptions } from './batch-send.config'
import { BatchSendService } from './batch-send.service'
import { USER_TYPES } from '@/constants/plugin/send-coupon'
import { MessageService } from '@/services/message.service'
import { PatternService } from '@/services/pattern.service'
import AllMemberSelect from '@/views/biz-components/member/all-member-select/all-member-select.vue'
import CouponSelect from '@/views/biz-components/plugin/coupon-select/index.vue'
export default {
  name: 'BrandAppPluginSendCouponBatchSend',
  bem: {
    bModal: 'brand-app-plugin-send-coupon-batch-send'
  },
  serviceInject() {
    return {
      batchSendService: BatchSendService,
      messageService: MessageService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      loading: this.batchSendService.loading$,
      userType: this.batchSendService.userType$,
      crowdList: this.batchSendService.crowdList$
    }
  },
  components: {
    AllMemberSelect,
    CouponSelect
  },
  props: {
    couponId: {
      type: Number
    },
    crowdId: {
      type: Number
    },
    title: {
      type: String,
      default: '定向发券'
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      USER_TYPES,
      show: false,
      curUser: USER_TYPES.USER,
      tel: '',
      selectCouponId: '',
      selectMemberId: ''
    }
  },
  mounted() {
    if (this.couponId) {
      this.selectCouponId = this.couponId
    }
    if (this.crowdId) {
      this.curUser = USER_TYPES.CROWD
      this.form.setFieldsValue({
        type: USER_TYPES.CROWD,
        send_value: this.crowdId
      })
    }
    this.getCrowdList()
  },
  methods: {
    // 获取人群列表
    getCrowdList() {
      return this.batchSendService.getCrowdList().subscribe()
    },
    getCurPrizUserType(e) {
      this.curUser = e.target.value
    },
    // 跳转到新增人群
    goCrowd() {
      this.$router.push('/brand/marketing/plugin/crowd/index')
      this.show = false
    },
    onMemberSelect(id) {
      this.selectMemberId = id
    },
    onCouponSelectChange(val) {
      this.selectCouponId = val
    },
    save() {
      this.form.validate((error, values) => {
        let errMsg = ''
        const types = {
          [USER_TYPES.USER]: () => {
            if (!this.selectMemberId) {
              errMsg = '请选择会员'
              return
            }
            values.send_users = [this.selectMemberId]
          },
          [USER_TYPES.MOBILE]: () => {
            if (!this.tel) {
              errMsg = '请输入手机号'
              return
            }
            let telArr = this.tel.split(/[\n]/)
            for (let i = 0; i < telArr.length; i++) {
              if (!this.pattern.MOBILE.test(telArr[i].trim())) {
                errMsg = '请输入正确格式手机号'
                return
              }
            }
            values.send_users = this.tel.split(/[\n]/)
          },
          [USER_TYPES.CROWD]: () => {
            if (!values.send_value) {
              errMsg = '请选择人群'
              return
            }
            values.send_users = [values.send_value]
          },
          [USER_TYPES.ALL]: () => {}
        }
        // 校验输入
        types[values.type]()
        if (errMsg) {
          this.messageService.warn({ content: errMsg })
          return
        }

        if (!this.selectCouponId) {
          this.messageService.warn({
            content: '请选择优惠券'
          })
          return
        }
        values.coupon_id = this.selectCouponId
        return this.batchSendService
          .sendCoupon({ ...values })
          .subscribe(res => {
            this.$confirm({
              title: '发券成功',
              content: '您可以推送短信，告知客户有新的优惠券到账哦~',
              okText: '短信推送',
              icon: () => (
                <st-icon
                  type="anticon:check-circle"
                  size="22px"
                  color="#52c41a"
                ></st-icon>
              ),
              onOk: () => {
                this.$router.push({
                  name: 'brand-setting-sms-group'
                })
              }
            })
            this.$emit('success')
            this.show = false
          })
      })
    }
  }
}
</script>
