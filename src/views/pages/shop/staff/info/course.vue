<template>
  <a-row>
    <a-select
      style="width: 160px;"
      class="mg-r12"
      :defaultValue="-1"
      placeholder="请选择课程状态"
      @change="onSingleSearch('schedule_status', $event)"
      :options="reserveStatus"
    ></a-select>
    <a-range-picker @change="onChooseDate" format="YYYY-MM-DD" />

    <st-input-search
      style="float:right"
      placeholder="请输入课程名称"
      @search="onSingleSearch('course_name', $event)"
    />

    <a-col :lg="24" class="mg-t16">
      <st-table
        :columns="courseColums"
        :dataSource="courseInfo"
        :loading="loading.getCoursesList"
        :page="page"
        rowKey="id"
        @change="onTableChange"
      >
        <template slot="schedule_status" slot-scope="text, record">
          <st-text
            :status="{
              success: record.schedule_status.id === 2,
              default:
                record.schedule_status.id === 3 ||
                record.schedule_status.id === 4,
              primary: record.schedule_status.id === 1
            }"
          >
            {{ record.schedule_status.name }}
          </st-text>
        </template>
        <template slot="course_type" slot-scope="text, record">
          <!-- 课程类型 -->
          {{ record.course_type.name }}
        </template>
        <template slot="course_name" slot-scope="text, record">
          <a href="javascript:;" class="mg-r8" @click="goCourseDetai(record)">
            {{ text }}
          </a>
        </template>
        <template slot="action" slot-scope="text, record">
          <a href="javascript:;" class="mg-r8" @click="onSearchDetail(record)">
            详情
          </a>
        </template>
      </st-table>
    </a-col>
  </a-row>
</template>

<script>
import { courseColums } from './columns.config'
import { CourseService } from './course.service'
import tableMixin from '@/mixins/table.mixin'
import SchedulePersonalReserveInfo from '@/views/biz-modals/schedule/personal/reserve-info'
import SchedulePersonalTeamReserveInfo from '@/views/biz-modals/schedule/personal-team/reserve-info'
import ScheduleTeamReserveInfo from '@/views/biz-modals/schedule/team/reserve-info'
export default {
  mixins: [tableMixin],
  modals: {
    SchedulePersonalReserveInfo,
    SchedulePersonalTeamReserveInfo,
    ScheduleTeamReserveInfo
  },
  serviceInject() {
    return {
      service: CourseService
    }
  },
  rxState() {
    return {
      courseInfo: this.service.courseInfo$,
      loading: this.service.loading$,
      page: this.service.page$,
      reserveStatus: this.service.reserveStatus$
    }
  },
  data() {
    return {
      id: ''
    }
  },
  computed: { courseColums },
  mounted() {
    this.id = this.$searchQuery.id
  },
  methods: {
    goCourseDetai(e) {
      console.log('跳转到课程详情', e)
      let course_type = e.course_type.id
      let course_id = e.course_id
      if (course_type === 3) {
        this.$router.push({
          name: 'shop-product-course-manage-team-info',
          query: {
            courseId: course_id
          }
        })
      } else {
        this.$router.push({
          name: 'shop-product-course-manage-personal-info',
          query: {
            id: course_id
          }
        })
      }
    },
    // 查看详情 点击弹出预约详情弹窗，同【门店-课程排期-团体课】、【门店-课程排期-私教1v1】、【门店-课程排期-私教小团课】
    onSearchDetail(e) {
      let course_type = e.course_type.id
      switch (course_type) {
        case 3:
          this.$modalRouter.push({
            name: 'schedule-team-reserve-info',
            props: {
              id: e.id
            },
            on: {
              ok: res => {
                console.log(res)
              }
            }
          })
          break
        case 1:
          this.$modalRouter.push({
            name: 'schedule-personal-reserve-info',
            props: {
              id: String(e.id)
            },
            on: {
              ok: res => {
                console.log(res)
              }
            }
          })
          break
        case 2:
          this.$modalRouter.push({
            name: 'schedule-personal-team-reserve-info',
            props: {
              id: e.id
            },
            on: {
              ok: res => {
                console.log(res)
              }
            }
          })
          break
      }
    },
    // 日期选择
    onChooseDate(e) {
      console.log(e)
      this.$router.push({
        query: {
          id: this.id,
          start_time: moment(e[0]).format('YYYY-MM-DD'),
          end_time: moment(e[1]).format('YYYY-MM-DD')
        }
      })
    }
  }
}
</script>
