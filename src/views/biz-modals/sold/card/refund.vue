<template>
  <st-modal title="退款" v-model="show" wrapClassName="modal-sold-card-refund">
    <div :class="refund('content')">
      <a-row :class="refund('info')" v-if="isDeposit">
        <a-col :span="13" class="mg-b36">
          <st-info>
            <st-info-item label="订单号">
              {{ refundInfo.order_id }}
            </st-info-item>
            <st-info-item class="mg-b0" label="下单时间">
              {{ refundInfo.created_time }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="11" class="mg-b36">
          <st-info>
            <st-info-item label="下单人">
              {{ refundInfo.operator_name }}
            </st-info-item>
            <st-info-item class="mg-b0" label="销售">
              {{ refundInfo.staff_name }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="13" class="mg-b36">
          <st-info>
            <st-info-item label="场馆">{{ refundInfo.shop_name }}</st-info-item>
            <st-info-item class="mg-b0" label="用户">
              {{ refundInfo.member_name }} {{ refundInfo.mobile }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="11" class="mg-b36">
          <st-info>
            <st-info-item label="购买">{{ refundInfo.card_name }}</st-info-item>
            <st-info-item class="mg-b0" label="赠送">
              {{ isDeposit ? '无' : 'refundInfo.aaaa' }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="24" class="mg-b36">
          <st-info>
            <st-info-item class="mg-b0" label="备注">
              {{ refundInfo.description || '无' }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="13" class="mg-b24">
          <st-info>
            <st-info-item label="订单总额">
              {{ refundInfo.total_price }}元
            </st-info-item>
            <st-info-item
              class="mg-b0"
              label="订单状态"
              v-if="refundInfo.order_status"
            >
              {{
                refundInfo.order_status | enumFilter('sold_common.order_status')
              }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="11" class="mg-b24">
          <st-info>
            <st-info-item label="应收金额">
              {{ refundInfo.should_price }}元
            </st-info-item>
            <st-info-item class="mg-b0" label="实收金额">
              {{ refundInfo.pay_price }}元
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>
      <a-row :class="refund('info')" v-if="isMember">
        <a-col :span="13" class="mg-b36">
          <st-info>
            <st-info-item label="订单号">
              {{ refundInfo.order_id }}
            </st-info-item>
            <st-info-item class="mg-b0" label="下单时间">
              {{ refundInfo.created_time }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="11" class="mg-b36">
          <st-info>
            <st-info-item label="下单人">
              {{ refundInfo.operator_name }}
            </st-info-item>
            <st-info-item class="mg-b0" label="销售">
              {{ refundInfo.staff_name }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="13" class="mg-b36">
          <st-info>
            <st-info-item label="场馆">{{ refundInfo.shop_name }}</st-info-item>
            <st-info-item class="mg-b0" label="用户">
              {{ refundInfo.member_name }} {{ refundInfo.mobile }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="11" class="mg-b36">
          <st-info>
            <st-info-item label="购买">{{ refundInfo.card_name }}</st-info-item>
            <st-info-item class="mg-b0" label="赠送">
              {{ refundInfo.gift_amount }}
            </st-info-item>
          </st-info>
        </a-col>

        <a-col :span="13" class="mg-b24">
          <st-info>
            <st-info-item label="订单总额">
              {{ refundInfo.total_price }}元
            </st-info-item>
            <st-info-item class="mg-b0" label="订单类型">
              {{ refundInfo.order_type }}
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="11" class="mg-b24">
          <st-info>
            <st-info-item label="应收金额">
              {{ refundInfo.should_price }}元
            </st-info-item>
            <st-info-item class="mg-b0" label="实收金额">
              {{ refundInfo.pay_price }}元
            </st-info-item>
          </st-info>
        </a-col>
        <a-col :span="24" class="mg-b36">
          <st-info>
            <st-info-item class="mg-b0" label="备注">
              {{ refundInfo.description || '无' }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>
      <st-form :form="form" labelWidth="88px">
        <div :class="refund('refund')">
          <st-form-item class="mg-b16" required>
            <template slot="label">
              退款原因
              <st-help-tooltip id="TSMC005" />
            </template>
            <a-radio-group v-model="refundReason">
              <a-radio
                v-for="item in refundReasons"
                :key="item.value"
                :value="+item.value"
              >
                {{ item.label }}
              </a-radio>
            </a-radio-group>
          </st-form-item>
          <st-form-item label="退款金额" required>
            <st-input-number
              :max="+refundInfo.pay_price"
              :float="true"
              placeholder="请输入本次退款的实际金额"
              v-decorator="decorators.refund_price"
            >
              <template slot="addonAfter">
                元
              </template>
            </st-input-number>
          </st-form-item>
          <st-form-item label="退款方式" class="mg-b16" required>
            <a-radio-group v-model="frozenPayType">
              <a-radio
                v-for="item in refundChannelSaas"
                :key="item.value"
                :value="+item.value"
              >
                {{ item.label }}
              </a-radio>
            </a-radio-group>
          </st-form-item>
          <st-form-item v-if="refundInfo.gift_points">
            <div :class="refund('integral')">
              该订单赠送{{ refundInfo.gift_points }}积分，退款时需扣回
              <span style="width: 150px;padding-left: 10px">
                <st-input-number
                  width="150px"
                  type="number"
                  :max="+refundInfo.gift_points"
                  placeholder="请输入"
                  v-decorator="decorators.gift_points"
                >
                  <template slot="addonAfter">
                    积分
                  </template>
                </st-input-number>
              </span>
            </div>
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
      <span class="info">
        提交后无法修改&nbsp;
        <st-icon type="help" />
      </span>
      <st-button @click="onSubmit" :loading="loading.refund" type="primary">
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import { RefundService } from './refund.service'
import { UserService } from '@/services/user.service'
import { ruleOptions } from './refund.config'
export default {
  name: 'ModalSoldCardRefund',
  bem: {
    refund: 'modal-sold-card-refund'
  },
  serviceProviders() {
    return [RefundService]
  },
  serviceInject() {
    return {
      userService: UserService,
      refundService: RefundService
    }
  },
  rxState() {
    return {
      refundInfo: this.refundService.refundInfo$,
      refundReasons: this.refundService.refundReasons$,
      refundChannelSaas: this.refundService.refundChannelSaas$,
      loading: this.refundService.loading$
    }
  },
  props: ['id', 'type'],
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      // 客户要求退款退货（此商品变为无效）
      refundReason: 2,
      frozenPayType: this.refundChannelSaas[0].value,
      description: ''
    }
  },
  computed: {
    isDeposit() {
      return this.type === 'deposit'
    },
    isMember() {
      return this.type === 'member'
    }
  },
  created() {
    this.refundService.getRefundInfo(this.id, this.type).subscribe(res => {
      res.info.gift_points &&
        this.$nextTick().then(() => {
          this.form.setFieldsValue({
            gift_points: res.info.gift_points
          })
        })
    })
  },
  methods: {
    onSubmit() {
      this.form.validate().then(values => {
        this.refundService
          .refund(
            {
              refund_price: +values.refund_price,
              refund_points: +values.gift_points,
              refund_reason: +this.refundReason,
              refund_channel: +this.frozenPayType,
              description: this.description
            },
            this.id,
            this.type
          )
          .subscribe(res => {
            this.$emit('success')
            this.show = false
          })
      })
    },
    handleIntegralCheck(rule, value) {
      if (value > this.refundInfo.member_points) {
        return `该用户仅剩${this.refundInfo.member_points}积分，不足扣减`
      }
      return true
    }
  }
}
</script>
