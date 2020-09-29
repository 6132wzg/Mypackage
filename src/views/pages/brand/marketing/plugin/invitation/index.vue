<template>
  <st-panel-layout :class="inviation()">
    <MarkteingPluginTitle
      pathName="brand-marketing-plugin-invitation-index-data"
    />
    <st-panel app :tabs="authTabs">
      <router-view></router-view>
    </st-panel>
  </st-panel-layout>
</template>
<script>
import MarkteingPluginTitle from '../../components#/marketing-title'
import { IndexService } from './index.service'
export default {
  name: 'PageBrandMarketingInviation',
  bem: {
    inviation: 'page-brand-marketing-inviation'
  },
  serviceInject() {
    return {
      indexService: IndexService
    }
  },
  rxState() {
    return {
      authTabs: this.indexService.authTabs$
    }
  },
  data() {
    return {}
  },
  components: {
    MarkteingPluginTitle
  }
}
</script>
