<template>
  <div :class="b()">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <div :class="bHeader('button-wapper')">
          <st-button
            type="primary"
            v-if="auth.export"
            v-export-excel="{
              type: 'shop/personal-course/export',
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
            _keyword="course_name"
            defaultLabel="全部私教课程"
            v-model="$searchQuery.course_id"
            showArrow
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
          <st-refresh-btn
            :updateTime="updateTime"
            :action="refresh"
          ></st-refresh-btn>
        </div>
      </header>
      <main :class="b('mian')">
        <st-total
          :class="b('total')"
          :indexs="totalColumns"
          :dataSource="total"
          hasTitle
        ></st-total>
        <st-table
          class="mg-t16"
          :class="!list.length && b('table-nodata')"
          :loading="loading.getList"
          :columns="columns"
          rowKey="course_id"
          :dataSource="list"
          :page="page"
          :expandedRowKeys="expendKeys"
          @change="onTableChange"
          @expand="expandChange"
        >
          <div slot="expandedRowRender" slot-scope="record">
            <st-table
              :columns="childColumns"
              :rowKey="(record, idx) => idx"
              :query="{ course_id: record.course_id }"
              :page="childListMap[record.course_id].page"
              :pagination="{ simple: true, hideOnSinglePage: true }"
              :dataSource="childListMap[record.course_id].list"
              :loading="
                activeTableKey === record.course_id && loading.getDetailList
              "
              @change="onChildTableChange"
              :stripe="false"
            >
              <span slot="valid_date" slot-scope="text">
                {{ moment(text).format('YYYY-MM-DD hh:mm:ss') }}
              </span>
              <span slot="buy_date" slot-scope="text">
                {{ moment(text).format('YYYY-MM-DD hh:mm:ss') }}
              </span>
              <template slot="coach_map" slot-scope="text">
                <span v-if="text.total <= 1 || text.list <= 1">
                  {{ (text.list[0] && text.list[0].coach_name) || '--' }}
                </span>
                <a-popover v-else placement="top" trigger="click">
                  <template slot="content">
                    <div style="max-width: 250px">
                      {{ text.list.map(item => item.coach_name).join('、') }}
                    </div>
                  </template>
                  <template slot="title">
                    <span>上课{{ $c('coach') }}</span>
                  </template>
                  <a>共 {{ text.total }} 人</a>
                </a-popover>
              </template>
            </st-table>
          </div>
        </st-table>
      </main>
    </div>
  </div>
</template>
<script>
import shopSelect from '@/views/biz-components/shop/shop-select'
import StTotal from '@/views/components/total#/total.vue'

import { StockService } from './stock.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, childColumns, totalColumns } from './stock.config'
import moment from 'moment'
export default {
  name: 'ShopStockPersonalCourse',
  mixins: [tableMixin],
  serviceInject() {
    return {
      service: StockService
    }
  },
  rxState() {
    const {
      list$,
      childListMap$,
      page$,
      total$,
      expendKeys$,
      auth$,
      categoryList$,
      courseList$,
      courseListPage$,
      updateTime$,
      loading$
    } = this.service
    return {
      list: list$,
      childListMap: childListMap$,
      page: page$,
      total: total$,
      expendKeys: expendKeys$,
      categoryList: categoryList$,
      courseList: courseList$,
      courseListPage: courseListPage$,
      updateTime: updateTime$,
      auth: auth$,
      loading: loading$
    }
  },
  bem: {
    b: 'page-shop-stock-personal-course',
    bHeader: 'page-brand-stat-header'
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
      activeTableKey: null,
      coursePage: {
        current_page: 1,
        size: 20
      }
    }
  },
  created() {
    this.service
      .getCourseList(
        {
          type: 2,
          category_id: this.$searchQuery.category_id,
          ...this.coursePage
        },
        true
      )
      .subscribe()
    this.service.getCategoryList().subscribe()
  },
  computed: {
    columns,
    childColumns,
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
    refresh() {
      return this.service.getDataRefresh()
    },
    onChildTableChange(pagination, ...ret) {
      this.onChildrenTableChange(pagination, ...ret).then(query => {
        console.log('子列表页面切换 请求参数', {
          ...this.finalSearchQuery,
          ...query
        })
        this.activeTableKey = query.course_id
        this.service
          .getDetailList({
            ...this.finalSearchQuery,
            ...query
          })
          .subscribe()
      })
    },
    expandChange(isExpend, record) {
      if (isExpend) {
        this.service.ADD_EXPENDKEY(record.course_id.toString())
        this.activeTableKey = record.course_id
        this.service
          .getDetailList({
            ...this.finalSearchQuery,
            course_id: record.course_id,
            current_page: 1,
            size: 10
          })
          .subscribe()
      } else {
        this.service.DEL_EXPENDKEY(record.course_id.toString())
        this.service.RESET_CHILDITEM(record.course_id.toString())
      }
    },
    onStaffSelectRefresh(isreload = false, query = {}) {
      this.coursePage.current_page = isreload
        ? 1
        : this.coursePage.current_page + 1
      return this.service
        .getCourseList(
          {
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
    StTotal
  }
}
</script>
