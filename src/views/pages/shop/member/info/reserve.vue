<template>
  <div :class="b()">
    <div :class="b('member-card')">
      <st-t3>已购会员卡</st-t3>
      <st-table
        v-if="memberCardList$.length"
        class="mg-t16"
        rowKey="id"
        :columns="memberCard"
        :dataSource="memberCardList$"
        :scroll="{ x: 1150 }"
        @change="onTableMemberChange('member', $event)"
        :page="memberCardPage$"
      >
        <template slot="memberList" slot-scope="text">
          <st-overflow-text :value="text" max-width="120px"></st-overflow-text>
        </template>
        <template slot="contract_number" slot-scope="text, record">
          <a @click="getSoldDetail('card', 'member', record.id)">{{ text }}</a>
        </template>
        <template slot="use_range" slot-scope="text, record">
          <user-range :userRange="text" :record="record"></user-range>
        </template>
        <template slot="card_status" slot-scope="text">
          <st-text
            :status="{
              success: text.id === 1,
              error: text.id === 3,
              default: text.id === 2
            }"
          >
            {{ text.name }}
          </st-text>
        </template>
      </st-table>
      <entry-data v-else tip="您还未购买会员卡^o^"></entry-data>
    </div>
    <div :class="b('deposit-card')" class="mg-t32">
      <st-t3>已购储值卡</st-t3>
      <st-table
        v-if="depositCardList$.length"
        class="mg-t16"
        rowKey="id"
        :columns="depositCard"
        :dataSource="depositCardList$"
        :scroll="{ x: 1150 }"
        @change="onTableMemberChange('deposit', $event)"
        :page="depositCardPage$"
      >
        <template slot="contract_number" slot-scope="text, record">
          <a @click="getSoldDetail('card', 'deposit', record.id)">{{ text }}</a>
        </template>
        <template slot="use_range" slot-scope="text, record">
          <user-range :userRange="text" :record="record"></user-range>
        </template>
        <template slot="card_status" slot-scope="text">
          <st-text
            :status="{
              success: text.id === 1,
              error: text.id === 3,
              default: text.id === 2
            }"
          >
            {{ text.name }}
          </st-text>
        </template>
      </st-table>
      <entry-data v-else tip="您还未购买储值卡^o^"></entry-data>
    </div>
    <div :class="b('personal-course')" class="mg-t32">
      <st-t3>已购私教课</st-t3>
      <st-table
        class="mg-t16"
        v-if="personalCourseList$.length"
        rowKey="id"
        :columns="personalCourse"
        :dataSource="personalCourseList$"
        :scroll="{ x: 1150 }"
        @change="onTableMemberChange('personal', $event)"
        :page="personalCoursePage$"
      >
        <template slot="contract_number" slot-scope="text, record">
          <a @click="getSoldDetail('course', 'personal', record.id)">
            {{ text }}
          </a>
        </template>
        <template slot="coach_name" slot-scope="text">
          <st-overflow-text max-width="180px" :value="text"></st-overflow-text>
        </template>
        <template slot="use_range" slot-scope="text, record">
          <user-range :userRange="text" :record="record"></user-range>
        </template>
        <template slot="course_status" slot-scope="text">
          <st-text
            :status="{
              success: text.id === 1,
              error: text.id === 3,
              default: text.id === 2
            }"
          >
            {{ text.name }}
          </st-text>
        </template>
      </st-table>
      <entry-data v-else tip="您还未购买私教课^o^"></entry-data>
    </div>
    <div :class="b('package')" class="mg-t32">
      <st-t3>已购课程包</st-t3>
      <st-table
        class="mg-t16"
        rowKey="id"
        v-if="packageList$.length"
        :columns="packageColumns"
        :dataSource="packageList$"
        :scroll="{ x: 1150 }"
        @change="onTableMemberChange('package', $event)"
        :page="packagePage$"
      >
        <template slot="memberList" slot-scope="text">
          <st-overflow-text :value="text" max-width="120px"></st-overflow-text>
        </template>
        <template slot="contract_number" slot-scope="text, record">
          <a @click="getSoldDetail('course', 'package', record.id)">
            {{ text }}
          </a>
        </template>
        <template slot="use_range" slot-scope="text, record">
          <user-range :userRange="text" :record="record"></user-range>
        </template>
        <template slot="course_status" slot-scope="text">
          <st-text
            :status="{
              success: text.id === 1,
              error: text.id === 3,
              default: text.id === 2
            }"
          >
            {{ text.name }}
          </st-text>
        </template>
      </st-table>
      <entry-data v-else tip="您还未购买课程包^o^"></entry-data>
    </div>
    <div :class="b('small-course')" class="mg-t32">
      <st-t3>已购小班课</st-t3>
      <st-table
        class="mg-t16"
        rowKey="id"
        :columns="smallCourse"
        v-if="smallCourseList$.length"
        :dataSource="smallCourseList$"
        :scroll="{ x: 1150 }"
        @change="onTableMemberChange('small', $event)"
        :page="smallCoursePage$"
      >
        <template slot="contract_number" slot-scope="text, record">
          <a @click="getSoldDetail('course', 'small-course', record.id)">
            {{ text }}
          </a>
        </template>
        <template slot="course_status" slot-scope="text">
          <st-text
            :status="{
              success: text.id === 1,
              error: text.id === 3,
              default: text.id === 2
            }"
          >
            {{ text.name }}
          </st-text>
        </template>
      </st-table>
      <entry-data v-else tip="您还未购买小班课^o^"></entry-data>
    </div>
  </div>
