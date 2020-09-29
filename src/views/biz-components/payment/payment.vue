<template>
  <div class="st-payment">
    <div class="st-payment__title" v-if="title">{{ title }}</div>
    <div class="st-payment__wrapper">
      <div
        :key="payment.payment_type"
        v-for="payment in payments"
        class="st-payment__item"
        :class="
          'st-payment__item' +
            `${paymentType === payment.payment_type ? '-active' : ''}`
        "
        @click="handleClickPaymentType(payment)"
      >
        <div
          class="st-payment__item-icon"
          :class="
            'st-payment__item-icon' +
              `-${paymentTypeClass(payment.payment_type)}`
          "
        ></div>
        <div class="st-payment__item-name">{{ payment.payment_type_name }}</div>
      </div>
    </div>
    <div class="st-payment__deposit">
      <!-- 选择储值卡 -->
      <st-form-item
        label="储值卡"
        required
        labelWidth="54px"
        v-if="isShowDeposit"
      >
        <a-select
          placeholder="请选择储值卡"
          v-decorator="decorators.deposit_card_id"
          style="width: 294px"
        >
          <a-select-option
            :value="item.id"
            :key="index"
            v-for="(item, index) in depositList"
          >
            {{ item.card_name }}--{{ item.now_amount }}元
          </a-select-option>
        </a-select>
      </st-form-item>
    </div>
  </div>
</template>

<script>
import { PaymentService } from './payment.service'
import { PAYMENT_TYPES } from '@/constants/pay'
import { ruleOptions } from './payment.config'
export default {
  name: 'st-payment',

  bem: {},

  components: {},

  serviceInject() {
    return {
      paymentService: PaymentService
    }
  },
  rxState() {
    return {
      payments: this.paymentService.payments$
    }
  },

  props: {
    form: {
      type: Object,
      default: () => {}
    },
    order_id: {
      type: [String, Number]
    },
    title: {
      type: String,
      default: '支付方式'
    }
  },

  data() {
    return {
      paymentType: -1,
      deposit_card_id: 0
    }
  },

  computed: {
    ruleOptions,
    decorators() {
      return this.form.addDecorators(this.ruleOptions)
    },
    isShowDeposit() {
      return this.paymentType === PAYMENT_TYPES.DEPOSIT
    },
    depositList() {
      return (
        (
          this.payments.filter(paymentMethod => {
            return paymentMethod.payment_type === PAYMENT_TYPES.DEPOSIT
          })[0] || {}
        ).deposit || []
      )
    }
  },

  watch: {
    paymentType(newV) {
      this.$emit('input', newV)
      this.$emit('change', newV)
    }
  },

  mounted() {
    this.paymentService.getPaymentMethodList(this.order_id).subscribe(res => {
      const paymentType = this.payments[0] && this.payments[0].payment_type
      this.paymentType = paymentType
    })
  },

  methods: {
    paymentTypeClass(paymentType) {
      if (paymentType > 32) {
        return 'stpos'
      }
      let Map = {
        0: 'deposit',
        2: 'wechat',
        3: 'alipay',
        5: 'pos',
        6: 'cash',
        8: 'other',
        4: 'bank'
      }
      return Map[paymentType]
    },
    handleClickPaymentType(payment) {
      if (this.paymentType === payment.payment_type) {
        this.paymentType = -1
      } else {
        this.paymentType = payment.payment_type
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
