<template>
  <section class="sg-section">
    <h3>coupon-tag</h3>
    <h5>name（券名称），为必传;close事件为点击优惠券组件关闭icon回调</h5>
    <h5>暂无type,目前只有这一种样式，后续根据需求加</h5>
    <section style="border: 1px solid #ccc;">
      <st-panel>
        <coupon-tag name="卡尔券" @close="onClose" />
        &nbsp;&nbsp;
        <coupon-tag name="新人券" @close="onClose" />
        &nbsp;&nbsp;
        <coupon-tag name="VIP券" @close="onClose" />
        &nbsp;&nbsp;
      </st-panel>
    </section>
  </section>
</template>
<script>
import CouponTag from '@/views/biz-components/plugin/coupon-tag/coupon-tag'
export default {
  components: {
    CouponTag
  },
  methods: {
    onClose() {
      console.log('close')
    }
  }
}
</script>
