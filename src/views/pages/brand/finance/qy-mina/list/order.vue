<template>
  <div :class="b()">
    <st-total
      :class="b('total')"
      :indexs="totalColumns"
      :dataSource="total$"
      hasTitle
    ></st-total>
    <st-table
      :page="page$"
      @change="onTableChange"
      class="mg-t12"
      :loading="loading$.getRevenueShopList"
      :columns="columns"
      :dataSource="list$"
      rowKey="id"
    ></st-table>
  </div>
</template>
<script>
import { OrderService } from './order.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './order.config.ts'
export default {
  mixins: [tableMixin],
  bem: {
    b: 'page-brand-finance-qy-mina',
    bTitle: 'title'
  },
  serviceInject() {
    return {
      orderService: OrderService
    }
  },
  rxState() {
    const {
      loading$,
      list$,
      page$,
      todayInfo$,
      total$,
      auth$
    } = this.orderService
    return { loading$, list$, page$, todayInfo$, total$, auth$ }
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
      return this.orderService.getRevenueShopToday()
    },
    refresh() {
      return this.getRevenueShopToday()
    }
  }
}
</script>
