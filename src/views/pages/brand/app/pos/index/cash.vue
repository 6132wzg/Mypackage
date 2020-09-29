<template>
  <div class="">
    <div :class="bData('filter')">
      <div :class="bData('filter-select')">
        <shop-select
          v-model="$searchQuery.shop_id"
          @change="onSingleSearch('shop_id', $event)"
          class="mg-r16"
        />
        <a-select
          v-model="$searchQuery.type"
          @change="onSingleSearch('type', $event)"
          placeholder="请选择"
          style="width: 148px"
        >
          <a-select-option :key="-1">
            全部流水
          </a-select-option>
          <a-select-option :key="2">
            未关联订单流水
          </a-select-option>
          <a-select-option :key="1">
            关联订单流水
          </a-select-option>
        </a-select>
      </div>
      <st-recent-radio-group
        :range="180"
        @change="handleDayChange"
      ></st-recent-radio-group>
    </div>
    <div :class="bData('content')">
      <st-total
        :class="bData('total')"
        :indexs="totalColumns"
        :dataSource="total"
        hasTitle
      ></st-total>
      <st-table
        :page="page"
        @change="onTableChange"
        class="mg-t12"
        :loading="loading.getPosFinanceList"
        :columns="tableColumns"
        :dataSource="list"
        :rowKey="record => record.order_id"
      ></st-table>
    </div>
  </div>
</template>

<script>
import ShopSelect from '@/views/biz-components/shop/shop-select'
import StTotal from '@/views/components/total#/total.vue'
import StTotalItem from '@/views/components/total#/total-item.vue'
import { totalColumns, tableColumns } from './cash.config'
import { CashService } from './cash.service'
import tableMixin from '@/mixins/table.mixin'
export default {
  name: '',
  mixins: [tableMixin],

  bem: {
    bData: 'brand-app-pos-data'
  },

  components: { ShopSelect, StTotal },

  serviceInject() {
    return {
      service: CashService
    }
  },

  rxState() {
    return {
      loading: this.service.loading$,
      page: this.service.page$,
      list: this.service.list$,
      total: this.service.total$,
      shopList: this.service.shopList$
    }
  },

  props: {},

  data() {
    return {}
  },

  computed: { tableColumns, totalColumns },

  async: {},

  mounted() {},

  methods: {
    // 门店切换
    handleShopChange() {
      this.$router.reload()
    },
    // 流水类型切换
    handleLiuShuiChange() {
      this.$router.reload()
    },
    // 日期切换
    handleDayChange(event) {
      this.$searchQuery.days = event.recently_day || undefined
      this.$searchQuery.start_time = event.start_date || undefined
      this.$searchQuery.end_time = event.end_date || undefined
      this.onSearch()
    }
  }
}
</script>

<style lang="less" scoped></style>
