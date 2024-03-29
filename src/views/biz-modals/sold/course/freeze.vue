<template>
  <st-modal
    title="冻结"
    size="small"
    v-model="show"
    wrapClassName="modal-sold-course-freeze"
  >
    <div :class="freeze('content')">
      <a-row :class="freeze('info')">
        <a-col :span="24">
          <st-info>
            <st-info-item label="课程名称">{{ info.course_name }}</st-info-item>
            <st-info-item label="剩余课时">
              {{ info.remain_course_num }}
            </st-info-item>
            <st-info-item label="有效期">{{ info.valid_date }}</st-info-item>
            <st-info-item class="mg-b24" label="剩余冻结时长">
              {{ info.frozen_time_remain }}
            </st-info-item>
          </st-info>
        </a-col>
      </a-row>
      <st-form :form="form" labelWidth="68px">
        <div :class="freeze('freeze')">
          <st-form-item
            class="mg-b0"
            label="冻结日期"
            required
            labelGutter="12px"
          >
            <div :class="freeze('time')">
              <a-form-item class="page-a-form">
                <a-date-picker
                  style="width: 100%;"
                  :value="moment(+info.start_time * 1000)"
                  disabled
                  format="YYYY-MM-DD HH:mm"
                  placeholder="开始时间"
                  :showToday="false"
                />
              </a-form-item>
              <span>~</span>
              <a-form-item class="page-a-form">
                <a-date-picker
                  :disabledDate="disabledEndDate"
                  v-decorator="decorators.endTime"
                  @change="end_time_change"
                  style="width:170px"
                  :showTime="{
                    defaultValue: moment(info.start_time * 1000),
                    format: 'HH:mm'
                  }"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="结束时间"
                  :showToday="false"
                />
              </a-form-item>
            </div>
          </st-form-item>
          <st-form-item label="手续费" labelGutter="12px">
            <st-input-number
              :min="0"
              :max="99999.9"
              v-model="frozen_fee"
              @change="onFrozenChange"
              :float="true"
            >
              <template slot="addonAfter">元</template>
            </st-input-number>
          </st-form-item>
          <st-form-item
            label="支付方式"
            v-if="frozen_fee > 0"
            :required="true"
            labelGutter="12px"
          >
            <a-select
              v-decorator="decorators.payType"
              placeholder="选择支付方式"
              :disabled="!(frozen_fee > 0)"
            >
              <a-select-option
                v-for="(item, index) in memberPaymentlist"
                :key="index"
                :value="+item.payment_type"
              >
                {{ item.payment_type_name }}
              </a-select-option>
            </a-select>
          </st-form-item>
        </div>
      </st-form>
    </div>
    <template slot="footer">
      <st-button @click="onSubmit" :loading="loading.freeze" type="primary">
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import moment from 'moment'
import { cloneDeep } from 'lodash-es'
import { UserService } from '@/services/user.service'
import { FreezeService } from './freeze.service'
import { OPERATION_TYPES } from '@/constants/sold/operations'
import { ruleOptions } from './freeze.config'
export default {
  name: 'ModalSoldCourseFreeze',
  serviceProviders() {
    return [FreezeService]
  },
  serviceInject() {
    return {
      userService: UserService,
      freezeService: FreezeService
    }
  },
  rxState() {
    return {
      loading: this.freezeService.loading$,
      info: this.freezeService.info$,
      memberPaymentlist: this.freezeService.memberPaymentlist$
    }
  },
  bem: {
    freeze: 'modal-sold-course-freeze'
  },
  props: ['id', 'type'],
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      OPERATION_TYPES,
      show: false,
      startTime: moment(),
      endTime: null,
      frozen_fee: null,
      frozen_pay_type: 1
    }
  },
  created() {
    this.freezeService.getInfo(this.id, this.type).subscribe(res => {
      this.freezeService
        .getMemberPaymentList({
          member_id: res.info.member_id,
          product_type: res.info.product_type,
          operation_type: OPERATION_TYPES.FREEZE
        })
        .subscribe()
    })
  },
  methods: {
    moment,
    // end_time validatorFn
    end_time_validator(rule, value, callback) {
      if (!value) {
        // eslint-disable-next-line
        callback('请选择冻结结束日期')
      } else {
        // eslint-disable-next-line
        callback()
      }
    },
    // pay_type validatorFn
    pay_type_validator(rule, value, callback) {
      if (!value && this.frozen_fee > 0) {
        // eslint-disable-next-line
        callback('请选择支付方式')
      } else {
        // eslint-disable-next-line
        callback()
      }
    },
    // 售卖时间-end
    end_time_change(data) {
      this.endTime = cloneDeep(data)
    },
    disabledEndDate(endValue) {
      return endValue.valueOf() < moment().valueOf()
    },
    onFrozenChange(data) {
      this.form.resetFields(['payType'])
    },
    onSubmit() {
      this.form.validate().then(values => {
        this.freezeService
          .freeze(
            {
              start_time: moment(this.info.start_time).format(
                'YYYY-MM-DD HH:mm'
              ),
              end_time: values.endTime.format('YYYY-MM-DD HH:mm'),
              frozen_fee: this.frozen_fee,
              frozen_pay_type: values.payType
            },
            this.id,
            this.type
          )
          .subscribe(res => {
            this.show = false
            this.$emit('success')
          })
      })
    }
  }
}
</script>
