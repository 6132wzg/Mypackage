<template>
  <div :class="b('panne')">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <div :class="bHeader('button-wapper')">
          <st-button
            type="primary"
            v-if="auth.export"
            v-export-excel="{
              type: 'brand/personal_coach/export',
              query: $searchQuery
            }"
          >
            全部导出
          </st-button>
        </div>
        <div :class="bHeader('actions')">
          <shop-select
            v-model="$searchQuery.shop_id"
            @change="onSingleSearch('shop_id', $event)"
          />
          <staff-select
            :query="{ identity: 4, shop_id: $searchQuery.shop_id }"
            :defaultLabel="`全部私教${$c('coach')}`"
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
            slot="effective_reserve_num"
            slot-scope="item"
            v-modal-link="{
              name: 'brand-stat-personal-reserve-modal',
              props: {
                query: $searchQuery,
                title: '预约明细',
                type: 'brand-personal-coach'
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
              name: 'brand-stat-free-coach-modal',
              props: {
                query: $searchQuery,
                title: '查看员工',
                type: 'brand-personal-coach'
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
          :scroll="{ x: 1200 }"
          rowKey="staff_id"
          :page="page"
          @change="onTableChange"
          :dataSource="list"
        >
          <a
            slot="effective_reserve_num"
            slot-scope="text, record"
            v-modal-link="{
              name: 'brand-stat-personal-reserve-modal',
              props: {
                query: { ...$searchQuery, staff_id: record.staff_id },
                title: '预约明细',
                type: 'brand-personal-coach'
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
import BrandStatFreeCoachModal from '@/views/biz-modals/stat/free-coach'
import BrandStatPersonalReserveModal from '@/views/biz-modals/stat/personal-reserve'

import { CoachService } from './coach.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './coach.config'
import moment from 'moment'
export default {
  name: 'BrandCoachPersonalCourse',
  mixins: [tableMixin],
  serviceInject() {
    return {
      service: CoachService
    }
  },
  rxState() {
    const { list$, page$, total$, auth$, loading$, consumeType$ } = this.service
    return {
      list: list$,
      page: page$,
      total: total$,
      auth: auth$,
      consumeType: consumeType$,
      loading: loading$
    }
  },
  modals: {
    BrandStatFreeCoachModal,
    BrandStatPersonalReserveModal
  },
  bem: {
    b: 'page-brand-coach-personal-course',
    bHeader: 'page-brand-stat-header'
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
    shopSelect,
    StTotal,
    StTotalItem,
    StaffSelect
  }
}
</script>
