<template>
  <st-modal
    title="续租"
    size="small"
    v-model="show"
    wrapClassName="modal-sold-lease-relet"
    @ok="onOk"
  >
    <div :class="relet('content')">
      <a-row :class="relet('info')">
        <a-col :span="13">
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
            <st-info-item label="允许转让">{{ info.is_transfer }}</st-info-item>
            <st-info-item class="mg-b24" label="转让手续费">
              {{ info.transfer }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>
      <st-form labelWidth="88px" :form="form">
        <div :class="relet('relet')">
          <st-form-item label="租赁会员" class="mg-b16">
            {{ info.member_name }}
          </st-form-item>
          <st-form-item label="租赁柜号" required>
            {{ info.serial_num }}
            <!-- <a-cascader :options="options" placeholder="选择XXX" /> -->
          </st-form-item>
          <st-form-item label="续租时间" required>
            <div :class="relet('time')">
              <a-form-item class="page-a-form mg-b0">
                {{ info.start_time }}
              </a-form-item>
              <span>~</span>
              <a-form-item class="page-a-form mg-b0">
                <a-date-picker
                  format="YYYY-MM-DD HH:mm"
                  placeholder="结束时间"
                  :showToday="false"
                  showTime
                  :disabledDate="disabledStartDate"
                  v-decorator="decorators.end_time"
                  @change="end_time_change"
                />
              </a-form-item>
            </div>
          </st-form-item>
          <st-form-item label="租赁天数" required>
            <st-input-number
              placeholder="请输入天数"
              :min="1"
              :max="999"
              @change="changeLeaseNum"
              v-decorator="decorators.lease_num"
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
          <st-form-item class="mg-b16" label="租赁费用">
            {{ orderAmountPrice }}元
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
          <st-form-item label="减免金额" class="mg-b16">
            <st-input-number placeholder="请输入金额" v-model="reduceAmount">
              <template slot="addonAfter">
                元
              </template>
            </st-input-number>
          </st-form-item>
          <st-form-item class="mg-b0" label="小计" :help="orderAmountText">
            <span class="total">{{ currentPrice }}元</span>
          </st-form-item>
        </div>
        <div :class="relet('remarks')">
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
              :autosize="{ minRows: 4, maxRows: 6 }"
              v-model="description"
            />
          </st-form-item>
        </div>
      </st-form>
    </div>
    <template slot="footer">
      <div :class="relet('footer')">
        <div class="price">
          <span>{{ currentPrice }}元</span>
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
            type="primary"
            @click="onPay"
            :loading="loading.setTransactionPay"
          >
            立即支付
          </st-button>
        </div>
      </div>
    </template>
  </st-modal>
</template>

<script>
import { ReletService } from './relet.service'
import { cloneDeep } from 'lodash-es'
import { timer } from 'rxjs'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from './relet.config'
import EditableContractNumber from '@/views/biz-components/contract/editable-contract-number.vue'

export default {
  name: 'ModalSoldLeaseRelet',
  bem: {
    relet: 'modal-sold-lease-relet',
    sale: 'modal-sold-deal-sale'
  },
  components: {
    EditableContractNumber
  },
  serviceProviders() {
    return [ReletService]
  },
  serviceInject() {
    return {
      reletService: ReletService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      loading: this.reletService.loading$,
      info: this.reletService.info$,
      saleList: this.reletService.saleList$,
      advanceList: this.reletService.advanceList$,
      currentPrice: this.reletService.currentPrice$,
      orderAmountPrice: this.reletService.orderAmountPrice$
    }
  },
  props: ['id'],
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      endTimeValue: null,
      // 定金
      advanceDropdownVisible: false,
      advanceText: '未选择定金',
      selectAdvance: '',
      reduceAmount: '',
      description: ''
    }
  },
  created() {
    this.reletService.serviceInit(this.id).subscribe(res => {
      this.reletService.getAdvanceList(this.info.member_id).subscribe()
    })
  },
  computed: {
    orderAmountText() {
      return this.currentPrice < 0 ? '小计不能为负' : ''
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
  methods: {
    disabledStartDate(endTime) {
      const startTime = moment(this.info.start_time)
      if (!endTime || !startTime) {
        return false
      }
      return endTime.valueOf() < startTime.valueOf()
    },
    changeLeaseNum(event) {
      this.form.setFieldsValue({
        end_time: moment(this.info.start_time).add(event, 'days')
      })
      this.getOrderPrice()
      this.getPrice()
    },
    onSelectAdvance() {
      timer(200).subscribe(() => {
        this.advanceDropdownVisible = false
      })
    },
    // 重置定金选择
    resetAdvance() {
      this.advanceList = []
      this.advanceText = '未选择定金'
    },
    onSelectAdvanceChange(data) {
      this.advanceText = `未选择定金`
      if (data.target.value !== -1) {
        let price = this.advanceList.filter(o => o.id === data.target.value)[0]
          .price
        this.advanceText = `${price}元`
      }
    },
    // 计算实付金额
    getPrice(advance, reduce) {
      this.reletService.currentPriceAction$.dispatch({
        id: this.id,
        product_id: this.info.cabinet_id,
        product_type: this.info.contract_type,
        product_num: this.form.getFieldValue('lease_num') || 0,
        member_id: this.info.member_id,
        advance_id: advance === -1 ? '' : advance,
        reduce_amount: reduce || undefined
      })
    },
    // 获取订单总额
    getOrderPrice() {
      this.reletService.orderAmountPriceAction$.dispatch({
        id: this.id,
        product_id: this.info.cabinet_id,
        product_type: this.info.contract_type,
        product_num: this.form.getFieldValue('lease_num') || 0
      })
    },
    onOk() {
      this.$emit('ok')
      this.show = false
    },
    // 租赁时间-end
    end_time_change(data) {
      this.form.setFieldsValue({
        lease_num: data.diff(moment(this.info.start_time), 'days') + 1
      })
      this.getOrderPrice()
      this.getPrice()
    },
    onCreateOrder() {
      this.form.validate().then(values => {
        this.reletService
          .setTransactionOrder(
            {
              id: this.id,
              start_time: this.info.start_time,
              end_time: moment(values.end_time).format('YYYY-MM-DD HH:mm'),
              contract_number: this.info.contract_number,
              advance_id: this.selectAdvance === -1 ? '' : this.selectAdvance,
              reduce_amount: this.reduceAmount || 0,
              description: this.description,
              order_amount: this.currentPrice,
              lease_days: values.lease_num,
              sale_id: values.saleName,
              member_id: this.info.member_id
            },
            this.id
          )
          .subscribe(result => {
            this.$emit('success', {
              type: 'create',
              order_id: result.info.order_id
            })
            this.show = false
          })
      })
    },
    onPay() {
      this.form.validate().then(values => {
        this.reletService
          .setTransactionPay(
            {
              id: this.id,
              start_time: this.info.start_time,
              end_time: moment(values.end_time).format('YYYY-MM-DD HH:mm'),
              contract_number: this.info.contract_number,
              advance_id: this.selectAdvance === -1 ? '' : this.selectAdvance,
              reduce_amount: this.reduceAmount || 0,
              description: this.description,
              order_amount: this.currentPrice,
              lease_days: values.lease_num,
              sale_id: values.saleName,
              member_id: this.info.member_id
            },
            this.id
          )
          .subscribe(result => {
            this.$emit('success', {
              type: 'createPay',
              order_id: result.info.order_id
            })
            this.show = false
          })
      })
    }
  }
}
</script>
