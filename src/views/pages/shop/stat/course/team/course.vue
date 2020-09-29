<template>
  <div :class="b('panne')">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <div :class="bHeader('button-wapper')">
          <st-button
            type="primary"
            v-if="auth.export"
            v-export-excel="{
              type: 'shop/team_course/export',
              query: $searchQuery
            }"
          >
            全部导出
          </st-button>
        </div>
        <div :class="bHeader('actions')">
          <st-select
            :options="categoryList"
            :defaultLabel="'全部课程类型'"
            v-model="$searchQuery.category_id"
            @change="onSingleSearch('category_id', $event)"
          ></st-select>
          <st-select-scroll
            style="width: 150px"
            _label="course_name"
            _value="id"
            defaultLabel="全部团课课程"
            showArrow
            v-model="$searchQuery.course_id"
            :showSearch="false"
            :query="{
              category_id: $searchQuery.category_id
            }"
            :options="courseList"
            :page="courseListPage"
            @change="onSingleSearch('course_id', $event)"
            @refresh="onStaffSelectRefresh(true, $event)"
            @search="onStaffSelectRefresh(true, $event)"
            @scroll="onStaffSelectRefresh(false, $event)"
          ></st-select-scroll>
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
                type: 'shop-team-course'
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
          :scroll="{ x: 1400 }"
          :rowKey="(record, idx) => idx"
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
                query: { ...$searchQuery, course_id: record.course_id },
                title: '预约明细',
                type: 'shop-team-course'
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

import { CourseService } from './course.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './course.config'
import moment from 'moment'

export default {
  name: 'BrandCoachTeamCourse',
  mixins: [tableMixin],
  serviceInject() {
    return {
      service: CourseService
    }
  },
  rxState() {
    const {
      list$,
      page$,
      total$,
      auth$,
      loading$,
      productType$,
      categoryList$,
      courseListPage$,
      courseList$
    } = this.service
    return {
      list: list$,
      page: page$,
      total: total$,
      auth: auth$,
      courseList: courseList$,
      categoryList: categoryList$,
      courseListPage: courseListPage$,
      productType: productType$,
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
  watch: {
    courseList: {
      deep: true,
      handler() {
        // FIXME: 当课程选择的是第一页之后的数据，回显时找不到对应id的数据，所以将id重置为-1
        !this.courseList.find(
          item => item.id === this.$searchQuery.course_id
        ) &&
          this.$searchQuery.course_id !== -1 &&
          this.$router.push({
            query: {
              ...this.finalSearchQuery,
              course_id: -1
            }
          })
      }
    }
  },
  data() {
    return {
      columns,
      totalColumns,
      coursePage: {
        current_page: 1,
        size: 20
      }
    }
  },
  created() {
    this.service.getCategoryList().subscribe()
    this.service
      .getCourseList(
        {
          type: 1,
          category_id: this.$searchQuery.category_id,
          ...this.coursePage
        },
        true
      )
      .subscribe()
  },
  computed: {
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
    },
    onStaffSelectRefresh(isreload = false, query = {}) {
      console.log('isReload', isreload)
      this.coursePage.current_page = isreload
        ? 1
        : this.coursePage.current_page + 1
      return this.service
        .getCourseList(
          {
            type: 1,
            ...query,
            category_id: this.$searchQuery.category_id,
            ...this.coursePage
          },
          isreload
        )
        .subscribe()
    }
  },
  components: {
    StTotal,
    StTotalItem
  }
}
</script>
