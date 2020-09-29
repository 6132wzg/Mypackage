<template>
  <st-panel app initial :tabs="authTabs">
    <div slot="actions">
      <st-input-search
        placeholder="请输入手机号或姓名进行查找"
        v-model="$searchQuery.keyword"
        @search="onKeywordsSearch('keyword', $event)"
      />
    </div>
    <router-view></router-view>
  </st-panel>
</template>
<script>
import { ReserveService } from './reserve.service'
import tableMixin from '@/mixins/table.mixin'
export default {
  name: 'PageShopSoldCourse',
  mixins: [tableMixin],
  bem: {
    b: 'page-shop-sold'
  },
  serviceInject() {
    return {
      reserveService: ReserveService
    }
  },
  rxState() {
    return {
      authTabs: this.reserveService.authTabs$
    }
  },
  data() {
    return {}
  },
  created() {
    console.log('authTabs', this.authTabs)
  },
  methods: {}
}
</script>
