<template>
  <st-modal title="扣次" size="small" v-model="show">
    <st-info labelWidth="70px">
      <a-row>
        <a-col
          v-for="(item, key) in infoItems"
          :key="key"
          :span="item.colSpan || 12"
        >
          <st-info-item :label="item.label" :key="key">
            {{ item.value }}
          </st-info-item>
        </a-col>
      </a-row>
    </st-info>
    <st-form :form="form" labelWidth="68px">
      <st-form-item label="直接扣次" required>
        <st-input-number
          :min="1"
          :max="9999"
          v-decorator="decorators.personal_num"
        >
          <span slot="addonAfter">次</span>
        </st-input-number>
      </st-form-item>
      <st-form-item required label="扣次日期">
        <a-date-picker
          :disabledDate="disabledDate"
          v-decorator="decorators.deduction_time"
          style="width: 100%"
        />
      </st-form-item>
      <st-form-item label="备注">
        <st-textarea
          v-decorator="decorators.content"
          :autosize="{ minRows: 2, maxRows: 6 }"
          :maxlength="200"
        ></st-textarea>
      </st-form-item>
    </st-form>
    <template slot="footer">
      <st-button @click="onSubmit" type="primary" :loading="loading.deduct">
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import { DeductService } from './deduct.service.ts'
import { ruleOptions } from './deduct.config'
import { MessageService } from '@/services/message.service'
export default {
  serviceInject() {
    return {
      messageService: MessageService,
      deductService: DeductService
    }
  },
  rxState() {
    const { info$, infoItems$, loading$ } = this.deductService
    return {
      info: info$,
      infoItems: infoItems$,
      loading: loading$
    }
  },
  props: {
    id: {
      type: [Number, String],
      default: 0
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
  created() {
    this.deductService.getInfo(this.id).subscribe()
  },
  methods: {
    disabledDate(current) {
      return moment().subtract(1, 'M') > current || moment() < current
    },
    onSubmit() {
      this.form.validate().then(values => {
        const params = {
          ...values
        }
        this.deductService
          .deduct(this.id, params)
          .subscribe(this.onSubmitSuccess)
      })
    },
    onSubmitSuccess() {
      this.messageService.success({
        content: '提交成功'
      })
      this.show = false
      this.$emit('success')
    }
  }
}
</script>
