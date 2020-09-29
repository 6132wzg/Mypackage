<template>
  <div></div>
</template>

<script>
import SoldDealGathering from '@/views/biz-modals/sold/deal/gathering'
import SoldDealSaleCabinet from '@/views/biz-modals/sold/deal/sale-cabinet'
import SoldDealSaleCourse from '@/views/biz-modals/sold/deal/sale-course'
import SoldDealSaleDepositCard from '@/views/biz-modals/sold/deal/sale-deposit-card'
import SoldDealSaleMemberCard from '@/views/biz-modals/sold/deal/sale-member-card'
import SoldDealSalePersonalCourse from '@/views/biz-modals/sold/deal/sale-personal-course'
import SoldDealSaleSmallCourse from '@/views/biz-modals/sold/deal/sale-small-course'
import SoldDealGatheringTip from '@/views/biz-modals/sold/deal/gathering-tip'
import SoldDealWaitPay from '@/views/biz-modals/brand/app/pos/wait-pay-result'
import { PRODUCT_TYPE } from '@/constants/sold/transaction'
import { OssService } from '@/services/oss.service'
export default {
  name: 'SoldTransaction',
  props: {},
  modals: {
    SoldDealWaitPay,
    SoldDealGathering,
    SoldDealSaleCabinet,
    SoldDealSaleCourse,
    SoldDealSaleDepositCard,
    SoldDealSaleMemberCard,
    SoldDealSalePersonalCourse,
    SoldDealGatheringTip,
    SoldDealSaleSmallCourse
  },
  serviceInject() {
    return {
      ossService: OssService
    }
  },
  data() {
    return {
      PRODUCT_TYPE
    }
  },
  methods: {
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
    // 订单收款回调
    // modelType 业务类型 如储值卡签单 会员卡签单等
    async payCallBack(orderId, modalType, callBackType, callBackData) {
      switch (callBackType) {
        case 'cancel':
          this.onSearch()
          break
        case 'pay':
          this.createdGatheringTip({
            message: '收款成功',
            order_id: orderId
          }).then(res => {
            this.tipCallBack(orderId, modalType, res.type)
          })
          break
        case 'pos':
          this.createdWaitPay(callBackData).then(() => {
            this.createdGatheringTip({
              message: '收款成功',
              order_id: orderId
            }).then(res => {
              this.tipCallBack(orderId, modalType, res.type)
            })
          })
          break
      }
    },
    // 提示框回调，gathering-tip
    async tipCallBack(orderId, modalType, callBackType) {
      switch (callBackType) {
        case 'cancel':
          this.$router.reload()
          break
        case 'Print':
          this.createdOrderPrint(orderId)
          break
        case 'ViewOrder':
          this.createdOrderViewOrder(orderId)
          break
        /**
         * 查看售出详情
         */
        case 'ViewOrder':
          this.createdOrderViewOrder(orderId)
          break
        case 'PrintOrder':
          this.printOrder(orderId)
          break
        case 'Pay':
          this.createdOrderPay({ order_id: orderId, type: modalType }).then(
            res => {
              this.payCallBack(orderId, modalType, res.type, res)
            }
          )
          break
      }
    },
    /**
     * 交易签单，签单操作
     * @params order_id 订单id
     * @params product_type 签单类型
     * @params member_id 会员id
     * @params member_name 会员姓名
     * @params member_mobile 会员手机号
     * @params id_card 证件号
     * @params id_card_type 证件类型
     * @params card_num 实体卡号
     * @params physical_id 物理ID
     */
    onTransaction(
      order_id,
      product_type,
      member_id,
      member_name,
      member_mobile,
      id_card,
      id_card_type,
      card_num,
      physical_id
    ) {
      let props = {}
      if (order_id) {
        props = {
          id: order_id,
          memberInfo: {
            member_id,
            member_name,
            member_mobile,
            id_card,
            id_card_type,
            card_num,
            physical_id
          }
        }
      }
      switch (product_type) {
        case this.PRODUCT_TYPE.MEMBER_CARD:
          this.onMember(props)
          break
        case this.PRODUCT_TYPE.DEPOSIT_CARD:
          this.onDeposit(props)
          break
        case this.PRODUCT_TYPE.PERSONAL_COURSE:
          this.onPersonalCourse(props)
          break
        case this.PRODUCT_TYPE.PACKAGE:
          this.onPackage(props)
          break
        case this.PRODUCT_TYPE.CABINET:
          this.onCabinet(props)
          break
        case this.PRODUCT_TYPE.SMALL_COURSE:
          this.onSmallCourse(props)
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
        this.tipCallBack(result.orderId, type, orderSuccessRes.type)
      } else if (result.type === 'createPay') {
        // 创建订单成功 并且到支付页面
        let props = {
          order_id: result.orderId,
          type
        }
        let payOrderRes = await this.createdOrderPay(props)
        this.payCallBack(result.orderId, type, payOrderRes.type, payOrderRes)
      }
    },
    // 打印小票
    printOrder(order_id) {
      window.open(
        '/ticket/gathering-print?id=' + order_id,
        '_blank',
        'width=800,height=600'
      )
    },
    // 会员卡签单
    onMember(props) {
      this.$modalRouter.push({
        name: 'sold-deal-sale-member-card',
        props,
        on: {
          success: result => {
            this.saleCallBack(result, 'member')
          }
        }
      })
    },
    // 储值卡签单
    onDeposit(props) {
      this.$modalRouter.push({
        name: 'sold-deal-sale-deposit-card',
        props,
        on: {
          success: result => {
            this.saleCallBack(result, 'deposit')
          }
        }
      })
    },
    // 储物柜签单
    onCabinet(props) {
      props.id = '0' // 默认传0，因为没有选择具体的柜子
      props.areaId = props.id
      this.$modalRouter.push({
        name: 'sold-deal-sale-cabinet',
        props,
        on: {
          success: result => {
            this.saleCallBack(result, 'cabinet_order')
          }
        }
      })
    },
    // 课程包签单
    onPackage(props) {
      this.$modalRouter.push({
        name: 'sold-deal-sale-course',
        props,
        on: {
          success: result => {
            this.saleCallBack(result, 'package')
          }
        }
      })
    },
    // 私教课签单
    onPersonalCourse(props) {
      this.$modalRouter.push({
        name: 'sold-deal-sale-personal-course',
        props,
        on: {
          success: result => {
            this.saleCallBack(result, 'personal')
          }
        }
      })
    },
    // 小班课签单
    onSmallCourse(props) {
      this.$modalRouter.push({
        name: 'sold-deal-sale-small-course',
        props,
        on: {
          success: result => {
            this.saleCallBack(result, 'small_course_order/detail')
          }
        }
      })
    },
    // 打印合同
    createdOrderPrint(order_id) {
      let url = `${window.location.origin}/common/contract-preview?id=${order_id}`
      this.ossService.openNewTab(url)
    },
    // 查看订单
    createdOrderViewOrder(order_id) {
      this.$router.push({
        name: 'shop-finance-order-info-collection-details',
        query: {
          id: order_id
        }
      })
    }
  }
}
</script>
