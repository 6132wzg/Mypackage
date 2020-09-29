<template>
  <st-modal
    title="订单收款"
    v-model="show"
    wrapClassName="modal-sold-deal-gathering"
    @cancel="onCancel"
    width="800px"
  >
    <div :class="b('content')">
      <!-- 支付金额 -->
      <st-form :form="form">
        <st-input-pay
          :isValueCanEdit="false"
          :max="info.remain_amount | dealMaxNumber"
          :showList="inputShowList"
          v-model="price"
        ></st-input-pay>
        <div
          class="modal-sold-deal-gathering-order-content"
          :class="{ contentFold }"
        >
          <!-- 用户信息 -->
          <div :class="bOrderContent('info')">
            <div :class="bOrderContent('info-item')">
              <span :class="bOrderContent('info-item-label')">用户：</span>
              <!-- <span :class="bOrderContent('info-item-value')">
                {{ info.member_name }}&nbsp;{{
                  info.is_minors ? '' : info.member_mobile
                }}
              </span>-->
              <st-overflow-text
                title="用户："
                max-width="190px"
                :value="
                  `${info.member_name}&nbsp;${
                    info.is_minors ? '' : info.member_mobile
                  }`
                "
              ></st-overflow-text>
            </div>
            <div :class="bOrderContent('info-item')">
              <span :class="bOrderContent('info-item-label')">购买:</span>
              <st-overflow-text
                title="购买："
                max-width="200px"
                :value="
                  info.venues_site &&
                    info.venues_site.map(
                      item =>
                        `${item.site_name} ${item.time_start}~${item.time_end} 金额：&yen;${item.price}元`
                    )
                "
                v-if="type === 'venues'"
              ></st-overflow-text>
              <st-overflow-text
                title="购买："
                max-width="200px"
                :value="
                  info.order_sub &&
                    info.order_sub.map(
                      item =>
                        `${item.product_name}${item.rule_name ? '规格：' : ''}${
                          item.rule_name
                        }*${item.product_count} 金额：&yen;${item.price}`
                    )
                "
                v-else-if="type === 'cloud_store'"
              ></st-overflow-text>
              <st-overflow-text
                title="购买："
                max-width="200px"
                :value="info.rule_name"
                v-else
              ></st-overflow-text>
            </div>
            <div :class="bOrderContent('info-item')">
              <span :class="bOrderContent('info-item-label')">销售：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.sale_name }}
              </span>
            </div>
            <div :class="bOrderContent('info-item')">
              <span :class="bOrderContent('info-item-label')">
                {{ type === 'venues' ? '门店：' : '场馆：' }}
              </span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.shop_name }}
              </span>
            </div>
            <div :class="bOrderContent('info-item')" v-if="type === 'venues'">
              <span :class="bOrderContent('info-item-label')">预约时间：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.reserve_day }}
              </span>
            </div>
            <div :class="bOrderContent('info-item')">
              <span :class="bOrderContent('info-item-label')">下单人：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.operate_name }}
              </span>
            </div>
            <div :class="bOrderContent('info-item')" v-if="type === 'venues'">
              <span :class="bOrderContent('info-item-label')">赠送：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.gift_amount }}
              </span>
            </div>
            <div :class="bOrderContent('info-item')" v-if="type === 'venues'">
              <span :class="bOrderContent('info-item-label')">定金抵扣：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.advance_amount }}
              </span>
            </div>
          </div>
          <!-- 订单信息 -->
          <div :class="bOrderContent('info')">
            <div :class="bOrderContent('info-item')">
              <span :class="bOrderContent('info-item-label')">订单总额：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.order_amount }}
              </span>
            </div>
            <div :class="bOrderContent('info-item')">
              <span :class="bOrderContent('info-item-label')">订单号：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.order_id }}
              </span>
            </div>
            <div :class="bOrderContent('info-item')">
              <span :class="bOrderContent('info-item-label')">下单时间：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.order_time }}
              </span>
            </div>
            <div :class="bOrderContent('info-item')">
              <span :class="bOrderContent('info-item-label')">减免金额：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.reduce_amount }}
              </span>
            </div>
            <div :class="bOrderContent('info-item')">
              <span :class="bOrderContent('info-item-label')">优惠金额：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.discount_amount }}
              </span>
            </div>
            <div :class="bOrderContent('info-item')">
              <span :class="bOrderContent('info-item-label')">应付金额：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.actual_amount }}
              </span>
            </div>
          </div>
          <!-- 备注 -->
          <div :class="bOrderContent('info')" v-if="type !== 'cloud_store'">
            <div :class="bOrderContent('info-item')" style="margin-bottom: 0">
              <span :class="bOrderContent('info-item-label')">备注：</span>
              <span :class="bOrderContent('info-item-value')">
                {{ info.description }}
              </span>
            </div>
          </div>
        </div>
        <div :class="bFold()">
          <div @click="handleContentToggleFold">
            <span class="mg-r4">{{ contentFold ? '展开' : '收起' }}</span>
            <st-icon
              :type="contentFold ? 'gathering-down' : 'gathering-up'"
              style="font-size: 13px"
            ></st-icon>
          </div>
        </div>
        <div :class="bPayment()">
          <!-- 支付方式组件 -->
          <st-payment
            :order_id="order_id"
            :form="form"
            @change="onPaymentTypeChange"
          ></st-payment>
          <!-- 备注信息 -->
          <div>
            <a-textarea
              placeholder="请输入备注信息"
              style="height:32px;"
              v-model="description"
            ></a-textarea>
          </div>
        </div>
      </st-form>
    </div>
    <template slot="footer">
      <div :class="bFooter()">
        <div :class="bFooter('error-tip')" v-if="isStPos && isPosReqError">
          当前POS正在使用中，请选择其他POS机或稍后再试
        </div>
        <st-button
          type="primary"
          @click="onSubmit"
          :loading="loading.payTransaction"
        >
          确认收款
        </st-button>
      </div>
    </template>
  </st-modal>
