<template>
  <st-modal v-model="show" size="small" @cancel="onConfirm">
    <div :class="b()">
      <div :class="b('title')">
        <st-icon
          type="success"
          :class="b('title-icon')"
          color="#52c41a"
          size="22px"
        ></st-icon>
        已提交成功！
      </div>
      <div :class="b('content')">
        可至【门店-设置-任务中心】查看处理进度
      </div>
    </div>
    <template slot="footer">
      <st-button type="primary" @click="onConfirm">确定</st-button>
    </template>
  </st-modal>
</template>
<script>
export default {
  name: 'ModalSettingTaskTip',
  bem: {
    b: 'modal-task-success-tip'
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    onConfirm() {
      this.$emit('success')
      this.show = false
    }
  }
}
</script>
