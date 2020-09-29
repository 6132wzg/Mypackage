<template>
  <st-modal :title="title" v-model="show" width="400px" :footer="null">
    <div :class="b()">
      <st-image :src="info.qrcode" :class="b('poster')"></st-image>
      <p :class="b('tip')">扫一扫查看我的店铺</p>
    </div>
  </st-modal>
</template>
<script>
import { MinaService } from './qy-mina.service'
export default {
  name: 'BrandMarketingQyMina',
  bem: {
    b: 'brand-marketing-qy-mina'
  },
  serviceInject() {
    return {
      minaService: MinaService
    }
  },
  rxState() {
    return {
      info: this.minaService.info$
    }
  },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    shop_id: {
      type: [Number, String],
      default: () => ''
    }
  },
  mounted() {
    this.getQrcode()
  },
  methods: {
    getQrcode() {
      let shop_id = this.shop_id
      this.minaService.getQrcode({ shop_id }).subscribe()
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>