</template>

<script>
import { ReserveService } from './reserve.service'
import tableMixin from '@/mixins/table.mixin'
import UserRange from './sold#/user-range'
import EntryData from './sold#/entry-data'
import {
  memberCard,
  depositCard,
  personalCourse,
  packageColumns,
  smallCourse
} from './reserve.config'
import { UserService } from '@/services/user.service'

export default {
  mixins: [tableMixin],
  bem: {
    b: 'member-reserve'
  },
  name: 'InfoReserve',
  serviceInject() {
    return {
      reserveService: ReserveService,
      userService: UserService
    }
  },
  rxState() {
    const {
      memberCardList$,
      depositCardList$,
      personalCourseList$,
      packageList$,
      smallCourseList$,
      memberCardPage$,
      depositCardPage$,
      personalCoursePage$,
      packagePage$,
      smallCoursePage$
    } = this.reserveService
    return {
      memberCardList$,
      depositCardList$,
      personalCourseList$,
      packageList$,
      smallCourseList$,
      memberCardPage$,
      depositCardPage$,
      personalCoursePage$,
      packagePage$,
      smallCoursePage$,
      cardConsumeList: this.userService.getOptions$('member.card_consume_type'),
      courseConsumeList: this.userService.getOptions$(
        'member.course_consume_type'
      )
    }
  },
  data() {
    return {
      cardquery: {
        start_time: '',
        card_type: 1,
        keyword: ''
      },
      coursequery: {
        buy_time: '',
        course_type: 1,
        keyword: ''
      },
      id: ''
    }
  },
  components: {
    UserRange,
    EntryData
  },
  computed: {
    memberCard,
    depositCard,
    personalCourse,
    packageColumns,
    smallCourse
  },
  methods: {
    getSoldDetail(type, subType, id) {
      window.open(
        `${window.location.origin}/shop/sold/${type}/info/${subType}/info/operation-record?id=${id}`
      )
    },
    onTableMemberChange(type, e) {
      this.$searchQuery.type = type
      this.reserveService
        .changePage({
          id: this.id,
          type,
          page: e.current,
          size: e.pageSize
        })
        .subscribe()
    },
    memberInfo(record) {
      const arr = record.members || []
      let familyInfo = ''
      if (record.card_number_type === 2) {
        familyInfo = `卡成员：${arr
          .filter(item => item.is_purchaser !== 1)
          .map(item => item.member_info)
          .join(',')}`
      }
      return `购卡人：${arr
        .filter(item => item.is_purchaser === 1)
        .map(item => item.member_info)
        .join('')}${familyInfo}`
    },
    /**
     * 设置页码
     * cardOrCourse 卡或课
     * current 当前页
     * pageSize 每页条数
     */
    initPage(cardOrCourse, current_page, size) {
      if (cardOrCourse === 1) {
        this.cardPage.size = size
        this.cardPage.current_page = current_page
      } else if (cardOrCourse === 2) {
        this.coursePage.current_page = current_page
        this.coursePage.size = size
      }
    },
    // 拼接入参
    assignObj(cardOrCourse) {
      if (cardOrCourse === 1) {
        return Object.assign(this.cardPage, this.cardquery)
      } else if (cardOrCourse === 2) {
        return Object.assign(this.coursePage, this.coursequery)
      }
    },
    // 选择日期
    onChooseDate(date, str) {
      console.log('======', date, str)
      this.initPage(1, 1, 10)
      this.cardquery.start_time = str
      this.reserveService
        .getCardInfo(this.id, this.assignObj(1))
        .subscribe(res => {})
    },
    // 选择卡类型
    onChooseCardType(e) {
      console.log('选择卡', e)
      this.initPage(1, 1, 10)
      this.reserveService
        .getCardInfo(this.id, this.assignObj(1))
        .subscribe(res => {})
    },
    // 卡分页
    cardPageChange(e) {
      this.initPage(1, e.current, e.pageSize)
      this.reserveService
        .getCardInfo(this.id, this.assignObj(1))
        .subscribe(res => {})
    },
    // 卡查询
    searchMemberCard(e) {
      this.initPage(1, 1, 10)
      this.cardquery.keyword = e
      this.reserveService
        .getCardInfo(this.id, this.assignObj(1))
        .subscribe(res => {})
    },
    // 课项选择时间
    onChooseDateCourse(date, str) {
      this.initPage(2, 1, 10)
      this.coursequery.buy_time = str
      this.reserveService
        .getCourseInfo(this.id, this.assignObj(2))
        .subscribe(res => {})
    },
    // 课项选择类型
    onChooseCourseType(e) {
      this.initPage(2, 1, 10)
      this.reserveService
        .getCourseInfo(this.id, this.assignObj(2))
        .subscribe(res => {})
    },
    // 课查询
    searchCourseName(e) {
      this.initPage(2, 1, 10)
      this.coursequery.keyword = e
      this.reserveService
        .getCourseInfo(this.id, this.assignObj(2))
        .subscribe(res => {})
    },
    // 课分页
    coursePageChange(e) {
      this.initPage(2, e.current, e.pageSize)
      this.reserveService
        .getCourseInfo(this.id, this.assignObj(2))
        .subscribe(res => {})
    }
  },
  mounted() {
    this.id = this.$searchQuery.id
  }
}
</script>
