<template>
  <st-modal
    title="添加自定义页面路径"
    v-model="show"
    @ok="handleSaveCustomLinkModal"
    @cancel="handleCancel"
    size="small"
  >
    <div :class="b('custom-content')">
      <a
        :class="b('custom-content-tip')"
        href="https://help.styd.cn/docs/mini_program.html"
        target="_blank"
      >
        如何获取自定义页面路径
      </a>
      <st-textarea
        :class="b('custom-content-textarea')"
        v-model="custom_path"
        :autosize="{ minRows: 4, maxRows: 6 }"
        :maxlength="100"
      />
    </div>
  </st-modal>
</template>
<script>
import { MessageService } from '@/services/message.service'
export default {
  serviceInject() {
    return {
      messageService: MessageService
    }
  },
  computed: {},
  props: {
    customPath: {
      type: String,
      default: ''
    }
  },
  bem: {
    b: 'custom-decorate-custom-link'
  },
  data() {
    return {
      show: false,
      custom_path: ''
    }
  },
  watch: {
    customPath: {
      handler(newV) {
        this.custom_path = newV
      },
      immediate: true
    }
  },
  methods: {
    handleSaveCustomLinkModal() {
      if (!this.custom_path) {
        this.messageService.error({
          content: '请填写自定义路径地址'
        })
        return false
      }
      // 校验格式
      let regExp = /^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/
      if (!regExp.test(this.custom_path)) {
        return this.messageService.error({
          content: '请正确填写自定义路径支持英文、数字及符号'
        })
      }

      this.show = false
      this.$emit('change', {
        id: -1,
        type: 99,
        name: '自定义页面路径',
        path: this.custom_path
      })
    },
    handleCancel() {
      this.show = false
    }
  }
}
</script>
