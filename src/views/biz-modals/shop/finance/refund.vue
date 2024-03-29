<template>
  <st-modal
    title="退款"
    v-model="show"
    wrapClassName="modal-shop-finance-refund"
  >
    <div :class="refund('content')">
      <a-row :class="refund('info')">
        <a-col :span="13" class="mg-b36">
          <st-info>
            <st-info-item label="订单号" v-if="isParent">
              {{ info.order_id }}
            </st-info-item>
            <!-- 此条展示为子订单id  -->
            <st-info-item label="订单号" v-else>
              {{ info.id }}
            </st-info-item>
            <st-info-item class="mg-b0" label="下单时间">
              {{ info.created_time }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="11" class="mg-b36">
          <st-info>
            <st-info-item label="下单人">{{ info.operator_name }}</st-info-item>
            <st-info-item class="mg-b0" label="销售">
              {{ info.staff_name }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="13" class="mg-b36">
          <st-info>
            <st-info-item label="订单类型" v-if="info.order_type">
              {{ info.order_type | enumFilter('sold_common.order_type') }}
            </st-info-item>
            <st-info-item class="mg-b0" label="订单来源">
              {{ info.order_source | enumFilter('finance.order_source') }}
              {{ info.mobile }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="11" class="mg-b36">
          <st-info>
            <st-info-item label="场馆">{{ info.shop_name }}</st-info-item>
            <st-info-item class="mg-b0" label="用户">
              {{ info.member_name }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="13" class="mg-b36">
          <st-info>
            <st-info-item
              label="购买"
              v-if="info.order_type !== 6 || info.is_sub === 1"
            >
              {{ info.product_name }}
            </st-info-item>
            <st-info-item
              label="购买"
              v-if="info.order_type === 6 && !info.is_sub"
            >
              <!-- TODO:雄伟给返回 -->
              <st-overflow-text
                title="购买"
                max-width="180px"
                :value="
                  info.product_list &&
                    info.product_list.map(
                      item =>
                        `${item.product_name}&nbsp;${
                          item.rule_name ? '规格：' : ''
                        }${item.rule_name}*${item.product_count} 金额：&yen;${
                          item.price
                        }`
                    )
                "
              ></st-overflow-text>
            </st-info-item>
            <st-info-item label="订单总额">
              {{ info.total_price }}元
            </st-info-item>
            <st-info-item label="实收金额">
              {{ info.actual_price }}元
            </st-info-item>
          </st-info>
        </a-col>

        <a-col :span="11" class="mg-b36">
          <st-info>
            <st-info-item label="赠送">{{ info.gift_amount }}</st-info-item>
            <st-info-item label="应收金额">{{ info.pay_price }}元</st-info-item>
          </st-info>
        </a-col>
        <a-col :span="24" class="mg-b36">
          <st-info>
            <st-info-item label="备注">
              {{ info.description || '' }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>
      <st-form :form="form">
        <div :class="refund('refund')">
          <st-form-item
            class="mg-b16"
            required
            v-if="info.is_fast_refund !== 1"
          >
            <template slot="label">
              退款原因
              <st-help-tooltip id="TSMC005" />
            </template>
            <a-radio-group v-model="getRefundReason">
              <a-radio
                v-for="(item, index) in refundReasonsChange"
                :key="index"
                :value="+item.value"
              >
                {{ item.label }}
              </a-radio>
            </a-radio-group>
          </st-form-item>
          <st-form-item label="退款金额" required>
            <st-input-number
              v-if="isRefundPriceEditable"
              :max="+info.actual_price"
              :float="true"
              placeholder="请输入本次退款的实际金额"
              v-decorator="decorators.refundPrice"
            >
              <template slot="addonAfter">元</template>
            </st-input-number>
            <template v-else>{{ info.actual_price }}元</template>
          </st-form-item>
          <st-form-item label="退款方式" class="mg-b16" required>
            <a-radio-group v-model="frozenPayType">
              <a-radio
                v-for="(item, index) in refundChannels"
                :key="index"
                :value="+item.value"
              >
                {{ item.label }}
              </a-radio>
            </a-radio-group>
          </st-form-item>
          <st-form-item v-if="info.gift_points">
            <div :class="refund('integral')">
              该订单赠送{{ info.gift_points }}积分，退款时需扣回
              <span style="width: 150px; padding-left: 10px">
                <st-input-number
                  width="150px"
                  type="number"
                  :max="+info.gift_points"
                  placeholder="请输入"
                  v-decorator="decorators.gift_points"
                >
                  <template slot="addonAfter">积分</template>
                </st-input-number>
              </span>
            </div>
          </st-form-item>
          <st-form-item label="备注" class="mg-b0">
            <a-textarea
              v-model="description"
              :autosize="{ minRows: 4, maxRows: 6 }"
            />
          </st-form-item>
        </div>
      </st-form>
    </div>
    <template slot="footer">
      <span class="info">
        提交后无法修改&nbsp;
        <st-icon type="help" />
      </span>
      <st-button
        @click="onSubmit"
        :loading="loading.orderRefund || loading.getChildInfo"
        type="primary"
      >
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import moment from 'moment'
import { RefundService } from './refund.service'
import { ruleOptions } from './refund.config'
import { ORDER_PRODUCT_TYPE } from '@/constants/finance/order'
export default {
  name: 'ModalShopFinanceOrderRefund',
  bem: {
    refund: 'modal-shop-finance-order-refund'
  },
  serviceInject() {
    return {
      refundService: RefundService
    }
  },
  rxState() {
    return {
      info: this.refundService.info$,
      refundChannels: this.refundService.refundChannels$,
      refundReasons: this.refundService.refundReasons$,
      refundReasonsSmallCourse: this.refundService.refundReasonsSmallCourse$,
      loading: this.refundService.loading$
    }
  },
  props: {
    id: {
      type: Number
    },
    isParent: {
      type: Boolean,
      default: true
    },
    product_type: [Number, String]
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      ORDER_PRODUCT_TYPE,
      form,
      decorators,
      show: false,
      description: '',
      frozenPayType: 2,
      refundReason: 1,
      updateReasonFlag: false
    }
  },
  computed: {
    isVenues() {
      return this.product_type === this.ORDER_PRODUCT_TYPE.VENUES
    },
    isRefundPriceEditable() {
      return this.product_type !== this.ORDER_PRODUCT_TYPE.EARNEST
    },
    refundReasonsChange() {
      let arr = this.refundReasons
      console.log('arr', arr)
      // 小班课的退款原因
      if (this.product_type === this.ORDER_PRODUCT_TYPE.SMALL_COURSE_TYPE) {
        arr = this.refundReasonsSmallCourse
      }
      // 定金去掉第一个退款原因
      if (this.product_type === this.ORDER_PRODUCT_TYPE.EARNEST) {
        arr = arr.slice(1)
      }
      // 场地预约退款原因过滤
      const reason = this.info.refund_reason
      if (this.isVenues && reason) {
        arr = arr.filter(item => reason.indexOf(item.value) > -1)
      }
      return arr
    },
    getRefundReason: {
      get: function() {
        if (!this.updateReasonFlag && !this.isVenues) {
          // 客户要求退款退货（此商品变为无效）
          return 2
        }
        return this.refundReason
      },
      set: function(value) {
        this.updateReasonFlag = true
        this.refundReason = value
      }
    }
  },
  created() {
    console.log('refundReasons', this.refundReasons)
    if (this.isParent) {
      this.refundService.getDetail(this.id).subscribe(res => {
        res.info.gift_points &&
          this.$nextTick().then(() => {
            this.form.setFieldsValue({
              gift_points: res.info.gift_points
            })
          })
      })
    } else {
      this.refundService.getChildInfo(this.id).subscribe()
    }
  },
  methods: {
    moment,
    onSubmit() {
      this.form.validate().then(values => {
        let parmas = {
          order_id: this.info.order_id || this.info.id,
          refund_money: +values.refundPrice,
          refund_points: +values.gift_points,
          reason: this.getRefundReason,
          pay_channel: +this.frozenPayType,
          description: this.description
        }
        // 快速退款默认原因，退货退款
        if (this.info.is_fast_refund == 1) {
          parmas.reason = 2
        }
        if (this.info.is_sub) {
          let childParmas = { ...parmas, order_sub_id: this.info.id }

          this.refundService
            .orderChildRefund(childParmas, this.id, this.type)
            .subscribe(res => {
              this.$emit('success')
              this.show = false
            })
        } else {
          this.refundService
            .orderRefund(parmas, this.id, this.type)
            .subscribe(res => {
              this.$emit('success')
              this.show = false
            })
        }
      })
    },
    handleIntegralCheck(rule, value) {
      if (value > this.info.member_points) {
        return `该用户仅剩${this.info.member_points}积分，不足扣减`
      }
      return true
    }
  }
}
</script>
