<template>
  <div :class="b()" :gutter="24">
    <div :class="b('adv')" :span="6">
      <sidebar-component></sidebar-component>
    </div>
    <div :class="bCount()" :lg="18">
      <st-panel :class="b('shadow')" title="概况">
        <div slot="actions">
          <!-- 最近更新时间：2019-04-02 12:38 <a :class="bCount('refresh')" href="javascript:viod(0);" @click="refresh"><st-icon type="switch"></st-icon></a> -->
        </div>
        <a-row type="flex" justify="space-around" :class="bCount('title')">
          <a-col :lg="4" :class="bCount('date')"></a-col>
          <a-col :lg="5">
            <!-- <st-help-tooltip id="TSNM001"></st-help-tooltip> -->
            购买私教(人)
            <span :class="[bCount('topIcon'), 'user']">
              <img :src="topIconUser" />
            </span>
          </a-col>
          <a-col :lg="5">
            客流量(人次)
            <span :class="[bCount('topIcon'), 'flow']">
              <img :src="topIconFlow" />
            </span>
          </a-col>
          <a-col :lg="5" style="position:relative;left:-16px;">
            <st-help-tooltip id="TSNM002"></st-help-tooltip>
            总消课(节)
            <span :class="[bCount('topIcon'), 'price']">
              <img :src="topIconPrice" />
            </span>
          </a-col>
          <a-col :lg="5">
            净营收/营收额(元)
            <span :class="[bCount('topIcon'), 'money']">
              <img :src="topIconMoney" />
            </span>
          </a-col>
        </a-row>
        <a-skeleton
          active
          v-if="$skeletonLoading"
          :paragraph="{ rows: 6 }"
        ></a-skeleton>
        <template v-else>
          <a-row type="flex" justify="space-around" class="mg-t24 count1">
            <a-col :class="bCount('date')" style="line-height:40px;" :lg="4">
              今日
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ beMemberNum.today || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ passengerFlow.today || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ courseCheckInNum.today || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ matchAmount(revenueAmount.today)[1] || 0 }}/
              <span :class="bCount('small')">
                {{ matchAmount(revenueAmount.today)[2] || 0 }}
              </span>
            </a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="mg-t32 count2">
            <a-col :class="bCount('date')" :lg="4">
              昨日
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ beMemberNum.yesterday || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ passengerFlow.yesterday || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ courseCheckInNum.yesterday || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ revenueAmount.yesterday || 0 }}
            </a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="mg-t32 count3">
            <a-col :class="bCount('date')" :lg="4">
              近7日
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ beMemberNum.nearly_seven_days || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ passengerFlow.nearly_seven_days || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ courseCheckInNum.nearly_seven_days || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ revenueAmount.nearly_seven_days || 0 }}
            </a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="mg-t32 count4">
            <a-col :class="bCount('date')" :lg="4">
              近30日
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ beMemberNum.nearly_thirty_days || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ passengerFlow.nearly_thirty_days || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ courseCheckInNum.nearly_thirty_days || 0 }}
            </a-col>
            <a-col :class="bCount('count')" class="font-number" :lg="5">
              {{ revenueAmount.nearly_thirty_days || 0 }}
            </a-col>
          </a-row>
        </template>
      </st-panel>
      <st-panel :class="b('shadow')" class="mg-t16">
        <div slot="title">
          <st-recent-radio-group
            @change="revenueRecentChange"
          ></st-recent-radio-group>
        </div>
        <div>
          <div :class="b('revenue-right')">
            <st-t3 style="margin-bottom:40px;">营收结构</st-t3>

            <st-skeleton
              v-if="$skeletonLoading"
              :style="{ height: '280px' }"
            ></st-skeleton>

            <template v-else>
              <shop-revenue-ring
                v-if="revenueSummary.length"
                :sum="revenueSum ? revenueSum : 0"
                :data="revenueSummary"
              ></shop-revenue-ring>
              <img v-else :class="b('entry-pie-img')" :src="pieImg" />
            </template>
          </div>
          <div :class="b('revenue-left')">
            <st-t3>营收趋势</st-t3>

            <st-skeleton
              v-if="$skeletonLoading"
              :style="{ height: '350px' }"
            ></st-skeleton>
            <template v-else>
              <p :class="bCount('amount')">
                合计：
                <span class="font-number">
                  {{ revenueSum ? revenueSum : '--' }}
                </span>
                元
              </p>

              <shop-revenue-line
                v-if="revenueDaily.length"
                :data="revenueDaily"
                :fields="[
                  $c('member_card'),
                  '私教课',
                  '团体课',
                  '课程包',
                  $c('small_course'),
                  '云店',
                  '其他',
                  '总营收'
                ]"
              ></shop-revenue-line>
              <img v-else :class="b('entry-course-img')" :src="inoutNumImg" />
            </template>
          </div>
        </div>
      </st-panel>
      <st-panel :class="b('shadow')" class="mg-t16">
        <div slot="title">
          <st-recent-radio-group
            @change="newMemberRecentChange"
          ></st-recent-radio-group>
        </div>
        <div>
          <div :class="b('user-left')">
            <a-dropdown>
              <a href="javascript:;">
                <st-t3>
                  {{ memberType === 'member' ? '用户转化' : '营销转化' }}
                  <st-icon
                    type="dropdown"
                    :class="b('dropdown')"
                    color="rgba(0,0,0,.15)"
                  ></st-icon>
                </st-t3>
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="switchMember('member')">
                    用户转化
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="switchMember('marketing')">
                    营销转化
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <st-skeleton v-if="$skeletonLoading" height="320px"></st-skeleton>
            <template v-else>
              <template v-if="memberType === 'member'">
                <funnel-vertical
                  v-if="member.member.length"
                  style="margin-top:24px;"
                  :height="320"
                  :data="member.member"
                ></funnel-vertical>
                <img v-else :class="b('entry-funnel-img')" :src="funnelImg" />
              </template>
              <template v-if="memberType === 'marketing'">
                <funnel-vertical
                  v-if="member.marketing.length"
                  style="margin-top:24px;"
                  :height="320"
                  :data="member.marketing"
                ></funnel-vertical>
                <img v-else :class="b('entry-funnel-img')" :src="funnelImg" />
              </template>
            </template>
          </div>
          <div :class="b('user-right')">
            <st-t3 style="margin-bottom:24px;">购买私教用户</st-t3>
            <st-skeleton v-if="$skeletonLoading" height="320px"></st-skeleton>
            <template v-else>
              <shop-add-user
                v-if="newMember.length"
                :height="320"
                :data="newMember"
              ></shop-add-user>
              <img
                v-else
                :class="b('entry-newMember-img')"
                :src="newMemberImg"
              />
            </template>
          </div>
        </div>
      </st-panel>
      <st-panel :class="b('shadow')" class="mg-t16">
        <div slot="title">
          <st-recent-radio-group
            @change="courseRecentChange"
          ></st-recent-radio-group>
        </div>
        <a-row>
          <a-col :span="13">
            <st-t3 style="margin-bottom:24px;">上课分析</st-t3>
            <shop-course-line
              v-if="courseDaily.length"
              :data="courseDaily"
            ></shop-course-line>
            <img v-else :class="b('entry-course-img')" :src="inoutNumImg" />
          </a-col>
          <a-col :span="10" :offset="1">
            <st-t3 style="margin-bottom:24px;">售课消课</st-t3>
            <shop-course-facet-bar
              v-if="courseSummary.length"
              :data="courseSummary"
            ></shop-course-facet-bar>
            <img v-else :class="b('entry-course-img')" :src="courseImg" />
          </a-col>
        </a-row>
      </st-panel>
      <st-panel :class="b('shadow')" class="mg-t16">
        <div slot="title">
          <st-recent-radio-group
            @change="inoutRecentChange"
          ></st-recent-radio-group>
        </div>
        <a-row>
          <a-col :span="13">
            <st-t3 style="margin-bottom:24px;">入场人数</st-t3>
            <shop-entry-line
              v-if="inoutNum.length"
              :height="190"
              :data="inoutNum"
            ></shop-entry-line>
            <img v-else :class="b('entry-line-img')" :src="inoutNumImg" />
          </a-col>
          <a-col :span="10" :offset="1">
            <st-t3 style="margin-bottom:24px;">入场人数横向柱状图</st-t3>
            <shop-entry-bar
              v-if="inoutTime.length"
              :data="inoutTime"
            ></shop-entry-bar>
            <img v-else :class="b('entry-line-img')" :src="inoutTimeImg" />
          </a-col>
        </a-row>
      </st-panel>
    </div>
  </div>
