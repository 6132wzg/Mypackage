<template>
  <st-modal
    title="课程包升级"
    v-model="show"
    @cancel="onCancel"
    wrapClassName="modal-sold-deal-sale"
  >
    <div :class="sale('content')">
      <biz-sold-course-info :info="info$" />
      <st-form :form="form" labelWidth="120px">
        <div :class="sale('sale')">
          <st-form-item label="课程包名称" required>
            <select-scroll
              v-decorator="decorators.productId"
              placeholder="请选择课"
              notFoundContent="无搜索结果"
              :list="packageOptions$"
              :loading="loading$.getUpgradePackageList"
              @select="handleSelect"
              @search="handleSearch"
            ></select-scroll>
            <a-row
              :class="sale('info')"
              v-if="hasProductInfo"
              type="flex"
              justify="space-between"
            >
              <a-col v-if="newPackageInfo$.id" :span="22">
                <st-info>
                  <st-info-item label="支持转让">
                    {{ newPackageInfo$.transfer_status }}
                  </st-info-item>
                  <st-info-item label="上课范围">
                    {{ newPackageInfo$.courseInfo }}
                  </st-info-item>
                  <st-info-item label="上课门店">
                    {{ newPackageInfo$.shopList }}
                  </st-info-item>
                </st-info>
              </a-col>
            </a-row>
          </st-form-item>
          <st-form-item
            label="初始额度"
            v-if="newPackageInfo$.is_limit === 0"
            required
          >
            <div :class="sale('contract')">
              <st-input-number
                class="input-number"
                :min="1"
                :max="9999"
                v-decorator="decorators.valid_days"
                placeholder="请输入初始额度"
                :disabled="isValidDaysDisable"
              >
                <div slot="addonAfter">
                  天
                </div>
              </st-input-number>
              <st-button
                class="create-button"
                @click="onClickValidDaysConfirm"
                v-if="!isValidDaysDisable"
              >
                确定
              </st-button>
              <st-button
                class="create-button"
                @click="onClickValidDaysConfirm"
                v-else
              >
                编辑
              </st-button>
            </div>
          </st-form-item>
          <st-form-item
            label="团课初始额度"
            v-if="
              newPackageInfo$.is_limit === 1 && newPackageInfo$.is_team === 1
            "
            required
          >
            <div :class="sale('contract')">
              <st-input-number
                class="input-number"
                :min="1"
                :max="9999"
                v-decorator="decorators.team_times"
                placeholder="请输入初始额度"
                :disabled="isTeamDisable"
              >
                <div slot="addonAfter">
                  节
                </div>
              </st-input-number>
              <st-button
                class="create-button"
                @click="onClickTeamConfirm"
                v-if="!isTeamDisable"
              >
                确定
              </st-button>
              <st-button
                class="create-button"
                @click="onClickTeamConfirm"
                v-else
              >
                编辑
              </st-button>
            </div>
          </st-form-item>
          <st-form-item
            label="私教课初始额度"
            v-if="
              newPackageInfo$.is_limit === 1 &&
                newPackageInfo$.is_personal === 1
            "
            required
          >
            <div :class="sale('contract')">
              <st-input-number
                class="input-number"
                :min="1"
                :max="9999"
                v-decorator="decorators.personal_times"
                placeholder="请输入初始额度"
                :disabled="isPersonalDisabled"
              >
                <div slot="addonAfter">
                  节
                </div>
              </st-input-number>
              <st-button
                class="create-button"
                @click="onClickPersonalConfirm"
                v-if="!isPersonalDisabled"
              >
                确定
              </st-button>
              <st-button
                class="create-button"
                @click="onClickPersonalConfirm"
                v-else
              >
                编辑
              </st-button>
            </div>
          </st-form-item>
          <st-form-item
            label="团课&私教课共"
            v-if="
              newPackageInfo$.is_limit === 1 && newPackageInfo$.is_total === 1
            "
            required
          >
            <div :class="sale('contract')">
              <st-input-number
                class="input-number"
                :min="1"
                :max="9999"
                v-decorator="decorators.total_times"
                placeholder="请输入初始额度"
                :disabled="isTotalDisabled"
              >
                <div slot="addonAfter">
                  节
                </div>
              </st-input-number>
              <st-button
                class="create-button"
                @click="onClickTotalConfirm"
                v-if="!isTotalDisabled"
              >
                确定
              </st-button>
              <st-button
                class="create-button"
                @click="onClickTotalConfirm"
                v-else
              >
                编辑
              </st-button>
            </div>
          </st-form-item>
          <st-form-item label="生效方式" required>
            <a-radio-group
              v-decorator="decorators.effective_way"
              :options="effectiveWayOptions$"
              @change="onChangeEffectiveWay"
            />
          </st-form-item>
          <st-form-item label="有效期" v-if="isExpire === 1" required>
            {{ validDate }}
          </st-form-item>
          <editable-contract-number
            v-model="info$.contract_number"
            :form="form"
          />
          <st-form-item label="商品价格" required>
            <div>{{ newPackageInfo$.sell_price }}元</div>
          </st-form-item>
          <st-form-item label="升级抵扣" required>
            <st-input-number
              class="input-number"
              :min="0"
              :max="+newPackageInfo$.sell_price"
              v-decorator="decorators.deduction_amount"
              @change="getDeductionAmount"
              placeholder="请输入初始额度"
            >
              <div slot="addonAfter">
                元
              </div>
            </st-input-number>
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
                    <span>{{ couponList$.length }}张可用优惠券</span>
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
                        v-for="(item, index) in couponList$"
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
                        v-for="(item, index) in advanceList$"
                      >
                        <a-radio :value="item.id">
                          定金 {{ item.price || 0 }}
                        </a-radio>
                      </a-menu-item>
                    </a-menu>
                  </a-radio-group>
                </a-dropdown>
              </div>
            </div>
          </st-form-item>
          <div :class="sale('remarks')">
            <st-form-item label="销售人员" required>
              <a-select
                v-decorator="decorators.sale_id"
                placeholder="选择签单的工作人员"
                :options="saleList$"
              />
            </st-form-item>
            <st-form-item label="备注" class="mg-b0">
              <st-textarea
                v-model="description"
                :autosize="{ minRows: 4, maxRows: 6 }"
                :maxlength="200"
              />
            </st-form-item>
          </div>
        </div>
      </st-form>
    </div>
    <template slot="footer">
      <div :class="sale('footer')">
        <div class="price">
          <span>{{ currentPrice$ }}元</span>
          <span>订单总额：{{ newPackageInfo$.sell_price }}元</span>
        </div>
        <div class="button">
          <st-button
            @click="onCreateOrder"
            :loading="loading$.setTransactionOrder"
          >
            创建订单
          </st-button>
          <st-button
            @click="onPay"
            :loading="loading$.setTransactionPay"
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
import { UpgradeService } from './upgrade.service.ts'
import { cloneDeep, get } from 'lodash-es'
import { timer } from 'rxjs'
import BizSoldCourseInfo from '@/views/biz-components/sold/cource-info.vue'
import { ruleOptions } from './upgrade.config'
import { PatternService } from '@/services/pattern.service'
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
    BizSoldCourseInfo,
    SelectScroll
  },
  serviceProviders() {
    return [UpgradeService]
  },
  serviceInject() {
    return {
      upgradeService: UpgradeService,
      pattern: PatternService
    }
  },
  rxState() {
    const {
      info$,
      packageOptions$,
      loading$,
      newPackageInfo$,
      effectiveWayOptions$,
      couponList$,
      advanceList$,
      currentPrice$,
      saleList$
    } = this.upgradeService
    return {
      loading$,
      info$,
      newPackageInfo$,
      advanceList$,
      couponList$,
      effectiveWayOptions$,
      saleList$,
      currentPrice$,
      packageOptions$
    }
  },
  props: {
    id: {
      type: Number
    },
    memberInfo: {
      type: Object
    }
  },
  data() {
    const form = this.$stForm.create()

    return {
      form,
      show: false,
      isTeamDisable: true,
      isPersonalDisabled: true,
      isTotalDisabled: true,
      isValidDaysDisable: true,
      // 定金
      advanceDropdownVisible: false,
      advanceList: [],
      advanceText: '未选择定金',
      advanceAmount: '',
      selectAdvance: '',
      deductionAmount: '',
      description: '',
      // 优惠券
      selectCoupon: '',
      couponText: '未选择优惠券',
      couponAmount: '',
      couponDropdownVisible: false,
      isExpire: 1,
      product_id: '',
      couponList: []
    }
  },
  computed: {
    decorators() {
      return this.form.decorators(ruleOptions)
    },
    validDate() {
      return `${moment().format('YYYY-MM-DD')}~${moment()
        .add(this.newPackageInfo$.valid_time, 'days')
        .format('YYYY-MM-DD')}`
    },
    canChoseCoupon() {
      let len = this.couponList$.length
      return !!len
    },
    canChoseAdvance() {
      let len = this.advanceList$.length
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
        this.getPrice(newVal, this.selectAdvance, +this.deductionAmount)
      }
    },
    selectAdvance: {
      deep: true,
      handler(newVal, oldVal) {
        this.getPrice(this.selectCoupon, newVal, +this.deductionAmount)
      }
    },
    deductionAmount(newVal, oldVal) {
      this.getPrice(this.selectCoupon, this.selectAdvance, +newVal)
    }
  },
  mounted() {
    this.upgradeService.init(this.id).subscribe(res => {
      console.log('初始化页面完成')
    })
  },
  methods: {
    moment,
    getDeductionAmount(value) {
      console.log(event)
      this.deductionAmount = value
    },
    // 选择课,筛选
    handleSelect(val) {
      this.product_id = val
      this.onResetDiscounts()
      this.handleGetCourseInfo(val)
    },
    // 选择课,搜索
    handleSearch(keywords) {
      this.handleGetList(keywords)
    },
    onChangeEffectiveWay(e) {
      console.log(e.target.value)
      this.isExpire = e.target.value
    },
    onClickTeamConfirm() {
      this.isTeamDisable = !this.isTeamDisable
    },
    onClickPersonalConfirm() {
      this.isPersonalDisabled = !this.isPersonalDisabled
    },
    onClickTotalConfirm() {
      this.isTotalDisabled = !this.isTotalDisabled
    },
    onClickValidDaysConfirm() {
      this.isValidDaysDisable = !this.isValidDaysDisable
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
      this.upgradeService.REST_COUPONLIST()
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
      let price = this.advanceList$.filter(o => o.id === data.target.value)[0]
        .price
      this.advanceAmount = price
      this.advanceText = `${price}元`
    },
    onSelectCouponChange(event) {
      let id = get(event.target.value, 'id', '')
      if (id) {
        let price = this.couponList$.filter(o => o.id === id)[0].price
        this.couponAmount = price
        this.couponText = `${price}元`
      } else {
        this.resetCoupon()
      }
    },
    // 计算实付金额
    getPrice(coupon, advance, reduce) {
      const memberId = this.info$.member_id
      const product_id = this.newPackageInfo$.product_id || undefined
      // 1会员卡 2 私教课程 3 课程包 4储值卡 5 储物柜租赁
      this.upgradeService
        .getPrice({
          product_id,
          product_type: 3,
          coupon_id: coupon ? coupon.id : undefined,
          member_id: memberId || undefined,
          advance_id: advance || undefined,
          reduce_amount: reduce || undefined
        })
        .subscribe(res => {
          console.log(res)
        })
    },
    onCreateOrder() {
      this.form.validate().then(values => {
        const form = cloneDeep(values)
        form.package_id = form.productId
        form.personal_times = +form.personal_times
        form.team_times = +form.team_times
        form.contract_number = this.info$.contract_number
        delete form.productId
        // TODO 添加对POS机支付的需求
        this.upgradeService
          .upgrade({
            id: this.info$.id,
            ...form,
            member_id: this.info$.member_id
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
        const form = cloneDeep(values)
        form.package_id = form.productId
        form.personal_times = +form.personal_times
        form.team_times = +form.team_times
        form.contract_number = this.info$.contract_number
        delete form.productId
        console.log(form, this.info$.member_id)
        this.upgradeService
          .upgrade({
            id: this.info$.id,
            ...form,
            member_id: this.info$.member_id
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
    handleGetList(keyword) {
      // if (this.finished) return false
      this.upgradeService
        .getUpgradePackageList({
          keyword
        })
        .subscribe()
    },
    // 获取课程详情
    handleGetCourseInfo(productId) {
      this.upgradeService.getNewUpgradePackageInfo(productId).subscribe(res => {
        this.$nextTick().then(() => {
          this.form.setFieldsValue({
            productId,
            team_times: res.info.team_times,
            personal_times: res.info.personal_times,
            valid_days: res.info.valid_time
          })
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
        this.upgradeService.getCouponList(params).subscribe()
      }
    },
    // 获取定金列表
    fetchAdvanceList(id) {
      let member_id = this.form.getFieldValue('member_id') || id
      if (member_id) {
        this.upgradeService.getAdvanceList(member_id).subscribe(res => {
          this.advanceList$ = cloneDeep(res.list)
        })
      }
    }
  }
}
</script>
