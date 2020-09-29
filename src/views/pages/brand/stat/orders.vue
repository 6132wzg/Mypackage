<template>
  <div :class="b()">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <st-t3 :class="bHeader('title')">
          订单概览
        </st-t3>
        <div :class="bHeader('actions')">
          <shop-select
            :defaultValue="-1"
            v-model="chartParam.shop_id"
            @change="onChangeChartShop"
          />
          <st-recent-radio-group
            @change="onChangeChartDays"
          ></st-recent-radio-group>
        </div>
      </header>
      <a-row class="mg-t32">
        <pillar-line
          style="height: 280px;"
          :fold="true"
          :fields="fields"
          :dataItem="fieldsForamt"
          :data="chartData"
          :dataFormat="fieldsForamt"
          :colorMap="orderColorMap"
        ></pillar-line>
      </a-row>
    </div>
    <st-panel :class="b()" app initial type="card" :tabs="authTabs">
      <router-view></router-view>
    </st-panel>
  </div>
</template>

<script>
import shopSelect from '@/views/biz-components/shop/shop-select'
import StTotal from '@/views/components/total#/total.vue'
import PillarLine from '@/views/biz-components/chart/pillar-line/pillar-line'

import { orderColorMap } from '@/constants/stat/colors'
import { OrdersService } from './orders.service'
import tableMixin from '@/mixins/table.mixin'
export default {
  name: 'BrandStatOrders',
  mixins: [tableMixin],
  serviceInject() {
    return {
      orderService: OrdersService
    }
  },
  rxState() {
    return {
      chartData: this.orderService.chartData$,
      fields: this.orderService.fields$,
      fieldsMap: this.orderService.fieldsMap$,
      loading: this.orderService.loading$,
      authTabs: this.orderService.authTabs$
    }
  },
  bem: {
    b: 'page-brand-stat-orders',
    bHeader: 'page-brand-stat-header'
  },
  watch: {},
  data() {
    return {
      orderColorMap,
      chartParam: {
        shop_id: -1,
        day: 7,
        start_date: undefined,
        end_date: undefined
      },
      dataParam: {
        shop_id: -1,
        day: 7
      }
    }
  },
  created() {
    this.getChart()
  },
  computed: {},
  methods: {
    fieldsForamt(row, index) {
      ;(row.key = row.name), (row.name = this.fieldsMap[row.name])
      return row
    },
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
      this.orderService.getChart(this.chartParam).subscribe()
    }
  },
  components: {
    shopSelect,
    PillarLine
  }
}
</script>
