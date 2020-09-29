<template>
  <div :class="b()">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <st-t3 :class="bHeader('title')">
          营收概览
        </st-t3>
        <div :class="bHeader('actions')">
          <shop-select
            v-model="chartParam.shop_id"
            @change="onChangeChartShop"
          />
          <st-recent-radio-group
            disabledNow
            @change="onChangeChartDays"
          ></st-recent-radio-group>
        </div>
      </header>
      <div class="mg-t36" style="display: flex;align-items: center">
        <brand-statistics-line
          :max="4000"
          :data="dataLine"
          style="width: calc(100% - 365px);height: 285px;"
        ></brand-statistics-line>
        <brand-statistics-ring
          totalName="总营收"
          :data="dataRing"
          :total="dataRingTotal"
          style="width: 365px;"
        ></brand-statistics-ring>
      </div>
    </div>
    <st-panel :class="b()" app type="card" :tabs="authTabs">
      <router-view></router-view>
    </st-panel>
  </div>
</template>

<script>
import shopSelect from '@/views/biz-components/shop/shop-select'
import BrandStatisticsRing from '@/views/biz-components/chart/ring/ring'
import BrandStatisticsLine from '@/views/biz-components/chart/multi-line/multi-line'

import { RevenueService } from './revenue.service'
import tableMixin from '@/mixins/table.mixin'
import moment from 'moment'
export default {
  name: 'BrandStatRevenue',
  mixins: [tableMixin],
  serviceInject() {
    return {
      revenueService: RevenueService
    }
  },
  rxState() {
    const {
      authTabs$,
      dataRingTotal$,
      dataRing$,
      dataLine$,
      productType$
    } = this.revenueService
    return {
      authTabs: authTabs$,
      dataRingTotal: dataRingTotal$,
      dataRing: dataRing$,
      dataLine: dataLine$,
      productType: productType$
    }
  },
  bem: {
    b: 'page-brand-stat-revenue',
    bHeader: 'page-brand-stat-header'
  },
  data() {
    return {
      chartParam: {
        shop_id: -1,
        day: 7,
        start_date: undefined,
        end_date: undefined
      },
      chartTodayShop: -1
    }
  },
  created() {
    this.getChart()
  },
  computed: {},
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
      this.revenueService.getChart(this.chartParam).subscribe()
    }
  },
  components: {
    shopSelect,
    BrandStatisticsRing,
    BrandStatisticsLine
  }
}
</script>
