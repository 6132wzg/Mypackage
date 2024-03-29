<template>
  <st-panel initial app>
    <div class="page-personal-table schedule-table">
      <div
        class="page-personal-table__title pd-x24 pd-y16 schedule-table__title schedule-table__title--fixed"
        slot="title"
      >
        <div class="title__left">
          <st-button @click="onClickSkipSchedule" type="primary">
            返回预约列表
          </st-button>
        </div>
        <div class="title__center">
          <date
            @today="getList"
            :start="$searchQuery.start_date"
            @pre="getList"
            @next="getList"
          />
        </div>
        <div class="title__right schedule-button">
          <st-button v-if="auth.addBatch" class="mg-r8" type="primary">
            <a
              v-modal-link="{
                name: 'schedule-personal-inbatch-add',
                props: { id: 1 }
              }"
            >
              设置{{ $c('coach') }}工作时间
            </a>
          </st-button>
          <st-button :disabled="isBatchDel">
            <a herf="javascript:;" @click="onClickDeleteInBatchSchedule">
              批量删除
            </a>
          </st-button>
        </div>
      </div>
      <div class="schedule-table__content  mg-r24 mg-l24">
        <st-table
          :columns="scheduleColumns"
          rowKey="staff_id"
          :alertSelection="{ onReset: onSelectionReset }"
          :rowSelection="{
            fixed: true,
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
          }"
          :page="false"
          @change="onTableChange"
          :dataSource="scheduleList"
        >
          <template slot="staff_name" slot-scope="text">
            {{ text }}
          </template>
          <template v-for="item in scheduleTime" :slot="item" slot-scope="text">
            <a-popover
              :key="item"
              v-if="text.timing.length"
              placement="rightTop"
            >
              <template slot="content">
                <template v-for="timingItem in text.timing">
                  <p :key="timingItem.start_time">
                    {{ timingItem.start_time }}~{{ timingItem.end_time }}
                  </p>
                </template>
              </template>
              <template slot="title">
                <span>排期</span>
              </template>
              {{ text.timing | timingFilter }}
            </a-popover>
            <span :key="item" v-else>{{ text.timing | timingFilter }}</span>
          </template>
          <div slot="action" slot-scope="text, record">
            <a
              class="mg-r8"
              v-modal-link="{
                name: 'schedule-personal-edit',
                props: { id: record.staff_id, start: scheduleTime[0] },
                on: {
                  success: onSuccess
                }
              }"
            >
              编辑
            </a>
            <a
              href="javascript:;"
              @click="onClickDeleteSchedule(record.schedule_info)"
            >
              删除
            </a>
          </div>
        </st-table>
      </div>
    </div>
  </st-panel>
</template>

<script>
import tableMixin from '@/mixins/table.mixin'
import { PersonalTableService } from './personal-table.service'
import { PersonalScheduleScheduleService } from './schedule/personal/service#/schedule.service'
import date from '@/views/biz-components/schedule/date#/date-component.vue'
import SchedulePersonalEdit from '@/views/biz-modals/schedule/personal/edit'
import SchedulePersonalInbatchAdd from '@/views/biz-modals/schedule/personal/inbatch-add'
export default {
  name: 'PersonalTable',
  mixins: [tableMixin],
  modals: {
    SchedulePersonalEdit,
    SchedulePersonalInbatchAdd
  },
  serviceInject() {
    return {
      tableService: PersonalTableService,
      scheduleService: PersonalScheduleScheduleService
    }
  },
  rxState() {
    return {
      auth: this.tableService.auth$,
      scheduleTime: this.tableService.scheduleTime$,
      scheduleColumns: this.tableService.scheduleColumns$,
      scheduleList: this.tableService.scheduleList$,
      formPage: this.tableService.formPage$
    }
  },
  computed: {
    isBatchDel() {
      return !this.selectedRowKeys.length
    }
  },
  filters: {
    getWeek(index) {
      const weekList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      return weekList[index]
    },
    timingFilter(val) {
      if (val.length) {
        return `${val[0].start_time} ~ ${val[0].end_time}`
      } else {
        return '--'
      }
    },
    getDate(date) {
      return moment(date)
        .format('MM/DD')
        .valueOf()
    }
  },
  data() {
    return {
      page: {},
      currentTime: '',
      selectedRowKeys: [],
      selectedRows: [],
      diffSelectedRows: []
    }
  },
  components: {
    date
  },
  methods: {
    onSuccess() {
      this.$router.reload()
    },
    // 返回列表
    onClickSkipSchedule() {
      this.$router.go(-1)
    },
    onClickDeleteSchedule(scheduleInfo) {
      this.$confirm({
        title: '提示',
        content: '确认删除？',
        onOk: () => {
          const ids = scheduleInfo
            .filter(item => {
              return item.id
            })
            .map(item => {
              return item.id
            })
          this.scheduleService.delInBatch(ids).subscribe(res => {
            this.$router.reload()
          })
        },
        onCancel() {}
      })
    },
    onClickDeleteInBatchSchedule() {
      let ids = []
      this.$confirm({
        title: '提示',
        content: '确认删除？',
        onOk: () => {
          this.selectedRows.forEach(item => {
            ids = [
              ...ids,
              ...item.schedule_info
                .filter(ele => {
                  return ele.id
                })
                .map(ele => {
                  return ele.id
                })
            ]
          })
          this.onSelectionReset()
          this.scheduleService.delInBatch(ids).subscribe(res => {
            this.$router.reload()
          })
        },
        onCancel() {}
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      if (selectedRows && selectedRows.length > 0) {
        const firstItem = selectedRows[0]
        this.diffSelectedRows = selectedRows.filter(
          item => item.card_type !== firstItem.card_type
        )
      }
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    getList(val = {}) {
      const query = {
        ...this.$searchQuery,
        start_date: val.start_date,
        end_date: val.end_date
      }
      this.$router.replace({ query })
    },
    onTableChange() {}
  }
}
</script>
