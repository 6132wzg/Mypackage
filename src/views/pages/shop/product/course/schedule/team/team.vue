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
      ref="calendar"
    >
      <div slot="toolbar-left">
        <st-btn-actions :options="btnOptions"></st-btn-actions>
      </div>
    </calendar>
  </div>
</template>

<script>
import Calendar from '@/views/biz-components/schedule/calendar'
import { TeamScheduleScheduleService } from '@/views/pages/shop/product/course/schedule/team/service#/schedule.service'
import ScheduleTeamAddCourseBatch from '@/views/biz-modals/schedule/team/add-course-batch'
import ScheduleBatchCourseManage from '@/views/biz-modals/schedule/batch/course-manage'
import ScheduleBatchAddEditCourse from '@/views/biz-modals/schedule/batch/add-edit-course'
import ScheduleBatchCourseRankPreview from '@/views/biz-modals/schedule/batch/course-rank-preview'
import ScheduleTeamAddCourse from '@/views/biz-modals/schedule/team/add-course'
import ScheduleTeamCopySchedule from '@/views/biz-modals/schedule/team/copy-schedule'
import ScheduleTeamReserveInfo from '@/views/biz-modals/schedule/team/reserve-info'
import ScheduleTeamPunishList from '@/views/biz-modals/schedule/team/punish-list'
import ScheduleTeamTimeTable from '@/views/biz-modals/schedule/team/time-table'
import { TeamService } from './team.service'
import { TIME_UNIT } from '@/constants/course/team'
export default {
  name: 'TeamSchedule',
  modals: {
    ScheduleTeamAddCourseBatch,
    ScheduleTeamAddCourse,
    ScheduleTeamCopySchedule,
    ScheduleTeamReserveInfo,
    ScheduleBatchCourseManage,
    ScheduleBatchAddEditCourse,
    ScheduleBatchCourseRankPreview,
    ScheduleTeamPunishList,
    ScheduleTeamTimeTable
  },
  serviceInject() {
    return {
      teamSchduleService: TeamScheduleScheduleService,
      service: TeamService
    }
  },
  rxState() {
    return {
      auth: this.service.auth$,
      loading: this.teamSchduleService.loading$,
      cardList: this.teamSchduleService.scheduleTeamCourseList$,
      teamTemplateList: this.teamSchduleService.teamTemplateList$
    }
  },
  components: {
    Calendar
  },
  data() {
    return { TIME_UNIT }
  },
  computed: {
    btnOptions() {
      return [
        {
          text: '批量排期',
          click: this.onClickScheduleInBatch,
          if: this.auth['addBatch']
        },
        {
          text: '复制排期',
          click: this.onClickCopySchedule,
          if: this.auth['copy']
        },
        {
          text: '爽约惩罚会员',
          click: this.showPunishModal
        },
        {
          text: '生成课表',
          click: this.createTimeTableModal
        }
      ]
    },
    startDate() {
      return this.$searchQuery.start_date || moment().format('YYYY-MM-DD')
    }
  },
  methods: {
    onMouseLeave() {
      console.log('onMouseLeave')
    },
    // 新增团课排期
    onAddSchedule(date) {
      console.log(date)
      this.$modalRouter.push({
        name: 'schedule-team-add-course',
        props: { time: date },
        on: {
          ok: res => {
            console.log('ok')
            this.onScheduleChange()
          },
          onClickBatch: () => {
            this.onClickScheduleInBatch()
          }
        }
      })
    },
    // 查看详情
    onDetail(info) {
      console.log(info)
      this.$modalRouter.push({
        name: 'schedule-team-reserve-info',
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
    // 批量排期(打开课程管理或者新增课程)
    onClickScheduleInBatch() {
      // this.$modalRouter.push({
      //   name: 'schedule-team-add-course-batch',
      //   on: {
      //     ok: res => {
      //       this.onScheduleChange()
      //     }
      //   }
      // })
      this.teamSchduleService.getTeamTemplate().subscribe(res => {
        // 打开课表管理
        if (!this.teamTemplateList.length) {
          this.addOrEditCourse()
          return
        }
        this.$modalRouter.push({
          name: 'schedule-batch-course-manage',
          props: {
            teamTemplateList: this.teamTemplateList,
            type: 'team'
          },
          on: {
            // 确定时开始删除数据
            save: res => {
              this.teamSchduleService
                .delTeamTemplate({ id: JSON.stringify(res) })
                .subscribe()
            },
            // 新增课表打开新增课表弹窗
            add: () => {
              setTimeout(() => {
                this.addOrEditCourse()
              }, 500)
            },
            // 编辑课表打开编辑课表弹窗
            edit: res => {
              setTimeout(() => {
                this.addOrEditCourse(res)
              }, 500)
            }
          }
        })
      })
    },
    // 新增和编辑团课
    addOrEditCourse(id = undefined) {
      this.$modalRouter.push({
        name: 'schedule-batch-add-edit-course',
        props: {
          id,
          type: 'team'
        },
        on: {
          success: res => {
            setTimeout(() => {
              this.$modalRouter.push({
                name: 'schedule-batch-course-rank-preview',
                props: {
                  dataTable: res.info,
                  type: 'team'
                },
                on: {
                  success: res => {
                    this.onScheduleChange()
                  }
                }
              })
            }, 500)
          }
        }
      })
    },
    // 复制排期
    onClickCopySchedule() {
      this.$modalRouter.push({
        name: 'schedule-team-copy-schedule',
        on: {
          ok: res => {
            this.onScheduleChange()
          }
        }
      })
    },
    // 进入表格模式
    onGetTable() {
      this.$router.push({
        name: 'shop-product-course-schedule-team-team-table',
        query: this.$searchQuery
      })
    },
    // 刷新页面
    onScheduleChange() {
      this.$router.push({ query: this.$searchQuery })
    },
    /**
     * 爽约惩罚列表
     */
    showPunishModal() {
      this.$modalRouter.push({
        name: 'schedule-team-punish-list'
      })
    },
    /**
     * 生成课表
     */
    createTimeTableModal() {
      this.$modalRouter.push({
        name: 'schedule-team-time-table'
      })
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.service.scheduleService.getList(this.$searchQuery)
      this.$refs.calendar.getWeeks(
        this.$searchQuery.time_unit === this.TIME_UNIT.TIME_WEEK ? 'week' : ''
      )
    }
  }
}
</script>
