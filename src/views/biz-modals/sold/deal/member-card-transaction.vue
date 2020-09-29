<template>
  <st-modal
    :title="title"
    v-model="show"
    @cancel="onCancel"
    wrapClassName="modal-sold-deal-sale"
  >
    <div :class="sale('content')">
      <st-form :form="form" labelWidth="88px">
        <member-search
          v-if="!isRenewal"
          :class="sale('member')"
          :form="form"
          :memberInfo="memberInfo"
          :saleRangeType="saleRangeType"
          isSoldDeal
          @select="onMemberChange"
          @change="onMemberChange"
        ></member-search>
        <st-form-item label="续卡会员" class="mg-b0">
          {{ renewalInfo.member_name }}
        </st-form-item>
        <div :class="sale('sale')">
          <st-form-item label="选择卡" required>
            <select-scroll
              v-decorator="decorators.productId"
              placeholder="请选择卡"
              notFoundContent="无搜索结果"
              :list="cardList"
              :loading="loading.getMemberCardList"
              :disabled="!isRenewal && !!id"
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
                  <st-info-item label="类型" v-if="info.product_type">
                    {{ info.product_type.name }}
                  </st-info-item>
                  <st-info-item label="允许转让">
                    {{ info.is_transfer }}
                  </st-info-item>
                  <st-info-item label="转让手续费">
                    {{ info.transfer_fee }}
                  </st-info-item>
                  <st-info-item label="赠送上限">
                    {{ selectedNorm.gift_max_name }}
                  </st-info-item>
                  <st-info-item label="支持约课权益">
                    {{ info.course_interests }}
                  </st-info-item>
                </st-info>
              </a-col>
              <a-col :span="11">
                <st-info>
                  <st-info-item
                    label="支持入场人数"
                    v-if="info.card_number_type === 2"
                  >
                    {{ info.support_member_num }}
                  </st-info-item>
                  <st-info-item label="售卖群体" v-if="info.sale_range">
                    {{ info.sale_range.name }}
                  </st-info-item>
                  <st-info-item label="冻结上限">
                    {{ selectedNorm.frozen_max_name }}
                  </st-info-item>
                </st-info>
              </a-col>
            </a-row>
          </st-form-item>
          <assign-shop
            v-if="info.admission_range_info"
            label="入场场馆"
            :form="form"
            :type="info.admission_range_info.admission_range"
            :shopIds="info.admission_range_info.product_support_shops"
            required
            :disabled="
              info.auth && !info.auth['shop:sold:transaction|right_price_edit']
            "
            @change="onShopChange"
          />
          <template v-if="hasProductInfo">
            <st-form-item label="卡成员" v-if="info.card_number_type === 2">
              <add-card-member
                v-model="memberChildrenlist"
                :max="info.support_member_num - 1"
                :type="info.sale_range.type"
              ></add-card-member>
            </st-form-item>
            <st-form-item label="规格" required>
              <a-radio-group
                @change="onChangeSpecs"
                v-decorator="decorators.specs"
              >
                <a-radio
                  v-for="(item, index) in info.specs"
                  :value="item"
                  :key="index"
                >
                  {{ item.specs_name }}/{{ item.price }}
                </a-radio>
              </a-radio-group>
            </st-form-item>
            <st-form-item label="开卡方式" required>
              <a-radio-group
                @change="onChangePayment"
                v-decorator="decorators.open_type"
              >
                <a-radio
                  v-for="(item, index) in info.open_type"
                  :value="item"
                  :key="index"
                >
                  {{ item.open_type }}
                </a-radio>
              </a-radio-group>
            </st-form-item>
            <st-form-item label="有效时间">
              <div v-if="selectedPayment.id == 1">
                {{
                  moment(validStartTime).format('YYYY-MM-DD HH:mm')
                }}&nbsp;至&nbsp;{{ validEndTime }}
              </div>
              <div v-if="selectedPayment.id == 2">
                {{ selectedPayment.automatic_num }}天内未开卡，则{{
                  selectedPayment.automatic_num + 1
                }}天0：00自动开卡
              </div>
              <div v-if="selectedPayment.id == 3">
                <a-date-picker
                  showTime
                  v-model="validStartTime"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择开始时间"
                  :disabledDate="disabledDate"
                  @change="onChangeTime"
                />
                至 {{ validEndTime }}
              </div>
            </st-form-item>
          </template>

          <st-form-item label="购买赠送">
            <st-input-number
              :min="0"
              :max="selectedNorm.gift_max"
              placeholder="请输入赠送的天数/次数"
              style="width: 100%"
              v-model="gift_amount"
            >
              <span slot="addonAfter">{{ giftUnit }}</span>
            </st-input-number>
          </st-form-item>
          <!-- 合同编号 -->
          <editable-contract-number
            v-model="info.contract_number"
            :form="form"
          />
          <st-form-item class="mg-b12" label="商品价格">
            <editable-number
              v-model="selectedNorm.price"
              unit="元"
              :disabled="
                info.auth &&
                  !info.auth['shop:sold:transaction|right_price_edit']
              "
              :form="form"
              @ok="onPriceChange"
            />
          </st-form-item>
          <st-form-item :class="sale('discounts')" label="优惠券">
            <div>
              <div :class="sale('discounts-total')">
                <span>{{ couponText }}</span>
                <a-dropdown
                  v-model="couponDropdownVisible"
                  :disabled="!canChoseCoupon"
                  :class="sale({ disabled: !canChoseCoupon })"
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
                      <a-menu-item @click="onSelectCoupon">
                        <a-radio :value="undefined">不使用</a-radio>
                      </a-menu-item>
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
          </st-form-item>
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
                    <span>定金选择</span>
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
            <span class="total">{{ currentPrice }}元</span>
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
          <span>{{ currentPrice }}元</span>
          <span>订单总额：{{ selectedNorm.price }}元</span>
        </div>
        <div class="button">
          <st-button @click="onCreateOrder" :loading="loading.createOrder">
            创建订单
          </st-button>
          <st-button @click="onPay" :loading="loading.pay" type="primary">
            立即支付
          </st-button>
        </div>
      </div>
    </template>
  </st-modal>
