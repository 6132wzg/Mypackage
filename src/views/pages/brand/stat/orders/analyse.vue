<template>
  <div :class="b()">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <div :class="bHeader('button-wapper')">
          <st-button
            type="primary"
            v-if="auth.export"
            v-export-excel="{
              type: 'brand/order_analysis_export',
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
      <st-table
        class="mg-t16"
        :rowKey="(record, index) => index"
        :loading="loading.getList"
        :columns="columns"
        :scroll="{ x: 1000 }"
        :page="false"
        @change="onTableChange"
        :dataSource="list"
      >
        <span slot="product_type" slot-scope="text">
          {{ text | enumFilter('report.revenue_product_type') }}
        </span>
        <a
          slot="order_per_price"
          slot-scope="text, record"
          v-modal-link="{
            name: 'stat-per-detail-list-modal',
            props: {
              query: {
                ...$searchQuery,
                product_type: record.product_type
              },
              title: '客单价日明细',
              type: 'brand-orders-analyse'
            }
          }"
        >
          {{ text }}
        </a>
        <a
          slot="order_num"
          slot-scope="text, record"
          @click="showOrdersModal(record)"
        >
          {{ text }}
        </a>
        <a
          slot="online_total_num"
          slot-scope="text, record"
          @click="showOrdersModal(record, 2)"
        >
          {{ text }}
        </a>
      </st-table>
    </div>
  </div>
</template>

<script>
import shopSelect from '@/views/biz-components/shop/shop-select'
import StatOrdersDetailListModal from '@/views/biz-modals/stat/order-detail'
import StatPerDetailListModal from '@/views/biz-modals/stat/per-daily-detail'

import { AnalyseService } from './analyse.service'
import tableMixin from '@/mixins/table.mixin'
import {
  columns,
  totalColumns,
  childColumns,
  countDesc,
  contractTypes
} from './analyse.config'
import moment from 'moment'

export default {
  name: 'BrandStatOrdersAnalyse',
  mixins: [tableMixin],
  modals: {
    StatOrdersDetailListModal,
    StatPerDetailListModal
  },
  serviceInject() {
    return {
      analyseService: AnalyseService
    }
  },
  rxState() {
    const { list$, auth$, loading$ } = this.analyseService
    return {
      list: list$,
      auth: auth$,
      loading: loading$
    }
  },
  bem: {
    b: 'page-brand-stat-orders-analyse',
    bHeader: 'page-brand-stat-header'
  },
  data() {
    return {}
  },
  computed: {
    columns
  },

  created() {},

  methods: {
    moment,
    onChangeDataDays(event) {
      this.$searchQuery.day = event.recently_day || undefined
      this.$searchQuery.start_date = event.start_date || undefined
      this.$searchQuery.end_date = event.end_date || undefined
      this.onSearch()
    },
    showOrdersModal(item, status) {
      this.$modalRouter.push({
        name: 'stat-orders-detail-list-modal',
        props: {
          query: {
            ...this.$searchQuery,
            product_type: item.product_type,
            order_source: status
          },
          title: '订单明细',
          type: 'brand-orders-analyse'
        }
      })
    }
  },
  components: {
    shopSelect
  }
}
</script>
