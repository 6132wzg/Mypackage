<template>
  <div :class="b()">
    <div :class="b('adv')" :span="6">
      <sidebar-component></sidebar-component>
    </div>
    <div :class="b('content')" :span="18">
      <a-row :gutter="12" :class="bCount()">
        <a-col :span="6" :class="bCount('item')">
          <div :class="bCount('box')">
            <count-card
              title="今日净营收(元)"
              :count="this.revenue.num"
              :footer="{
                label: '近7天日均净营收额：',
                value: this.revenue.avg
              }"
              :trend="{
                isUp: this.revenue.ratio >= 0,
                rate: this.revenue.ratio + this.revenue.ratio_mark
              }"
            >
              <template slot="title">
                <st-help-tooltip id="TBSDA001"></st-help-tooltip>
              </template>
              <brand-simple-line
                :data="this.revenue.chart | lineFilter"
              ></brand-simple-line>
            </count-card>
          </div>
        </a-col>
        <a-col :span="6" :class="bCount('item')">
          <div :class="bCount('box')">
            <count-card
              title="今日订单数(单)"
              :count="this.order.num"
              :footer="{ label: '近7天日均订单数：', value: this.order.avg }"
              :trend="{
                isUp: this.order.ratio >= 0,
                rate: this.order.ratio + this.order.ratio_mark
              }"
            >
              <template slot="title">
                <st-help-tooltip id="TBSDA002"></st-help-tooltip>
              </template>
              <brand-simple-line
                color="#00B4BC"
                unit="单"
                :data="this.order.chart | lineFilter"
              ></brand-simple-line>
            </count-card>
          </div>
        </a-col>
        <a-col :span="6" :class="bCount('item')">
          <div :class="bCount('box')">
            <count-card
              title="今日客流量(人)"
              :count="this.visit.num"
              :footer="{ label: '近7天日均客流量：', value: this.visit.avg }"
            >
              <template slot="title">
                <st-help-tooltip id="TBSDA004"></st-help-tooltip>
              </template>
              <brand-simple-line
                color="#55BFA3"
                unit="人"
                :data="this.visit.chart | lineFilter"
              ></brand-simple-line>
            </count-card>
          </div>
        </a-col>
        <a-col :span="6" :class="bCount('item')">
          <div :class="bCount('box')">
            <count-card
              title="用户数(人)"
              :count="this.user.num"
              :footer="{ label: '近7天日转化会员率：', value: this.user.ratio }"
            >
              <template slot="title">
                <st-help-tooltip id="TBSDA003"></st-help-tooltip>
              </template>
              <brand-simple-bar
                color="#58CC99"
                class="mg-t40"
                :data="this.user.percent | barFilter"
              ></brand-simple-bar>
            </count-card>
          </div>
        </a-col>
      </a-row>
      <a-row :class="b('linebox')" class="mg-t12 bg-white">
        <a-col :span="24">
          <dashboard-tabs @change="onChangeTabs">
            <template v-slot:userTitle>
              <st-help-tooltip id="TBSDA005"></st-help-tooltip>
            </template>
            <template v-slot:user>
              <div class="mg-t8 mg-l32 user-chart-box">
                <div class="funnel-vertical">
                  <st-skeleton
                    v-if="$skeletonLoading"
                    :style="{ height: '400px' }"
                  ></st-skeleton>
                  <funnel-vertical v-else :data="userFunnel"></funnel-vertical>
                </div>
                <div class="revenue-area">
                  <st-skeleton
                    v-if="$skeletonLoading"
                    :style="{
                      height: '400px',
                      margin: '0 16px'
                    }"
                  ></st-skeleton>
                  <brand-revenue-area
                    v-else
                    :fields="['注册用户', '消费用户', '购买私教', '消课人数']"
                    class="user-chart-box__item"
                    :data="userChartData"
                  ></brand-revenue-area>
                </div>
              </div>
            </template>
            <template v-slot:marketing>
              <div class="mg-t8 mg-l32 user-chart-box">
                <div class="funnel-vertical">
                  <funnel-vertical :data="marketingFunnel"></funnel-vertical>
                </div>
                <div class="revenue-area">
                  <brand-revenue-area
                    :fields="['注册用户', '消费用户', '购买私教']"
                    class="user-chart-box__item"
                    :data="marketing"
                  ></brand-revenue-area>
                </div>
              </div>
            </template>
          </dashboard-tabs>
        </a-col>
      </a-row>
      <a-row :gutter="12" class="mg-t12">
        <a-col :span="12">
          <st-container class="bg-white" type="2">
            <st-t3 style="margin-bottom:20px">客单价（近90天）</st-t3>
            <brand-user-avg-bar :data="avg" :height="295"></brand-user-avg-bar>
          </st-container>
        </a-col>
        <a-col :span="12">
          <st-container class="bg-white" type="2">
            <st-t3 style="margin-bottom:20px">用户活跃分析（近90天）</st-t3>

            <brand-user-ring :data="entry" :height="295"></brand-user-ring>
          </st-container>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import BrandSimpleLine from '@/views/biz-components/stat/brand-simple-line'
