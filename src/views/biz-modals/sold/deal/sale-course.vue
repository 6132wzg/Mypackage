<template>
  <st-modal
    title="课程包签单"
    v-model="show"
    width="880px"
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
              :loading="loading.getCourseList"
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
                  <st-info-item label="有效期">
                    {{ info.valid_time }}天
                  </st-info-item>
                  <st-info-item
                    v-if="info.max_use_num > 1"
                    label="支持使用人数"
                  >
                    {{ info.max_use_num }}人
                  </st-info-item>
                </st-info>
              </a-col>
              <a-col :span="11">
                <st-info>
                  <st-info-item label="售卖群体" v-if="info.sale_range">
                    {{ info.sale_range.name }}
                  </st-info-item>
                  <st-info-item label="上课门店">
                    <st-overflow-text
                      max-width="200px"
                      needMaxContainerWidth
                      :value="info.shop_name"
                    ></st-overflow-text>
                  </st-info-item>
                  <st-info-item label="上课范围">
                    {{ info.course_range }}
                  </st-info-item>
                </st-info>
              </a-col>
            </a-row>
          </st-form-item>
          <st-form-item label="成员" v-if="info.max_use_num > 1">
            <add-card-member
              v-model="memberChildrenlist"
              addText="新增成员"
              :max="info.max_use_num - 1"
              productType="package"
            ></add-card-member>
          </st-form-item>
          <st-form-item label="生效方式" required>
            <a-radio-group
              v-decorator="decorators.effective_way"
              :options="effectiveWayOptions"
              @change="onChangeEffectiveWay"
            />
          </st-form-item>
          <st-form-item v-if="isExpire === 1" label="到期时间">
            <div>
              {{
                moment()
                  .add(info.valid_time, 'days')
                  .format('YYYY-MM-DD HH:mm')
              }}
            </div>
          </st-form-item>
          <editable-contract-number
            v-model="info.contract_number"
            :form="form"
          />
          <st-form-item class="mg-b12" label="商品价格">
            {{ info.sell_price }}元
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
          <span>订单总额：{{ info.sell_price }}元</span>
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
import moment from 'moment'
import { SaleCourseService } from './sale-course.service'
import { cloneDeep, get } from 'lodash-es'
import { timer } from 'rxjs'
import { ruleOptions } from './sale-course.config'
import { PatternService } from '@/services/pattern.service'
import AddCardMember from '@/views/biz-components/member/add-card-member/add-card-member'
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
    AddCardMember,
    SelectScroll
  },
  serviceProviders() {
    return [SaleCourseService]
  },
  serviceInject() {
    return {
      saleCourseService: SaleCourseService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      page: this.saleCourseService.page$,
      loading: this.saleCourseService.loading$,
      finished: this.saleCourseService.finished$,
      effectiveWayOptions: this.saleCourseService.effectiveWayOptions$,
      info: this.saleCourseService.info$,
      courseList: this.saleCourseService.courseList$,
      saleList: this.saleCourseService.saleList$,
      couponList: this.saleCourseService.couponList$,
      currentPrice: this.saleCourseService.currentPrice$
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
      reduceAmount: '',
      description: '',
      // 优惠券
      selectCoupon: '',
      memberChildrenlist: [],
      couponText: '未选择优惠券',
      couponAmount: '',
      couponDropdownVisible: false,
      isExpire: 1,
      product_id: '',
      isFollowSalesman: 0,
      product_name: ''
    }
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
      return this.currentPrice < 0 ? '小计不能为负' : ''
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
    this.saleCourseService.serviceInit().subscribe(result => {
      if (this.id) {
        this.handleGetCourseInfo(this.id)
      } else {
        this.saleCourseService
          .getCourseList({
            app_brand_id: this.$searchQuery.app_brand_id,
            app_shop_id: this.$searchQuery.app_shop_id,
            product_type: 5
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
      this.saleCourseService
        .getCourseList({
          product_name,
          app_brand_id: this.$searchQuery.app_brand_id,
          app_shop_id: this.$searchQuery.app_shop_id,
          product_type: 5,
          page: 1
        })
        .subscribe()
    },
    onChangeEffectiveWay(e) {
      console.log(e.target.value)
      this.isExpire = e.target.value
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
      this.saleCourseService.REST_COUPONLIST()
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
      const memberId = this.form.getFieldValue('member_id')
      const product_id = this.form.getFieldValue('productId') || undefined
      this.saleCourseService.currentPriceAction$.dispatch({
        product_id,
        product_type: this.info.contract_type,
        coupon_id: coupon ? coupon.id : undefined,
        member_id: memberId || undefined,
        advance_id: advance || undefined,
        reduce_amount: reduce || undefined
      })
    },
    onCreateOrder() {
      this.form.validate().then(values => {
        const package_id = this.form.getFieldValue('productId') || undefined
        this.saleCourseService
          .setTransactionOrder({
            effective_way: values.effective_way,
            member_id: values.member_id,
            member_name: values.member_name,
            mobile: values.mobile ? values.mobile.phone : undefined,
            package_id,
            contract_number: this.info.contract_number,
            coupon_id: this.selectCoupon.id,
            advance_id: this.selectAdvance,
            advance_amount: this.validStartTime,
            reduce_amount: this.reduceAmount || 0,
            sale_id: values.saleName,
            description: this.description,
            sale_range: this.info.sale_range.type,
            order_amount: this.currentPrice,
            is_minors: values.is_minors,
            member_ids: this.memberChildrenlist
              .filter(item => !!item.id)
              .map(item => item.id),
            member_info: this.memberChildrenlist
              .filter(item => {
                return !item.id
              })
              .map(item => {
                if (item.is_minors) {
                  let mobile = item.mobile
                  item.mobile = ''
                  item.parent_mobile = item.parent_mobile || mobile
                }
                return item
              }),
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
    onPay() {
      this.form.validate().then(values => {
        const package_id = this.form.getFieldValue('productId') || undefined
        this.saleCourseService
          .setTransactionPay({
            effective_way: values.effective_way,
            member_id: values.member_id,
            member_name: values.member_name,
            mobile: values.mobile ? values.mobile.phone : undefined,
            package_id,
            contract_number: this.info.contract_number,
            coupon_id: this.selectCoupon.id,
            advance_id: this.selectAdvance,
            advance_amount: this.advanceAmount,
            reduce_amount: this.reduceAmount || 0,
            sale_id: values.saleName,
            description: this.description,
            sale_range: this.info.sale_range.type,
            order_amount: this.currentPrice,
            is_minors: values.is_minors,
            parent_name: values.parent_name,
            member_ids: this.memberChildrenlist
              .filter(item => !!item.id)
              .map(item => item.id),
            member_info: this.memberChildrenlist
              .filter(item => {
                return !item.id
              })
              .map(item => {
                if (item.is_minors) {
                  let mobile = item.mobile
                  item.mobile = ''
                  item.parent_mobile = item.parent_mobile || mobile
                }
                return item
              }),
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
    // 获取课程列表
    handleGetList() {
      if (this.finished) return false
      this.saleCourseService
        .getCourseList({
          product_name: this.product_name,
          app_brand_id: this.$searchQuery.app_brand_id,
          app_shop_id: this.$searchQuery.app_shop_id,
          product_type: 5,
          page: ++this.page.current_page
        })
        .subscribe()
    },
    // 获取课程详情
    handleGetCourseInfo(productId) {
      this.saleCourseService.getInfo(productId).subscribe(res => {
        if (this.id) {
          this.saleCourseService.SET_LIST([
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
          this.getPrice()
        })
      })
    },
    // 获取优惠券列表
    fetchCouponList(id) {
      const package_id = this.form.getFieldValue('productId') || undefined
      const member_id = this.form.getFieldValue('member_id') || id
      if (package_id && member_id) {
        const params = {
          member_id,
          package_id
        }
        this.saleCourseService.getCouponList(params).subscribe()
      }
    },
    // 获取定金列表
    fetchAdvanceList(id) {
      let member_id = this.form.getFieldValue('member_id') || id
      if (member_id) {
        this.saleCourseService.getAdvanceList(member_id).subscribe(res => {
          this.advanceList = cloneDeep(res.list)
        })
      }
    }
  }
}
</script>
