<template>
  <st-panel app initial :tabs="authTabs">
    <div slot="actions">
      <st-input-search
        v-model="$searchQuery.keyword"
        @search="onSearchCardName"
        placeholder="请输入会员姓名或手机号查找"
        :class="b('search')"
      />
    </div>
    <router-view></router-view>
  </st-panel>
</template>
<script>
import { GatheringService } from './gathering.service'
export default {
  name: 'PageShopSoldCard',
  bem: {
    b: 'page-shop-sold'
  },
  serviceInject() {
    return {
      gatheringService: GatheringService
    }
  },
  rxState() {
    return {
      authTabs: this.gatheringService.authTabs$
    }
  },
  methods: {
    onSearchCardName() {
      this.$router.push({
        query: { ...this.$searchQuery, keyword: this.$searchQuery.keyword }
      })
    }
  }
}
</script>
