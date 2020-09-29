<!-- 数据统计--营收、订单模块--订单明细 -->
<template>
  <st-modal
    :class="b()"
    wrapClassName="modal-stat-order-detail"
    :title="title"
    width="1140px"
    v-model="show"
    :loading="loading.getOrderList"
    :footer="false"
  >
    <st-table
      :rowKey="(record, idx) => record.order_id || record.id || Math.random()"
      :scroll="{ x: 1600, y: 340 }"
      :columns="columns"
      :loading="loading.getOrderList"
      :dataSource="list"
      :pagination="{ simple: true }"
      :page="page"
      @change="onModalTableChange"
    >
      <span slot="product_type" slot-scope="text">
        {{ productType[text] }}
      </span>
      <span slot="pay_finished_time" slot-scope="text">
        {{ text || '--' }}
      </span>
      <span slot="discount_price" slot-scope="text">
        {{ text || '--' }}
      </span>
      <span slot="refund_price" slot-scope="text">
        {{ text || '--' }}
      </span>
      <span slot="staff_sale_name" slot-scope="text">
        {{ text || '--' }}
      </span>
      <span slot="order_id" slot-scope="text">
        {{ text || '--' }}
      </span>
      <a-badge
        slot="order_status"
        slot-scope="text, record"
        :status="record.order_status === 2 ? 'success' : 'default'"
        :text="
          orderStatus[text] +
            (refundReason[record.refund_reason]
              ? `(${refundReason[record.refund_reason]})`
              : ' ')
        "
      />
      <span slot="member_mobile" slot-scope="text, record">
        {{
          record.parent_id > 0
            ? `${record.parent_mobile}(${record.parent_user_role})`
            : text
        }}
      </span>
    </st-table>
    <st-button
      style="position: absolute; bottom: 0; left: 0;"
      :disabled="!list.length"
      type="primary"
      v-if="authExport && exportParams.type"
      v-export-excel="exportParams"
    >
      全部导出
    </st-button>
  </st-modal>
</template>
<script>
import { columns } from './order-detail.config'
import tableMixin from '@/mixins/table.mixin'
import { OrderService } from './order-detail.service'
import { isEqual } from 'lodash-es'
export default {
  name: 'OrderDetail',
  mixins: [tableMixin],
  bem: {
    b: 'modal-stat-order-detail'
  },
  serviceInject() {
    return {
      orderService: OrderService
    }
  },
  rxState() {
    let {
      list$,
      page$,
      auth$,
      orderStatus$,
      productType$,
      refundReason$,
      loading$
    } = this.orderService
    return {
      list: list$,
      page: page$,
      auth: auth$,
      orderStatus: orderStatus$,
      productType: productType$,
      refundReason: refundReason$,
      loading: loading$
    }
  },
  props: {
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: String,
    type: String
  },
  data() {
    return {
      show: false,
      modalQuery: {
        current_page: 1,
        size: 10
      }
    }
  },
  // watch: {
  //   searchQuery: {
  //     deep: true,
  //     handler(newVal, oldVal) {
  //       if (isEqual(newVal, oldVal)) return
  //       this.getList()
  //     }
  //   }
  // },
  computed: {
    columns,
    authExport() {
      return this.type.includes('brand')
        ? this.auth.brandExport
        : this.auth.shopExport
    },
    exportParams() {
      const exportUrlMap = {
        'brand-revenue-gather': 'brand/revenue-order',
        'brand-revenue-product': 'brand/revenue-order',
        'shop-revenue-gather': 'shop/revenue-order',
        'shop-revenue-product': 'shop/revenue-order',
        'brand-orders-gather': 'brand/order_collect_order_list_export',
        'shop-orders-gather': 'shop/order_collect_export',
        'brand-orders-analyse': 'brand/order_analysis_order_list_export',
        'shop-orders-analyse': 'shop/order_analysis_order_list_export',
        'brand-plugin-discount': '',
        'brand-plugin-seckill': ''
      }
      const type = exportUrlMap[this.type] || ''
      return { type, query: this.query }
    },
    searchQuery() {
      return {
        ...this.query,
        ...this.modalQuery
      }
    }
  },
  methods: {
    getList() {
      this.orderService.getOrderList(this.searchQuery, this.type).subscribe()
    },
    onModalTableChange(pagination, ...ret) {
      this.modalQuery = {
        ...this.modalQuery,
        ...this.getTableQuery(pagination, ...ret)
      }
      this.getList()
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
