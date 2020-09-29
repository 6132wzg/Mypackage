<template>
  <st-panel-layout>
    <MarkteingPluginTitle
      pathName="brand-marketing-plugin-member-points-list"
    />
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
  name: 'PageBrandMarketingMemberPoints',
  bem: {
    basic: 'page-brand-plugin-member-points'
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
