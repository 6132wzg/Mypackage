<template>
  <st-panel-layout :class="b('container')">
    <!-- pos机信息说明 -->
    <MarkteingPluginTitle pathName="brand-app-pos-index" />
    <div :class="b('intro')" v-if="!info.is_open">
      <img
        :class="b('intro-item')"
        src="https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/saas-pro/plugin_pos_banner_1%402x.png"
        alt=""
      />
      <img
        :class="b('intro-item')"
        src="https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/saas-pro/plugin_pos_banner_2%402x.png"
        alt=""
      />
      <img
        :class="b('intro-item')"
        src="https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/saas-pro/plugin_pos_banner_3%402x.png"
        alt=""
      />
      <img
        :class="b('intro-item')"
        src="https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/saas-pro/plugin_pos_banner_4%402x.png"
        alt=""
      />
    </div>
    <st-panel v-else app :tabs="authTabs">
      <router-view></router-view>
    </st-panel>
  </st-panel-layout>
</template>

<script>
import MarkteingPluginTitle from '@/views/pages/brand/marketing/components#/marketing-title'
import { IndexService } from './index.service'
export default {
  name: '',

  bem: {
    b: 'brand-app-pos',
    bPos: 'brand-app-pos-device',
    bData: 'brand-app-pos-data'
  },

  serviceInject() {
    return {
      service: IndexService
    }
  },

  rxState() {
    return {
      authTabs: this.service.authTabs$,
      info: this.service.info$
    }
  },

  components: { MarkteingPluginTitle },

  props: {},

  data() {
    return {}
  },

  computed: {},

  async: {},

  mounted() {
    console.log('authTabs', this.authTabs)
  },

  methods: {}
}
</script>
