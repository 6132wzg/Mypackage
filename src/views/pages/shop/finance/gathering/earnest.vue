<template>
  <div :class="b()">
    <st-search-panel @search="onSearchNative" @reset="onSearchReset">
      <st-search-panel-item label="定金状态：">
        <st-search-radio
          v-model="$searchQuery.use_status"
          :options="useStatus"
        />
      </st-search-panel-item>
      <st-search-panel-item label="查询日期：">
        <st-range-picker :disabledDays="180" v-model="date" />
      </st-search-panel-item>
    </st-search-panel>
    <div :class="b('content')">
      <div :class="b('content-batch')" class="mg-b16">
        <!-- NOTE: 导出 -->
        <!-- <st-button type="primary" class="mg-r8" v-if="auth.export">批量导出</st-button> -->
        <st-button
          type="primary"
          class="mg-r8"
          v-if="auth.add"
          @click="addEarnest"
        >
          新增定金
        </st-button>
      </div>
      <!-- :alertSelection="{ onReset: onClear }"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            fixed: true,
            onChange: onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: disabledSelect(record)
              }
            })
      }"-->
      <div>
        <st-table
          :page="page"
          rowKey="id"
          @change="onTableChange"
          :columns="columns"
          :dataSource="list"
          :scroll="{ x: 1280 }"
        >
          <template slot="use_status" slot-scope="text">
            {{ text | enumFilter('finance.use_status') }}
          </template>
          <div slot="action" slot-scope="text, record">
            <st-table-actions>
              <a
                v-if="
                  record.auth['shop:temporary_payment:bargin|export_contract']
                "
                @click="toContract(record)"
              >
                查看合同
              </a>
              <a
                v-if="record.auth['shop:temporary_payment:bargin|order']"
                @click="onDeal(record)"
              >
                定金签单
              </a>
              <a
                v-if="record.auth['brand_shop:order:order|refund']"
                @click="onRefund(record)"
              >
                退款
              </a>
              <a
                v-if="record.auth['brand_shop:order:order|get']"
                @click="showOrderInfo(record.use_order_id)"
              >
                签单详情
              </a>
              <a
                v-if="record.auth['shop:temporary_payment:bargin|extension']"
                @click="onRenewal(record.order_id)"
              >
                定金延期
              </a>
            </st-table-actions>
          </div>
        </st-table>
      </div>
    </div>
    <sold-transaction ref="soldTransaction"></sold-transaction>
  </div>
</template>
<script>
import moment from 'moment'
import { cloneDeep, filter } from 'lodash-es'
import { EarnestService } from './earnest.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './earnest.config'
import ShopFinanceRefund from '@/views/biz-modals/shop/finance/refund'
import ShopFinanceGatheringEarnestAdd from '@/views/biz-modals/shop/finance/gathering/earnest/add'
import ShopFinanceGatheringEarnestDeal from '@/views/biz-modals/shop/finance/gathering/earnest/deal'
import ShopFinanceGatheringEarnestDetail from '@/views/biz-modals/shop/finance/gathering/earnest/detail'
import ShopFinanceGatheringEarnestRenewal from '@/views/biz-modals/shop/finance/gathering/earnest/renewal'
import SoldTransaction from '@/views/biz-components/sold/transaction'
import { OssService } from '@/services/oss.service'
export default {
  name: 'PageShopFinanceGatheringEarnest',
  mixins: [tableMixin],
  bem: {
    b: 'page-shop-sold'
  },
  modals: {
    ShopFinanceRefund,
    ShopFinanceGatheringEarnestAdd,
    ShopFinanceGatheringEarnestDeal,
    ShopFinanceGatheringEarnestDetail,
    ShopFinanceGatheringEarnestRenewal
  },
  serviceInject() {
    return {
      earnestService: EarnestService,
      ossService: OssService
    }
  },
  rxState() {
    return {
      loading: this.earnestService.loading$,
      list: this.earnestService.list$,
      page: this.earnestService.page$,
      useStatus: this.earnestService.useStatus$,
      auth: this.earnestService.auth$
    }
  },
  computed: {
    columns
  },
  components: {
    SoldTransaction
  },
  data() {
    return {
      // 结束时间面板是否显示
      endOpen: false,
      selectedRowKeys: [],
      selectedRows: [],
      diffSelectedRows: [],
      date: [],
      soldDealInfo: '',
      earnestInfo: ''
    }
  },
  mounted() {
    this.setSearchData()
  },
  watch: {
    $searchQuery() {
      this.setSearchData()
    }
  },
  methods: {
    // 查询
    onSearchNative() {
      this.$searchQuery.start_date = this.date[0]
        ? `${this.date[0].format('YYYY-MM-DD')} 00:00:00`
        : ''
      this.$searchQuery.end_date = this.date[1]
        ? `${this.date[1].format('YYYY-MM-DD')} 23:59:59`
        : ''
      this.onSearch()
    },
    // 设置searchData
    setSearchData() {
      const start = this.$searchQuery.start_date
        ? cloneDeep(moment(this.$searchQuery.start_date))
        : null
      const end = this.$searchQuery.end_date
        ? cloneDeep(moment(this.$searchQuery.end_date))
        : null
      this.date = [start, end]
    },
    // moment
    moment,
    // 退款
    onRefund(record) {
      this.$modalRouter.push({
        name: 'shop-finance-refund',
        props: {
          id: record.order_id,
          product_type: record.product_type
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 跳转合同
    toContract(record) {
      let url = `${window.location.origin}/common/contract-preview?id=${record.order_id}`
      this.ossService.openNewTab(url)
    },
    // 定金签单
    onDeal(record) {
      this.$modalRouter.push({
        name: 'shop-finance-gathering-earnest-deal',
        props: {
          id: record.order_id
        },
        on: {
          success: res => {
            this.$refs.soldTransaction.onTransaction(
              res.id,
              res.product_type,
              res.member_id,
              res.member_name,
              res.member_mobile,
              record.id_card,
              record.id_card_type,
              record.card_num,
              record.physical_id
            )
          }
        }
      })
    },
    // 新增定金
    addEarnest() {
      this.$modalRouter.push({
        name: 'shop-finance-gathering-earnest-add',
        props: {},
        on: {
          success: res => {
            this.$router.reload()
            this.$refs.soldTransaction.payCallBack(
              res.orderId,
              '',
              res.type,
              res
            )
          }
        }
      })
    },
    showOrderInfo(id) {
      this.$modalRouter.push({
        name: 'shop-finance-gathering-earnest-detail',
        props: {
          id
        }
      })
    },
    onRenewal(id) {
      this.$modalRouter.push({
        name: 'shop-finance-gathering-earnest-renewal',
        props: {
          id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    }
  }
}
</script>
