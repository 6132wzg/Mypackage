<template>
  <div :class="module()">
    <portal to="BRAND_MARKETING_SHI">
      <staff-select
        style="width: 260px"
        type="brand"
        placeholder="搜索员工姓名、手机号"
        @change="onSingleSearch('staff_id', $event)"
      ></staff-select>
    </portal>
    <!-- 员工考勤表格 -->
    <div :class="module('main')">
      <div :class="module('main-title')">
        <div :class="module('main-btn')">
          <st-button
            v-if="auth['authMend']"
            type="primary"
            v-modal-link="{
              name: 'brand-attendance-card-replacement',
              props: { source: '1' },
              on: { success: getListHandle }
            }"
          >
            补卡
          </st-button>
          <st-button
            v-if="auth['authExport']"
            v-export-excel="{
              type: 'applications/staff-attendance/export',
              query: $searchQuery
            }"
          >
            导出明细
          </st-button>
        </div>
        <st-recent-radio-group
          :showBtnRangeDate="false"
          :range="360"
          :days="redioDays"
          :value="{ day: $searchQuery.date_symbol }"
          @change="recentChangeHandle"
        ></st-recent-radio-group>
        <shop-select
          width="160px"
          v-model="$searchQuery.shop_id"
          @change="onSingleSearch('shop_id', $event)"
          class="mg-x8"
        />
        <a-cascader
          style="width: 160px"
          :allowClear="false"
          placeholder="请选择部门"
          :options="departmentList"
          change-on-select
          v-model="departmentId"
          @change="onCascaderChange"
        />
      </div>
    </div>
    <st-total
      :indexs="attendanceInfo"
      :dataSource="summaryList"
      hasTitle
      class="mg-b16"
    ></st-total>
    <st-table
      :loading="loading.getAttendanceListHandle"
      :columns="columns"
      :scroll="{ x: 1440 }"
      class="mg-t16"
      rowKey="product_type"
      :page="page"
      @change="onTableChange"
      :dataSource="tableList"
    >
      <template slot="is_shop_range" slot-scope="text, record">
        <span v-if="record.shops && record.shops.length === 1">
          {{ record.shops[0].shop_name }}
        </span>
        <span
          v-else-if="record.shops && record.shops.length > 1"
          class="select-color"
        >
          <div class="select-color popover-shops">
            <a-popover
              placement="bottom"
              :getPopupContainer="
                triggerNode => {
                  return triggerNode.parentNode || document.body
                }
              "
            >
              <template slot="content">
                <div :class="module('popover-shops')">
                  <div :class="module('popover-shops-title')">全门店</div>
                  <div :class="module('popover-shops-table')">
                    <st-table
                      :columns="shopList"
                      :scroll="{ x: 532 }"
                      :pagination="false"
                      :dataSource="record.shops"
                    ></st-table>
                  </div>
                </div>
              </template>
              共有{{ record.shops.length }}家门店
            </a-popover>
          </div>
        </span>
        <span v-else>
          --
        </span>
      </template>

      <template slot="department" slot-scope="text, record">
        <span v-if="record.department">{{ record.department }}</span>
        <span v-else>--</span>
      </template>
      <template slot="in_time" slot-scope="text, record">
        <span v-if="record.in_type == '2'" class="select-color popover-time">
          <a-popover
            placement="left"
            :getPopupContainer="
              triggerNode => {
                return triggerNode.parentNode || document.body
              }
            "
          >
            <template slot="content">
              <a-row
                :style="{
                  width: record.in_time.includes('次日') ? '206px' : ''
                }"
              >
                <a-col :span="4">
                  时间
                </a-col>
                <a-col :span="18" :offset="2">
                  {{ record.date + ' ' + record.in_time }}
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="4">
                  位置
                </a-col>
                <a-col :span="18" :offset="2">
                  {{ record.in_shop_address }}
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="4">
                  备注
                </a-col>
                <a-col :span="18" :offset="2">
                  <img :src="record.in_photo" width="80px" height="80px" />
                </a-col>
              </a-row>
            </template>
            {{ record.in_time }}
            <div>({{ cardType[record.in_type] }})</div>
          </a-popover>
        </span>
        <span v-else>
          {{ record.in_time }}
          <div v-if="record.in_type == '1'">
            ({{ cardType[record.in_type] }})
          </div>
        </span>
      </template>
      <template slot="out_time" slot-scope="text, record">
        <span v-if="record.out_type == '2'" class="select-color popover-time">
          <a-popover
            placement="left"
            :getPopupContainer="
              triggerNode => {
                return triggerNode.parentNode || document.body
              }
            "
          >
            <template slot="content">
              <a-row
                :style="{
                  width: record.out_time.includes('次日') ? '206px' : ''
                }"
              >
                <a-col :span="4">
                  时间
                </a-col>
                <a-col :span="18" :offset="2">
                  {{ record.date + ' ' + record.out_time }}
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="4">
                  位置
                </a-col>
                <a-col :span="18" :offset="2">
                  {{ record.out_shop_address }}
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="4">
                  备注
                </a-col>
                <a-col :span="18" :offset="2">
                  <img :src="record.out_photo" width="80px" height="80px" />
                </a-col>
              </a-row>
            </template>
            {{ record.out_time }}
            <div>({{ cardType[record.out_type] }})</div>
          </a-popover>
        </span>
        <span v-else>
          {{ record.out_time }}
          <div v-if="record.out_type == '1'">
            ({{ cardType[record.out_type] }})
          </div>
        </span>
      </template>
      <template slot="remark" slot-scope="text, record">
        <span v-if="record.remark">{{ record.remark }}</span>
        <span v-else>--</span>
      </template>
      <template slot="action" slot-scope="text, record">
        <span
          class="select-color"
          v-modal-link="{
            name: 'brand-attendance-card-replacement',
            props: { source: '2', record: record },
            on: { success: getListHandle }
          }"
          v-if="record.auth['brand:application:staff_attendance|mend']"
        >
          补卡
        </span>
        <span v-else>--</span>
      </template>
    </st-table>
  </div>
