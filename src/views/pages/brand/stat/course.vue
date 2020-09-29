<template>
  <div :class="bPage()">
    <div :class="bPage('section')">
      <header :class="bHeader('header')">
        <st-t3 :class="bHeader('title')">
          课程概览
        </st-t3>
        <div :class="bHeader('actions')">
          <shop-select
            :defaultValue="-1"
            v-model="chartParam.shop_id"
            @change="onChangeChartShop"
          />
        </div>
      </header>

      <a-row :class="bPage('main')" class="mg-t24">
        <a-col :lg="8" class="main-item">
          <brand-statistics-ring
            totalName="总售课时"
            unit=""
            :unitBack="true"
            :total="saleChartTotal"
            :data="saleChartData"
            :legend="{ layout: 'vertical' }"
            :guide="{ layout: 'reverse' }"
            :padding="['auto', 160, 'auto', 'auto']"
          />
        </a-col>
        <a-col :lg="8" class="main-item">
          <brand-statistics-ring
            totalName="剩余课时"
            unit=""
            :unitBack="true"
            :total="remainCourseTotal"
            :data="remainChartData"
            :legend="{ layout: 'vertical' }"
            :guide="{ layout: 'reverse' }"
            :padding="['auto', 160, 'auto', 'auto']"
          />
        </a-col>
        <a-col :lg="8" class="main-item">
          <brand-statistics-ring
            totalName="剩余摊销金额"
            :total="amountCourseTotal"
            :data="amountChartData"
            :legend="{ layout: 'vertical' }"
            :guide="{ layout: 'reverse' }"
            :padding="['auto', 160, 'auto', 'auto']"
          />
        </a-col>
      </a-row>
    </div>
    <st-panel :class="bPage()" app initial type="card" :tabs="authTabs">
      <router-view></router-view>
    </st-panel>
  </div>
</template>

<script>
// import BrandStatisticsCourseRing from '@/views/biz-components/stat/brand-stat-ring'
import BrandStatisticsRing from '@/views/biz-components/chart/ring/ring'
import shopSelect from '@/views/biz-components/shop/shop-select'

import { CourseService } from './course.service'
import tableMixin from '@/mixins/table.mixin'
export default {
  name: 'BrandStatCourse',
  mixins: [tableMixin],
  serviceInject() {
    return {
      service: CourseService
    }
  },
  rxState() {
    const {
      saleChartData$,
      remainChartData$,
      amountChartData$,
      saleChartTotal$,
      remainCourseTotal$,
      amountCourseTotal$,
      authTabs$
    } = this.service
    return {
      saleChartData: saleChartData$,
      remainChartData: remainChartData$,
      amountChartData: amountChartData$,
      saleChartTotal: saleChartTotal$,
      remainCourseTotal: remainCourseTotal$,
      amountCourseTotal: amountCourseTotal$,
      authTabs: authTabs$
    }
  },
  bem: {
    bPage: 'page-brand-stat-course',
    bHeader: 'page-brand-stat-header'
  },
  watch: {},
  data() {
    return {
      chartParam: {
        shop_id: -1
      }
    }
  },
  created() {
    this.getChart()
  },
  computed: {
    value() {
      let day = this.$searchQuery.start_date ? 0 : this.$searchQuery.day
      return {
        day,
        start_date: this.$searchQuery.start_date,
        end_date: this.$searchQuery.end_date
      }
    }
  },
  methods: {
    onChangeChartShop(event) {
      this.getChart()
    },
    getChart() {
      this.service.getChart(this.chartParam).subscribe()
    }
  },
  components: {
    BrandStatisticsRing,
    shopSelect
    // BrandStatisticsCourseRing
  }
}
</script>
