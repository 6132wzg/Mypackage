<template>
  <st-modal
    title="修改合同备注"
    v-model="show"
    @ok="onSubmit"
    :confirmLoading="loading.updateContractDescription"
  >
    <st-form :form="form" labelWidth="56px">
      <st-form-item label="合同备注" class="mg-b0">
        <st-textarea
          v-decorator="decorators.description"
          :autosize="{ minRows: 4, maxRows: 6 }"
          :maxlength="200"
          placeholder="请填写合同备注内容，限制200字以内"
        />
      </st-form-item>
    </st-form>
  </st-modal>
</template>

<script>
import { MessageService } from '@/services/message.service'
import { EditDescriptionService } from './edit-description.service'
import { ruleOptions } from './edit-description.config'
export default {
  props: {
    order_id: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ''
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
  serviceInject() {
    return {
      messageService: MessageService,
      editDescriptionService: EditDescriptionService
    }
  },
  rxState() {
    return {
      loading: this.editDescriptionService.loading$
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    initForm() {
      this.form.setFieldsValue({
        description: this.description
      })
    },
    onSubmit() {
      this.form.validate().then(values => {
        this.editDescriptionService
          .updateContractDescription(this.order_id, values)
          .subscribe(() => {
            this.messageService.success({
              content: '修改成功'
            })
            this.show = false
            this.$emit('success')
          })
      })
    }
  }
}
</script>
