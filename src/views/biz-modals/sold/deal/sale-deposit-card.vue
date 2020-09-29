<template>
  <st-modal
    title="储值卡签单"
    v-model="show"
    @cancel="onCancel"
    wrapClassName="modal-sold-deal-sale"
  >
    <div :class="sale('content')">
      <st-form :form="form" labelWidth="88px">
        <member-search
          :class="sale('member')"
          :form="form"
          :memberInfo="memberInfo"
          :saleRangeType="saleRangeType"
          isSoldDeal
          @select="onMemberChange"
          @change="onMemberChange"
        ></member-search>
        <div :class="sale('sale')">
          <st-form-item label="选择卡" required>
            <select-scroll
              v-decorator="decorators.productId"
              placeholder="请选择卡"
              notFoundContent="无搜索结果"
              :list="cardList"
              :loading="loading.getDepositCardList"
              :disabled="!!id"
              @load="handleGetList"
              @select="handleSelect"
              @search="handleSearch"
            ></select-scroll>
            <a-row
              :class="sale('info')"
              v-if="hasProductInfo"
              type="flex"
              justify="space-between"
            >
              <a-col :span="12">
                <st-info>
                  <st-info-item label="储值面额">
                    {{ info.card_price }}
                  </st-info-item>
                  <st-info-item label="有效期">
                    {{ info.valid_time }}天
                  </st-info-item>
                  <st-info-item label="支持消费类目">
                    {{ info.consume_product }}
                  </st-info-item>
                </st-info>
              </a-col>
              <a-col :span="11">
                <st-info>
                  <st-info-item label="允许转让">
                    {{ info.is_transfer }}
                  </st-info-item>
                  <st-info-item label="转让手续费">
                    {{ info.transfer_fee }}
                  </st-info-item>
                  <st-info-item label="支持消费门店">
                    {{ info.support_shop }}
                  </st-info-item>
                </st-info>
              </a-col>
            </a-row>
          </st-form-item>
          <st-form-item label="到期时间">
            {{
              moment()
                .add(info.valid_time, 'd')
                .format('YYYY-MM-DD HH:mm')
            }}
          </st-form-item>
          <editable-contract-number
            v-model="info.contract_number"
            :form="form"
          />
          <st-form-item class="mg-b12" label="商品价格">
            {{ info.sell_price }}元
          </st-form-item>
          <!-- NOTE: 功能没有实现完全所以先去掉 -->
          <!-- <st-form-item :class="sale('discounts')" label="优惠券">
            <div>
              <div :class="sale('discounts-total')">
                <span>{{ couponText }}</span>
                <a-dropdown
                  v-model="couponDropdownVisible"
                  :disabled="canChoseCoupon"
                  :class="sale({ disabled: canChoseCoupon })"
                  placement="bottomRight"
                  :getPopupContainer="trigger => trigger.parentNode"
                  :trigger="['click']"
                >
                  <div :class="sale('discounts-promotion')">
                    <span>{{ couponList.length }}张可用优惠券</span>
                    <a-icon type="right" />
                  </div>
                  <a-radio-group
                    v-model="selectCoupon"
                    @change="onSelectCouponChange"
                    :class="sale('dropdown')"
                    slot="overlay"
                  >
                    <a-menu>
                      <a-menu-item
                        @click="onSelectCoupon"
                        :key="index"
                        v-for="(item, index) in couponList"
                      >
                        <a-radio :value="item">
                          {{ item.name }}{{ item.price }}
                        </a-radio>
                      </a-menu-item>
                    </a-menu>
                  </a-radio-group>
                </a-dropdown>
              </div>
            </div>
          </st-form-item> -->
          <st-form-item :class="sale('discounts')" label="定金抵扣">
            <div>
              <div :class="sale('discounts-total')">
                <span>{{ advanceText }}</span>
                <a-dropdown
                  v-model="advanceDropdownVisible"
                  :disabled="!canChoseAdvance"
                  :class="
                    sale({
                      disabled: !canChoseAdvance
                    })
                  "
                  placement="bottomRight"
                  :getPopupContainer="trigger => trigger.parentNode"
                  :trigger="['click']"
                >
                  <div :class="sale('discounts-promotion')">
                    <span>
                      {{ advanceList.length === 0 ? '无定金' : '定金选择' }}
                    </span>
                    <a-icon type="right" />
                  </div>
                  <a-radio-group
                    v-model="selectAdvance"
                    @change="onSelectAdvanceChange"
                    :class="sale('dropdown')"
                    slot="overlay"
                  >
                    <a-menu>
                      <a-menu-item @click="onSelectAdvance">
                        <a-radio :value="undefined">不使用</a-radio>
                      </a-menu-item>
                      <a-menu-item
                        @click="onSelectAdvance"
                        :key="index"
                        v-for="(item, index) in advanceList"
                      >
                        <a-radio :value="item.id">
                          定金 {{ item.price }}
                        </a-radio>
                      </a-menu-item>
                    </a-menu>
                  </a-radio-group>
                </a-dropdown>
              </div>
            </div>
          </st-form-item>
          <st-form-item label="减免金额">
            <st-input-number
              v-model="reduceAmount"
              :float="true"
              placeholder="请输入"
            >
              <span slot="addonAfter">元</span>
            </st-input-number>
          </st-form-item>
          <st-form-item
            validateStatus="error"
            :help="orderAmountText"
            class="mg-b0"
            label="小计"
          >
            <span class="total">{{ priceInfo }}元</span>
          </st-form-item>
        </div>
        <div :class="sale('remarks')">
          <st-form-item label="销售人员" required>
            <a-select
              v-decorator="decorators.saleName"
              placeholder="选择签单的工作人员"
            >
              <a-select-option
                v-for="(item, index) in saleList"
                :key="index"
                :value="item.id"
              >
                {{ item.staff_name }}
              </a-select-option>
            </a-select>
            <div>
              <st-checkbox v-model="isFollowSalesman">
                作为用户跟进销售
              </st-checkbox>
            </div>
          </st-form-item>
          <st-form-item label="备注" class="mg-b0">
            <st-textarea
              v-model="description"
              :autosize="{ minRows: 4, maxRows: 6 }"
              :maxlength="200"
            />
          </st-form-item>
        </div>
      </st-form>
    </div>
    <template slot="footer">
      <div :class="sale('footer')">
        <div class="price">
          <span>{{ priceInfo }}元</span>
          <span>订单总额：{{ info.sell_price }}元</span>
        </div>
        <div class="button">
          <st-button @click="onCreateOrder" :loading="loading.setTransaction">
            创建订单
          </st-button>
          <st-button
            @click="onPay"
            :loading="loading.setTransactionPay"
            type="primary"
          >
            立即支付
          </st-button>
        </div>
      </div>
    </template>
  </st-modal>
