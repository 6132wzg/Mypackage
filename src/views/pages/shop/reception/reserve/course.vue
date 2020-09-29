<template>
  <div :class="b()">
    <st-table-header-section class="mg-b16" :class="b('nav')">
      <st-button
        type="primary"
        v-if="auth.export"
        v-export-excel="{
          type: 'reserve',
          query: reserveQuery
        }"
        class="mg-r8"
      >
        全部导出
      </st-button>
      <div :class="b('actions')" slot="actions">
        <recent-radio-group
          _day="search_date"
          _start_date="start_time"
          _end_date="end_time"
          :showBtnRangeDate="false"
          :defaultRecent="1"
          :disabledDate="disabledDate"
          :days="customRadioDays"
          @change="recentChange"
        ></recent-radio-group>
      </div>
      <!-- 课程类型 -->
      <a-select
        class="mg-r8"
        v-model="$searchQuery.course_type"
        :options="courseTypeOptions"
        style="width: 140px"
        @change="onSearch"
      ></a-select>
      <!-- 预约状态 -->
      <a-select
        class="mg-r8"
        v-model="$searchQuery.reserve_status"
        :options="reserveStatusOptions"
        style="width: 140px"
        @change="onSearch"
      ></a-select>
      <!-- 签到状态 -->
      <a-select
        class="mg-r8"
        v-model="$searchQuery.is_checkin"
        :options="checkinOptions"
        style="width: 140px"
        @change="onSearch"
      ></a-select>
    </st-table-header-section>
    <div :class="b('table')">
      <st-table
        :page="page"
        @change="onTableChange"
        :loading="loading.getList"
        :columns="mainColumns"
        :dataSource="list"
        :stripe="false"
        rowKey="id"
      >
        <template slot="sub_reserve_type" slot-scope="record">
          {{ record.name }}
        </template>
        <template slot="remark" slot-scope="record">
          <st-overflow-text
            :value="record.remark"
            maxWidth="200px"
            placement="bottomLeft"
            needOverflowTextContainer
          ></st-overflow-text>
        </template>
        <st-table
          class="reserve-course-child-table"
          slot="expandedRowRender"
          slot-scope="record, index"
          :columns="childColumns"
          :dataSource="record.list"
          :pagination="false"
          rowKey="id"
        >
          <span slot="member" slot-scope="record">{{ record.name }}</span>
          <template slot="reserve_status" slot-scope="record">
            {{ record.name }}
          </template>
          <template slot="is_checkin" slot-scope="record">
            {{ record.name }}
          </template>
          <template slot="checkin_method" slot-scope="record">
            {{ record.name }}
          </template>
          <div slot="action" slot-scope="text, record">
            <st-table-actions>
              <a
                v-if="record.auth['shop:reserve:course_reserve|del']"
                @click="cancelBooking(record, index)"
              >
                取消预约
              </a>
              <a
                v-if="record.auth['shop:reserve:course_reserve|checkin']"
                @click="booking(record, index)"
              >
                签到
              </a>
              <a
                @click="onPrint(record.id)"
                v-if="
                  record.reserve_status.id === 1 && record.is_checkin.id === 1
                "
              >
                打印小票
              </a>
            </st-table-actions>
          </div>
        </st-table>
      </st-table>
    </div>
  </div>
</template>

<script>
import tableMixin from '@/mixins/table.mixin'
import { mainColumns, childColumns } from './course.config'
import { CourseService } from './course.service'
import RecentRadioGroup from '@/views/components/recent-radio-group/recent-radio-group'
import moment from 'moment'

export default {
  name: '',

  bem: {
    b: 'shop-reception-reserve-course'
  },

  components: { RecentRadioGroup },

  modals: {},

  serviceInject() {
    return {
      courseService: CourseService
    }
  },

  rxState() {
    const { courseService } = this
    return {
      list: courseService.list$,
      page: courseService.page$,
      loading: courseService.loading$,
      auth: courseService.auth$,
      courseTypeOptions: courseService.courseTypeOptions$,
      reserveStatusOptions: courseService.reserveStatusOptions$,
      checkinOptions: courseService.checkinOptions$
    }
  },

  mixins: [tableMixin],

  props: {},

  data() {
    return {
      reserveQuery: {
        end_time: '',
        search_date: 1,
        start_time: ''
      },
      customRadioDays: [
        {
          value: 1,
          label: '今日'
        },
        {
          value: 2,
          label: '昨日'
        },
        {
          value: 3,
          label: '明日'
        }
      ]
    }
  },

  computed: {
    mainColumns,
    childColumns
  },

  mounted() {},

  methods: {
    moment,
    recentChange(data) {
      const start_time = data.start_date ? `${data.start_date} 00:00` : ''
      const end_time = data.end_date ? `${data.end_date} 23:59` : ''
      let recently_day = data.recently_day
      this.$searchQuery.search_date = recently_day || undefined
      this.$searchQuery.start_time = start_time || undefined
      this.$searchQuery.end_time = end_time || undefined
      if (this.$searchQuery.start_time || this.$searchQuery.end_time) {
        this.$searchQuery.search_date = undefined
        recently_day = undefined
      }
      this.reserveQuery = {
        start_time: start_time,
        end_time: end_time,
        search_date: recently_day
      }
      this.onMultiSearch(this.reserveQuery)
    },
    getCourseForm(record, index) {
      const { id, member } = record
      let reserve_type = this.list[index].sub_reserve_type
      return {
        id: member.id,
        reserve_type: reserve_type.id,
        reserve_id: id
      }
    },
    // 取消签到
    cancelBooking(record, index) {
      let params = this.getCourseForm(record, index)
      this.courseService.cancelVisitReserve(params).subscribe(res => {
        this.$router.reload()
      })
    },
    // 签到
    booking(record, index) {
      let params = this.getCourseForm(record, index)
      this.courseService.confirmVisitReserve(params).subscribe(res => {
        this.$router.reload()
      })
    },
    onPrint(id) {
      window.open('/ticket/print?id=' + id, '_blank', 'width=800,height=600')
    },
    onSearch() {
      this.$router.push({ query: this.$searchQuery })
    },
    disabledDate(current) {
      return current && current > moment().add(6, 'months')
    }
  }
}
</script>

<style lang="less" scoped></style>
