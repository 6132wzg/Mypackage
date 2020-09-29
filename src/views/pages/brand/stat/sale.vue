<template>
  <div :class="b()">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <st-t3 :class="bHeader('title')">
          销售概览
        </st-t3>
        <div :class="bHeader('actions')">
          <shop-select
            width="100px"
            v-model="chartParam.shop_id"
            @change="onChangeChartShop"
          />
          <st-recent-radio-group
            @change="onChangeChartDays"
          ></st-recent-radio-group>
        </div>
      </header>
      <div class="mg-t24" :class="b('panel')">
        <st-top5
          :class="b('top5-table')"
          rowKey="top"
          :columns="columnsFeatsTop5"
          :dataSource="featsRankList"
        >
          <span slot="top5">业绩TOP5</span>
          <a
            slot="action"
            v-modal-link="{
              name: 'brand-stat-record-rank-modal',
              props: {
                query: chartParam,
                title: '业绩排行'
              }
            }"
          >
            更多
          </a>
          <img
            slot="top"
            slot-scope="text"
            :class="b('top5-order')"
            v-if="text <= 3"
            :src="orderMap[text]"
            alt=""
          />
          <span slot="top" slot-scope="text" :class="b('top5-order')" v-else>
            {{ text }}
          </span>
          <div
            slot="nickname"
            slot-scope="text"
            style="width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
          >
            {{ text }}
          </div>
          <div slot="total_amount" slot-scope="text" style="min-width: 55px">
            {{ text }}
          </div>
        </st-top5>
        <st-top5
          :class="b('top5-table')"
          rowKey="top"
          :columns="columnsSaleTop5"
          :dataSource="salesRankList"
        >
          <span slot="top5">销量TOP5</span>
          <a
            slot="action"
            v-modal-link="{
              name: 'brand-stat-sales-rank-modal',
              props: { query: chartParam, title: '销量排行' }
            }"
          >
            更多
          </a>
          <img
            slot="top"
            slot-scope="text"
            :class="b('top5-order')"
            v-if="text <= 3"
            :src="orderMap[text]"
            alt=""
          />
          <span slot="top" slot-scope="text" :class="b('top5-order')" v-else>
            {{ text }}
          </span>
          <div
            slot="nickname"
            slot-scope="text"
            style="width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
          >
            {{ text }}
          </div>
          <div slot="total_num" slot-scope="text" style="min-width: 55px">
            {{ text }}
          </div>
        </st-top5>
        <div :class="b('chart')">
          <div :class="b('chart-title')">类目业绩占比</div>
          <div class="pd-l40">
            <brand-statistics-ring
              totalName="业绩总额"
              :data="dataRing"
              :total="chartTotal"
              style="width: 365px;"
            ></brand-statistics-ring>
          </div>
        </div>
      </div>
    </div>
    <st-panel :class="b()" app type="card" :tabs="authTabs">
      <router-view></router-view>
    </st-panel>
  </div>
</template>

<script>
import shopSelect from '@/views/biz-components/shop/shop-select'
import StTop5 from '@/views/biz-components/stat/top5/top5.vue'
import BrandStatisticsRing from '@/views/biz-components/chart/ring/ring'
import BrandStatRecordRankModal from '@/views/biz-modals/stat/record-rank'
import BrandStatSalesRankModal from '@/views/biz-modals/stat/sales-rank'

import { SaleService } from './sale.service'
import tableMixin from '@/mixins/table.mixin'
import { columnsFeatsTop5, columnsSaleTop5 } from './sale.config'

import top1 from '@/assets/img/stat/icon-order1.png'
import top2 from '@/assets/img/stat/icon-order2.png'
import top3 from '@/assets/img/stat/icon-order3.png'
import moment from 'moment'

export default {
  name: 'BrandStatSale',
  mixins: [tableMixin],
  serviceInject() {
    return {
      saleService: SaleService
    }
  },
  modals: {
    BrandStatRecordRankModal,
    BrandStatSalesRankModal
  },
  rxState() {
    const {
      featsRankList$,
      salesRankList$,
      auth$,
      dataRing$,
      chartTotal$,
      authTabs$,
      loading$
    } = this.saleService
    return {
      featsRankList: featsRankList$,
      salesRankList: salesRankList$,
      auth: auth$,
      authTabs: authTabs$,
      dataRing: dataRing$,
      chartTotal: chartTotal$,
      loading: loading$
    }
  },
  bem: {
    b: 'page-brand-stat-sale',
    bHeader: 'page-brand-stat-header'
  },
  data() {
    return {
      columnsFeatsTop5,
      columnsSaleTop5,
      orderMap: { 1: top1, 2: top2, 3: top3 },
      chartParam: {
        shop_id: -1,
        day: 7,
        start_date: undefined,
        end_date: undefined
      }
    }
  },
  created() {
    this.getChart()
  },

  methods: {
    moment,
    onChangeChartShop(event) {
      this.chartParam.shop_id = event
      this.getChart()
    },
    onChangeChartDays(event) {
      this.chartParam.day = event.recently_day || undefined
      this.chartParam.start_date = event.start_date || undefined
      this.chartParam.end_date = event.end_date || undefined
      this.getChart()
    },
    getChart() {
      this.saleService.getChart(this.chartParam).subscribe()
      // this.saleService.getFeatsRank(this.chartParam).subscribe()
      // this.saleService.getSalesRank(this.chartParam).subscribe()
    }
  },
  components: {
    shopSelect,
    BrandStatisticsRing,
    StTop5
  }
}
</script>
