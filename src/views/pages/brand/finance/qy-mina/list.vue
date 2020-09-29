<template>
  <div :class="b()">
    <st-panel app :class="bTitle()">
      <div>
        <div :class="bTitle('left-text')">可提现金额(元)</div>
        <ICountUp :class="bTitle('left-span')" :endVal="8000.55" />
        <a-button type="primary" @click="onWithDraw">提现</a-button>
      </div>
      <div :class="b('right')">
        <p :class="b('bank-name')">招商银行</p>
        <p :class="b('address')">
          <label>上海徐汇淮海支行</label>
          <label :class="b('address-card')">****</label>
          <label :class="b('address-card')">0606</label>
        </p>
        <div @click="onMyBankCard">
          <st-icon type="edit" :class="b('edit')" />
        </div>
      </div>
    </st-panel>
    <st-panel app :tabs="authTabs$">
      <router-view></router-view>
    </st-panel>
  </div>
</template>
<script>
import { ListService } from './list.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './list.config.ts'
import BrandFinanceWithdraw from '@/views/biz-modals/brand/finance/withdraw'
import BrandFinanceMyBankCard from '@/views/biz-modals/brand/finance/my-bank-card'
export default {
  mixins: [tableMixin],
  bem: {
    b: 'page-brand-finance-qy-mina',
    bTitle: 'title'
  },
  modals: {
    BrandFinanceWithdraw,
    BrandFinanceMyBankCard
  },
  serviceInject() {
    return {
      listService: ListService
    }
  },
  rxState() {
    const {
      loading$,
      list$,
      page$,
      todayInfo$,
      total$,
      auth$,
      authTabs$
    } = this.listService
    return { loading$, list$, page$, todayInfo$, total$, auth$, authTabs$ }
  },
  data() {
    return {}
  },
  computed: {
    columns,
    totalColumns
  },
  created() {
    this.getRevenueShopToday().subscribe()
  },
  methods: {
    recentChange(searchFieldsValue) {
      this.onMultiSearch(searchFieldsValue)
    },
    getRevenueShopToday() {
      return this.listService.getRevenueShopToday()
    },
    refresh() {
      return this.getRevenueShopToday()
    },
    onWithDraw() {
      this.$modalRouter.push({
        name: 'brand-finance-withdraw'
      })
    },
    onMyBankCard() {
      this.$modalRouter.push({
        name: 'brand-finance-my-bank-card'
      })
    }
  }
}
</script>
