<template>
  <st-modal
    title="小班课签单"
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
          <st-form-item label="选择课" required>
            <select-scroll
              v-decorator="decorators.productId"
              placeholder="请选择课"
              notFoundContent="无搜索结果"
              :list="courseList"
              :loading="loading.getSmallCourseList"
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
                  <st-info-item label="允许转让">
                    {{ info.is_transfer }}
                  </st-info-item>
                  <st-info-item label="转让手续费">
                    {{ info.transfer_fee }}
                  </st-info-item>
                  <st-info-item label="开班条件">
                    {{ info.num_min }}~{{ info.num_max }}人
                  </st-info-item>
                  <st-info-item label="开班时间">
                    {{ courseBeginTime }}
                  </st-info-item>
                  <st-info-item label="上课方式">
                    {{ info.course_type_name }}
                  </st-info-item>
                </st-info>
              </a-col>
              <a-col :span="11">
                <st-info>
                  <st-info-item label="售卖群体" v-if="info.sale_range">
                    {{ info.sale_range.name }}
                  </st-info-item>
                  <st-info-item label="总课时">
                    {{ info.course_times }}节
                  </st-info-item>
                  <st-info-item label="排课状态" v-if="info.has_schedule">
                    {{ info.has_schedule.name }}
                    <a
                      v-if="info.has_schedule.status"
                      :href="onViewCourseHref"
                      target="_blank"
                    >
                      查看排期
                    </a>
                  </st-info-item>
                  <st-info-item label="报名人数">
                    {{ info.buy_member_counts }}人
                  </st-info-item>
                </st-info>
              </a-col>
            </a-row>
          </st-form-item>
          <st-form-item required label="购买课时">
            <st-input-number
              placeholder="请输入购买课时"
              v-decorator="decorators.course_num"
              :disabled="isDisabledBuyNum"
              :max="amountMax"
              :min="amountMin"
            >
              <span slot="addonAfter">节</span>
            </st-input-number>
          </st-form-item>
          <editable-contract-number
            v-model="info.contract_number"
            :form="form"
          />
          <st-form-item class="mg-b12" label="商品价格">
            {{ orderAmountPrice }}元
          </st-form-item>
          <st-form-item :class="sale('discounts')" label="优惠券">
            <div>
              <div :class="sale('discounts-total')">
                <span>{{ couponText }}</span>
                <a-dropdown
                  v-model="couponDropdownVisible"
                  :disabled="!canChoseAdvance"
                  :class="sale({ disabled: !canChoseAdvance })"
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
              placeholder="请输入减免金额"
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
          <span>订单总额：{{ orderAmountPrice }}元</span>
        </div>
        <div class="button">
          <st-button
            @click="onCreateOrder"
            :loading="loading.setTransactionOrder"
          >
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
import { SaleSmallCourseService } from './sale-small-course.service'
import moment from 'moment'
import { cloneDeep, get } from 'lodash-es'
import { timer } from 'rxjs'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from './sale-small-course.config'
import { UserService } from '@/services/user.service'
import EditableContractNumber from '@/views/biz-components/contract/editable-contract-number.vue'
import MemberSearch from '@/views/biz-components/member/member-search/member-search'
import SelectScroll from '@/views/components/select-scroll#/select-scroll'

