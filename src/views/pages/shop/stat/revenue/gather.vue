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
              query: {
                start_date: moment().format('YYYY-MM-DD'),
                end_date: moment().format('YYYY-MM-DD')
              },
              title: '订单明细',
              type: 'shop-revenue-gather'
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
              type: 'shop/revenue-product-type',
              query: $searchQuery
            }"
          >
            全部导出
          </st-button>
        </div>
        <div :class="bHeader('actions')">
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
          slot="net_revenue"
          slot-scope="item"
          v-modal-link="{
            name: 'shop-stat-daily-list-modal',
            props: {
              query: $searchQuery,
              title: '营收日明细',
              type: 'shop-revenue-gather'
            }
          }"
        >
          <st-total-item
            :unit="item.unit"
            :label="item.label"
            :value="item.value"
          ></st-total-item>
        </a>
        <a
          slot="total_num"
          slot-scope="item"
          v-modal-link="{
            name: 'shop-stat-detail-list-modal',
            props: {
              query: $searchQuery,
              title: '订单明细',
              type: 'shop-revenue-gather'
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
        class="mg-t16"
        :scroll="{ x: 1440 }"
        rowKey="product_type"
        :page="false"
        @change="onTableChange"
        :dataSource="list"
      >
        <template slot="product_type" slot-scope="text">
          {{ text | enumFilter('report.revenue_product_type') }}
        </template>
        <a
          slot="net_revenue"
          slot-scope="text, record"
          v-modal-link="{
            name: 'shop-stat-daily-list-modal',
            props: {
              query: {
                ...$searchQuery,
                product_type: record.product_type,
                is_include_advance: 1
              },
              title: '营收日明细',
              type: 'shop-revenue-gather'
            }
          }"
        >
          {{ text }}
        </a>
        <a
          slot="total_num"
          slot-scope="text, record"
          v-modal-link="{
            name: 'shop-stat-detail-list-modal',
            props: {
              query: {
                ...$searchQuery,
                product_type: record.product_type
              },
              title: '订单明细',
              type: 'shop-revenue-gather'
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

import { GatherService } from './gather.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns, countDesc } from './gather.config'
import moment from 'moment'

export default {
  name: 'ShopStatRevenueGather',
  mixins: [tableMixin],
  serviceInject() {
    return {
      gatherService: GatherService
    }
  },
  modals: {
    ShopStatDetailListModal,
    ShopStatDailyListModal
  },
  rxState() {
    const {
      list$,
      total$,
      auth$,
      loading$,
      dataToday$,
      updateTime$
    } = this.gatherService
    return {
      list: list$,
      total: total$,
      auth: auth$,
      loading: loading$,
      dataToday: dataToday$,
      updateTime: updateTime$
    }
  },
  bem: {
    b: 'page-shop-stat-gather',
    bHeader: 'page-shop-stat-header'
  },
  data() {
    return {}
  },
  created() {
    this.getDataToday()
  },
  computed: {
    columns,
    dailyTotalColumns() {
      return totalColumns('daily')
    },
    totalColumns,
    countDesc
  },
  methods: {
    moment,
    onChangeDataDays(event) {
      this.$searchQuery.day = event.recently_day || undefined
      this.$searchQuery.start_date = event.start_date || undefined
      this.$searchQuery.end_date = event.end_date || undefined
      this.onSearch()
    },
    getDataToday() {
      return this.gatherService.getDataToday().subscribe()
    },
    refresh() {
      return this.gatherService.getDataRefresh()
    },
    dailyRefresh() {
      return this.gatherService.getDataToday({ is_refresh: 1 })
    }
  },
  components: {
    StTotal,
    StTotalItem,
    StDesc
  }
}
</script>
