<template>
  <div :class="basic()">
    <st-panel-layout :class="basic('main')">
      <!-- 云店概览 -->
      <st-panel title="云店概览">
        <div slot="actions">
          <st-refresh-btn :action="refresh"></st-refresh-btn>
        </div>
        <ul :class="headerContent()">
          <li
            v-for="(item, index) in headerInfo"
            :key="index"
            :class="headerContent('item')"
          >
            <img :src="item.icon" :class="headerContent('item-icon')" />
            <div>
              <div :class="headerContent('item-title')">
                {{ item.title }}
              </div>
              <div :class="headerContent('day-money')">
                <span class="font-number">
                  {{ dataProfile.today[headerTitleItem[index]] }}
                </span>
              </div>
              <div :class="headerContent('yesterday-money')">
                昨日:
                <span class="font-number">
                  {{ dataProfile.yesterday[headerTitleItem[index]] }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </st-panel>
      <!-- 整体看板 -->
      <section>
        <st-panel class="mg-t16" title="整体看板">
          <div slot="actions">
            <date-picker @onChange="wholeTimesFn"></date-picker>
          </div>
          <div :class="basic('whole')">
            <div
              :class="[
                basic('whole-item'),
                wholenavIndex === index ? basic('whole-item-active') : ''
              ]"
              v-for="(item, index) in wholeNav"
              :key="index"
              @click="wholenavFun(index, item)"
            >
              <div :class="basic('whole-item-title')">
                {{ item.title }}
                <img :class="basic('whole-item-icon')" :src="item.icon" />
              </div>
              <div :class="basic('whole-item-text')">
                <span class="font-number">{{ item.num }}</span>
              </div>
            </div>
          </div>
          <div :class="basic('revenue-trend')">
            <a-row>
              <a-col :span="16">
                <div>
                  <!-- <st-t3>
                    {{ wholeNav[wholenavIndex].title }}
                  </st-t3> -->
                  <shop-store-data-line
                    v-if="
                      filterLine(storeBoard, wholeNav[wholenavIndex].title)
                        .length
                    "
                    :data="
                      filterLine(storeBoard, wholeNav[wholenavIndex].title)
                    "
                    :tooltipKey="wholeNav[wholenavIndex].title"
                    :unit="wholeNav[wholenavIndex].unit"
                  ></shop-store-data-line>
                  <div v-else :class="basic('entry-store-img')">
                    <img
                      :src="inoutNumImg"
                      :class="basic('entry-store-img-line')"
                    />
                  </div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="ring">
                  <whole-tabs>
                    <template v-slot:user>
                      <whole-order-member
                        :storeBoard="storeBoard"
                        :wholeNav="wholeNav"
                        :wholeNavcom="wholeNavcom"
                        orderMemberFlag="order"
                        :wholenavIndex="wholenavIndex"
                        :fieldNav="fieldNav"
                      ></whole-order-member>
                    </template>
                    <template v-slot:marketing>
                      <whole-order-member
                        :storeBoard="storeBoard"
                        :wholeNav="wholeNav"
                        :wholeNavcom="wholeNavcom"
                        orderMemberFlag="member"
                        :wholenavIndex="wholenavIndex"
                        :fieldNav="fieldNav"
                        :colors="['#4679F9', '#894BFF', '#009DFF']"
                      ></whole-order-member>
                    </template>
                  </whole-tabs>
                </div>
              </a-col>
            </a-row>
          </div>
        </st-panel>
        <!-- 销售分析 类目分析-->
        <div :class="salesCategory()">
          <div :class="salesCategory('sales-box')">
            <a-row>
              <a-col :span="16" :class="salesCategory('sales-box__left')">
                <st-container class="bg-white" type="2">
                  <st-t3>销售分析</st-t3>
                  <date-picker @onChange="saleTimesFn"></date-picker>
                </st-container>
                <div :class="salesCategory('sales-top')">
                  <a-col :span="12">
                    <div>
                      <sales-analysis
                        title="销量TOP5"
                        :salesTitle="['排名', '商品', '销量(件)']"
                        nameLength="6"
                        :salesList="storeSaleList.sales_rank"
                      ></sales-analysis>
                    </div>
                  </a-col>
                  <a-col :span="12" class="hr">
                    <div>
                      <sales-analysis
                        title="营收TOP5"
                        :salesTitle="['排名', '商品', '营收(元)']"
                        nameLength="6"
                        :salesList="storeSaleList.revenue_rank"
                      ></sales-analysis>
                    </div>
                  </a-col>
                </div>
              </a-col>
              <a-col :span="8">
                <div :class="salesCategory('category-box')">
                  <st-container class="bg-white" type="2">
                    <st-t3>类目分析</st-t3>
                    <date-picker
                      @onChange="categoryTimesFn"
                      class="date-picker"
                    ></date-picker>
                  </st-container>
                  <div class="category">
                    <st-t4>类目营收占比</st-t4>
                    <shop-store-data-revenue-ring
                      :data="storeCategoryRank.category_list"
                      :total="Number(storeCategoryRank.total_revenue)"
                      style="width: 100%;"
                      v-if="storeCategoryRank.category_list.length"
                    ></shop-store-data-revenue-ring>
                    <div :class="basic('entry-pie-img')" v-else>
                      <img :src="pieImg" />
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
        <!-- 购买次数 消费金额 -->
        <div class="buy-consumption">
          <buy-consumption-tables
            @change="onChangeTabs"
            @onChange="userAnalysisTimesFn"
          >
            <template v-slot:user>
              <buy-number :data="storeMemberAnalysis"></buy-number>
            </template>
            <template v-slot:marketing>
              <buy-number
                :flag="false"
                :data="storeMemberAnalysis"
              ></buy-number>
            </template>
          </buy-consumption-tables>
        </div>
      </section>
    </st-panel-layout>
  </div>
