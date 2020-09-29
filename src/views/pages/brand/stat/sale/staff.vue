<template>
  <div :class="b()">
    <div :class="b('section')">
      <header :class="bHeader('header')">
        <div :class="bHeader('button-wapper')">
          <st-button
            type="primary"
            v-if="auth.export"
            v-export-excel="{
              type: 'sales/brand/export',
              query: $searchQuery
            }"
          >
            全部导出
          </st-button>
        </div>
        <div :class="bHeader('actions')">
          <st-select
            width="100px"
            :options="contractType"
            :defaultLabel="'全部类型'"
            v-model="$searchQuery.contract_type"
            @change="onSingleSearch('contract_type', $event)"
          ></st-select>
          <shop-select
            width="100px"
            v-model="$searchQuery.shop_id"
            @change="onSingleSearch('shop_id', $event)"
          />
          <a-cascader
            style="width: 120px"
            :allowClear="false"
            placeholder="请选择部门"
            :options="departmentList"
            change-on-select
            v-model="departmentId"
            @change="onCascaderChange"
          />
          <st-select
            show-search
            width="100px"
            :options="staffList"
            :defaultLabel="'全部员工'"
            :query="{
              shop_id: $searchQuery.shop_id,
              department_id: this.$searchQuery.section_id
            }"
            v-model="$searchQuery.staff_id"
            option-filter-prop="children"
            :filter-option="true"
            @change="onSingleSearch('staff_id', $event)"
            @refresh="onStaffSelectRefresh"
          ></st-select>
          <st-recent-radio-group
            @change="onChangeDataDays"
            :value="$searchQuery"
          ></st-recent-radio-group>
          <st-refresh-btn
            :updateTime="updateTime"
            :action="refresh"
          ></st-refresh-btn>
        </div>
      </header>
      <st-total
        :class="b('total')"
        :indexs="totalColumns"
        :dataSource="total"
        hasTitle
      ></st-total>
      <st-table
        :loading="loading.getList"
        :columns="columns"
        class="mg-t16"
        :class="!list.length && b('table-nodata')"
        rowKey="staff_id"
        :expandedRowKeys="expendKeys"
        :page="page"
        @change="onTableChange"
        @expand="expandChange"
        :dataSource="list"
        :stripe="false"
      >
        <div slot="expandedRowRender" slot-scope="record">
          <st-table
            :columns="childColumns"
            :rowKey="(record, idx) => idx"
            :query="{ staff_id: record.staff_id }"
            :page="childListMap[record.staff_id].page"
            :pagination="{ simple: true, hideOnSinglePage: true }"
            :dataSource="childListMap[record.staff_id].list"
            :loading="
              activeTableKey === record.staff_id && loading.getDetailList
            "
            @change="onChildTableChange"
            :stripe="false"
          >
            <span slot="pay_date" slot-scope="text">
              {{ moment(text).format('YYYY-MM-DD') }}
            </span>
          </st-table>
        </div>
      </st-table>
    </div>
  </div>
</template>

<script>
import shopSelect from '@/views/biz-components/shop/shop-select'
import StaffSelect from '@/views/biz-components/staff/staff-select'
import StTotal from '@/views/components/total#/total.vue'

import { StaffService } from './staff.service'
import tableMixin from '@/mixins/table.mixin'
import {
  columns,
  totalColumns,
  childColumns,
  countDesc,
  contractTypes
} from './staff.config'
import moment from 'moment'

export default {
  name: 'BrandStatSaleStaff',
  mixins: [tableMixin],
  serviceInject() {
    return {
      staffService: StaffService
    }
  },
  rxState() {
    const {
      list$,
      childListMap$,
      expendKeys$,
      page$,
      total$,
      auth$,
      contractType$,
      departmentList$,
      staffList$,
      updateTime$,
      loading$
    } = this.staffService
    return {
      list: list$,
      childListMap: childListMap$,
      expendKeys: expendKeys$,
      page: page$,
      total: total$,
      auth: auth$,
      contractType: contractType$,
      departmentList: departmentList$,
      staffList: staffList$,
      updateTime: updateTime$,
      loading: loading$
    }
  },
  bem: {
    b: 'page-brand-stat-sale-staff',
    bHeader: 'page-brand-stat-header'
  },
  data() {
    return {
      chartTodayShop: -1,
      departmentId: [-1],
      activeTableKey: null
    }
  },
  watch: {
    departmentList: {
      deep: true,
      handler() {
        const getKeyArr = (list, id) => {
          if (!list || !list.length) return []
          let arr = []
          list.map(item => {
            if (item.value === id) {
              return arr.push(item.value)
            }
            let childArr = getKeyArr(item.children, id)
            if (childArr.length) arr = [item.value, ...childArr]
          })
          return arr
        }
        let ids = getKeyArr(this.departmentList, this.$searchQuery.section_id)
        this.departmentId = ids.length ? ids : [-1]
      }
    }
  },
  computed: {
    columns,
    childColumns,
    totalColumns
  },

  created() {
    this.staffService.getDepartmentList().subscribe()
    this.staffService
      .getStaffList({
        shop_id: this.$searchQuery.shop_id,
        department_id: this.$searchQuery.section_id
      })
      .subscribe()
  },

  methods: {
    moment,
    onCascaderChange(val) {
      this.$searchQuery.section_id = val.length ? val[val.length - 1] : [-1]
      this.onSearch()
    },
    onChangeDataDays(event) {
      this.$searchQuery.day = event.recently_day || undefined
      this.$searchQuery.start_date = event.start_date || undefined
      this.$searchQuery.end_date = event.end_date || undefined
      this.onSearch()
    },
    refresh() {
      return this.staffService.getDataRefresh()
    },
    onStaffSelectRefresh(query) {
      this.staffService.getStaffList(query).subscribe()
    },
    onChildTableChange(pagination, ...ret) {
      this.onChildrenTableChange(pagination, ...ret).then(query => {
        console.log('子列表页面切换 请求参数', {
          ...this.finalSearchQuery,
          ...query
        })
        this.activeTableKey = query.staff_id
        this.staffService
          .getDetailList({
            ...this.finalSearchQuery,
            ...query
          })
          .subscribe()
      })
    },
    expandChange(isExpend, record) {
      if (isExpend) {
        this.staffService.ADD_EXPENDKEY(record.staff_id.toString())
        this.activeTableKey = record.staff_id
        this.staffService
          .getDetailList({
            ...this.finalSearchQuery,
            staff_id: record.staff_id,
            current_page: 1,
            size: 10
          })
          .subscribe()
      } else {
        this.staffService.DEL_EXPENDKEY(record.staff_id.toString())
        this.staffService.RESET_CHILDITEM(record.staff_id.toString())
      }
    }
  },
  components: {
    shopSelect,
    StTotal
  }
}
</script>
