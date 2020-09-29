<template>
  <st-panel app :tabs="authTabs">
    <router-view></router-view>
  </st-panel>
</template>

<script>
import { CashierService } from './cashier.service'
export default {
  serviceInject() {
    return {
      cashierService: CashierService
    }
  },
  rxState() {
    return {
      authTabs: this.cashierService.authTabs$
    }
  }
}
</script>
