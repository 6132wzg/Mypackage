<template>
  <div :class="b('panne')">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <div :class="bHeader('button-wapper')">
          <st-button
            type="primary"
            v-if="auth.export"
            v-export-excel="{
              type: 'shop/team_coach/export',
              query: $searchQuery
            }"
          >
            全部导出
          </st-button>
        </div>
        <div :class="bHeader('actions')">
          <staff-select
            :query="{ identity: 3 }"
            :defaultLabel="`全部团课${$c('coach')}`"
            v-model="$searchQuery.staff_id"
            @change="onSingleSearch('staff_id', $event)"
          />
          <st-recent-radio-group
            disabledNow
            @change="onChangeTableDays"
            :value="value"
          ></st-recent-radio-group>
        </div>
      </header>
      <main :class="b('mian')">
        <st-total
          :class="b('total')"
          :indexs="totalColumns"
          :dataSource="total"
          hasTitle
        >
          <a
            slot="total_num"
            slot-scope="item"
            v-modal-link="{
              name: 'shop-stat-team-reserve-modal',
              props: {
                query: $searchQuery,
                title: '预约明细',
                type: 'shop-team-coach'
              }
            }"
          >
            <st-total-item
              :unit="item.unit"
              :label="item.label"
              :value="item.value"
            ></st-total-item>
          </a>
          <a
            slot="free_coach_num"
            slot-scope="item"
            v-modal-link="{
              name: 'shop-stat-free-coach-modal',
              props: {
                query: $searchQuery,
                title: '查看员工',
                type: 'shop-team-coach'
              }
            }"
          >
            <st-total-item
              :unit="item.unit"
              :label="item.label"
              :value="item.value"
            ></st-total-item>
          </a>
        </st-total>
        <st-table
          class="mg-t16"
          :loading="loading.getList"
          :columns="columns"
          :scroll="{ x: 1360 }"
          rowKey="staff_id"
          :page="page"
          @change="onTableChange"
          :dataSource="list"
        >
          <a
            slot="total_num"
            slot-scope="text, record"
            v-modal-link="{
              name: 'shop-stat-team-reserve-modal',
              props: {
                query: { ...$searchQuery, staff_id: record.staff_id },
                title: '预约明细',
                type: 'shop-team-coach'
              }
            }"
          >
            {{ text }}
          </a>
        </st-table>
      </main>
    </div>
  </div>
</template>
<script>
import shopSelect from '@/views/biz-components/shop/shop-select'
import StaffSelect from '@/views/biz-components/staff/staff-select'
import StTotal from '@/views/components/total#/total.vue'
import StTotalItem from '@/views/components/total#/total-item.vue'
import ShopStatFreeCoachModal from '@/views/biz-modals/stat/free-coach'
import ShopStatTeamReserveModal from '@/views/biz-modals/stat/team-reserve'

import { CoachService } from './coach.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './coach.config'
import moment from 'moment'
export default {
  name: 'ShopCoachTeamCourse',
  mixins: [tableMixin],
  serviceInject() {
    return {
      service: CoachService
    }
  },
  rxState() {
    const { list$, page$, total$, auth$, loading$ } = this.service
    return {
      list: list$,
      page: page$,
      total: total$,
      auth: auth$,
      loading: loading$
    }
  },
  modals: {
    ShopStatFreeCoachModal,
    ShopStatTeamReserveModal
  },
  bem: {
    b: 'page-shop-coach-team-course',
    bHeader: 'page-shop-stat-header'
  },
  watch: {},
  data() {
    return {}
  },
  created() {},
  computed: {
    columns,
    totalColumns,
    value() {
      let day = this.$searchQuery.start_date ? 0 : this.$searchQuery.day
      return {
        day,
        start_date: this.$searchQuery.start_date,
        end_date: this.$searchQuery.end_date
      }
    }
  },
  methods: {
    moment,
    onChangeTableDays(event) {
      this.$searchQuery.day = event.recently_day || undefined
      this.$searchQuery.start_date = event.start_date || undefined
      this.$searchQuery.end_date = event.end_date || undefined
      this.onSearch()
    }
  },
  components: {
    StTotal,
    StTotalItem,
    StaffSelect
  }
}
</script>
