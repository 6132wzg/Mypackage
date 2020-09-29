<template>
  <div :class="b()">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <st-t3 :class="bHeader('title')">当日收银</st-t3>
        <div :class="bHeader('actions')">
          <shop-select v-model="dataTodayShop" @change="getDataToday" />
          <st-refresh-btn :action="refresh"></st-refresh-btn>
        </div>
      </header>
      <st-total
        class="mg-t4"
        :class="b('total')"
        :indexs="dailyTotalColumns"
        :dataSource="dataToday"
      >
        <a
          slot="total_price"
          slot-scope="item"
          v-modal-link="{
            name: 'stat-cashier-detail-list-modal',
            props: {
              query: {
                shop_id: dataTodayShop,
                start_date: moment().format('YYYY-MM-DD'),
                end_date: moment().format('YYYY-MM-DD')
              },
              title: '收银日明细',
              type: 'brand-cashier-income'
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
    </div>
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <div :class="bHeader('button-wapper')">
          <st-button
            type="primary"
            v-if="auth.export"
            v-export-excel="{
              type: 'brand/cashier_collect_export',
              query: $searchQuery
            }"
          >
            全部导出
          </st-button>
        </div>
        <div :class="bHeader('actions')">
          <shop-select
            v-model="$searchQuery.shop_id"
            @change="onSingleSearch('shop_id', $event)"
          />
          <st-recent-radio-group
            @change="onChangeDataDays"
            :value="$searchQuery"
          ></st-recent-radio-group>
        </div>
      </header>
      <st-total
        :class="b('total')"
        :indexs="totalColumns"
        :dataSource="total"
        hasTitle
      >
        <a
          slot="total_price"
          slot-scope="item"
          v-modal-link="{
            name: 'stat-cashier-detail-list-modal',
            props: {
              query: $searchQuery,
              title: '收银日明细',
              type: 'brand-cashier-income'
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
        :scroll="{ x: 1440 }"
        class="mg-t16"
        rowKey="product_type"
        :page="false"
        @change="onTableChange"
        :dataSource="list"
      >
        <span slot="pay_channel" slot-scope="text">
          {{ text | enumFilter('finance.pay_channel') }}
        </span>
        <a
          slot="total_price"
          slot-scope="text, record"
          v-modal-link="{
            name: 'stat-cashier-detail-list-modal',
            props: {
              query: {
                ...$searchQuery,
                pay_channel: record.pay_channel
              },
              title: '收银日明细',
              type: 'brand-cashier-income'
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
import shopSelect from '@/views/biz-components/shop/shop-select'
import StTotal from '@/views/components/total#/total.vue'
import StTotalItem from '@/views/components/total#/total-item.vue'
import StatCashierDetailListModal from '@/views/biz-modals/stat/cashier-daily-detail'

import moment from 'moment'
import { IncomeService } from './income.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './income.config'
export default {
  name: 'BrandStatCashierGather',
  mixins: [tableMixin],
  serviceInject() {
    return {
      service: IncomeService
    }
  },
  modals: {
    StatCashierDetailListModal
  },
  rxState() {
    const { list$, total$, auth$, dataToday$, loading$ } = this.service
    return {
      list: list$,
      total: total$,
      auth: auth$,
      dataToday: dataToday$,
      loading: loading$
    }
  },
  bem: {
    b: 'page-brand-stat-cashier-gather',
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
    dailyTotalColumns() {
      return totalColumns(this, 'daily')
    },
    totalColumns
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
      return this.service
        .getDataToday({ shop_id: this.dataTodayShop })
        .subscribe()
    },
    refresh() {
      return this.service.getDataToday({
        shop_id: this.dataTodayShop,
        is_refresh: 1
      })
    }
  },
  components: {
    shopSelect,
    StTotal,
    StTotalItem
  }
}
</script>
