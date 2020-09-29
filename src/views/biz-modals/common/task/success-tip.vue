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
        <template v-if="isShowLink">
          点击
          <a @click="goTaskCenter">【任务中心】</a>
          可查处理进度
        </template>
        <template v-else>
          可至【门店-设置-任务中心】查看处理进度
        </template>
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
  props: {
    /**
     * 是否展示到门店任务中心的链接
     * 品牌维度下一般为 false
     */
    isShowLink: {
      type: Boolean,
      default: true
    },
    /**
     * 是否跳转到品牌任务中心
     * 门店维度下一般为 false
     */
    isBrandTaskLink: {
      type: Boolean,
      default: false
    }
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
    },
    goTaskCenter() {
      this.show = false
      const link = this.isBrandTaskLink
        ? '/brand/setting/task/list'
        : '/shop/setting/task/list'
      this.$router.push({
        path: link
      })
    }
  }
}
</script>
