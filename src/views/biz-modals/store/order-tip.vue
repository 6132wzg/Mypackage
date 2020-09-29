<template>
  <st-modal
    title=""
    size="small"
    v-model="show"
    :footer="null"
    @cancel="onCancel"
    wrapClassName="modal-store-order-tip"
  >
    <div :class="tip('content')">
      <st-icon type="success" class="img" color="#52c41a" />
      <p>{{ message }}</p>
      <st-button v-if="isShowVerificationBtn" @click="jumpToPageVerification">
        核销订单
      </st-button>
      <st-button @click="viewOrder">查看订单</st-button>
      <st-button @click="goPay" v-if="type === 'create'">去支付</st-button>
      <st-button @click="printOrder" v-else>打印小票</st-button>
    </div>
  </st-modal>
</template>

<script>
export default {
  name: 'modalStoreOrderTip',
  bem: {
    tip: 'modal-store-order-tip'
  },
  data() {
    return {
      show: false
    }
  },
  props: {
    type: String,
    message: String
  },
  computed: {
    /**
     * 支付成功后展示查看核销订单按钮
     */
    isShowVerificationBtn() {
      return this.type === 'pay'
    }
  },
  methods: {
    viewOrder() {
      this.show = false
      this.$emit('success', {
        type: 'ViewOrder'
      })
    },
    printOrder() {
      this.show = false
      this.$emit('success', {
        type: 'PrintOrder'
      })
    },
    goPay(e) {
      this.show = false
      this.$emit('success', {
        type: 'Pay'
      })
    },
    // 取消
    onCancel() {
      this.show = false
      this.$emit('success', {
        type: 'cancel'
      })
    },
    jumpToPageVerification() {
      this.show = false
      this.$router.push({
        name: 'shop-store-order-list-verification'
      })
    }
  }
}
</script>