</template>
<script>
import topIconUser from '@/assets/img/shop/dashboard/top_icon_user.png'
import topIconMoney from '@/assets/img/shop/dashboard/top_icon_money.png'
import topIconPrice from '@/assets/img/shop/dashboard/top_icon_price.png'
import topIconFlow from '@/assets/img/shop/dashboard/top_icon_flow.png'
import FunnelVertical from '@/views/biz-components/stat/shop-funnel-vertical'
import ShopRevenueRing from '@/views/biz-components/stat/shop-revenue-ring'
import ShopRevenueLine from '@/views/biz-components/stat/shop-revenue-line'
import ShopCourseLine from '@/views/biz-components/stat/shop-course-line'
import ShopAddUser from '@/views/biz-components/stat/shop-add-user'
import ShopEntryBar from '@/views/biz-components/stat/shop-entry-bar'
import ShopEntryLine from '@/views/biz-components/stat/shop-entry-line'
import CrowdLine from '@/views/biz-components/stat/crowd-line'
import SidebarComponent from '@/views/biz-components/dashboard/sidebar'
import ShopCourseFacetBar from '@/views/biz-components/stat/shop-course-facet-bar'
import inoutNumImg from '@/assets/img/shop/dashboard/inoutNum.png'
import inoutTimeImg from '@/assets/img/shop/dashboard/inoutTime.png'
import funnelImg from '@/assets/img/shop/dashboard/funnel.png'
import courseImg from '@/assets/img/shop/dashboard/course.png'
import newMemberImg from '@/assets/img/shop/dashboard/newMember.png'
import pieImg from '@/assets/img/shop/dashboard/pie.png'
import { StudioService } from './studio.service'
export default {
  name: 'DashboardStudio',
  bem: {
    b: 'page-shop-dashboard-studio',
    bCount: 'page-shop-dashboard-studio-count',
    bAdv: 'page-shop-dashboard-studio-adv'
  },
  serviceInject() {
    return {
      studioComponentService: StudioService
    }
  },
  rxState() {
    return {
      top: this.studioComponentService.top$,
      revenueDaily: this.studioComponentService.revenueDaily$,
      revenueSummary: this.studioComponentService.revenueSummary$,
      revenueSum: this.studioComponentService.revenueSum$,
      courseDaily: this.studioComponentService.courseDaily$,
      courseSummary: this.studioComponentService.courseSummary$,
      inoutNum: this.studioComponentService.inoutNum$,
      inoutTime: this.studioComponentService.inoutTime$,
      member: this.studioComponentService.member$,
      newMember: this.studioComponentService.newMember$
    }
  },
  computed: {
    revenueAmount() {
      return this.top.revenue_amount
    },
    courseCheckInNum() {
      return this.top.course_checkin_num
    },
    passengerFlow() {
      return this.top.passenger_flow
    },
    beMemberNum() {
      return this.top.buy_personal_course_num
    }
  },
  data() {
    return {
      topIconUser: topIconUser,
      topIconMoney: topIconMoney,
      topIconPrice: topIconPrice,
      topIconFlow: topIconFlow,
      inoutRecent: '7',
      courseRecent: '7',
      revenueRecent: '7',
      memberType: 'member',
      gutter: 24,
      inoutNumImg: inoutNumImg,
      inoutTimeImg: inoutTimeImg,
      funnelImg: funnelImg,
      courseImg: courseImg,
      newMemberImg: newMemberImg,
      pieImg: pieImg
    }
  },
  components: {
    ShopRevenueRing,
    ShopRevenueLine,
    ShopCourseLine,
    ShopEntryBar,
    ShopEntryLine,
    FunnelVertical,
    ShopAddUser,
    SidebarComponent,
    // RecentRadioGroup,
    ShopCourseFacetBar
  },
  methods: {
    matchAmount(str) {
      if (str) return str.match(/(.*)\/(.*)/) || []
    },
    inoutRecentChange(query) {
      this.studioComponentService.getInout(query).subscribe()
    },
    courseRecentChange(query) {
      this.studioComponentService.getCourse(query).subscribe()
    },
    newMemberRecentChange(query) {
      this.studioComponentService.getBuyCourse(query).subscribe()
    },
    revenueRecentChange(query) {
      this.studioComponentService.getRevenue(query).subscribe()
    },
    switchMember(memberType) {
      this.memberType = memberType
    },
    refresh() {
      // 5分钟间隔限制
    }
  }
}
</script>
