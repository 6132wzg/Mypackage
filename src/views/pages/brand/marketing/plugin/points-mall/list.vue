<template>
  <st-panel-layout>
    <MarkteingPluginTitle pathName="brand-marketing-plugin-points-mall-list" />
    <st-panel app :tabs="authTabs$">
      <portal-target
        slot="actions"
        name="BRAND_PLUGIN_POINTS_MALL_SEARCH"
      ></portal-target>
      <router-view></router-view>
    </st-panel>
  </st-panel-layout>
</template>

<script>
import { ListService } from './list.service'
import MarkteingPluginTitle from '../../components#/marketing-title'
export default {
  name: 'PageBrandMarketingPointsMallList',
  bem: {
    basic: 'page-brand-plugin-points-mall'
  },
  serviceInject() {
    return {
      listService: ListService
    }
  },
  rxState() {
    const { authTabs$ } = this.listService
    return {
      authTabs$
    }
  },
  data(vm) {
    return {}
  },
  components: {
    MarkteingPluginTitle
  }
}
</script>
