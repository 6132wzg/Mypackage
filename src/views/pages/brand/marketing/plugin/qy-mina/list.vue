<template>
  <st-panel-layout>
    <MarkteingPluginmMinaTitle :info="info" />
    <st-panel app initial :class="b()">
      <p :class="b('title')">开通场馆</p>
      <a-row :gutter="24">
        <a-col :span="8" v-for="(item, index) in info.shop_list" :key="index">
          <div :class="bItem()">
            <div
              :class="bItem('img')"
              :style="{
                background: `url(${item.shop_image}) no-repeat center`,
                backgroundSize: 'cover'
              }"
            ></div>
            <div :class="bItem('label')">
              <div :class="bItem('text')">
                <p :class="bItem('shop')">{{ item.shop_name }}</p>
                <p :class="bItem('time')">开通日期 {{ item.open_time }}</p>
              </div>
              <a-button
                type="primary"
                :class="bItem('btn')"
                @click="showQrcode(item)"
              >
                查看
              </a-button>
            </div>
          </div>
        </a-col>
      </a-row>
    </st-panel>
    <footer v-if="info.is_sign_agreement" :class="b('footer')">
      已阅读并同意
      <span>《商家服务协议》</span>
    </footer>
  </st-panel-layout>
</template>
<script>
import { ListService } from './list.service'
import MarkteingPluginmMinaTitle from '../../components#/marketing-mina-title'
import BrandMarketingQyMina from '@/views/biz-modals/brand/marketing/qy-mina'
import BrandMarketingQyMinaProtocol from '@/views/biz-modals/brand/marketing/qy-mina-protocol'

export default {
  name: 'PageBrandMarketingPluginGroupList',
  bem: {
    b: 'page-brand-plugin-qy-mina-list',
    bItem: 'shop-item'
  },
  modals: {
    BrandMarketingQyMina,
    BrandMarketingQyMinaProtocol
  },
  serviceInject() {
    return {
      listService: ListService
    }
  },
  rxState() {
    return {
      info: this.listService.info$
    }
  },
  data() {
    return {}
  },
  mounted() {
    !this.info.is_sign_agreement && this.showProtocol()
  },
  methods: {
    showProtocol() {
      this.$modalRouter.push({
        name: 'brand-marketing-qy-mina-protocol',
        props: {}
      })
    },
    showQrcode(item) {
      this.$modalRouter.push({
        name: 'brand-marketing-qy-mina',
        props: {
          title: item.shop_name,
          shop_id: item.shop_id
        }
      })
    }
  },
  components: {
    MarkteingPluginmMinaTitle
  }
}
</script>
