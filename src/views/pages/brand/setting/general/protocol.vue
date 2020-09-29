<template>
  <st-panel :class="protocol()">
    <a-row class="mg-b16">
      <a-col :span="12">
        <st-t2>会员在线协议</st-t2>
      </a-col>
      <a-col v-if="!isEdit" :span="12" class="ta-r">
        <st-info-action icon="edit" text="编辑" @click="onEdit" />
      </a-col>
    </a-row>
    <st-form :form="form">
      <st-form-item label="在线协议" :required="isEdit">
        <a-radio-group v-decorator="decorators.protocol_status" v-if="isEdit">
          <a-radio :value="1">开启</a-radio>
          <a-radio :value="2">关闭</a-radio>
        </a-radio-group>
        <span v-else>{{ protocolStatus[protocolInfo.protocol_status] }}</span>
      </st-form-item>
      <st-form-item label="协议标题" :required="isEdit">
        <a-input
          v-if="isEdit"
          v-decorator="decorators.title"
          placeholder="请输入协议标题，最多显示10个字符"
        />
        <span v-else>{{ protocolInfo.title }}</span>
      </st-form-item>
      <st-form-item label="协议正文" :required="isEdit">
        <st-textarea
          v-if="isEdit"
          :autosize="{ minRows: 10, maxRows: 20 }"
          v-decorator="decorators.content"
          placeholder="请输入协议内容"
          maxlength="20000"
        />
        <st-container
          v-else
          type="2"
          :class="protocol('text-style')"
          v-html="protocolInfo.content"
        ></st-container>
      </st-form-item>
    </st-form>
    <div class="mg-t24 ta-c" v-if="isEdit">
      <st-button type="primary" @click="onSave" :loading="loading.update">
        确定
      </st-button>
      <st-button class="mg-l8" @click="onCancel" v-if="!isInit">取消</st-button>
    </div>
  </st-panel>
</template>
<script>
import { ProtocolService } from './protocol.service'
import { MessageService } from '@/services/message.service'
import { UserService } from '@/services/user.service'
import { ruleOptions } from './protocol.config'
export default {
  bem: {
    protocol: 'member-protocol'
  },
  serviceInject() {
    return {
      protocolService: ProtocolService,
      messageService: MessageService,
      userService: UserService
    }
  },
  rxState() {
    return {
      protocolInfo: this.protocolService.protocolInfo$,
      loading: this.protocolService.loading$
    }
  },
  data() {
    const form = this.$stForm.create()
    const decorators = form.decorators(ruleOptions)
    return {
      form,
      decorators,
      isEdit: false,
      protocolStatus: {
        1: '开启',
        2: '关闭'
      }
    }
  },
  mounted() {
    if (this.isInit) {
      this.onEdit()
    }
  },
  computed: {
    isInit() {
      return !Object.keys(this.protocolInfo).length
    }
  },
  methods: {
    onEdit() {
      this.isEdit = true
      setTimeout(() => {
        this.form.setFieldsValue({
          protocol_status: this.protocolInfo.protocol_status,
          title: this.protocolInfo.title,
          content: this.protocolInfo.content
        })
      })
    },
    onSave() {
      this.form.validate().then(values => {
        this.protocolService.update(values).subscribe(() => {
          this.messageService.success({
            content: '编辑成功'
          })
          this.$router.reload()
          this.isEdit = false
        })
      })
    },
    onCancel() {
      this.isEdit = false
    }
  }
}
</script>
