<template>
  <div :class="b()">
    <st-table-header-section class="mg-b24" :class="b('nav')">
      <st-button
        @click="onAddReverse"
        type="primary"
        class="shop-member-list-button"
        icon="add"
      >
        到访预约
      </st-button>
      <div slot="actions">
        <st-range-picker
          class="value"
          @change="onSearchNative"
          v-model="date"
        />
      </div>
    </st-table-header-section>

    <st-table
      class="mg-t16"
      :columns="columns"
      rowKey="id"
      :page="page$"
      :loading="loading$.getList"
      @change="onTableChange"
      :dataSource="list$"
    >
      <span slot="reserve_type" slot-scope="text">{{ text.name }}</span>
      <span slot="member" slot-scope="text">{{ text.name }}</span>
      <span slot="reserve_status" slot-scope="text">{{ text.name }}</span>
      <div slot="action" slot-scope="text, record">
        <st-table-actions v-if="record.reserve_type.id === RESERVE_TYPE.COURSE">
          <a
            v-if="record.auth['shop:reserve:course_reserve|del']"
            @click="onClickCancel(record)"
          >
            取消
          </a>
          <a
            v-if="record.auth['shop:reserve:course_reserve|checkin']"
            @click="onClickCourseSign(record)"
          >
            签到
          </a>
          <a
            v-if="record.reserve_status.id === VISIT_STATUS.RESERVED"
            @click="onPrint(record.id)"
          >
            打印小票
          </a>
        </st-table-actions>
        <st-table-actions v-if="record.reserve_type.id === RESERVE_TYPE.VISIT">
          <a
            v-if="record.auth['shop:reserve:visit_reserve|del']"
            @click="onClickCancelVisitReserve(record)"
          >
            取消
          </a>
          <a
            v-if="record.auth['shop:reserve:visit_reserve|checkin']"
            @click="onClickconfirmVisitReserve(record)"
          >
            确认到访
          </a>
        </st-table-actions>
      </div>
    </st-table>
  </div>
</template>
<script>
import tableMixin from '@/mixins/table.mixin'
import { VisitService } from './visit.service'
import FrontAddReserve from '@/views/biz-modals/front/add-reserve'
import { columns } from './visit.config.ts'

import {
  VISIT_STATUS,
  COURSE_STATUS,
  RESERVE_TYPE
} from '@/constants/front/reserve'
export default {
  name: 'ReceptionReserve',
  mixins: [tableMixin],
  modals: {
    FrontAddReserve
  },
  bem: {
    b: 'page-shop-reception-reserve-visit'
  },
  serviceInject() {
    return {
      service: VisitService
    }
  },
  rxState() {
    const { loading$, page$, list$ } = this.service
    return {
      loading$,
      page$,
      list$
    }
  },
  data() {
    return {
      VISIT_STATUS,
      COURSE_STATUS,
      RESERVE_TYPE,
      date: []
    }
  },
  computed: {
    columns
  },
  methods: {
    onAddReverse() {
      this.$modalRouter.push({
        name: 'front-add-reserve',
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    onClickCancelVisitReserve(record) {
      this.service.cancelVisitReserve(record.id).subscribe(res => {
        this.$router.reload()
      })
    },
    onClickconfirmVisitReserve(record) {
      this.service.confirmVisitReserve(record.id).subscribe(res => {
        this.$router.reload()
      })
    },
    onSearchNative() {
      const start_time = this.date[0]
        ? `${this.date[0].format('YYYY-MM-DD')} 00:00`
        : ''
      const end_time = this.date[1]
        ? `${this.date[1].format('YYYY-MM-DD')} 23:59`
        : ''
      this.$searchQuery.start_time = start_time
      this.$searchQuery.end_time = end_time
      this.onSearch()
    },
    init() {
      const start = this.$searchQuery.start_time
        ? moment(this.$searchQuery.start_time)
        : null
      const end = this.$searchQuery.end_time
        ? moment(this.$searchQuery.end_time)
        : null
      this.$set(this, 'date', [start, end])
      console.log(this.date)
    },
    onReset() {
      this.$set(this, 'date', [moment(), moment()])
      this.onSearchReset()
    },
    onPrint(id) {
      window.open('/ticket/print?id=' + id, '_blank', 'width=800,height=600')
    }
  },
  created() {
    this.init()
  }
}
</script>