</template>
<script>
import pieImg from '@/assets/img/shop/dashboard/pie.png'
import inoutNumImg from '@/assets/img/shop/dashboard/inoutNum.png'
import moment from 'moment'
import ShopStoreDataLine from '@/views/biz-components/stat/shop-store-data-line'
import WholeTabs from './components#/whole-tabs'
import BuyConsumptionTables from './components#/buy-consumption-tables'
import DatePicker from './components#/date-picker'
import SalesAnalysis from './components#/sales-analysis'
import BuyNumber from './components#/buy-number'
import WholeOrderMember from './components#/whole-order-member'
import ShopStoreDataRevenueRing from '@/views/biz-components/stat/shop-store-data-revenue-ring'
import { DataService } from './data.service'
import {
  headerInfo,
  wholeNav,
  headerTitleItem,
  fieldNav,
  fieldInfo
} from './data.config.ts'
export default {
  serviceInject() {
    return {
      dataService: DataService
    }
  },
  rxState() {
    return {
      dataProfile: this.dataService.dataProfile$,
      storeBoard: this.dataService.storeBoard$,
      storeSaleList: this.dataService.storeSaleList$,
      storeCategoryRank: this.dataService.storeCategoryRank$,
      storeMemberAnalysis: this.dataService.storeMemberAnalysis$
    }
  },
  bem: {
    basic: 'shop-store-data',
    salesCategory: 'sales-category',
    headerContent: 'header-content'
  },
  data() {
    return {
      wholenavIndex: 0,
      pieImg,
      inoutNumImg,
      wholeNavcom: 'shop-store-data-ring',
      headerInfo,
      wholeNav,
      headerTitleItem,
      fieldNav,
      fieldInfo,
      tabsObjData: {
        choose_type: 1,
        date_type: 1,
        date: null
      }
    }
  },
  components: {
    ShopStoreDataLine,
    DatePicker,
    WholeTabs,
    BuyConsumptionTables,
    SalesAnalysis,
    BuyNumber,
    ShopStoreDataRevenueRing,
    WholeOrderMember
  },
  mounted() {
    this.$nextTick(() => {
      this.wholenavFilter()
    })
  },
  methods: {
    // 整体看板时间
    wholeTimesFn(value) {
      this.dataService.getStoreBoard(value).subscribe(res => {
        this.wholenavFilter()
      })
    },
    // 销售分析时间
    saleTimesFn(value) {
      this.dataService.getStoreSaleList(value).subscribe()
    },
    // 类目分析时间
    categoryTimesFn(value) {
      this.dataService.getStoreCategoryRank(value).subscribe()
    },
    // 购买次数/消费金额时间
    userAnalysisTimesFn(value) {
      this.tabsObjData.date_type = value.date_type
      this.tabsObjData.date = value.date
      this.dataService.getStoreMemberAnalysis(this.tabsObjData).subscribe()
    },
    // 整体看板订单/会员折线图
    filterLine(data, type) {
      if (!data[this.fieldNav[this.wholenavIndex]].trend.length) return []
      return data[this.fieldNav[this.wholenavIndex]].trend.map(item => {
        return {
          date: item.date,
          amount: Number(item[this.fieldInfo[this.wholenavIndex]])
        }
      })
    },
    // 整体看板数据处理
    wholenavFilter() {
      let data = this.storeBoard
      this.wholeNav.forEach((item, index) => {
        let dataInfo = data[this.fieldNav[index]][this.fieldInfo[index]]
        this.$set(item, 'num', dataInfo)
        item.unit = data[this.fieldNav[index]].unit
      })
    },
    onChangeTabs(query) {
      this.tabsObjData = Object.assign(this.tabsObjData, { choose_type: query })
      this.tabsObjData.date = this.tabsObjData.date
        ? this.tabsObjData.date
        : moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD') + ''
      this.dataService.getStoreMemberAnalysis(this.tabsObjData).subscribe()
    },
    refresh() {
      return this.dataService.getDataProfile(this.chartTodayShop)
    },
    wholenavFun(index, item) {
      this.wholenavIndex = index
      if (index > 1) {
        this.wholeNavcom = 'brand-user-avg-bar'
      } else {
        this.wholeNavcom = 'shop-store-data-ring'
      }
    }
  }
}
</script>
