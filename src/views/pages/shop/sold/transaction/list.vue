<template>
  <st-panel initial app :class="basic()">
    <st-table
      :page="page"
      :class="basic('table')"
      rowKey="id"
      :loading="loading.getProductList"
      :columns="columns"
      @change="onTableChange"
      :dataSource="list"
    >
      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <a
            v-if="record.auth['shop:sold:transaction|order']"
            @click="onTransaction(record)"
          >
            签单
          </a>
        </st-table-actions>
      </div>
    </st-table>
  </st-panel>
</template>

<script>
import {
  PRODUCT_TYPE,
  SOLD_DETAIL_PAGE_NAMES
} from '@/constants/sold/transaction'
import { ListService } from './list.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './list.config'
import SoldDealGatheringTip from '@/views/biz-modals/sold/deal/gathering-tip'
import SoldDealGathering from '@/views/biz-modals/sold/deal/gathering'
import SoldDealSaleCabinet from '@/views/biz-modals/sold/deal/sale-cabinet'
import SoldDealSaleCourse from '@/views/biz-modals/sold/deal/sale-course'
import SoldDealSaleDepositCard from '@/views/biz-modals/sold/deal/sale-deposit-card'
import SoldDealSaleMemberCard from '@/views/biz-modals/sold/deal/sale-member-card'
import SoldDealSalePersonalCourse from '@/views/biz-modals/sold/deal/sale-personal-course'
import SoldDealSaleSmallCourse from '@/views/biz-modals/sold/deal/sale-small-course'
import SoldDealWaitPay from '@/views/biz-modals/brand/app/pos/wait-pay-result'
export default {
  name: 'PageShopSoldLease',
  mixins: [tableMixin],
  bem: {
    basic: 'page-shop-sold',
    sale: 'page-shop-sold-sale'
  },
  modals: {
    SoldDealGatheringTip,
    SoldDealGathering,
    SoldDealSaleCabinet,
    SoldDealSaleCourse,
    SoldDealSaleDepositCard,
    SoldDealSaleMemberCard,
    SoldDealSalePersonalCourse,
    SoldDealSaleSmallCourse,
    SoldDealWaitPay
  },
  props: {
    product_type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      PRODUCT_TYPE
    }
  },
  serviceInject() {
    return {
      listService: ListService
    }
  },
  rxState() {
    return {
      list: this.listService.list$,
      page: this.listService.page$,
      loading: this.listService.loading$,
      productTypes: this.listService.productTypes$,
      auth: this.listService.auth$
    }
  },
  computed: {
    columns
  },
  mounted() {
    this.$searchQuery.product_type = this.product_type
    this.getList()
  },
  watch: {
    $searchQuery() {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.listService.getProductList(this.$searchQuery).subscribe()
    },
    // 签单
    onTransaction(record) {
      switch (this.$searchQuery.product_type) {
        case this.PRODUCT_TYPE.MEMBER_CARD:
          this.onMember(record)
          break
        case this.PRODUCT_TYPE.DEPOSIT_CARD:
          this.onDeposit(record)
          break
        case this.PRODUCT_TYPE.PERSONAL_COURSE:
          this.onPersonalCourse(record)
          break
        case this.PRODUCT_TYPE.PACKAGE:
          this.onPackage(record)
          break
        case this.PRODUCT_TYPE.CABINET:
          this.onCabinet(record)
          break
        case this.PRODUCT_TYPE.SMALL_COURSE:
          this.onSmallCourse(record)
          break
      }
    },
    // 打印合同
    createdOrderPrint(order_id) {
      let url = `${window.location.origin}/common/contract-preview?id=${order_id}`
      window.open(url)
    },
    // 查看订单
    createdOrderViewOrder(order_id) {
      this.$router.push({
        name: 'shop-finance-order-info-collection-details',
        query: {
          id: order_id
        }
      })
    },
    viewSoldDetetail(soldId, type) {
      const name = SOLD_DETAIL_PAGE_NAMES[type]
      this.$router.push({
        name,
        query: {
          id: soldId
        }
      })
    },
    // 打印小票
    printOrder(order_id) {
      window.open(
        '/ticket/gathering-print?id=' + order_id,
        '_blank',
        'width=800,height=600'
      )
    },
    // 订单收款modal
    createdOrderPay(props) {
      return new Promise((resolve, reject) => {
        this.$modalRouter.push({
          name: 'sold-deal-gathering',
          props,
          on: {
            success: resolve
          }
        })
      })
    },
    // 创建成功，提示框modal
    createdGatheringTip(props) {
      return new Promise((resolve, reject) => {
        this.$modalRouter.push({
          name: 'sold-deal-gathering-tip',
          props,
          on: {
            success: resolve
          }
        })
      })
    },
    // 等待支付回调modal
    createdWaitPay(props) {
      return new Promise((resolve, reject) => {
        this.$modalRouter.push({
          name: 'sold-deal-wait-pay',
          props,
          on: {
            success: resolve
          }
        })
      })
    },
    // 提示框回调，gathering-tip
    async tipCallBack(params = {}) {
      const { orderId, soldId, modalType, callBackType } = params
      switch (callBackType) {
        case 'cancel':
          this.getList()
          break
        case 'Print':
          this.createdOrderPrint(orderId)
          break
        case 'ViewOrder':
          this.createdOrderViewOrder(orderId)
          break
        case 'PrintOrder':
          this.printOrder(orderId)
          break
        case 'viewSoldDetetail':
          this.viewSoldDetetail(soldId, modalType)
          break
        case 'Pay':
          this.createdOrderPay({
            order_id: orderId,
            type: modalType
          }).then(res => {
            this.payCallBack({
              orderId,
              soldId: res.soldId,
              modalType,
              callBackType: res.type,
              callBackData: res
            })
          })
          break
      }
    },
    // 订单收款回调
    async payCallBack(params) {
      const { orderId, soldId, modalType, callBackType, callBackData } = params
      switch (callBackType) {
        case 'cancel':
          this.getList()
          break
        case 'pay':
          this.createdGatheringTip({
            message: '收款成功',
            type: this.product_type
          }).then(res => {
            this.tipCallBack({
              orderId,
              soldId,
              modalType,
              callBackType: res.type
            })
          })
          break
        case 'pos':
          this.createdWaitPay(callBackData).then(() => {
            this.createdGatheringTip({
              message: '收款成功',
              type: this.product_type,
              order_id: orderId
            }).then(res => {
              this.tipCallBack({
                orderId,
                soldId: res.soldId,
                modalType,
                callBackType: res.type
              })
            })
          })
          break
      }
    },
    // 签单成功回调
    async saleCallBack(result, type) {
      if (result.type === 'create') {
        // 创建订单成功
        let props = {
          order_id: result.orderId,
          type,
          message: '订单创建成功',
          needPay: true
        }
        let orderSuccessRes = await this.createdGatheringTip(props)
        this.tipCallBack({
          orderId: result.orderId,
          soldId: result.soldId,
          modalType: type,
          callBackType: orderSuccessRes.type
        })
      } else if (result.type === 'createPay') {
        // 创建订单成功 并且到支付页面
        let props = {
          order_id: result.orderId,
          type
        }
        let payOrderRes = await this.createdOrderPay(props)
        this.payCallBack({
          orderId: result.orderId,
          soldId: payOrderRes.soldId,
          modalType: type,
          callBackType: payOrderRes.type,
          callBackData: payOrderRes
        })
      }
    },
    // 会员卡签单
    onMember(record) {
      this.$modalRouter.push({
        name: 'sold-deal-sale-member-card',
        props: {
          id: `${record.id}`
        },
        on: {
          success: result => {
            this.saleCallBack(result, 'member')
          }
        }
      })
    },
    // 储值卡签单
    onDeposit(record) {
      this.$modalRouter.push({
        name: 'sold-deal-sale-deposit-card',
        props: {
          id: `${record.id}`
        },
        on: {
          success: result => {
            this.saleCallBack(result, 'deposit')
          }
        }
      })
    },
    // 储物柜签单
    onCabinet(record) {
      this.$modalRouter.push({
        name: 'sold-deal-sale-cabinet',
        props: {
          // 默认传0，因为没有选择具体的柜子
          id: '0',
          areaId: `${record.id}`
        },
        on: {
          success: result => {
            this.saleCallBack(result, 'cabinet_order')
          }
        }
      })
    },
    // 课程包签单
    onPackage(record) {
      this.$modalRouter.push({
        name: 'sold-deal-sale-course',
        props: {
          id: `${record.id}`
        },
        on: {
          success: result => {
            this.saleCallBack(result, 'package')
          }
        }
      })
    },
    // 私教课签单
    onPersonalCourse(record) {
      this.$modalRouter.push({
        name: 'sold-deal-sale-personal-course',
        props: {
          id: `${record.id}`
        },
        on: {
          success: result => {
            this.saleCallBack(result, 'personal')
          }
        }
      })
    },
    // 小班课签单
    onSmallCourse(record) {
      this.$modalRouter.push({
        name: 'sold-deal-sale-small-course',
        props: {
          id: `${record.id}`
        },
        on: {
          success: result => {
            this.saleCallBack(result, 'small_course_order/detail')
          }
        }
      })
    },
    onTableChange(pagination) {
      this.$searchQuery.current_page = pagination.current
      this.$searchQuery.size = pagination.pageSize
      this.getList()
    }
  }
}
</script>
