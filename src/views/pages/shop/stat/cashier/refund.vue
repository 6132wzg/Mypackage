<template>
  <div :class="b()">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <st-t3 :class="bHeader('title')">当日退款</st-t3>
        <div :class="bHeader('actions')">
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
              title: '退款日明细',
              type: 'shop-cashier-refund'
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
    <st-hr />
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <div :class="bHeader('button-wapper')">
          <st-button
            type="primary"
            v-if="auth.export"
            v-export-excel="{
              type: 'shop/cashier-refund-export',
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
              title: '退款日明细',
              type: 'shop-cashier-refund'
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
              title: '退款日明细',
              type: 'shop-cashier-refund'
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
import StatCashierDetailListModal from '@/views/biz-modals/stat/cashier-daily-detail'

import moment from 'moment'
import { RefundService } from './refund.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './refund.config'
export default {
  name: 'ShopStatCashierRefund',
  mixins: [tableMixin],
  modals: {
    StatCashierDetailListModal
  },
  serviceInject() {
    return {
      service: RefundService
    }
  },
  rxState() {
    console.log(this.service)
    const {
      list$,
      page$,
      total$,
      auth$,
      dataToday$,
      productType$,
      loading$
    } = this.service
    return {
      list: list$,
      page: page$,
      total: total$,
      auth: auth$,
      dataToday: dataToday$,
      productType: productType$,
      loading: loading$
    }
  },
  bem: {
    b: 'page-shop-stat-cashier-refund',
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
    StTotal,
    StTotalItem
  }
}
</script>
