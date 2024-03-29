<template>
  <section :class="basic()">
    <st-panel title="订单详情">
      <div slot="actions">
        <st-btn-actions
          :options="[
            {
              if: auth['brand_shop:order:order|refund'],
              text: '退款',
              click: onRefund
            },
            {
              if: auth['brand_shop:order:order|pay'],
              text: '收款',
              click: createdOrderPay
            },
            {
              if: auth['brand_shop:order:order|cancel'],
              text: '取消',
              click: onCancel
            },
            {
              if: auth['brand_shop:order:order|split'],
              text: '业绩拆分',
              click: onSplit
            }
          ]"
        ></st-btn-actions>
      </div>
      <a-row :gutter="24">
        <a-col :span="9">
          <st-info>
            <st-info-item label="订单号">{{ info.id }}</st-info-item>
            <st-info-item label="商品名称">
              {{ info.product_name }}
            </st-info-item>
            <st-info-item label="购买会员">
              {{ info.member_name }}
            </st-info-item>
            <template v-if="info.is_minors === PERSON_TYPE.CHILD">
              <st-info-item label="家长手机号">
                {{ info.parent_mobile }}
              </st-info-item>
              <st-info-item :label="`家长姓名`">
                {{ info.parent_name }}({{ info.parent_user_role }})
              </st-info-item>
            </template>
            <template v-else>
              <st-info-item label="手机号">
                {{ info.member_mobile }}
              </st-info-item>
            </template>
            <st-info-item label="下单人">{{ info.operator_name }}</st-info-item>
            <st-info-item label="下单时间">
              {{ info.created_time }}
            </st-info-item>
            <st-info-item label="销售">{{ info.staff_name }}</st-info-item>
            <st-info-item label="订单状态">
              {{ info.order_status | enumFilter('finance.order_status') }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="9">
          <st-info>
            <st-info-item label="赠送">{{ info.gift_amount }}</st-info-item>
            <st-info-item label="订单总额">{{ info.total_price }}</st-info-item>
            <st-info-item label="优惠金额">
              {{ info.order_discount }}
            </st-info-item>
            <st-info-item label="减免金额">
              {{ info.reduce_price }}
            </st-info-item>
            <st-info-item label="应收金额">{{ info.pay_price }}</st-info-item>
            <st-info-item
              label="待收金额"
              v-if="info.product_type === 12 || info.product_type === 13"
            >
              {{ info.remainder_price }}
            </st-info-item>
            <st-info-item label="支付状态">
              {{ info.pay_status | enumFilter('finance.pay_status') }}
            </st-info-item>
            <st-info-item label="业绩拆分">
              <a @click="onShowSplitInfo">详情</a>
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="6">
          <st-info>
            <st-info-item label="备注">{{ info.description }}</st-info-item>
          </st-info>
        </a-col>
      </a-row>
    </st-panel>
    <st-panel
      initial
      class="mg-t12"
      :class="basic('panel-bottom')"
      :tabs="tabs"
    >
      <router-view></router-view>
    </st-panel>
    <sold-transaction ref="soldTransaction"></sold-transaction>
  </section>
</template>
<script>
import { InfoService } from './info.service'
import ShopFinanceCancel from '@/views/biz-modals/shop/finance/cancel'
import ShopFinanceRefund from '@/views/biz-modals/shop/finance/refund'
import ShopFinanceSplit from '@/views/biz-modals/shop/finance/split'
import SoldDealGathering from '@/views/biz-modals/sold/deal/gathering'
import SoldTransaction from '@/views/biz-components/sold/transaction'
import FinanceSplitInfo from '@/views/biz-modals/finance/split-info'
import { ORDER_PRODUCT_TYPE } from '@/constants/finance/order'
import { PERSON_TYPE } from '@/constants/course/small-course'
export default {
  name: 'PageShopFinanceOrderInfo',
  bem: {
    basic: 'page-shop-finance-info'
  },
  modals: {
    ShopFinanceCancel,
    ShopFinanceRefund,
    ShopFinanceSplit,
    SoldDealGathering,
    FinanceSplitInfo
  },
  components: {
    SoldTransaction
  },
  serviceInject() {
    return {
      infoService: InfoService
    }
  },
  rxState() {
    return {
      info: this.infoService.info$,
      tabs: this.infoService.tabs$,
      auth: this.infoService.auth$
    }
  },
  data() {
    return {
      ORDER_PRODUCT_TYPE,
      PERSON_TYPE
    }
  },
  computed: {
    infoParents() {
      let parentsMess = ''
      if (typeof this.info.parents === 'object') {
        parentsMess = `${this.info.parents.name} (${this.info.parents.mobile})`
      } else {
        parentsMess = this.info.parents
      }
      return parentsMess
    }
  },
  methods: {
    // 订单收款modal
    createdOrderPay() {
      this.$modalRouter.push({
        name: 'sold-deal-gathering',
        props: {
          order_id: this.$searchQuery.id,
          type: this.productType(this.info.product_type)
        },
        on: {
          success: res => {
            console.log('res', res)
            if (res.type === 'pos') {
              this.$refs.soldTransaction.payCallBack(
                res.order_id,
                '',
                res.type,
                res
              )
            } else {
              this.$router.reload()
            }
          }
        }
      })
    },
    // 退款
    onRefund() {
      const props = {
        id: this.$searchQuery.id,
        product_type: this.info.product_type
      }
      this.$modalRouter.push({
        name: 'shop-finance-refund',
        props,
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 业务拆分
    onSplit() {
      this.$modalRouter.push({
        name: 'shop-finance-split',
        props: {
          id: this.$searchQuery.id
        },
        on: {
          success: result => {
            this.$router.reload()
          }
        }
      })
    },
    // 取消
    onCancel() {
      this.$modalRouter.push({
        name: 'shop-finance-cancel',
        props: {
          id: this.$searchQuery.id
        },
        on: {
          success: result => {
            this.$router.reload()
          }
        }
      })
    },
    productType(type) {
      let name = ''
      // 1-会员卡 2-私教课 3-团体课 4-课程包 5-储值卡 6-小班课 7-手续费 8-定金 9-押金 10-储物柜 12-云店 13-场地预约
      switch (type) {
        case 1:
          name = 'member'
          break
        case 2:
          name = 'personal'
          break
        case 3:
          name = 'member'
          break
        case 4:
          name = 'package'
          break
        case 5:
          name = 'deposit'
          break
        case 6:
          name = 'small_course_order/detail'
          break
        case 7:
          name = 'advance'
          break
        case 8:
          name = 'advance'
          break
        case 9:
          name = 'member'
          break
        case 10:
          name = 'cabinet_order'
          break
        case 12:
          name = 'cloud_store'
          break
        case 13:
          name = 'venues'
      }
      return name
    },
    onShowSplitInfo() {
      this.$modalRouter.push({
        name: 'finance-split-info',
        props: {
          value: {
            list: this.info.split_items,
            description: this.info.split_description
          }
        },
        on: {
          success() {
            vm.$router.reload()
          }
        }
      })
    }
  }
}
</script>
