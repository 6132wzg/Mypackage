<template>
  <div>
    <calendar
      @get-table="onGetTable"
      @detail="onDetail"
      @add="onAddSchedule"
      :authAdd="auth.add"
      fixed
      :cardList="cardList"
      :startDate="startDate"
      :smallCourseType="true"
    >
      <div slot="toolbar-left">
        <st-button
          type="primary"
          class="mg-r12"
          @click="onClickScheduleInBatch"
          v-if="auth.eidt"
        >
          批量编辑
        </st-button>
      </div>
    </calendar>
  </div>
</template>

<script>
import Calendar from '@/views/biz-components/schedule/calendar'
import { SmallCourseScheduleService } from './service#/schedule.service'
import ScheduleSmallCourseAddCourse from '@/views/biz-modals/schedule/small-course/add-course'
import ScheduleSmallCourseReserveInfo from '@/views/biz-modals/schedule/small-course/reserve-info'
import { SmallCourseService } from './small-course.service'
export default {
  name: 'SmallCourseSchedule',
  modals: {
    ScheduleSmallCourseAddCourse,
    ScheduleSmallCourseReserveInfo
  },
  serviceInject() {
    return {
      smallCourseScheduleService: SmallCourseScheduleService,
      service: SmallCourseService
    }
  },
  rxState() {
    return {
      auth: this.service.auth$,
      cardList: this.smallCourseScheduleService.scheduleSmallCourseList$
    }
  },
  components: {
    Calendar
  },
  data() {
    return {}
  },
  computed: {
    startDate() {
      return this.$searchQuery.start_date || moment().format('YYYY-MM-DD')
    }
  },
  methods: {
    // 新增课程排期
    onAddSchedule(date) {
      if (!this.auth.add) {
        return
      }
      this.$modalRouter.push({
        name: 'schedule-small-course-add-course',
        props: { time: date },
        on: {
          ok: res => {
            this.onScheduleChange()
          }
        }
      })
    },
    // 查看详情
    onDetail(info) {
      if (!this.auth.getInfo) {
        return
      }
      this.$modalRouter.push({
        name: 'schedule-small-course-reserve-info',
        props: {
          id: info.id
        },
        on: {
          ok: res => {
            this.onScheduleChange()
          }
        }
      })
    },
    // 排课-批量修改
    onClickScheduleInBatch() {
      this.$router.push({
        path: '/shop/product/course/mini-schedule/inbatch-add'
      })
    },
    // 进入表格模式
    onGetTable() {
      this.$router.push({
        name: 'shop-product-course-schedule-small-course-small-course-table',
        query: this.$searchQuery
      })
    },
    onScheduleChange() {
      this.$router.reload()
    }
  }
}
</script>