</template>

<script>
import { GatheringService } from './gathering.service'
import { ruleOptions } from './gathering.config'
import { PAYMENT_TYPES } from '@/constants/pay'
import StPayment from '@/views/biz-components/payment/payment'
import StInputPay from '@/views/biz-components/input-pay/input-pay'
import BrandAppPosWaitPay from '@/views/biz-modals/brand/app/pos/wait-pay-result'
import { MessageService } from '@/services/message.service'
export default {
  name: 'ModalSoldDealGathering',
  bem: {
    b: 'modal-sold-deal-gathering',
    bOrderContent: 'modal-sold-deal-gathering-order-content',
    bOrderPay: 'modal-sold-deal-gathering-order-pay',
    bPayment: 'modal-sold-deal-gathering-payment',
    bFooter: 'modal-sold-deal-gathering-footer',
    bFold: 'modal-sold-deal-gathering-fold'
  },
  components: { StPayment, StInputPay },
  modals: { BrandAppPosWaitPay },
  serviceProviders() {
    return [GatheringService]
  },
  serviceInject() {
    return {
      gatheringService: GatheringService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      info: this.gatheringService.info$,
      loading: this.gatheringService.loading$,
      paymentMethodList: this.gatheringService.paymentMethodList$
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      description: '',
      isPosReqError: false,
      posReqErrorStr: '',
      contentFold: true,
      currentPaymentType: -1,
      inputShowList: [],
      price: ''
    }
  },
  // 订单id，签单类型
  props: ['order_id', 'type'],
  computed: {
    isStPos() {
      return this.currentPaymentType > 32
    }
  },
  created() {
    this.gatheringService
      .getPaymentInfo(this.order_id, this.type)
      .subscribe(res => {
        this.price = parseFloat(res.info.remain_amount)
        this.inputShowList = [
          { label: '已收金额(元)', value: this.info.payed_amount, type: 1 },
          { label: '应收金额(元)', value: this.info.remain_amount, type: 0 }
        ]
      })
  },
  filters: {
    dealMaxNumber: value => {
      if (!value) return
      return Number(value.substr(0, value.length - 1))
    }
  },
  methods: {
    onPaymentTypeChange(value) {
      this.currentPaymentType = value
    },
    handleContentToggleFold() {
      this.contentFold = !this.contentFold
    },
    // 关闭modal
    onCancel() {
      this.show = false
      this.$emit('cancel')
    },
    onSubmit(e) {
      e.preventDefault()
      console.log('isStPos', this.isStPos)
      if (this.currentPaymentType === -1) {
        this.messageService.error({
          content: '请选择支付方式'
        })
      }
      this.form.validate().then(values => {
        values.order_id = this.order_id
        values.description = this.description || undefined
        values.payment_type = this.currentPaymentType
        values.price = this.price
        console.log('values', values)
        this.isReqError = false
        this.gatheringService.payTransaction(values).subscribe(
          result => {
            console.log('result', result)
            this.isReqError = false
            // 如果是pos机支付,弹出pos机支付订单状态等待页
            if (this.isStPos) {
              this.show = false
              this.$emit('success', {
                type: 'pos',
                order_id: this.order_id,
                soldId: result.info.sold_id,
                posInfo: result.info,
                payInfo: values
              })
            } else {
              this.$emit('success', {
                type: 'pay',
                soldId: result.info.sold_id
              })
              this.show = false
            }
          },
          err => {
            // 判断是否是pos机支付方式,并且报错信息为pos机正在使用中
            if (err && err.response && err.response.code === 108009) {
              this.isPosReqError = true
              this.posReqErrorStr = err.response.msg
            }
          }
        )
      })
    }
  }
}
</script>