</template>

<script>
import { MemberCardTransactionService } from './member-card-transaction.service'
import moment from 'moment'
import { cloneDeep, get } from 'lodash-es'
import { timer } from 'rxjs'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from './member-card-transaction.config'
import EditableContractNumber from '@/views/biz-components/contract/editable-contract-number.vue'
import AddCardMember from '@/views/biz-components/member/add-card-member/add-card-member'
import SelectScroll from '@/views/components/select-scroll#/select-scroll'
import { MessageService } from '@/services/message.service'
import MemberSearch from '@/views/biz-components/member/member-search/member-search'
import AssignShop from '@/views/biz-components/shop/assign-shop/assign-shop'
import EditableNumber from '@/views/components/editable-number#/editable-number'

export default {
  bem: {
    sale: 'modal-sold-deal-sale'
  },
  components: {
    EditableContractNumber,
    AddCardMember,
    MemberSearch,
    SelectScroll,
    AssignShop,
    EditableNumber
  },
  serviceProviders() {
    return [MemberCardTransactionService]
  },
  serviceInject() {
    return {
      transactionService: MemberCardTransactionService,
      messageService: MessageService,
      pattern: PatternService
    }
  },
  rxState() {
    const {
      page$,
      loading$,
      finished$,
      info$,
      cardList$,
      saleList$,
      couponList$,
      currentPrice$,
      renewalInfo$
    } = this.transactionService
    return {
      page: page$,
      loading: loading$,
      finished: finished$,
      info: info$,
      cardList: cardList$,
      saleList: saleList$,
      couponList: couponList$,
      currentPrice: currentPrice$,
      renewalInfo: renewalInfo$
    }
  },
  props: {
    id: {
      type: String,
      description: '会员卡售出id'
    },
    memberInfo: {
      type: Object
    },
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      // 搜索卡成员
      memberChildrenSearchText: '',
      searchMemberChildrenIsShow: true,
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
      // 规格选项
      selectedNorm: '',
      // 开卡方式选择
      selectedPayment: '',
      // 会员卡结束日期
      validStartTime: moment(),
      validEndTime: '',
      // 赠送天数
      gift_amount: 0,
      // 卡成员展示
      memberChildrenlist: [],
      product_id: '',
      isFollowSalesman: 0,
      product_name: ''
    }
  },
  computed: {
    /**
     * 是否是续卡类型
     */
    isRenewal() {
      return this.type === 'renewal'
    },
    canChoseAdvance() {
      let len = this.advanceList.length
      return (this.id || this.product_id) && len
    },
    canChoseCoupon() {
      let len = this.couponList.length
      return !!len
    },
    orderAmountText() {
      return this.currentPrice < 0 ? '小计不能为负' : ''
    },
    giftUnit() {
      let unit = '天'
      if (this.info.product_type && this.info.product_type.id === 1) {
        unit = '次'
      }
      return unit
    },
    saleRangeType() {
      return get(this.info.sale_range, 'type', 1)
    },
    hasProductInfo() {
      return JSON.stringify(this.info) !== '{}'
    }
  },
  watch: {
    selectCoupon: {
      deep: true,
      handler(newVal, oldVal) {
        this.getPrice(newVal, this.selectAdvance, +this.reduceAmount)
      }
    },
    selectAdvance: {
      deep: true,
      handler(newVal, oldVal) {
        this.getPrice(this.selectCoupon, newVal, +this.reduceAmount)
      }
    },
    reduceAmount(newVal, oldVal) {
      this.getPrice(this.selectCoupon, this.selectAdvance, +newVal)
    }
  },
  mounted() {
    this.transactionService
      .serviceInit(this.id, 'renewal')
      .subscribe(result => {
        if (this.id && !this.isRenewal) {
          this.handleGetMemberCardInfo(this.id)
        } else {
          this.transactionService
            .getMemberCardList({
              app_brand_id: this.$searchQuery.app_brand_id,
              app_shop_id: this.$searchQuery.app_shop_id,
              product_type: 1
            })
            .subscribe()
        }
      })
  },
  methods: {
    moment,
    // 选择会员卡,筛选
    handleSelect(val) {
      this.product_id = val
      this.onResetDiscounts()
      this.handleGetMemberCardInfo(val)
    },
    // 选择会员卡,搜索
    handleSearch(product_name) {
      this.product_name = product_name
      this.transactionService
        .getMemberCardList({
          product_name,
          current_page: 1,
          app_brand_id: this.$searchQuery.app_brand_id,
          app_shop_id: this.$searchQuery.app_shop_id,
          product_type: 1
        })
        .subscribe()
    },
    // 规格发生改变
    onChangeSpecs(event) {
      this.selectedNorm = event.target.value
      this.fetchCouponList()
      this.gift_amount = ''
      this.getPrice(this.selectCoupon, this.selectAdvance, +this.reduceAmount)
      this.validEndTime = moment(this.validStartTime)
        .add(event.target.value.valid_time, 'days')
        .format('YYYY-MM-DD HH:mm')
    },
    // 开卡方式发生改变
    onChangePayment(event) {
      this.selectedPayment = event.target.value
      if (this.selectedPayment.id !== 2) {
        this.validStartTime = moment()
        this.validEndTime = moment()
          .add(this.selectedNorm.valid_time, 'days')
          .format('YYYY-MM-DD HH:mm')
      }
      this.fetchCouponList()
    },
    // 选择指定日期开卡
    onChangeTime(event) {
      if (event) {
        this.validEndTime = moment(event._d)
          .add(this.selectedNorm.valid_time, 'days')
          .format('YYYY-MM-DD HH:mm')
      }
    },
    onResetDiscounts() {
      console.log('onResetDiscounts')
      // 重置优惠券及定金选择
      this.resetCoupon()
      this.resetAdvance()
    },
    // 重新获取优惠券及定金
    onReGetDiscounts(data) {
      console.log('onReGetDiscounts')
      // 如果存在会员id则请求重新拉取优惠券及定金列表
      this.fetchAdvanceList(data)
      this.fetchCouponList(data)
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
    onSelectCoupon() {
      timer(200).subscribe(() => {
        this.couponDropdownVisible = false
      })
    },
    // 重置定金选择
    resetAdvance() {
      this.advanceList = []
      this.advanceText = '未选择定金'
      this.selectAdvance = ''
      this.advanceAmount = ''
    },
    // 重置优惠券选择
    resetCoupon() {
      this.couponText = '未选择优惠券'
      this.selectCoupon = ''
      this.couponAmount = ''
      this.transactionService.REST_COUPONLIST()
    },
    onCancel() {
      this.onResetDiscounts()
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
    onSelectCouponChange(event) {
      let id = get(event.target.value, 'id', '')
      console.log('id', id)

      if (id) {
        let price = this.couponList.filter(o => o.id === id)[0].price
        this.couponAmount = price
        this.couponText = `${price}元`
      } else {
        this.couponText = '未选择优惠券'
        this.couponAmount = 0
      }
    },
    // 计算实付金额
    getPrice(coupon, advance, reduce) {
      const memberId = this.form.getFieldValue('member_id')
      const productId = this.form.getFieldValue('productId') || undefined
      this.transactionService.currentPriceAction$.dispatch({
        product_id: productId,
        product_type: this.info.contract_type,
        coupon_id: coupon ? coupon.id : undefined,
        member_id: memberId || undefined,
        advance_id: advance || undefined,
        reduce_amount: reduce || undefined,
        transaction_price: this.selectedNorm.price,
        specs_id: this.selectedNorm.id
      })
    },
    onPriceChange() {
      /**
       * 商品价格变化后重置优惠券和定金和减免金额
       */
      this.reduceAmount = ''
      // 重置优惠券及定金选择
      this.onResetDiscounts()
      this.onReGetDiscounts()
      this.getPrice(this.selectCoupon, this.selectAdvance, this.reduceAmount)
    },
    getParams(values) {
      const productId = this.form.getFieldValue('productId') || undefined
      const {
        admission_range,
        product_support_shops: sold_product_support_shops
      } = this.info.admission_range_info
      const params = {
        member_id: values.member_id,
        member_name: values.member_name,
        mobile: values.mobile ? values.mobile.phone : undefined,
        product_id: productId,
        contract_number: this.info.contract_number,
        admission_range,
        sold_product_support_shops,
        transaction_amount: this.selectedNorm.price,
        specs_id: values.specs.id,
        open_card_type: values.open_type.id,
        valid_start_time: moment(this.validStartTime).format(
          'YYYY-MM-DD HH:mm'
        ),
        coupon_id: this.selectCoupon.id,
        advance_id: this.selectAdvance,
        gift_amount: this.gift_amount || 0,
        reduce_amount: this.reduceAmount || 0,
        sale_id: values.saleName,
        description: this.description,
        sale_range: this.info.sale_range.type,
        order_amount: this.currentPrice,
        family_member_ids: this.memberChildrenlist
          .filter(item => !!item.id)
          .map(item => item.id),
        family_member_info: this.memberChildrenlist.filter(item => !item.id),
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
      }
      if (this.isRenewal) {
        params.member_id = this.renewalInfo.member_id
      }
      return params
    },
    onCreateOrder() {
      this.form.validate().then(values => {
        const params = this.getParams(values)
        this.transactionService
          .createOrder(this.isRenewal, this.id, params)
          .subscribe(res => {
            this.$emit('success', {
              type: 'create',
              orderId: res.info.order_id
            })
            this.show = false
          })
      })
    },
    onPay() {
      this.form.validate().then(values => {
        const params = this.getParams(values)
        this.transactionService
          .pay(this.isRenewal, this.id, params)
          .subscribe(res => {
            this.$emit('success', {
              type: 'createPay',
              orderId: res.info.order_id
            })
            this.show = false
          })
      })
    },
    // 获取会员卡列表
    handleGetList(product_name) {
      if (this.finished) return false
      this.transactionService
        .getMemberCardList({
          product_name: this.product_name,
          current_page: ++this.page.current_page,
          app_brand_id: this.$searchQuery.app_brand_id,
          app_shop_id: this.$searchQuery.app_shop_id,
          product_type: 1
        })
        .subscribe()
    },
    // 获取会员卡详情
    handleGetMemberCardInfo(productId) {
      this.transactionService.getInfo(productId).subscribe(res => {
        if (this.id && !this.isRenewal) {
          this.transactionService.SET_LIST([
            {
              id: +this.id,
              product_name: this.info.product_name
            }
          ])
        }
        setTimeout(() => {
          this.selectedNorm = this.info.specs[0]
          this.selectedPayment = this.info.open_type[0]
          this.form.setFieldsValue({
            productId: +productId,
            specs: this.selectedNorm,
            open_type: this.selectedPayment
          })
          this.validStartTime = moment()
          this.validEndTime = moment()
            .add(this.selectedNorm.valid_time, 'days')
            .format('YYYY-MM-DD HH:mm')
          this.onReGetDiscounts()
          this.getPrice()
        })
      })
    },
    fetchCouponList(id) {
      const card_id = this.info.id
      const specs_id = this.selectedNorm.id
      const member_id = this.form.getFieldValue('member_id') || id
      const transaction_price = this.selectedNorm.price
      console.log('member_id', member_id)
      if (this.selectedNorm && this.selectedPayment && card_id && member_id) {
        const params = {
          member_id,
          card_id,
          specs_id,
          transaction_price
        }
        this.transactionService.getCouponList(params).subscribe()
      }
    },
    // 获取定金列表
    fetchAdvanceList(id) {
      let member_id = this.form.getFieldValue('member_id') || id
      console.log('member_id', member_id)
      if (member_id) {
        this.transactionService.getAdvanceList(member_id).subscribe(res => {
          this.advanceList = cloneDeep(res.list)
        })
      }
    },
    onShopChange(type, shopIds) {
      this.info.admission_range_info.admission_range = type
      this.info.admission_range_info.product_support_shops = shopIds
    },
    disabledDate(current) {
      return current && current < moment().subtract(90, 'days')
    }
  }
}
</script>
