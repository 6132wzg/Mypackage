<template>
  <st-panel app initial :class="b()">
    <div :class="b('header')" class="mg-l32 mg-r16">
      <div :class="b('header-left')">
        <div :class="b('header-left-img')" class="mg-r24">
          <img :src="imgUrl" alt="" width="281" height="158" />
        </div>

        <div :class="b('header-right')">
          <div :class="b('header-right-title')" class="mg-b24">
            {{ info.course_name }}
            <span>（{{ courseRangeName }}）</span>
          </div>
          <div class="price mg-b16">
            <i-count-up
              class="font-number mg-r8"
              :options="{ decimalPlaces: 1, duration: 0 }"
              :endVal="+info.price"
            ></i-count-up>
            <span class="font-unit">元</span>
          </div>
          <div class="mg-b8 limit">
            {{ info.course_setting }}
          </div>
          <div class="validate">{{ info.valid_time }}</div>
        </div>
      </div>
      <div class="right">
        <slot name="actions"></slot>
      </div>
    </div>
    <div :class="b('base-info')">
      <block-title title-name="基本信息" class="mg-b24"></block-title>
      <div class="mg-l24">
        <st-info>
          <st-info-item
            v-for="(item, index) in baseInfo"
            :label="item.label"
            :key="index"
          >
            {{ item.value }}
          </st-info-item>
          <st-info-item label="可约课程">
            <span v-if="packageType === PACKAGE_ATTR.ALL">
              {{ allCourseRange }}
            </span>
            <span v-if="info.basic_info.course_setting.total_times">
              团课&私教课共{{ info.basic_info.course_setting.total_times }}次
            </span>
          </st-info-item>
          <template
            v-if="
              packageType === PACKAGE_ATTR.RANGE ||
                packageType === PACKAGE_ATTR.FIX
            "
          >
            <st-container v-if="supportTeamCourse.length" class="mg-r40">
              <div :class="b('course-title')">
                <st-t3>团体课</st-t3>
                <st-info class="mg-l16 mg-r40">
                  <st-info-item
                    v-if="info.basic_info.course_setting.team_times"
                    label="总计"
                  >
                    <span>
                      {{ info.basic_info.course_setting.team_times }}次
                    </span>
                  </st-info-item>
                </st-info>
              </div>
              <st-table
                :columns="teamColumns"
                class="mg-t8"
                pageMode="client"
                rowKey="course_id"
                :dataSource="supportTeamCourse"
              ></st-table>
            </st-container>
            <st-container
              v-if="supportPersonalCourse.length"
              class="mg-t8 mg-r40"
            >
              <div :class="b('course-title')">
                <st-t3>私教课</st-t3>
                <st-info class="mg-l16">
                  <st-info-item
                    v-if="info.basic_info.course_setting.personal_times"
                    label="总计"
                  >
                    <span>
                      {{ info.basic_info.course_setting.personal_times }}次
                    </span>
                  </st-info-item>
                </st-info>
              </div>
              <st-table
                :columns="personalColumns"
                pageMode="client"
                class="mg-t8"
                rowKey="course_id"
                simplePage
                :dataSource="supportPersonalCourse"
              ></st-table>
            </st-container>
          </template>
        </st-info>
      </div>
    </div>
    <div :class="b('sale-info')" class="mg-t32">
      <block-title title-name="售卖信息" class="mg-b24"></block-title>
      <div class="mg-l24">
        <st-info>
          <st-info-item
            v-for="(item, index) in saleInfo"
            :label="item.label"
            :key="index"
          >
            {{ item.value }}
          </st-info-item>
        </st-info>
      </div>
    </div>
    <div :class="b('other-info')" class="mg-t32">
      <block-title title-name="其他信息" class="mg-b24"></block-title>
      <div class="mg-l24 mg-r24">
        <st-info>
          <st-info-item label="介绍">
            <div v-html="intro"></div>
          </st-info-item>
          <st-info-item
            v-for="(item, index) in extraInfo"
            :label="item.label"
            :key="index"
          >
            {{ item.value }}
          </st-info-item>
        </st-info>
      </div>
    </div>
  </st-panel>
</template>

<script>
import { InfoService } from './info.service'
import { teamColumns, personalColumns } from './info.config'
import { PACKAGE_ATTR } from '../const'
export default {
  name: 'PackageInfo',
  bem: { b: 'biz-package-info' },
  serviceInject() {
    return {
      service: InfoService
    }
  },
  rxState() {
    const {
      saleTimeIsForever$,
      reserveIsLimit$,
      packageType$,
      coachList$,
      reserveLimitDay$
    } = this.service
    return {
      saleTimeIsForever$,
      reserveIsLimit$,
      coachList$,
      packageType$,
      reserveLimitDay$
    }
  },
  data() {
    return {
      PACKAGE_ATTR
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },
    btnOptions: {
      type: Array,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    teamColumns,
    personalColumns,
    imgUrl() {
      return this.info.image
    },
    courseRangeName() {
      return this.packageType$[this.info.package_type]
    },
    supportTeamCourse() {
      let { basic_info } = this.info
      return basic_info.course_setting.support_course_team_range
    },
    supportPersonalCourse() {
      let { basic_info } = this.info
      return basic_info.course_setting.support_course_personal_range.map(
        item => {
          item.coachList = item.coach_level_ids
            .map(item => item.setting_name)
            .join(',')
          return item
        }
      )
    },
    packageType() {
      return this.info.package_type
    },
    isLimit() {
      return this.info.is_limit
    },
    allCourseRange() {
      let { basic_info } = this.info
      return basic_info.course_setting.description
    },
    baseInfo() {
      let { basic_info } = this.info
      let {
        reserve_is_limit,
        reserve_limit_times,
        reserve_limit_day
      } = basic_info
      let unit = this.reserveLimitDay$[reserve_limit_day]
      let reserveCourseLimit =
        reserve_is_limit === 0
          ? this.reserveIsLimit$[reserve_is_limit]
          : `${unit}${reserve_limit_times}节课`
      return [
        { label: '使用人数', value: `${basic_info.support_num}人` },
        { label: '上课门店', value: basic_info.use_shop },
        {
          label: '约课限制',
          value: reserveCourseLimit
        }
      ]
    },
    saleInfo() {
      let { sale_info } = this.info
      let {
        is_permanent_sale,
        end_time,
        start_time,
        sale_mode,
        sale_shop,
        frozen_setting,
        transfer_setting
      } = sale_info
      // TODO: 永久售卖应该是枚举 1 为永久售卖
      let saleTime =
        is_permanent_sale === 0
          ? `${start_time} ~ ${end_time}`
          : this.saleTimeIsForever$[is_permanent_sale]
      return [
        { label: '售卖时间', value: saleTime },
        { label: '售卖方式', value: sale_mode },
        {
          label: '售卖门店',
          value: sale_shop
        },
        { label: '转让设置', value: transfer_setting },
        { label: '冻结设置', value: frozen_setting }
      ]
    },
    intro() {
      let { extra_info } = this.info
      return extra_info.intro || '--'
    },
    extraInfo() {
      let { extra_info } = this.info
      let { remarks } = extra_info
      return [
        {
          label: '内部备注',
          value: remarks || '--'
        }
      ]
    }
  },
  created() {
    this.service.getCoachList().subscribe()
  }
}
</script>
