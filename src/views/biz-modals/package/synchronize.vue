<template>
  <st-modal
    title="同步上课范围至售出"
    @ok="onAgree"
    wrapClassName="modal-shop-product-course-package"
    v-model="show"
  >
    <div>同步后，课程包当前上课范围将同步到已售出的课程包， 是否确认同步？</div>
  </st-modal>
</template>
<script>
export default {
  name: 'ModalPackageSync',
  bem: {
    bModal: 'modal-package-on-sale'
  },
  data() {
    return {
      show: true
    }
  },
  methods: {
    onAgree() {
      this.$emit('success')
      this.show = false
    }
  }
}
</script>
