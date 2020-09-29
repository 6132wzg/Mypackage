<template>
  <div :class="b()">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <div :class="bHeader('button-wapper')">
          <st-button
            type="primary"
            v-if="auth.export"
            v-export-excel="{
              type: 'brand/order_collect_export',
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
        slidesPerView="auto"
        hasTitle
      >
        <a
          slot="order_num"
          slot-scope="item"
          @click="showOrdersModal(item, -1)"
        >
          <st-total-item
            :unit="item.unit"
            :label="item.label"
            :value="item.value"
          ></st-total-item>
        </a>
        <a
          slot="order_completed_num"
          slot-scope="item"
          @click="showOrdersModal(item, 2)"
        >
          <st-total-item
            :unit="item.unit"
            :label="item.label"
            :value="item.value"
          ></st-total-item>
        </a>
        <a
          slot="order_uncompleted_num"
          slot-scope="item"
          @click="showOrdersModal(item, 1)"
        >
          <st-total-item
            :unit="item.unit"
            :label="item.label"
            :value="item.value"
          ></st-total-item>
        </a>
        <a
          slot="order_refund_num"
          slot-scope="item"
          @click="showOrdersModal(item, 4)"
        >
          <st-total-item
            :unit="item.unit"
            :label="item.label"
            :value="item.value"
          ></st-total-item>
        </a>
        <a
          slot="order_cancel_num"
          slot-scope="item"
          @click="showOrdersModal(item, 3)"
        >
          <st-total-item
            :unit="item.unit"
            :label="item.label"
            :value="item.value"
          ></st-total-item>
        </a>
        <a
          slot="order_part_refund_num"
          slot-scope="item"
          @click="showOrdersModal(item, 5)"
        >
          <st-total-item
            :unit="item.unit"
            :label="item.label"
            :value="item.value"
          ></st-total-item>
        </a>
      </st-total>
      <st-table
        class="mg-t16"
        :rowKey="(record, index) => index"
        :loading="loading.getList"
        :columns="columns"
        :scroll="{ x: 1400 }"
        @change="onTableChange"
        :dataSource="list"
        :stripe="false"
        :rowSpanKey="[
          { key: 'transfer_type', formatter: value => transferType[value] }
        ]"
      >
        <span slot="product_type" slot-scope="text">
          {{ text | enumFilter('report.revenue_product_type') }}
        </span>
        <a
          slot="order_num"
          slot-scope="text, record"
          @click="showOrdersModal(record, -1, 'table')"
        >
          {{ text }}
        </a>
        <a
          slot="order_completed_num"
          slot-scope="text, record"
          @click="showOrdersModal(record, 2, 'table')"
        >
          {{ text }}
        </a>
        <a
          slot="order_uncompleted_num"
          slot-scope="text, record"
          @click="showOrdersModal(record, 1, 'table')"
        >
          {{ text }}
        </a>
        <a
          slot="order_refund_num"
          slot-scope="text, record"
          @click="showOrdersModal(record, 4, 'table')"
        >
          {{ text }}
        </a>
        <a
          slot="order_cancel_num"
          slot-scope="text, record"
          @click="showOrdersModal(record, 3, 'table')"
        >
          {{ text }}
        </a>
        <a
          slot="order_part_refund_num"
          slot-scope="text, record"
          @click="showOrdersModal(record, 5, 'table')"
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
import StatDetailListModal from '@/views/biz-modals/stat/order-detail'

import { GatherService } from './gather.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './gather.config'
import moment from 'moment'

export default {
  name: 'BrandStatOrdersGather',
  mixins: [tableMixin],
  modals: {
    StatDetailListModal
  },
  serviceInject() {
    return {
      gatherService: GatherService
    }
  },
  rxState() {
    const { list$, transferType$, total$, auth$, loading$ } = this.gatherService
    return {
      list: list$,
      transferType: transferType$,
      total: total$,
      auth: auth$,
      loading: loading$
    }
  },
  bem: {
    b: 'page-brand-stat-orders-gather',
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
    onChangeDataDays(event) {
      this.$searchQuery.day = event.recently_day || undefined
      this.$searchQuery.start_date = event.start_date || undefined
      this.$searchQuery.end_date = event.end_date || undefined
      this.onSearch()
    },
    showOrdersModal(item, status, type) {
      const query =
        type === 'table'
          ? {
              product_type: item.product_type,
              transfer_type: item.transfer_type
            }
          : {}
      this.$modalRouter.push({
        name: 'stat-detail-list-modal',
        props: {
          query: {
            ...this.$searchQuery,
            order_status: status,
            ...query
          },
          title: '订单明细',
          type: 'brand-orders-gather'
        }
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