import BrandSimpleBar from '@/views/biz-components/stat/brand-simple-bar'
import BrandRevenueArea from '@/views/biz-components/stat/brand-revenue-area'
import BrandUserRing from '@/views/biz-components/stat/brand-user-ring'
import BrandUserAvgBar from '@/views/biz-components/stat/brand-user-avg-bar'
import DashboardTabs from './components#/tabs'
import CountCard from './components#/count-card'
import FunnelVertical from '@/views/biz-components/stat/brand-funnel-vertical'
import { StudioService } from './studio.service'
import SidebarComponent from '@/views/biz-components/dashboard/sidebar'

export default {
  name: 'Dashboard',
  serviceInject() {
    return {
      studioService: StudioService
    }
  },
  rxState() {
    return {
      top: this.studioService.top$,
      userFunnel: this.studioService.userFunnel$,
      userChartData: this.studioService.user$,
      avg: this.studioService.avg$,
      entry: this.studioService.entry$,
      marketing: this.studioService.marketing$,
      marketingFunnel: this.studioService.marketingFunnel$,
      loading: this.studioService.loading$
    }
  },
  bem: {
    b: 'page-dashboard-studio',
    bCount: 'page-dashboard-studio-count',
    bAdv: 'page-dashboard-studio-adv'
  },
  filters: {
    lineFilter(val) {
      return val.map((item, index) => {
        return {
          name: index,
          value: item.num
        }
      })
    },
    barFilter(val) {
      return {
        name: '会员占比',
        percent: val
      }
    }
  },
  data() {
    return {
      gutter: 24,
      dataFV: [],
      dataRA: [],
      dataSimpleLine: [],
      dataSimpleLine2: [],
      dataSimpleLine3: [],
      dataSimpleArea: [],
      dataSimpleBar: {},
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      data5: [],
      data6: [],
      data7: [],
      data8: [],
      data9: {},
      data10: [],
      data11: []
    }
  },
  computed: {
    order() {
      return this.top.order
    },
    revenue() {
      return this.top.revenue
    },
    user() {
      return this.top.user
    },
    visit() {
      return this.top.visit
    }
  },
  methods: {
    onChangeTabs(query) {
      this.studioService.getUser(query).subscribe()
      this.studioService.getMarketing(query).subscribe()
    },
    reload() {
      const member_card = this.$c('member_card')
      this.dataSimpleBar = {
        name: '会员占比',
        percent: 0.18
      }
      this.dataSimpleLine = [
        { name: '1', value: parseInt(10 * Math.random() * 10) },
        { name: '2', value: parseInt(10 * Math.random() * 10) },
        { name: '3', value: parseInt(10 * Math.random() * 10) },
        { name: '4', value: parseInt(10 * Math.random() * 10) },
        { name: '5', value: parseInt(10 * Math.random() * 10) },
        { name: '6', value: parseInt(10 * Math.random() * 10) },
        { name: '7', value: parseInt(10 * Math.random() * 10) }
      ]
      this.dataSimpleLine2 = [
        { name: '1', value: parseInt(10 * Math.random() * 10) },
        { name: '2', value: parseInt(10 * Math.random() * 10) },
        { name: '3', value: parseInt(10 * Math.random() * 10) },
        { name: '4', value: parseInt(10 * Math.random() * 10) },
        { name: '5', value: parseInt(10 * Math.random() * 10) },
        { name: '6', value: parseInt(10 * Math.random() * 10) },
        { name: '7', value: parseInt(10 * Math.random() * 10) }
      ]
      this.dataSimpleLine3 = [
        { name: '1', value: parseInt(10 * Math.random() * 10) },
        { name: '2', value: parseInt(10 * Math.random() * 10) },
        { name: '3', value: parseInt(10 * Math.random() * 10) },
        { name: '4', value: parseInt(10 * Math.random() * 10) },
        { name: '5', value: parseInt(10 * Math.random() * 10) },
        { name: '6', value: parseInt(10 * Math.random() * 10) },
        { name: '7', value: parseInt(10 * Math.random() * 10) }
      ]
      this.dataSimpleArea = [
        { name: '1', value: parseInt(10 * Math.random() * 10) },
        { name: '2', value: parseInt(10 * Math.random() * 10) },
        { name: '3', value: parseInt(10 * Math.random() * 10) },
        { name: '4', value: parseInt(10 * Math.random() * 10) },
        { name: '5', value: parseInt(10 * Math.random() * 10) }
      ]
      this.dataFV = [
        { name: '得到你', value: 400 },
        { name: '得到你 laiya', value: 300 },
        { name: '得到你 laiya', value: 200 },
        { name: '得到你 laiya', value: 100 }
      ]
      this.dataRA = [
        {
          date: '05-23',
          访问用户: 20 * Math.random() * 10,
          办理入会: 20 * Math.random() * 10,
          消费用户: 20 * Math.random() * 10,
          注册用户: 20 * Math.random() * 10,
          推荐用户: 20 * Math.random() * 10
        },
        {
          date: '05-24',
          访问用户: 20 * Math.random() * 10,
          办理入会: 20 * Math.random() * 10,
          消费用户: 20 * Math.random() * 10,
          注册用户: 20 * Math.random() * 10,
          推荐用户: 20 * Math.random() * 10
        },
        {
          date: '05-25',
          访问用户: 20 * Math.random() * 10,
          办理入会: 20 * Math.random() * 10,
          消费用户: 20 * Math.random() * 10,
          注册用户: 20 * Math.random() * 10,
          推荐用户: 20 * Math.random() * 10
        }
      ]
      this.data1 = [
        { name: '1-3次', value: 20 },
        { name: '2-5次', value: 200 },
        { name: '3-3次', value: 60 },
        { name: '14-3次', value: 90 },
        { name: '14-36次', value: 90 }
      ]
      this.data2 = [
        { name: member_card, value: 2500 },
        { name: '储值卡', value: 2000 },
        { name: '团体课', value: 1000 },
        { name: '私教课', value: 2311.26 },
        { name: '课程包', value: 200 }
      ]

      this.data3 = [
        { name: member_card, value: 2500 },
        { name: '私教课', value: 2000 },
        { name: '团体课', value: 1000 },
        { name: '储值卡', value: 2311.26 },
        { name: '定金', value: 200 },
        { name: '押金', value: 200 },
        { name: '其他', value: 200 }
      ]
      this.data4 = [
        {
          date: '05/27',
          私教课: 25618,
          团体课: 6985,
          储值卡: 25456,
          课程包: 12554,
          member_card: 11564,
          云店: 12544,
          定金: 1125,
          押金: 4568,
          其它: 456
        },
        {
          date: '05/28',
          私教课: 2568,
          团体课: 6985,
          储值卡: 2546,
          课程包: 12541,
          member_card: 11564,
          云店: 12254,
          定金: 12125,
          押金: 4568,
          其它: 456
        },
        {
          date: '05/29',
          私教课: 25068,
          团体课: 69815,
          储值卡: 2546,
          课程包: 12524,
          member_card: 11564,
          云店: 12154,
          定金: 12151,
          押金: 45168,
          其它: 45126
        },
        {
          date: '05/30',
          私教课: 25681,
          团体课: 69851,
          储值卡: 2546,
          课程包: 1254,
          member_card: 11564,
          云店: 1254,
          定金: 125,
          押金: 4568,
          其它: 456
        },
        {
          date: '05/31',
          私教课: 25681,
          团体课: 69851,
          储值卡: 2546,
          课程包: 1254,
          member_card: 11564,
          云店: 1254,
          定金: 125,
          押金: 4568,
          其它: 456
        }
      ]
      this.data5 = [
        {
          date: '05/27',
          私教预约人数: 25618,
          私教签到人数: 6985,
          团体课排课人数: 25456
        },
        {
          date: '05/28',
          私教预约人数: 2568,
          私教签到人数: 6985,
          团体课排课人数: 2546
        },
        {
          date: '05/29',
          私教预约人数: 25068,
          私教签到人数: 69815,
          团体课排课人数: 2546
        }
      ]
      this.data6 = [
        { type: '私教课', 售课数: 20, 消课数: 50 },
        { type: '团体课', 售课数: 20, 消课数: 50 }
      ]
      this.data7 = [
        {
          name: '08:00之前',
          value: 128
        },
        {
          name: '08:00~12:00',
          value: 132
        },
        {
          name: '12:00~18:00',
          value: 100
        },
        {
          name: '18:00~24:00',
          value: 72
        },
        {
          name: '24:00之后',
          value: 148
        }
      ]
      this.data8 = [
        {
          date: '05-19',
          value: 202 * Math.random() * 10
        },
        {
          date: '05-20',
          value: 111 * Math.random() * 10
        },
        {
          date: '05-21',
          value: 165 * Math.random() * 10
        },
        {
          date: '05-22',
          value: 225 * Math.random() * 10
        }
      ]
      this.data9 = {
        name: '转化率',
        percent: Math.random()
      }
      this.data10 = [
        { name: '水瓶座' },
        { name: '有子女' },
        { name: '男生' },
        { name: '未婚' },
        { name: '北京市' },
        { name: '大专' },
        { name: '00后' }
      ].slice(0, parseInt(Math.random() * 5 + 2))

      this.data11 = [
        {
          date: '05/19',
          入场人数: 1346 * Math.random() * 100,
          领券人数: 1023 * Math.random() * 100,
          交易人数: 940 * Math.random() * 100,
          上课人数: 680 * Math.random() * 100
        },
        {
          date: '05/20',
          入场人数: 1346 * Math.random() * 100,
          领券人数: 1023 * Math.random() * 100,
          交易人数: 940 * Math.random() * 100,
          上课人数: 680 * Math.random() * 100
        },
        {
          date: '05/21',
          入场人数: 1346 * Math.random() * 100,
          领券人数: 1023 * Math.random() * 100,
          交易人数: 940 * Math.random() * 100,
          上课人数: 680 * Math.random() * 100
        },
        {
          date: '05/22',
          入场人数: 1346 * Math.random() * 100,
          领券人数: 1023 * Math.random() * 100,
          交易人数: 940 * Math.random() * 100,
          上课人数: 680 * Math.random() * 100
        },
        {
          date: '05/23',
          入场人数: 1346 * Math.random() * 100,
          领券人数: 1023 * Math.random() * 100,
          交易人数: 940 * Math.random() * 100,
          上课人数: 680 * Math.random() * 100
        }
      ]
    }
  },
  components: {
    DashboardTabs,
    CountCard,
    BrandSimpleBar,
    BrandRevenueArea,
    BrandUserRing,
    BrandSimpleLine,
    BrandUserAvgBar,
    FunnelVertical,
    SidebarComponent
  }
}
</script>
