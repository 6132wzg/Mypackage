<template>
  <div :class="b()">
    <st-input
      :class="b('input')"
      v-model="areaName"
      placeholder="请输入区域名称"
      :maxLength="20"
      autoFocus
      style="width: 158px"
    />
    <span :class="b('action')">
      <a :class="b('action-text')" @click.stop="onSave">保存</a>
      <a class="mg-l8" :class="b('action-close')" @click.stop="onCancel">
        <st-icon type="close" size="16px" />
      </a>
    </span>
  </div>
</template>
<script>
import { MessageService } from '@/services/message.service'
import { PatternService } from '@/services/pattern.service'
import { AreaService } from '../area.service'

export default {
  name: 'EditCabinetArea',
  bem: {
    b: 'st-cabinet-area-edit'
  },
  serviceInject() {
    return {
      messageService: MessageService,
      cabinetService: AreaService,
      pattern: PatternService
    }
  },
  rxState() {
    return {}
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      areaName: this.name
    }
  },
  methods: {
    onCancel() {
      this.$emit('onChangeEditStatus', false)
    },
    onSave() {
      // 场地名称未填写
      if (!this.areaName) {
        this.messageService.error({
          content: '请输入场地名称'
        })
        return false
      }
      // 场地名称格式错误
      if (!this.pattern.CN_EN_NUM_SPACE('1-15').test(this.sValue)) {
        this.messageService.error({
          content: '输入的场地名称格式错误，请重新输入'
        })
        return false
      }
      let params = {
        id: this.id,
        area_name: this.areaName
      }
      let fn
      if (this.isEdit) {
        params = Object.assign(params, {
          id: this.id
        })
        fn = this.cabinetService.update(params)
      } else {
        fn = this.cabinetService.add(params)
      }
      fn.subscribe(res => {
        this.messageService.success({
          content: this.isEdit ? '编辑成功' : '新增成功'
        })
        this.$emit('onChangeEditStatus', false)
        this.$emit('refresh')
      })
    }
  }
}
</script>