import { COURSE_TYPE } from '@/constants/course/small-course'
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
    return [SaleSmallCourseService]
  },
  serviceInject() {
    return {
      saleSmallCourseService: SaleSmallCourseService,
      userService: UserService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      page: this.saleSmallCourseService.page$,
      loading: this.saleSmallCourseService.loading$,
      finished: this.saleSmallCourseService.finished$,
      info: this.saleSmallCourseService.info$,
      courseList: this.saleSmallCourseService.courseList$,
      saleList: this.saleSmallCourseService.saleList$,
      couponList: this.saleSmallCourseService.couponList$,
      personalPrice: this.saleSmallCourseService.personalPrice$,
      priceInfo: this.saleSmallCourseService.priceInfo$,
      orderAmountPrice: this.saleSmallCourseService.orderAmountPrice$
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
      COURSE_TYPE,
      form,
      decorators,
      show: false,
      // 到期有效时间
      validEndTime: 0,
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
  computed: {
    modelTitle() {
      return this.$c('small_course') + '签单'
    },
    canChoseCoupon() {
      let len = this.couponList.length
      return (this.id || this.product_id) && len
    },
    canChoseAdvance() {
      let len = this.advanceList.length
      return (this.id || this.product_id) && len
    },
    onViewCourseHref() {
      const course_id = this.form.getFieldValue('productId') || undefined
      return `/shop/product/course/schedule/small-course?app_brand_id=${this.$searchQuery.app_brand_id}&app_shop_id=${this.$searchQuery.app_shop_id}&course_id=${course_id}`
    },
    courseBeginTime() {
      return (
        moment(this.info.course_begin_time * 1000).format('YYYY-MM-DD HH:MM') +
        '~' +
        moment(this.info.course_end_time * 1000).format('YYYY-MM-DD HH:MM')
      )
    },
    orderAmountText() {
      return this.priceInfo < 0 ? '小计不能为负' : ''
    },
    amountMax() {
      // if (this.info.course_type === this.COURSE_TYPE.FIXED_COURSE) {
      //   return this.info.buy_num || 0
      // }
      return this.info.buy_num || 1
    },
    amountMin() {
      // if (this.info.course_type === this.COURSE_TYPE.FIXED_COURSE) {
      //   return this.info.buy_num || 0
      // }
      return 1
    },
    isDisabledBuyNum() {
      return this.info.course_type === this.COURSE_TYPE.FIXED_COURSE
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
    this.saleSmallCourseService.serviceInit().subscribe(result => {
      if (this.id) {
        this.handleGetCourseInfo(this.id)
      } else {
        this.saleSmallCourseService
          .getSmallCourseList({
            app_brand_id: this.$searchQuery.app_brand_id,
            app_shop_id: this.$searchQuery.app_shop_id,
            product_type: 7
          })
          .subscribe()
      }
    })
  },
  methods: {
    moment,
    // 选择课,筛选
    handleSelect(val) {
      this.product_id = val
      this.onResetDiscounts()
      this.handleGetCourseInfo(val)
    },
    // 选择课,搜索
    handleSearch(product_name) {
      this.product_name = product_name
      this.saleSmallCourseService
        .getSmallCourseList({
          product_name,
          current_page: 1,
          app_brand_id: this.$searchQuery.app_brand_id,
          app_shop_id: this.$searchQuery.app_shop_id,
          product_type: 7
        })
        .subscribe()
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
    // 重新获取定金及优惠券
    onMemberChange(data) {
      // 重置优惠券及定金选择
      this.onResetDiscounts()
      // 如果存在会员id则请求重新拉取优惠券及定金列表
      if (data) this.onReGetDiscounts(data)
    },
    // 选择定金
    onSelectAdvance() {
      timer(200).subscribe(() => {
        this.advanceDropdownVisible = false
      })
    },
    // 选择优惠券
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
      this.saleSmallCourseService.REST_COUPONLIST()
      this.couponText = '未选择优惠券'
      this.selectCoupon = ''
      this.couponAmount = ''
    },
    // 关闭签单弹窗
    onCancel() {
      this.resetAdvance()
      this.resetCoupon()
    },
    // 选择定金
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
    // 选择优惠券
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
    // 计算实付金额
    getPrice(coupon, advance, reduce) {
      let advanceId = advance === -1 ? '' : advance
      const product_id = this.form.getFieldValue('productId') || undefined
      this.saleSmallCourseService.priceAction$.dispatch({
        product_id,
        product_type: this.info.contract_type,
        product_num: this.form.getFieldValue('course_num'),
        coupon_id: coupon ? coupon.id : undefined,
        advance_id: advanceId,
        reduce_amount: reduce,
        member_id: this.form.getFieldValue('member_id')
      })
    },
    // 获取订单总额
    getOrderPrice() {
      const product_id = this.form.getFieldValue('productId') || undefined
      this.saleSmallCourseService.orderAmountPriceAction$.dispatch({
        product_id,
        product_type: this.info.contract_type,
        product_num: 0
      })
    },
    // 创建订单
    onCreateOrder() {
      this.form.validate().then(values => {
        const small_course_id =
          this.form.getFieldValue('productId') || undefined
        this.saleSmallCourseService
          .setTransactionOrder({
            member_id: values.member_id,
            member_name: values.member_name,
            mobile: values.mobile ? values.mobile.phone : undefined,
            country_prefix: values.mobile ? values.mobile.code_id : undefined,
            small_course_id,
            course_num: values.course_num,
            contract_number: this.info.contract_number,
            coupon_id: this.selectCoupon.id,
            advance_id: this.selectAdvance,
            reduce_amount: this.reduceAmount || 0,
            sale_id: values.saleName,
            description: this.description,
            sale_range: this.info.sale_range.type,
            order_amount: this.priceInfo,
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
          .subscribe(result => {
            this.$emit('success', {
              type: 'create',
              orderId: result.info.order_id
            })
            this.show = false
          })
      })
    },
    // 订单支付
    onPay() {
      this.form.validate().then(values => {
        const small_course_id =
          this.form.getFieldValue('productId') || undefined
        this.saleSmallCourseService
          .setTransactionPay({
            member_id: values.member_id,
            member_name: values.member_name,
            mobile: values.mobile ? values.mobile.phone : undefined,
            country_prefix: values.mobile ? values.mobile.code_id : undefined,
            small_course_id,
            course_num: values.course_num,
            contract_number: this.info.contract_number,
            coupon_id: this.selectCoupon.id,
            advance_id: this.selectAdvance,
            reduce_amount: this.reduceAmount || 0,
            sale_id: values.saleName,
            description: this.description,
            sale_range: this.info.sale_range.type,
            order_amount: this.priceInfo,
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
          .subscribe(result => {
            this.$emit('success', {
              type: 'createPay',
              orderId: result.info.order_id
            })
            this.show = false
          })
      })
    },
    // 获取优惠券列表
    fetchCouponList(id) {
      const member_id = this.form.getFieldValue('member_id') || id
      const price = this.personalPrice.sell_price
      const buy_num = this.form.getFieldValue('course_num')
      const course_id = this.form.getFieldValue('productId') || undefined
      if (course_id && member_id) {
        const params = {
          member_id,
          course_id,
          price,
          buy_num
        }
        this.saleSmallCourseService.getCouponList(params).subscribe()
      }
    },
    // 获取定金列表
    fetchAdvanceList(id) {
      let member_id = this.form.getFieldValue('member_id') || id
      if (member_id) {
        this.saleSmallCourseService.getAdvanceList(member_id).subscribe(res => {
          this.advanceList = cloneDeep(res.list)
        })
      }
    },
    // 获取课程列表
    handleGetList() {
      console.log('finished 1', this.finished)
      console.log('page', this.page)
      if (this.finished) return false
      this.saleSmallCourseService
        .getSmallCourseList({
          product_name: this.product_name,
          current_page: ++this.page.current_page,
          app_brand_id: this.$searchQuery.app_brand_id,
          app_shop_id: this.$searchQuery.app_shop_id,
          product_type: 7
        })
        .subscribe()
    },
    // 获取课程详情
    handleGetCourseInfo(productId) {
      this.saleSmallCourseService.getInfo(productId).subscribe(res => {
        if (this.id) {
          this.saleSmallCourseService.SET_LIST([
            {
              id: +this.id,
              product_name: this.info.course_name
            }
          ])
        }
        setTimeout(() => {
          // 设置
          this.form.setFieldsValue({
            productId: +productId,
            course_num: this.info.buy_num
          })
          this.onReGetDiscounts()
          this.getPrice()
          this.getOrderPrice()
        })
      })
    }
  }
}
</script>
