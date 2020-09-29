<template>
  <st-modal title="修改售出权益" size="small" v-model="show">
    <st-form :form="form">
      <st-form-item v-if="info.transfer" label="转让设置" labelWidth="88px">
        <st-checkbox v-model="info.transfer.is_transferable">
          支持转让
        </st-checkbox>
        <st-input-number
          v-show="info.transfer.is_transferable"
          v-decorator="decorators.transfer_num"
          style="width: 140px"
          :min="0"
          :max="form.getFieldValue('transfer_unit') === 1 ? 100 : 9999999.9"
        >
          <span slot="addonAfter">
            <a-select
              v-decorator="decorators.transfer_unit"
              :options="transferUnitOptions"
            ></a-select>
          </span>
        </st-input-number>
      </st-form-item>
    </st-form>
    <template slot="footer">
      <st-button
        @click="onSubmit"
        type="primary"
        :loading="loading.updateRights"
      >
        确认提交
      </st-button>
    </template>
  </st-modal>
</template>

<script>
import { UpdateRightsService } from './update-rights.service.ts'
import { ruleOptions } from './update-rights.config'
import { MessageService } from '@/services/message.service'
export default {
  serviceInject() {
    return {
      messageService: MessageService,
      updateRightsService: UpdateRightsService
    }
  },
  rxState() {
    const { info$, loading$, transferUnitOptions$ } = this.updateRightsService
    return {
      info: info$,
      loading: loading$,
      transferUnitOptions: transferUnitOptions$
    }
  },
  props: {
    id: {
      type: Number,
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
    this.updateRightsService.getInfo(this.id).subscribe(res => {
      this.$nextTick(() => {
        this.setFieldsValue(res)
      })
    })
  },
  methods: {
    setFieldsValue(info) {
      const { transfer_num, transfer_unit } = info.transfer
      this.form.setFieldsValue({
        transfer_num,
        transfer_unit: transfer_unit || 1
      })
    },
    onSubmit() {
      this.form.validate().then(values => {
        const params = {
          ...values,
          is_transferable: this.info.transfer.is_transferable
        }
        this.updateRightsService
          .updateRights(this.id, params)
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
