<script>
export default {
  name: 'StPopconfirm',
  render(h) {
    const props = {
      overlayClassName: 'st-popconfirm',
      destroyTooltipOnHide: true,
      title: '是否确认删除?',
      okText: '确定',
      cancelText: '取消',
      placement: 'topRight',
      arrowPointAtCenter: true,
      ...this.$attrs
    }
    // slot title生效
    if (this.$slots.title) {
      props.title = undefined
    }
    return h(
      'a-popconfirm',
      {
        props,
        on: this.$listeners,
        scopedSlots: this.$scopedSlots,
        slot: this.$slots
      },
      this.$slots.default
    )
  }
}
</script>
