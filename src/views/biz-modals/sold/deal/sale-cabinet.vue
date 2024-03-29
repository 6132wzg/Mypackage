<template>
  <st-modal
    title="租赁柜签单"
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
          @change="onMemberChange"
        ></member-search>
        <div :class="sale('sale')">
          <st-form-item v-if="cabinetList" label="租赁柜号" required>
            <a-cascader
              v-decorator="decorators.cabinet"
              @change="onCabinetChange"
              :allowClear="false"
              :fieldNames="cabinetFieldNames"
              :options="cabinetList"
              placeholder="请选择租赁柜号"
            />
            <a-row
              :class="sale('info')"
              v-if="hasProductInfo"
              type="flex"
              justify="space-between"
            >
              <a-col :span="12">
                <st-info>
                  <st-info-item label="商品名称">
                    {{ info.product_name }}
                  </st-info-item>
                  <st-info-item label="商品类型">
                    {{ info.product_type }}
                  </st-info-item>
                  <st-info-item class="mg-b24" label="租赁计费">
                    {{ info.price }}
                  </st-info-item>
                </st-info>
              </a-col>
              <a-col :span="11">
                <st-info>
                  <st-info-item label="售卖群体" v-if="info.sale_range">
                    {{ info.sale_range.name }}
                  </st-info-item>
                  <st-info-item label="允许转让">
                    {{ info.is_transfer }}
                  </st-info-item>
                  <st-info-item class="mg-b24" label="转让手续费">
                    {{ info.transfer }}
                  </st-info-item>
                </st-info>
              </a-col>
            </a-row>
          </st-form-item>
          <st-form-item required class="mg-b0" label="租赁时间">
            <div :class="sale('time')">
              <a-form-item class="page-a-form">
                <a-date-picker
                  style="width: 100%;"
                  v-model="startTime"
                  disabled
                  format="YYYY-MM-DD HH:mm"
                  placeholder="开始时间"
                  :showToday="false"
                />
              </a-form-item>
              <span>~</span>
              <a-form-item class="page-a-form">
                <a-date-picker
                  :allowClear="false"
                  :disabled="disabledCalendar"
                  v-decorator="decorators.endTimePicker"
                  @change="endTimeChange"
                  style="width: 100%;"
                  :showTime="{ defaultValue: startTime, format: 'HH:mm' }"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="结束时间"
                  :showToday="false"
                />
              </a-form-item>
            </div>
          </st-form-item>
          <st-form-item required label="租赁天数">
            <st-input-number
              :disabledDate="disabledCalendar"
              @change="onEndTimeInputChange"
              v-decorator="decorators.endTimeInput"
              :max="999999"
            >
              <template slot="addonAfter">
                天
              </template>
            </st-input-number>
          </st-form-item>
          <editable-contract-number
            v-model="info.contract_number"
            :form="form"
          />
          <st-form-item class="mg-b12" label="租赁费用">
            {{ orderAmountPrice }}
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
            <span class="total">{{ currentPrice }}</span>
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
          <span>{{ currentPrice }}</span>
          <span>订单总额：{{ orderAmountPrice }}</span>
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
import { SaleCabinetService } from './sale-cabinet.service'
import { cloneDeep, get } from 'lodash-es'
import { timer } from 'rxjs'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from './sale-cabinet.config'
import EditableContractNumber from '@/views/biz-components/contract/editable-contract-number.vue'
import MemberSearch from '@/views/biz-components/member/member-search/member-search'
export default {
  name: 'ModalSoldDealSaleCabinet',
  bem: {
    sale: 'modal-sold-deal-sale'
  },
  components: {
    EditableContractNumber,
    MemberSearch
  },
  serviceProviders() {
    return [SaleCabinetService]
  },
  serviceInject() {
    return {
      saleCabinetService: SaleCabinetService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      loading: this.saleCabinetService.loading$,
      saleList: this.saleCabinetService.saleList$,
      cabinetList: this.saleCabinetService.cabinetList$,
      info: this.saleCabinetService.info$,
      currentPrice: this.saleCabinetService.currentPrice$,
      orderAmountPrice: this.saleCabinetService.orderAmountPrice$
    }
  },
  props: {
    id: {
      type: String
    },
    areaId: {
      type: [String, Number],
      default: 0
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
      // 租赁柜
      cabinetFieldNames: {
        label: 'name',
        value: 'id',
        children: 'cabinets'
      },
      cabinetId: '',
      // 租赁天数
      disabledCalendar: true,
      startTime: moment(),
      days: '',
      // 定金
      advanceDropdownVisible: false,
      advanceList: [],
      advanceText: '未选择定金',
      advanceAmount: '',
      selectAdvance: '',
      reduceAmount: null,
      description: '',
      isFollowSalesman: 0
    }
  },
  computed: {
    // 租赁费用
    leaseFee() {
      if (!this.cabinetId || !this.days > 0) {
        return '无'
      } else {
        return `${this.info.price_num * this.days}元`
      }
    },
    // 小计
    orderAmount() {
      if (!this.cabinetId || !this.days > 0) {
        return '无'
      } else {
        return `${this.info.price_num * this.days -
          +this.reduceAmount -
          +this.advanceAmount}元`
      }
    },
    orderAmountText() {
      return this.orderAmount.split('元')[0] < 0 ? '小计不能为负' : ''
    },
    saleRangeType() {
      return get(this.info.sale_range, 'type', 1)
    },
    hasProductInfo() {
      return JSON.stringify(this.info) !== '{}'
    }
  },
  watch: {
    days(newVal, oldVal) {
      this.getOrderPrice()
      this.getPrice(this.selectAdvance, +this.reduceAmount)
    },
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
  created() {
    this.saleCabinetService.orderAmountPrice$.commit(() => 0)
    this.saleCabinetService.currentPrice$.commit(() => 0)
    this.saleCabinetService.init().subscribe(res => {
      if (this.id) {
        this.saleCabinetService.getInfo(this.id).subscribe(res => {
          setTimeout(() => {
            this.startTime = cloneDeep(moment(res.info.start_time))
          })
        })
      }
      this.saleCabinetService.getCabinetList(this.areaId).subscribe()
    })
  },
  methods: {
    onMemberChange(data) {
      this.resetAdvance()
      if (data) {
        this.saleCabinetService.getAdvanceList(data).subscribe(res => {
          this.advanceList = cloneDeep(res.list)
        })
      }
    },
    // 重置定金选择
    resetAdvance() {
      this.advanceList = []
      this.advanceText = '未选择定金'
      this.advanceAmount = ''
      this.selectAdvance = ''
    },
    onCabinetChange(data) {
      this.cabinetId = data[1]
      this.saleCabinetService.getInfo(data[1]).subscribe()
    },
    // 租赁时间
    disabledEndDate(endValue) {
      return (
        endValue.valueOf() < this.startTime.valueOf() ||
        endValue.valueOf() >
          moment()
            .add(999, 'd')
            .valueOf()
      )
    },
    // 租赁时间-end
    endTimeChange(data) {
      this.form.setFieldsValue({
        endTimeInput: Math.ceil(
          data.diff(this.startTime, 'minutes') / (24 * 60)
        )
      })
      this.days = Math.ceil(data.diff(this.startTime, 'minutes') / (24 * 60))
    },
    onEndTimeInputChange(data) {
      this.days = data
      let start = cloneDeep(this.startTime)
      if (data > 0) {
        // 有效天数
        this.form.setFieldsValue({
          endTimePicker: start.add(data, 'd')
        })
      } else {
        // 无效天数
        this.form.resetFields(['endTimePicker'])
      }
    },
    onSelectAdvance() {
      timer(200).subscribe(() => {
        this.advanceDropdownVisible = false
      })
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
    // 获取当前价钱
    getPrice(advance, reduce) {
      const memberId = this.form.getFieldValue('member_id')
      this.saleCabinetService.currentPriceAction$.dispatch({
        product_id: this.cabinetId,
        product_type: this.info.contract_type,
        product_num: this.days,
        advance_id: advance || undefined,
        member_id: memberId || undefined,
        reduce_amount: reduce || undefined
      })
    },
    // 获取订单总额
    getOrderPrice() {
      this.saleCabinetService.orderAmountPriceAction$.dispatch({
        product_id: this.cabinetId,
        product_type: this.info.contract_type,
        product_num: this.days
      })
    },
    onCreateOrder() {
      this.form.validate().then(values => {
        let reduce_amount = this.reduceAmount ? +this.reduceAmount : 0
        this.saleCabinetService
          .setTransaction({
            cabinet_id: +this.cabinetId,
            start_time: `${this.startTime.format('YYYY-MM-DD HH:mm')}`,
            end_time: `${values.endTimePicker.format('YYYY-MM-DD HH:mm')}`,
            lease_days: +this.days,
            contract_number: this.info.contract_number,
            advance_id:
              this.selectAdvance === -1 ? undefined : this.selectAdvance,
            reduce_amount,
            order_amount: this.currentPrice,
            member_id: +values.member_id,
            member_name: values.member_name,
            mobile: values.mobile ? values.mobile.phone : undefined,
            sale_id: +values.saleName,
            description: this.description,
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
        this.saleCabinetService
          .setTransactionPay({
            cabinet_id: +this.cabinetId,
            start_time: `${this.startTime.format('YYYY-MM-DD HH:mm')}`,
            end_time: `${values.endTimePicker.format('YYYY-MM-DD HH:mm')}`,
            lease_days: +this.days,
            contract_number: this.info.contract_number,
            advance_id:
              this.selectAdvance === -1 ? undefined : this.selectAdvance,
            reduce_amount,
            order_amount: this.currentPrice,
            member_id: +values.member_id,
            member_name: values.member_name,
            mobile: values.mobile ? values.mobile.phone : undefined,
            sale_id: +values.saleName,
            description: this.description,
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
    }
  }
}
</script>
