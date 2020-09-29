<template>
  <div :class="b()">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <div :class="bHeader('button-wapper')">
          <st-button
            type="primary"
            v-if="auth.export"
            v-export-excel="{
              type: 'brand/product-performance/export',
              query: $searchQuery
            }"
          >
            全部导出
          </st-button>
        </div>
        <div :class="bHeader('actions')">
          <shop-select
            width="100px"
            v-model="$searchQuery.shop_id"
            @change="onSingleSearch('shop_id', $event)"
          />
          <st-select
            width="140px"
            :options="contractType"
            :defaultLabel="'全部合同类型'"
            v-model="$searchQuery.contract_type"
            @change="onSingleSearch('contract_type', $event)"
          ></st-select>
          <st-select
            width="120px"
            :options="productType"
            :defaultLabel="'全部类型'"
            v-model="$searchQuery.product_type"
            @change="onSingleSearch('product_type', $event)"
          ></st-select>
          <st-recent-radio-group
            @change="onChangeDataDays"
            :value="$searchQuery"
          ></st-recent-radio-group>
          <st-refresh-btn
            :updateTime="updateTime"
            :action="refresh"
          ></st-refresh-btn>
        </div>
      </header>
      <st-total
        :class="b('total')"
        :indexs="totalColumns"
        :dataSource="total"
        slidesPerView="auto"
        hasTitle
      ></st-total>
      <st-table
        class="mg-t16"
        rowKey="order_id"
        :scroll="{ x: 1540 }"
        :loading="loading.getList"
        :columns="columns"
        :page="page"
        @change="onTableChange"
        :dataSource="list"
      ></st-table>
    </div>
  </div>
</template>

<script>
import shopSelect from '@/views/biz-components/shop/shop-select'
import StTotal from '@/views/components/total#/total.vue'

import { ProductService } from './product.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './product.config'
import moment from 'moment'

export default {
  name: 'BrandStatSaleProduct',
  mixins: [tableMixin],
  serviceInject() {
    return {
      productService: ProductService
    }
  },
  rxState() {
    const {
      list$,
      page$,
      total$,
      auth$,
      contractType$,
      productType$,
      updateTime$,
      loading$
    } = this.productService
    return {
      list: list$,
      page: page$,
      total: total$,
      auth: auth$,
      contractType: contractType$,
      productType: productType$,
      updateTime: updateTime$,
      loading: loading$
    }
  },
  bem: {
    b: 'page-brand-stat-sale-product',
    bHeader: 'page-brand-stat-header'
  },
  data() {
    return {}
  },
  computed: {
    columns,
    totalColumns
  },

  created() {},

  methods: {
    moment,
    refresh() {
      return this.productService.getDataRefresh()
    },
    onChangeDataDays(event) {
      this.$searchQuery.day = event.recently_day || undefined
      this.$searchQuery.start_date = event.start_date || undefined
      this.$searchQuery.end_date = event.end_date || undefined
      this.onSearch()
    }
  },
  components: {
    shopSelect,
    StTotal
  }
}
</script>
