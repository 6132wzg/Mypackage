<template>
  <st-modal
    v-model="show"
    @cancel="onCancel"
    wrapClassName="modal-sold-deal-sale"
  >
    <template slot="title">
      升级
      <st-help-tooltip id="TSMC002" placement="right" />
    </template>
    <div :class="sale('content')">
      <a-row :class="sale('info')">
        <a-col :span="13">
          <st-info>
            <st-info-item label="卡名">{{ info.card_name }}</st-info-item>
            <st-info-item label="当前额度">
              {{ info.remain_amount }}
            </st-info-item>
            <st-info-item label="初始额度">{{ info.init_amount }}</st-info-item>
            <st-info-item label="优惠赠送">{{ info.gift_amount }}</st-info-item>
            <st-info-item label="实付金额">{{ info.pay_price }}</st-info-item>
            <st-info-item label="到期日期">{{ info.end_time }}</st-info-item>
          </st-info>
        </a-col>
        <a-col :span="11">
          <st-info>
            <st-info-item label="购卡人">{{ info.member_name }}</st-info-item>
            <st-info-item label="卡成员" v-if="isFamilyCard">
              {{ info.card_member }}
            </st-info-item>
            <template v-if="info.is_minors === PERSON_TYPE.CHILD">
              <st-info-item label="家长手机号">
                {{ info.parent_mobile }}
              </st-info-item>
              <st-info-item label="家长姓名">
                {{ info.parent_name }}
              </st-info-item>
            </template>
            <st-info-item label="手机号" v-else>{{ info.mobile }}</st-info-item>
            <st-info-item label="订单号">{{ info.order_id }}</st-info-item>
            <st-info-item label="订单状态">
              {{ info.order_status }}
            </st-info-item>
            <st-info-item label="销售人员">{{ info.staff_name }}</st-info-item>
          </st-info>
        </a-col>
      </a-row>
      <st-form :form="form" labelWidth="88px">
        <div :class="sale('sale')">
          <st-form-item :label="$c('member_card')" required>
            <a-select
              showSearch
              allowClear
              :placeholder="`输入${$c('member_card')}名搜索`"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              @change="onSelectCardChange"
              v-decorator="decorators.memberCardId"
              @search="onCardSearch"
              notFoundContent="无搜索结果"
            >
              <a-select-option
                v-for="(item, index) in cardList"
                :value="+item.id"
                :key="index"
              >
                {{ item.card_name }}
              </a-select-option>
            </a-select>
          </st-form-item>
          <assign-shop
            v-if="upgradeCardInfo.admission_range_info"
            label="入场场馆"
            :form="form"
            :type="upgradeCardInfo.admission_range_info.admission_range"
            :shopIds="
              upgradeCardInfo.admission_range_info.product_support_shops
            "
            required
            :disabled="
              info.auth && !info.auth['shop:sold:transaction|right_price_edit']
            "
            @change="onShopChange"
          />
          <st-form-item label="规格" class="mg-b16" required>
            <template v-if="selectCardIsNone">无</template>
            <a-radio-group v-else v-model="selectSpecs" @change="onSpecsChange">
              <a-radio
                v-for="(item, index) in upgradeCardInfo.specs"
                :value="item.id"
                :key="index"
              >
                <template v-if="item.id === selectSpecs">
                  {{ info.card_name }}/{{ item.price }}元/
                  <editable-number
                    :width="200"
                    v-model="ruleQuota"
                    :unit="item.card_type"
                    :form="form"
                    :float="false"
                    :max="9999"
                    :placeholder="`请输入${item.card_type}数`"
                    @ok="onRuleQuotaChange"
                  />
                </template>
                <template v-else>
                  {{ info.card_name }}/{{ item.price }}元/{{ item.card_amount
                  }}{{ item.card_type }}
                </template>
              </a-radio>
            </a-radio-group>
          </st-form-item>
          <st-form-item label="开卡方式" required>
            <template v-if="selectCardIsNone">无</template>
            <a-radio-group
              v-else
              v-model="selectOpenType"
              @change="onOpenTypeChange"
            >
              <a-radio
                v-for="(item, index) in upgradeCardInfo.open_type"
                :value="item.id"
                :key="index"
              >
                {{ item.open_type }}
              </a-radio>
            </a-radio-group>
          </st-form-item>
          <st-form-item
            label="有效时间"
            :class="{ 'mg-b0': !selectCardIsNone && +selectOpenType === 3 }"
            :required="!selectCardIsNone && +selectOpenType === 3"
          >
            <template v-if="selectCardIsNone">无</template>
            <template
              v-if="
                !selectCardIsNone &&
                  +selectOpenType === 1 &&
                  upgradeCardInfo.server_time
              "
            >
              {{
                moment(upgradeCardInfo.server_time * 1000).format(
                  'YYYY-MM-DD HH:mm'
                )
              }}&nbsp;至&nbsp;
              {{
                moment(upgradeCardInfo.server_time * 1000)
                  .add(getValidTime, 'd')
                  .format('YYYY-MM-DD HH:mm')
              }}
            </template>
            <template v-if="!selectCardIsNone && +selectOpenType === 2">
              {{
                upgradeCardInfo.open_type.filter(i => +i.id === 2)[0]
                  .automatic_num
              }}天内未开卡，则{{
                upgradeCardInfo.open_type.filter(i => +i.id === 2)[0]
                  .automatic_num + 1
              }}天0：00自动开卡
            </template>
            <div
              :class="sale('time')"
              v-if="!selectCardIsNone && +selectOpenType === 3"
            >
              <a-form-item class="page-a-form">
                <a-date-picker
                  :disabledDate="disabledStartDate"
                  v-decorator="decorators.startTime"
                  @change="onStartTimeChange"
                  style="width: 188px"
                  format="YYYY-MM-DD HH:mm"
                  :showTime="{ format: 'HH:mm' }"
                  placeholder="开始时间"
                  :allowClear="false"
                  :showToday="false"
                />
                <span style="width: 158px">
                  &nbsp;&nbsp;至&nbsp;&nbsp;{{ endTime }}
                </span>
              </a-form-item>
            </div>
          </st-form-item>
          <st-form-item label="购买赠送">
            <st-input-number
              :disabled="selectCardIsNone"
              v-model="giftAmount"
              :max="+selectSpecsItem.gift_max"
              :placeholder="
                `请输入赠送的${
                  selectCardItem.card_type !== 1 ? '天数' : '次数'
                }`
              "
            >
              <span slot="addonAfter">
                {{ selectCardItem.card_type !== 1 ? '天' : '次' }}
              </span>
            </st-input-number>
          </st-form-item>
          <editable-contract-number
            v-model="info.contract_number"
            :form="form"
          />
          <st-form-item class="mg-b12" label="商品价格">
            <editable-number
              v-model="cardPrice"
              unit="元"
              :disabled="
                info.auth &&
                  !info.auth['shop:sold:transaction|right_price_edit']
              "
              :form="form"
              @ok="onPriceChange"
            />
          </st-form-item>
          <st-form-item required>
            <template slot="label">
              原卡抵扣
              <st-help-tooltip id="TSMC003" />
            </template>
            <st-input-number
              @change="onSurplusPriceChange"
              v-decorator="decorators.surplusPrice"
              :float="true"
              :max="+info.deduct_limit"
              placeholder="请输入原卡可以抵扣的剩余价值金额"
            >
              <span slot="addonAfter">元</span>
            </st-input-number>
          </st-form-item>
          <st-form-item :class="sale('discounts')" label="优惠金额">
            <div>
              <div :class="sale('discounts-total')">
                <span>{{ couponText }}</span>
                <a-dropdown
                  v-model="couponDropdownVisible"
                  :disabled="couponList.length === 0"
                  :class="sale({ disabled: couponList.length === 0 })"
                  placement="bottomRight"
                  :getPopupContainer="trigger => trigger.parentNode"
                  :trigger="['click']"
                >
                  <div :class="sale('discounts-promotion')">
                    <span>
                      {{ couponList.length === 0 ? '无优惠券' : '优惠券选择' }}
                    </span>
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
                        <a-radio :value="-1">不使用</a-radio>
                      </a-menu-item>
                      <a-menu-item
                        @click="onSelectCoupon"
                        :key="index"
                        v-for="(item, index) in couponList"
                      >
                        <a-radio :value="item.id">
                          {{ item.name }} {{ item.price }}
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
                  :disabled="advanceList.length === 0"
                  :class="sale({ disabled: advanceList.length === 0 })"
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
                        <a-radio :value="-1">不使用</a-radio>
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
      <div :class="sale('footer')">
        <div class="price">
          <span>{{ priceInfo }}元</span>
          <span>订单总额：{{ cardPrice }}元</span>
        </div>
        <div class="button">
          <st-button @click="onCreateOrder" :loading="loading.upgrade">
            创建订单
          </st-button>
          <st-button
            @click="onPay"
            :loading="loading.upgradePay"
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
import { UpgradeMemberService } from './upgrade-member.service'
import { cloneDeep } from 'lodash-es'
import { timer } from 'rxjs'
import { ruleOptions } from './upgrade-member.config'
import autoContractBtn from '@/views/biz-components/contract/auto-contract-btn.vue'
import moment from 'moment'
import { PERSON_TYPE } from '@/constants/course/small-course'
import EditableContractNumber from '@/views/biz-components/contract/editable-contract-number.vue'
import AssignShop from '@/views/biz-components/shop/assign-shop/assign-shop'
import EditableNumber from '@/views/components/editable-number#/editable-number'
export default {
  name: 'ModalSoldUpgradeMemberCard',
  bem: {
    sale: 'modal-sold-deal-sale'
  },
  components: {
    EditableContractNumber,
    AssignShop,
    EditableNumber
  },
  serviceProviders() {
    return [UpgradeMemberService]
  },
  serviceInject() {
    return {
      upgradeMemberService: UpgradeMemberService
    }
  },
  rxState() {
    return {
      info: this.upgradeMemberService.info$,
      couponList: this.upgradeMemberService.couponList$,
      advanceList: this.upgradeMemberService.advanceList$,
      priceInfo: this.upgradeMemberService.priceInfo$,
      saleList: this.upgradeMemberService.saleList$,
      loading: this.upgradeMemberService.loading$
    }
  },
  props: ['id'],
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      PERSON_TYPE,
      form,
      decorators,
      show: false,
      // 会员卡列表
      cardList: [],
      cardLists: {},
      // 选择的卡
      selectCardItem: {},
      // 选择的卡的详情
      upgradeCardInfo: {},
      upgradeCardsInfo: {},
      // 规格
      selectSpecs: null,
      // 选择的规格
      selectSpecsItem: {},
      // 初始额度可编辑
      isAmountDisabled: true,
      getValidTime: 0,
      // 开卡方式
      selectOpenType: null,
      // 入场场馆
      admission_range_info: {},
      // 有效时间
      startTime: null,
      endTime: '-',
      // 购买赠送
      giftAmount: '',
      // 商品金额
      cardPrice: '0',
      // 原卡折扣
      surplusPrice: '',
      // 优惠
      couponDropdownVisible: false,
      couponText: '未选择优惠券',
      couponAmount: '',
      selectCoupon: '',
      // 定金
      advanceDropdownVisible: false,
      advanceText: '未选择定金',
      advanceAmount: '',
      selectAdvance: '',
      // 减免金额
      reduceAmount: '',
      // 描述
      description: '',
      // 规格额度
      ruleQuota: '0',
      // 初始额度
      initAmount: '0'
    }
  },
  computed: {
    // 是否未选择卡
    selectCardIsNone() {
      return !this.selectCardItem.id
    },
    // 卡跟规格，用来判断规格是否切换了，因为有可能不同的卡有同一个规格，但是同卡同规格是不会出现的
    cardAndSpecs() {
      return `${this.selectCardItem.id || ''}-${this.selectSpecsItem.id || ''}`
    },
    // 小计判断
    orderAmountText() {
      return this.priceInfo < 0 ? '小计不能为负' : ''
    },
    // 计算小计用
    priceOB() {
      return `${this.selectSpecs}-
              ${this.selectAdvance}-
              ${this.reduceAmount}-
              ${this.selectCoupon}-
              ${this.surplusPrice}`
    },
    isFamilyCard() {
      return this.info.card_number_type === 2
    }
  },
  watch: {
    cardAndSpecs(newVal, oldVal) {
      // 先重围优惠券
      this.resetCoupon()
      if (!this.upgradeCardInfo.id || !this.selectSpecsItem.id) return
      this.upgradeMemberService.couponAction$.dispatch({
        member_id: this.info.member_id,
        card_id: this.upgradeCardInfo.id,
        specs_id: this.selectSpecsItem.id
      })
    },
    // 计算小计
    priceOB() {
      if (!this.selectCardItem.id) {
        return
      }
      this.getPrice({
        product_id: this.selectCardItem.id,
        product_type: this.info.contract_type,
        specs_id: +this.selectSpecs,
        advance_id: this.selectAdvance === -1 ? '' : this.selectAdvance,
        reduce_amount: +this.reduceAmount,
        coupon_id: this.selectCoupon === -1 ? '' : this.selectCoupon,
        member_id: +this.info.member_id,
        surplus_amount: +this.surplusPrice,
        transaction_price: +this.cardPrice
      })
    }
  },
  created() {
    this.upgradeMemberService.serviceInit(this.id).subscribe(() => {
      // 初始化原卡抵扣金额
      this.surplusPrice = this.info.amortization_amount
      this.form.setFieldsValue({ surplusPrice: this.info.amortization_amount })
      // 初始化会员卡列表
      this.upgradeMemberService.getCardList('', -1).subscribe(res => {
        // 缓存请求结果
        this.cardList = cloneDeep(res.list)
      })
    })
  },
  methods: {
    moment,
    // 搜索会员卡
    onCardSearch(data) {
      if (data === '') {
        this.cardList = []
      } else {
        // 判断之前是否请求过
        if (!this.cardLists[data]) {
          this.upgradeMemberService.getCardList(data, -1).subscribe(res => {
            // 缓存请求结果
            this.cardLists[data] = cloneDeep(res.list)
            this.cardList = cloneDeep(res.list)
          })
        } else {
          // 取缓存
          this.cardList = cloneDeep(this.cardLists[data])
        }
      }
    },
    // 重置规格/开卡方式/有效时间/商品金额/购买赠送/表单重置
    resetData() {
      // 规格
      this.selectSpecs = null
      this.selectSpecsItem = {}
      // 开卡方式
      this.selectOpenType = null
      // 有效时间
      this.startTime = null
      this.endTime = '-'
      // 商品金额
      this.cardPrice = '0'
      // 购买赠送
      this.giftAmount = ''
      this.form.resetFields()
    },
    onSelectCardChange(data) {
      if (data) {
        // 选择了卡
        this.selectCardItem = cloneDeep(
          this.cardList.filter(i => i.id === data)[0]
        )
        // 获取选择的卡的详情
        this.getUpgradeCardInfo(data)
      } else {
        // 清空了选择的卡
        this.selectCardItem = {}
        this.resetData()
      }
    },
    getUpgradeCardInfo(id) {
      // 判断之前是否请求过
      if (!this.upgradeCardsInfo[id]) {
        // 缓存请求结果
        this.upgradeMemberService.getUpgradeCardInfo(id).subscribe(res => {
          this.upgradeCardsInfo[id] = cloneDeep(res.info)
          this.upgradeCardInfo = cloneDeep(res.info)
          // 设置默认规格
          this.selectSpecs = this.upgradeCardInfo.specs[0].id
          this.selectSpecsItem = cloneDeep(this.upgradeCardInfo.specs[0])
          this.ruleQuota = this.selectSpecsItem.card_amount
          // 设置默认开卡方式
          this.selectOpenType = this.upgradeCardInfo.open_type[0].id
          this.getValidTime = this.selectSpecsItem.valid_time
          // 设置初始额度
          this.initAmount = this.selectSpecsItem.card_amount
          // 设置默认卡价格
          this.cardPrice = this.upgradeCardInfo.specs[0].price
        })
      } else {
        // 取缓存
        this.upgradeCardInfo = cloneDeep(this.upgradeCardsInfo[id])
        // 设置默认规格
        this.selectSpecs = this.upgradeCardInfo.specs[0].id
        this.selectSpecsItem = cloneDeep(this.upgradeCardInfo.specs[0])
        this.ruleQuota = this.selectSpecsItem.card_amount
        // 设置默认开卡方式
        this.selectOpenType = this.upgradeCardInfo.open_type[0].id
        this.getValidTime = this.selectSpecsItem.valid_time
        // 设置初始额度
        this.initAmount = this.selectSpecsItem.card_amount
        // 设置默认卡价格
        this.cardPrice = this.upgradeCardInfo.specs[0].price
      }
    },
    // 规格
    onSpecsChange(data) {
      this.selectSpecsItem = cloneDeep(
        this.upgradeCardInfo.specs.filter(i => i.id === data.target.value)[0]
      )
      const item = this.upgradeCardInfo.specs.filter(
        i => i.id === data.target.value
      )[0]
      this.cardPrice = item.price
      this.ruleQuota = item.card_amount
      // 重置选择的开始时间
      this.form.resetFields(['startTime'])
      this.endTime = '-'
      this.getValidTime = this.selectSpecsItem.valid_time
      this.initAmount = this.selectSpecsItem.card_amount
    },
    // 开卡方式
    onOpenTypeChange(data) {
      // 重置选择的开始时间
      this.form.resetFields(['startTime'])
      this.endTime = '-'
    },
    // 有效时间
    disabledStartDate(startTime) {
      return startTime && startTime < moment().subtract(90, 'days')
    },
    onStartTimeChange(data) {
      this.startTime = cloneDeep(data)
      let s = cloneDeep(data)
      let productType = this.upgradeCardInfo.product_type.id
      let dayScope = this.ruleQuota
      if (productType === 1) {
        dayScope = this.selectSpecsItem.valid_time
      }
      this.endTime = s.add(dayScope, 'd').format('YYYY-MM-DD HH:mm')
    },
    // 原卡折扣
    onSurplusPriceChange(data) {
      this.surplusPrice = data
    },
    // 优惠
    onSelectCouponChange(data) {
      if (data.target.value === -1) {
        this.couponAmount = ''
        this.couponText = '未选择优惠券'
        return
      }
      let price = this.couponList.filter(o => o.id === data.target.value)[0]
        .price
      this.couponAmount = price
      this.couponText = `${price}元`
    },
    onSelectCoupon() {
      timer(200).subscribe(() => {
        this.couponDropdownVisible = false
      })
    },
    resetCoupon() {
      this.upgradeMemberService.resetCouponList()
      this.couponText = '未选择优惠券'
      this.couponAmount = ''
      this.selectCoupon = ''
    },
    // 定金
    onSelectAdvanceChange(data) {
      if (data.target.value === -1) {
        this.advanceAmount = ''
        this.advanceText = '未选择定金'
        return
      }
      let price = this.advanceList.filter(o => o.id === data.target.value)[0]
        .price
      this.advanceAmount = price
      this.advanceText = `${price}元`
    },
    onSelectAdvance() {
      timer(200).subscribe(() => {
        this.advanceDropdownVisible = false
      })
    },
    resetAdvance() {
      this.upgradeMemberService.resetAdvanceList()
      this.advanceText = '未选择定金'
      this.advanceAmount = ''
      this.selectAdvance = ''
    },
    // 计算实付金额
    getPrice(params) {
      this.upgradeMemberService.priceAction$.dispatch(params)
    },
    onCreateOrder() {
      this.form.validate((error, values) => {
        if (!error) {
          const {
            admission_range,
            product_support_shops: sold_product_support_shops
          } = this.admission_range_info
          this.upgradeMemberService
            .upgrade(
              {
                product_id: +values.memberCardId,
                contract_number: this.info.contract_number,
                rule_id: +this.selectSpecs,
                surplus_price: +values.surplusPrice,
                valid_start_time: moment(values.startTime).format(
                  'YYYY-MM-DD HH:mm'
                ),
                open_card_type: +this.selectOpenType,
                user_coupon_id: this.selectCoupon,
                advance_id: this.selectAdvance,
                reduce_price: +this.reduceAmount,
                description: this.description,
                staff_sale_id: +values.saleName,
                gift_amount: +this.giftAmount,
                init_amount: +this.initAmount,
                total_price: +this.cardPrice,
                admission_range,
                sold_product_support_shops,
                rule_quota: +this.ruleQuota
              },
              this.id
            )
            .subscribe(res => {
              this.show = false
              this.$emit('success', {
                type: 'create',
                orderId: res.info.order_id,
                soldId: res.info.sold_id,
                isFamilyCard: this.isFamilyCard
              })
            })
        }
      })
    },
    onPay() {
      this.form.validate((error, values) => {
        if (!error) {
          const {
            admission_range,
            product_support_shops: sold_product_support_shops
          } = this.admission_range_info
          this.upgradeMemberService
            .upgrade(
              {
                product_id: +values.memberCardId,
                contract_number: this.info.contract_number,
                rule_id: +this.selectSpecs,
                surplus_price: +values.surplusPrice,
                valid_start_time: moment(values.startTime).format(
                  'YYYY-MM-DD HH:mm'
                ),
                open_card_type: +this.selectOpenType,
                user_coupon_id: this.selectCoupon,
                advance_id: this.selectAdvance,
                reduce_price: +this.reduceAmount,
                description: this.description,
                staff_sale_id: +values.saleName,
                gift_amount: +this.giftAmount,
                init_amount: +this.initAmount,
                total_price: +this.cardPrice,
                admission_range,
                sold_product_support_shops,
                rule_quota: +this.ruleQuota
              },
              this.id
            )
            .subscribe(res => {
              this.show = false
              this.$emit('success', {
                type: 'createPay',
                orderId: res.info.order_id,
                soldId: res.info.sold_id,
                isFamilyCard: this.isFamilyCard
              })
            })
        }
      })
    },
    onCancel() {
      this.upgradeMemberService.resetCouponList()
      this.upgradeMemberService.resetAdvanceList()
    },
    onShopChange(type, shopIds) {
      this.admission_range_info.admission_range = type
      this.admission_range_info.product_support_shops = shopIds
    },
    onRuleQuotaChange() {
      // 期卡编辑规格更新有效时间
      if (this.upgradeCardInfo.card_number_type === 1) {
        this.getValidTime = this.ruleQuota
      }
    },
    onPriceChange() {
      /**
       * 商品价格变化后重置优惠券和定金和减免金额
       */
      this.reduceAmount = ''
      // 重置优惠券
      this.resetCoupon()
      // 重新获取优惠券
      this.upgradeMemberService.couponAction$.dispatch({
        member_id: this.info.member_id,
        card_id: this.upgradeCardInfo.id,
        specs_id: this.selectSpecsItem.id,
        transaction_price: +this.cardPrice
      })
      this.getPrice({
        product_id: this.selectCardItem.id,
        product_type: this.info.contract_type,
        specs_id: +this.selectSpecs,
        advance_id: this.selectAdvance === -1 ? '' : this.selectAdvance,
        reduce_amount: +this.reduceAmount,
        coupon_id: this.selectCoupon === -1 ? '' : this.selectCoupon,
        member_id: +this.info.member_id,
        surplus_amount: +this.surplusPrice,
        transaction_price: +this.cardPrice
      })
    }
  }
}
</script>
