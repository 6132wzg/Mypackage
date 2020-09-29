<template>
  <st-panel app :tabs="authTabs">
    <router-view></router-view>
  </st-panel>
</template>

<script>
import { OrdersService } from './orders.service'
export default {
  serviceInject() {
    return {
      ordersService: OrdersService
    }
  },
  rxState() {
    return {
      authTabs: this.ordersService.authTabs$
    }
  }
}
</script>
