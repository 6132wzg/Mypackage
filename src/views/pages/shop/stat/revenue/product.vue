<template>
  <div :class="b()">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <st-t3 :class="bHeader('title')">当日营收</st-t3>
        <div :class="bHeader('actions')">
          <st-refresh-btn :action="dailyRefresh"></st-refresh-btn>
        </div>
      </header>
      <st-total
        class="mg-t4"
        :class="b('total')"
        :indexs="dailyTotalColumns"
        :dataSource="dataToday"
        :options="{
          breakpoints: {
            1440: {
              slidesPerView: 6
            }
          }
        }"
      >
        <a
          slot="total_num"
          slot-scope="item"
          v-modal-link="{
            name: 'shop-stat-detail-list-modal',
            props: {
              type: 'shop-revenue-product',
              query: {
                start_date: moment().format('YYYY-MM-DD'),
                end_date: moment().format('YYYY-MM-DD')
              },
              title: '订单明细'
            }
          }"
        >
          <st-total-item
            :unit="item.unit"
            :label="item.label"
            :value="item.value"
          ></st-total-item>
        </a>
      </st-total>
      <st-desc :class="b('desc-card')" :dataSource="countDesc"></st-desc>
    </div>
    <st-hr />
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <div :class="bHeader('button-wapper')">
          <st-button
            type="primary"
            v-if="auth.export"
            v-export-excel="{
              type: 'shop/revenue-product',
              query: $searchQuery
            }"
          >
            全部导出
          </st-button>
        </div>
        <div :class="bHeader('actions')">
          <st-select
            :options="productType"
            :defaultLabel="'全部分类'"
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
        hasTitle
      >
        <a
          slot="total_num"
          slot-scope="item"
          v-modal-link="{
            name: 'shop-stat-detail-list-modal',
            props: {
              type: 'shop-revenue-product',
              query: $searchQuery,
              title: '订单明细'
            }
          }"
        >
          <st-total-item
            :unit="item.unit"
            :label="item.label"
            :value="item.value"
          ></st-total-item>
        </a>
      </st-total>
      <st-table
        :loading="loading.getList"
        :columns="columns"
        :scroll="{ x: 1200 }"
        class="mg-t16"
        :rowKey="(record, idx) => idx"
        @change="onTableChange"
        :page="page"
        :dataSource="list"
      >
        <span slot="product_type" slot-scope="text">
          {{ text | enumFilter('transaction.product_type') }}
        </span>
        <a
          slot="total_num"
          slot-scope="text, record"
          v-modal-link="{
            name: 'shop-stat-detail-list-modal',
            props: {
              type: 'shop-revenue-product',
              query: {
                ...$searchQuery,
                product_type: record.product_type,
                product_id: record.product_id
              },
              title: '订单明细'
            }
          }"
        >
          {{ text }}
        </a>
      </st-table>
    </div>
  </div>
</template>

<script>
import StTotal from '@/views/components/total#/total.vue'
import StTotalItem from '@/views/components/total#/total-item.vue'
import StDesc from '@/views/components/desc#/desc.vue'
import ShopStatDetailListModal from '@/views/biz-modals/stat/order-detail'
import ShopStatDailyListModal from '@/views/biz-modals/stat/daily-detail'

import moment from 'moment'
import { ProductService } from './product.service'
import tableMixin from '@/mixins/table.mixin'
import {
  columns,
  totalColumns,
  dailyTotalColumns,
  countDesc
} from './product.config'
export default {
  name: 'BrandStatRevenueProduct',
  mixins: [tableMixin],
  serviceInject() {
    return {
      productService: ProductService
    }
  },
  modals: {
    ShopStatDetailListModal,
    ShopStatDailyListModal
  },
  rxState() {
    console.log(this.productService)
    const {
      list$,
      page$,
      total$,
      auth$,
      dataToday$,
      updateTime$,
      productType$,
      loading$
    } = this.productService
    return {
      list: list$,
      page: page$,
      total: total$,
      auth: auth$,
      dataToday: dataToday$,
      updateTime: updateTime$,
      productType: productType$,
      loading: loading$
    }
  },
  bem: {
    b: 'page-brand-stat-revenue-product',
    bHeader: 'page-brand-stat-header'
  },
  data() {
    return {
      dataTodayShop: -1
    }
  },
  created() {
    this.getDataToday()
  },
  computed: {
    columns,
    totalColumns,
    countDesc,
    dailyTotalColumns
  },
  methods: {
    moment,
    // TODO:
    onChangeDataDays(event) {
      this.$searchQuery.day = event.recently_day || undefined
      this.$searchQuery.start_date = event.start_date || undefined
      this.$searchQuery.end_date = event.end_date || undefined
      this.onSearch()
    },
    getDataToday() {
      return this.productService.getDataToday().subscribe()
    },
    refresh() {
      return this.productService.getDataRefresh()
    },
    dailyRefresh() {
      return this.productService.getDataToday({ is_refresh: 1 })
    }
  },
  components: {
    StTotal,
    StTotalItem,
    StDesc
  }
}
</script>
