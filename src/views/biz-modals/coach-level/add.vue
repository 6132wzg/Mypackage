<template>
  <st-modal
    :title="`新增${$c('coach')}等级`"
    v-model="show"
    @ok="onSubmit"
    @cancel="onCancel"
    :confirmLoading="loading.addCoachLevel"
    size="small"
  >
    <div>
      <st-form :form="form" labelAuto>
        <a-row>
          <a-col :xs="22">
            <st-form-item :label="`${$c('coach')}等级`" required>
              <a-input
                :placeholder="`请输入${$c('coach')}等级`"
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
import { AddService } from './add.service'
import { MessageService } from '@/services/message.service'
import { ruleOptions } from './coach-level.config'

export default {
  serviceInject() {
    return {
      addService: AddService,
      messageService: MessageService
    }
  },
  rxState() {
    return {
      loading: this.addService.loading$
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
  methods: {
    onSubmit(e) {
      e.preventDefault()
      this.form.validate().then(values => {
        this.addService.addCoachLevel(values).subscribe(() => {
          this.messageService.success({
            content: '新增成功'
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