</template>

<script>
import { SaleDepositCardService } from './sale-deposit-card.service'
import moment from 'moment'
import { cloneDeep, get } from 'lodash-es'
import { timer } from 'rxjs'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from './sale-deposit-card.config'
import EditableContractNumber from '@/views/biz-components/contract/editable-contract-number.vue'
import MemberSearch from '@/views/biz-components/member/member-search/member-search'
import SelectScroll from '@/views/components/select-scroll#/select-scroll'

export default {
  name: 'ModalSoldDealSaleMemberCard',
  bem: {
    sale: 'modal-sold-deal-sale'
  },
  components: {
    EditableContractNumber,
    MemberSearch,
    SelectScroll
  },
  serviceProviders() {
    return [SaleDepositCardService]
  },
  serviceInject() {
    return {
      saleDepositCardService: SaleDepositCardService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      page: this.saleDepositCardService.page$,
      loading: this.saleDepositCardService.loading$,
      finished: this.saleDepositCardService.finished$,
      priceInfo: this.saleDepositCardService.priceInfo$,
      info: this.saleDepositCardService.info$,
      cardList: this.saleDepositCardService.cardList$,
      couponList: this.saleDepositCardService.couponList$,
      saleList: this.saleDepositCardService.saleList$
    }
  },
  props: {
    id: {
      type: String
    },
    memberInfo: {
      type: Object
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      // 定金
      advanceDropdownVisible: false,
      advanceList: [],
      advanceText: '未选择定金',
      advanceAmount: '',
      selectAdvance: '',
      reduceAmount: null,
      description: '',
      // 优惠券
      selectCoupon: '',
      couponText: '未选择优惠券',
      couponAmount: '',
      couponDropdownVisible: false,
      product_id: '',
      isFollowSalesman: 0,
      product_name: ''
    }
  },
  watch: {
    selectAdvance: {
      deep: true,
      handler(newVal, oldVal) {
        this.getPrice(newVal, +this.reduceAmount)
      }
    },
    reduceAmount(newVal, oldVal) {
      this.getPrice(this.selectAdvance, +newVal)
    }
  },
  mounted() {
    this.saleDepositCardService.serviceInit().subscribe(res => {
      if (this.id) {
        this.handleGetDepositCardInfo(this.id)
      } else {
        this.saleDepositCardService
          .getDepositCardList({
            app_brand_id: this.$searchQuery.app_brand_id,
            app_shop_id: this.$searchQuery.app_shop_id,
            product_type: 2
          })
          .subscribe()
      }
    })
  },
  computed: {
    canChoseCoupon() {
      let len = this.couponList.length
      return !!len
    },
    canChoseAdvance() {
      let len = this.advanceList.length
      return (this.id || this.product_id) && len
    },
    orderAmountText() {
      return this.priceInfo < 0 ? '小计不能为负' : ''
    },
    saleRangeType() {
      return get(this.info.sale_range, 'type', 1)
    },
    hasProductInfo() {
      return JSON.stringify(this.info) !== '{}'
    }
  },
  methods: {
    moment,
    // 选择课,筛选
    handleSelect(val) {
      this.product_id = val
      this.onResetDiscounts()
      this.handleGetDepositCardInfo(val)
    },
    // 选择课,搜索
    handleSearch(product_name) {
      this.product_name = product_name
      this.saleDepositCardService
        .getDepositCardList({
          product_name,
          page: 1,
          app_brand_id: this.$searchQuery.app_brand_id,
          app_shop_id: this.$searchQuery.app_shop_id,
          product_type: 2
        })
        .subscribe()
    },
    // 获取课程列表
    handleGetList() {
      if (this.finished) return false
      this.saleDepositCardService
        .getDepositCardList({
          product_name: this.product_name,
          page: ++this.page.current_page,
          app_brand_id: this.$searchQuery.app_brand_id,
          app_shop_id: this.$searchQuery.app_shop_id,
          product_type: 2
        })
        .subscribe()
    },
    onResetDiscounts() {
      console.log('onResetDiscounts')
      // 重置优惠券及定金选择
      // this.resetCoupon()
      this.resetAdvance()
    },
    // 重新获取优惠券及定金
    onReGetDiscounts(data) {
      console.log('onReGetDiscounts')
      // 如果存在会员id则请求重新拉取优惠券及定金列表
      this.fetchAdvanceList(data)
      // this.fetchCouponList(data)
    },
    onMemberChange(data) {
      // 重置优惠券及定金选择
      this.onResetDiscounts()
      // 如果存在会员id则请求重新拉取优惠券及定金列表
      if (data) this.onReGetDiscounts(data)
    },
    onSelectAdvance() {
      timer(200).subscribe(() => {
        this.advanceDropdownVisible = false
      })
    },
    onSelectCouponChange(event) {
      let id = get(event.target.value, 'id', '')
      if (id) {
        let price = this.couponList.filter(o => o.id === id)[0].price
        this.couponAmount = price
        this.couponText = `${price}元`
      } else {
        this.couponText = '未选择优惠券'
        this.couponAmount = 0
      }
    },
    // 重置定金选择
    resetAdvance() {
      this.advanceList = []
      this.advanceText = '未选择定金'
      this.advanceAmount = ''
      this.selectAdvance = ''
    },
    // 重置优惠券选择
    resetCoupon() {
      this.saleDepositCardService.REST_COUPONLIST()
      this.couponText = '未选择优惠券'
      this.selectCoupon = ''
      this.couponAmount = ''
    },
    onCancel() {
      this.resetAdvance()
    },
    onSelectAdvanceChange(data) {
      if (!data.target.value) {
        this.advanceAmount = 0
        this.advanceText = `未选择定金`
        return
      }
      let price = this.advanceList.filter(o => o.id === data.target.value)[0]
        .price
      this.advanceAmount = price
      this.advanceText = `${price}元`
    },
    // 计算实付金额
    getPrice(advance, reduce) {
      let advanceId = advance === -1 ? '' : advance
      const memberId = this.form.getFieldValue('member_id')
      const productId = this.form.getFieldValue('productId')
      this.saleDepositCardService.priceAction$.dispatch({
        product_id: productId || undefined,
        product_type: this.info.contract_type,
        advance_id: advanceId,
        member_id: memberId || undefined,
        reduce_amount: reduce
      })
    },
    onCreateOrder() {
      this.form.validate().then(values => {
        let reduce_amount = this.reduceAmount ? +this.reduceAmount : 0
        const deposit_card_id =
          this.form.getFieldValue('productId') || undefined
        this.saleDepositCardService
          .setTransaction({
            member_id: +values.member_id,
            member_name: values.member_name,
            mobile: values.mobile ? values.mobile.phone : undefined,
            deposit_card_id,
            contract_number: this.info.contract_number,
            advance_id:
              this.selectAdvance === -1 ? undefined : this.selectAdvance,
            reduce_amount,
            sale_id: +values.saleName,
            description: this.description,
            order_amount: this.priceInfo,
            sale_range: +this.info.sale_range.type,
            is_minors: values.is_minors,
            parent_name: values.parent_name,
            parent_mobile: values.parent_mobile
              ? values.parent_mobile.phone
              : undefined,
            parent_country_prefix: values.parent_mobile
              ? values.parent_mobile.code_id
              : undefined,
            parent_user_role: values.parent_user_role,
            physical_id: values.physical_id,
            card_num: values.card_num,
            id_card: values.id_card,
            id_card_type: values.id_card_type,
            is_follow_salesman: this.isFollowSalesman
          })
          .subscribe(res => {
            this.show = false
            this.$emit('success', {
              type: 'create',
              orderId: res.info.order_id
            })
          })
      })
    },
    onPay() {
      this.form.validate().then(values => {
        let reduce_amount = this.reduceAmount ? +this.reduceAmount : 0
        const deposit_card_id =
          this.form.getFieldValue('productId') || undefined
        this.saleDepositCardService
          .setTransactionPay({
            member_id: +values.member_id,
            member_name: values.member_name,
            mobile: values.mobile ? values.mobile.phone : undefined,
            deposit_card_id,
            contract_number: this.info.contract_number,
            advance_id:
              this.selectAdvance === -1 ? undefined : this.selectAdvance,
            reduce_amount,
            sale_id: +values.saleName,
            description: this.description,
            order_amount: this.priceInfo,
            sale_range: +this.info.sale_range.type,
            is_minors: values.is_minors,
            parent_name: values.parent_name,
            parent_mobile: values.parent_mobile
              ? values.parent_mobile.phone
              : undefined,
            parent_country_prefix: values.parent_mobile
              ? values.parent_mobile.code_id
              : undefined,
            parent_user_role: values.parent_user_role,
            physical_id: values.physical_id,
            card_num: values.card_num,
            id_card: values.id_card,
            id_card_type: values.id_card_type,
            is_follow_salesman: this.isFollowSalesman
          })
          .subscribe(res => {
            this.show = false
            this.$emit('success', {
              type: 'createPay',
              orderId: res.info.order_id
            })
          })
      })
    },
    // 获取课程详情
    handleGetDepositCardInfo(productId) {
      this.saleDepositCardService.getInfo(productId).subscribe(res => {
        if (this.id) {
          this.saleDepositCardService.SET_LIST([
            {
              id: +this.id,
              product_name: this.info.product_name
            }
          ])
        }
        setTimeout(() => {
          this.form.setFieldsValue({
            productId: +productId
          })
          this.onReGetDiscounts()
          this.getPrice(this.selectAdvance, +this.reduceAmount)
        })
      })
    },
    // 获取优惠券列表
    fetchCouponList(memberId) {
      const member_id = this.form.getFieldValue('member_id') || memberId
      const card_id = this.info.product_id
      if (card_id && member_id) {
        const params = {
          member_id,
          card_id
        }
        this.saleDepositCardService.getCouponList(params).subscribe()
      }
    },
    // 获取定金列表
    fetchAdvanceList(id) {
      let member_id = this.form.getFieldValue('member_id') || id
      if (member_id) {
        this.saleDepositCardService.getAdvanceList(member_id).subscribe(res => {
          this.advanceList = cloneDeep(res.list)
        })
      }
    }
  }
}
</script>
