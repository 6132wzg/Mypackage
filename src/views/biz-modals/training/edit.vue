<template>
  <st-modal
    title="编辑训练目的"
    v-model="show"
    @ok="onSubmit"
    @cancel="onCancel"
    :confirmLoading="loading.updateTrainingAim"
    size="small"
  >
    <div>
      <st-form :form="form">
        <a-row>
          <a-col :xs="22">
            <st-form-item v-show="false">
              <input type="hidden" v-decorator="decorators.id" />
            </st-form-item>
            <st-form-item label="训练目的" required>
              <a-input
                placeholder="请输入训练目的"
                v-decorator="decorators.setting_name"
                maxlength="20"
              ></a-input>
            </st-form-item>
          </a-col>
        </a-row>
      </st-form>
    </div>
  </st-modal>
</template>
<script>
import { EditService } from './edit.service'
import { MessageService } from '@/services/message.service'
import { PatternService } from '@/services/pattern.service'
import { ruleOptions } from './training.config'

export default {
  serviceInject() {
    return {
      editService: EditService,
      messageService: MessageService,
      pattern: PatternService
    }
  },
  rxState() {
    return {
      loading: this.editService.loading$
    }
  },
  props: {
    id: {
      type: [Number, String],
      default: 0
    },
    setting_name: {
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
      show: true
    }
  },
  mounted() {
    this.form.setFieldsValue({
      id: this.id,
      setting_name: this.setting_name
    })
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()
      this.form.validate().then(values => {
        this.editService.updateTrainingAim(values).subscribe(() => {
          this.messageService.success({
            content: '编辑成功'
          })
          this.$emit('change')
          this.show = false
        })
      })
    },
    onCancel() {
      this.show = false
    }
  }
}
</script>
