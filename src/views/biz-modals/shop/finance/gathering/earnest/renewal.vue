<template>
  <st-modal title="定金延期" v-model="show" @ok="onSubmit">
    <a-row>
      <a-col :span="12">
        <st-info>
          <st-info-item label="用户姓名">{{ info.member_name }}</st-info-item>
          <st-info-item label="用户手机号">
            {{ info.member_mobile }}
          </st-info-item>
          <st-info-item label="定金金额">{{ info.pay_price }}</st-info-item>
          <st-info-item label="收款日期">{{ info.pay_last_time }}</st-info-item>
        </st-info>
      </a-col>
      <a-col :span="12">
        <st-info>
          <st-info-item label="销售">{{ info.staff_name }}</st-info-item>
          <st-info-item label="收款人">{{ info.cashier }}</st-info-item>
          <st-info-item label="到期日期">{{ info.end_time }}</st-info-item>
        </st-info>
      </a-col>
    </a-row>
    <st-hr />
    <st-form :form="form">
      <st-form-item label="到期日期" required>
        <a-date-picker
          showTime
          v-decorator="decorators.end_time"
          style="width: 300px"
          :disabledDate="disabledDate"
        />
      </st-form-item>
      <st-form-item label="备注">
        <st-textarea
          maxlength="200"
          v-decorator="decorators.description"
          :autosize="{ minRows: 1, maxRows: 3 }"
          placeholder="请输入备注信息"
        ></st-textarea>
      </st-form-item>
    </st-form>
  </st-modal>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { RenewalService } from './renewal.service'
import { ruleOptions } from './renewal.config'
export default {
  serviceInject() {
    return {
      messageService: MessageService,
      renewalService: RenewalService
    }
  },
  rxState() {
    const { info$, loading$ } = this.renewalService
    return {
      info: info$,
      loading: loading$
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      show: false
    }
  },
  computed: {
    ruleOptions
  },
  created() {
    this.renewalService.getInfo(this.id).subscribe(res => {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          end_time: moment(res.info.end_time)
        })
      })
    })
  },
  methods: {
    disabledDate(current) {
      return current && current < moment(this.info.end_time)
    },
    onSubmit() {
      this.form.validate().then(values => {
        const params = {
          end_time: values.end_time.format('YYYY-MM-DD HH:mm'),
          description: values.description
        }
        this.renewalService
          .updateRenewal(this.id, params)
          .subscribe(this.onSubmitSuccess)
      })
    },
    onSubmitSuccess() {
      this.messageService.success({
        content: '修改成功'
      })
      this.$emit('success')
      this.show = false
    }
  }
}
</script>