</template>

<script>
import { attendanceInfo, columns, shopList } from './list.config'
import shopSelect from '@/views/biz-components/shop/shop-select'
import { ListService } from './list.service'
import StaffSelect from '@/views/biz-components/staff-select/staff-select'
import tableMixin from '@/mixins/table.mixin'
import StTotal from '@/views/components/total#/total.vue'
import BrandAttendanceCardReplacement from '@/views/biz-modals/brand/app/attendance/card-replacement'
export default {
  name: 'brand-app-attendance-list',
  mixins: [tableMixin],
  bem: {
    module: 'brand-app-attendance-list'
  },
  modals: {
    BrandAttendanceCardReplacement
  },
  serviceInject() {
    return {
      listService: ListService
    }
  },
  rxState() {
    return {
      auth: this.listService.auth$,
      summaryList: this.listService.summaryList$,
      loading: this.listService.loading$,
      tableList: this.listService.tableList$,
      page: this.listService.page$,
      departmentList: this.listService.departmentList$,
      cardType: this.listService.cardType$
    }
  },
  components: {
    shopSelect,
    StTotal,
    StaffSelect
  },
  props: {},
  data() {
    return {
      departmentId: [-1],
      start_date: '',
      end_date: '',
      redioDays: [
        {
          label: '今日',
          value: 'today'
        },
        {
          label: '本周',
          value: 'week'
        },
        {
          label: '本月',
          value: 'month'
        }
      ]
    }
  },
  created() {
    this.listService.getDepartmentList().subscribe()
    this.getListHandle()
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
        let ids = getKeyArr(
          this.departmentList,
          this.$searchQuery.department_id
        )
        console.log(333444, ids)
        this.departmentId = ids.length ? ids : [-1]
      }
    }
  },
  methods: {
    getListHandle() {
      this.listService.getAttendanceListHandle(this.$searchQuery).subscribe()
    },
    recentChangeHandle(event) {
      this.onMultiSearch({
        date_symbol: event.recently_day || '',
        date_start: event.start_date || '',
        date_end: event.end_date || ''
      })
    },
    onCascaderChange(val) {
      console.log(333, val)
      this.$searchQuery.department_id = val.length ? val[val.length - 1] : [-1]
      this.onSearch()
    }
  },
  computed: {
    columns,
    shopList,
    attendanceInfo
  }
}
</script>

<style lang="less" scoped></style>
