<template>
  <div class="member-info-sold">
    <formDate v-model="form"></formDate>
    <a-row :gutter="24" class="mg-t16">
      <a-col :lg="24">
        <st-table
          rowKey="id"
          :columns="classrecord"
          :dataSource="soldListInfo"
          @change="reservePageChange"
          :page="soldPage"
        >
          <div slot="reserve_type" slot-scope="text, record">
            {{ record.reserve_type.name }}
          </div>
          <div slot="reserve_status" slot-scope="text, record">
            {{
              record.mina_reserve_status | enumFilter('reserve.reserve_status')
            }}
          </div>
          <div slot="is_checkin" slot-scope="text, record">
            <div>
              <span v-if="record.mina_checkin_status === 0"></span>
              {{ text }}
            </div>
          </div>
          <div slot="action" slot-scope="text, record">
            <st-table-actions>
              <a
                v-if="
                  record.auth['shop:reserve:personal_course_reserve|del'] &&
                    record.reserve_type.id === 1
                "
                @click="reserveStatus(record)"
              >
                取消预约
              </a>
              <a
                v-if="
                  record.auth['shop:reserve:personal_course_reserve|checkin'] &&
                    record.reserve_type.id === 1
                "
                @click="isCheckin(record)"
              >
                签到
              </a>
              <a
                v-if="
                  record.auth[
                    'shop:reserve:personal_team_course_reserve|del'
                  ] && record.reserve_type.id === 2
                "
                @click="reserveStatus(record)"
              >
                取消预约
              </a>
              <a
                v-if="
                  record.auth[
                    'shop:reserve:personal_team_course_reserve|checkin'
                  ] && record.reserve_type.id === 2
                "
                @click="isCheckin(record)"
              >
                签到
              </a>
              <a
                v-if="
                  record.auth['shop:reserve:team_course_reserve|del'] &&
                    record.reserve_type.id === 3
                "
                @click="reserveStatus(record)"
              >
                取消预约
              </a>
              <a
                v-if="
                  record.auth['shop:reserve:team_course_reserve|checkin'] &&
                    record.reserve_type.id === 3
                "
                @click="isCheckin(record)"
              >
                签到
              </a>
              <a
                v-if="
                  record.auth['shop:reserve:small_class_course_reserve|del'] &&
                    record.reserve_type.id === 5
                "
                @click="reserveStatus(record)"
              >
                取消预约
              </a>
              <a
                v-if="
                  record.auth['shop:reserve:small_class_course_reserve|checkin']
                "
                @click="isCheckin(record)"
              >
                签到
              </a>
              <a
                @click="getMessage(record.id)"
                v-if="
                  record.auth[
                    'shop:reserve:small_class_course_reserve|get_supplement'
                  ]
                "
              >
                查看补课
              </a>
              <a
                @click="leave(record.id)"
                v-if="
                  record.auth['shop:reserve:small_class_course_reserve|leave']
                "
              >
                请假
              </a>
              <a
                @click="checkSign(record.id)"
                v-if="
                  record.auth[
                    'shop:reserve:small_class_course_reserve|supplement_checkin'
                  ]
                "
              >
                补签到
              </a>
              <a
                @click="remedialCourse(record.id)"
                v-if="
                  record.auth[
                    'shop:reserve:small_class_course_reserve|supplement'
                  ]
                "
              >
                补课
              </a>
            </st-table-actions>
          </div>
        </st-table>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import formDate from './sold#/form-date.vue'
import { SoldService } from './sold.service'
import { classrecord } from './sold.config.ts'
import tableMixin from '@/mixins/table.mixin'
import ScheduleSmallCourseReservedCourse from '@/views/biz-modals/schedule/small-course/reserved-course'
import ScheduleSmallCourseRemedialCourse from '@/views/biz-modals/schedule/small-course/remedial-course'
import ScheduleSmallCourseRemedialInfo from '@/views/biz-modals/schedule/small-course/remedial-info'
export default {
  mixins: [tableMixin],
  serviceInject() {
    return {
      soldService: SoldService
    }
  },
  rxState() {
    return {
      soldListInfo: this.soldService.soldListInfo$,
      soldPage: this.soldService.soldPage$,
      auth: this.soldService.auth$
    }
  },
  modals: {
    ScheduleSmallCourseReservedCourse,
    ScheduleSmallCourseRemedialCourse,
    ScheduleSmallCourseRemedialInfo
  },
  computed: {
    classrecord
  },
  components: {
    formDate
  },
  data() {
    return {
      form: {
        start_date: '', // 上课日期
        reserve_type: -1,
        reserve_status: -1,
        checkin_status: -1,
        course_name: undefined,
        size: 20,
        page: 1
      }
    }
  },
  created() {
    // let self = this
    // this.soldService.init(self.$searchQuery.id, self.form).subscribe()
  },
  methods: {
    /* 取消预约 */
    reserveStatus(record) {
      let self = this
      this.$confirm({
        title: '提示',
        content: '确认取消预约并退还相应费用？',
        okText: '确认取消',
        cancelText: '再看看',
        onOk() {
          let getdata = {
            id: self.$searchQuery.id,
            reserve_type: record.reserve_type.id,
            reserve_id: record.id
          }
          self.soldService.getMemberCancel(getdata).subscribe(res => {
            self.soldService.init(self.$searchQuery.id, self.form).subscribe()
          })
        },
        onCancel() {}
      })
    },
    /* 课程签到 */
    isCheckin(record) {
      let self = this
      this.$confirm({
        title: '提示',
        content: '确认签到?',
        onOk() {
          let getdata = {
            id: self.$searchQuery.id,
            reserve_type: record.reserve_type.id,
            reserve_id: record.id
          }
          console.log(record, getdata)
          self.soldService.getMemberSign(getdata).subscribe(res => {
            self.soldService.init(self.$searchQuery.id, self.form).subscribe()
          })
        },
        onCancel() {}
      })
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    // 上课记录分页
    reservePageChange(e) {
      this.form.size = e.pageSize
      this.form.page = e.current
    },
    // 入场记录分页
    entrancePageChange(e) {
      this.soldService
        .getMemberEntrance(this.$searchQuery.id, {
          size: e.pageSize,
          page: e.current
        })
        .subscribe()
    },
    // 查看补课
    getMessage(id) {
      this.$modalRouter.push({
        name: 'schedule-small-course-remedial-info',
        props: {
          id: id
        }
      })
      this.show = false
    },
    // 补签到
    checkSign(id) {
      this.soldService.checkSign(id).subscribe(this.getReserveInfo)
    },
    // 取消预约
    del(id) {
      this.soldService.del(id).subscribe(this.getReserveInfo)
    },
    // 请假
    leave(id) {
      this.soldService.leave(id).subscribe(this.getReserveInfo)
    },
    // 补课回显
    remedialCourse(reserve_id) {
      this.$modalRouter.push({
        name: 'schedule-small-course-remedial-course',
        props: {
          reserve_id: reserve_id
        },
        on: {
          ok: () => {
            this.$router.reload()
          }
        }
      })
      this.show = false
    },
    getReserveInfo() {
      this.$router.reload()
    }
  },
  watch: {
    form: {
      handler() {
        this.soldService
          .getMemberReserve(this.$searchQuery.id, this.form)
          .subscribe()
      },
      deep: true
    }
  }
}
</script>
