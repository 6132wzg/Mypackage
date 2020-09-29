<template>
  <st-panel app :tabs="authTabs">
    <router-view></router-view>
  </st-panel>
</template>

<script>
import { RevenueService } from './revenue.service'
export default {
  serviceInject() {
    return {
      revenueService: RevenueService
    }
  },
  rxState() {
    return {
      authTabs: this.revenueService.authTabs$
    }
  }
}
</script>
