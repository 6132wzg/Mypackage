<template>
  <st-modal
    :title="`${$c('member_card')}恢复售卖`"
    v-model="show"
    wrapClassName="modal-card-shop-recover-sale"
    width="484px"
  >
    <div :class="recoverSale()">
      <div :class="recoverSale('warn-text')" class="mg-b24">
        <st-icon
          color="#1890FF"
          style="line-height:22px;flex:none;margin-top:4px;"
          size="14px"
          type="help"
        />
        <p>
          注：仅恢复{{ $c('member_card') }}为可售卖状态，该{{
            $c('member_card')
          }}需要重新上架至门店。
        </p>
      </div>
      <div :class="recoverSale('card-name')" class="mg-b24">
        <st-tag type="deposit-card" style="margin-right:8px;" />
        <span>{{ cardName }}</span>
      </div>
      <st-form :form="form" labelWidth="94px" :class="recoverSale('form')">
        <st-form-item label="支持售卖时间" class="mg-b0" required>
          <div :class="recoverSale('saletime')">
            <a-form-item class="page-a-form">
              <a-date-picker
                style="width: 100%;"
                disabled
                v-model="startTime"
                format="YYYY-MM-DD"
                placeholder="开始时间"
              />
            </a-form-item>
            <span>~</span>
            <a-form-item class="page-a-form">
              <a-date-picker
                :disabledDate="disabledEndDate"
                v-decorator="decorators.endTime"
                format="YYYY-MM-DD"
                placeholder="结束时间"
                :showToday="false"
              />
            </a-form-item>
          </div>
        </st-form-item>
      </st-form>
    </div>
    <footer slot="footer" :class="recoverSale('footer')">
      <st-button @click="show = false">取消</st-button>
      <st-button
        type="primary"
        :loading="loading.setRecoverSale"
        @click="onSubmit"
        ghost
      >
        恢复售卖
      </st-button>
    </footer>
  </st-modal>
</template>
<script>
import { cloneDeep } from 'lodash-es'
import moment from 'moment'
import { RecoverSaleService } from './recover-sale.service'
import { ruleOptions } from './recover-sale.config'
export default {
  name: 'ModalCardShopDepositRecoverSale',
  bem: {
    recoverSale: 'modal-card-shop-recover-sale'
  },
  serviceInject() {
    return {
      recoverSaleService: RecoverSaleService
    }
  },
  rxState() {
    return {
      loading: this.recoverSaleService.loading$,
      serviceTime: this.recoverSaleService.time$
    }
  },
  props: ['id', 'cardName'],
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false,
      startTime: null,
      endTime: null
    }
  },
  methods: {
    moment,
    // 结束时间
    disabledEndDate(endValue) {
      return (
        endValue.valueOf() < this.serviceTime * 1000 ||
        endValue.valueOf() >
          moment(this.serviceTime * 1000)
            .add(30, 'y')
            .valueOf()
      )
    },
    onSubmit() {
      this.form.validate().then(values => {
        this.recoverSaleService
          .setRecoverSale(
            {
              start_time: `${moment(this.serviceTime * 1000).format(
                'YYYY-MM-DD'
              )}`,
              end_time: `${values.endTime.format('YYYY-MM-DD')}`
            },
            this.id
          )
          .subscribe(() => {
            this.show = false
            this.$emit('success')
          })
      })
    }
  },
  mounted() {
    this.recoverSaleService.getServiceTime().subscribe(() => {
      this.startTime = cloneDeep(moment(this.serviceTime * 1000))
    })
  }
}
</script>
