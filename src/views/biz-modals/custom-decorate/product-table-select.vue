<template>
  <st-modal
    :title="title"
    v-model="show"
    @ok="onSubmit"
    @cancel="onCancel"
    style="width: 676px"
  >
    <div :class="b()">
      <div :class="b('header')">
        <div :class="b('header-warn')" v-if="selectedRowKeys.length > max">
          最多选择{{ max }}项
        </div>
        <div :class="b('header-select')" v-else>
          已选{{ selectedRowKeys.length }}项
        </div>
        <div :class="b('header-filter')">
          <!-- 私教课, 小团课, 团课 -->
          <a-select
            class="mg-r16"
            style="width: 145px"
            @change="handleOnChangeCourseType"
            v-model="courseType"
            v-if="module_type === MODULE_TYPES.RECOMMEND_COURSE"
          >
            <a-select-option :value="1">团课</a-select-option>
            <a-select-option :value="2">私教课</a-select-option>
            <a-select-option :value="3">小班课</a-select-option>
          </a-select>
          <!-- 课程包 -->
          <a-select
            class="mg-r16"
            style="width: 145px"
            @change="handleOnChangeOption"
            v-model="filterOption"
            v-if="module_type === MODULE_TYPES.RECOMMEND_PACKAGE"
          >
            <a-select-option :value="-1">全部课程包</a-select-option>
            <a-select-option
              v-for="item in package_type"
              :value="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <!-- 教练等级 -->
          <a-select
            class="mg-r16"
            style="width: 145px"
            @change="handleOnChangeOption"
            v-model="filterOption"
            v-if="module_type === MODULE_TYPES.COACH"
          >
            <a-select-option :value="-1">全部教练</a-select-option>
            <a-select-option
              v-for="item in cocach_type"
              :value="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <!-- 卡项类型 -->
          <a-select
            class="mg-r16"
            style="width: 145px"
            @change="handleOnChangeOption"
            v-model="filterOption"
            v-if="module_type === MODULE_TYPES.RECOMMEND_CARD"
          >
            <a-select-option
              v-for="item in card_type"
              :value="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <!-- 优惠券 -->
          <a-select
            class="mg-r16"
            style="width: 145px"
            @change="handleOnChangeOption"
            v-model="filterOption"
            v-if="module_type === MODULE_TYPES.COUPON"
          >
            <a-select-option :value="-1">全部优惠券</a-select-option>
            <a-select-option
              v-for="item in coupon_type"
              :value="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <st-input-search
            style="width: 240px"
            :class="b('search')"
            v-model="keywords"
            @search="handleOnSearch"
            placeholder="搜索"
          ></st-input-search>
        </div>
      </div>
      <div :class="b('body')">
        <st-table
          :rowKey="computedRowKey"
          :loading="fnLoading"
          :dataSource="list"
          :columns="columns"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
          }"
          :scroll="{ x: 700 }"
          @change="onPageChange"
          :simplePage="true"
          :page="page"
        >
          <template slot="identity" slot-scope="text, record">
            <template v-for="item in record.identity">
              <span :key="item.id" class="mg-r8">{{ item.name }}</span>
            </template>
          </template>
          <template slot="card_type" slot-scope="text">
            {{ text | enumFilter('mina_setting.card_type') }}
          </template>
          <template slot="package_type" slot-scope="text">
            {{ text | enumFilter('package_course.package_type') }}
          </template>
          <template slot="coupon_status" slot-scope="text, record">
            {{ record.coupon_status | enumFilter('coupon.coupon_status') }}
          </template>
          <template slot="put_status" slot-scope="text, record">
            {{ record.put_status | enumFilter('coupon.put_status') }}
          </template>
          <template slot="activity_time" slot-scope="text, record">
            {{ record.activity_start_time }}~{{ record.activity_end_time }}
          </template>
          <template slot="signup_activity_time" slot-scope="text, record">
            {{ record.start_time }}~{{ record.end_time }}
          </template>
          <template slot="groupbuy_activity_status" slot-scope="text, record">
            {{ record.activity_state.name }}
          </template>
          <template slot="class_status" slot-scope="text, record">
            {{ record.class_status | enumFilter('small_course.class_status') }}
          </template>
          <template slot="small_course_type" slot-scope="text, record">
            {{
              record.small_course_type
                | enumFilter('small_course.small_course_type')
            }}
          </template>
          <template slot="card_price" slot-scope="text">
            {{ text.name || text }}
          </template>
        </st-table>
      </div>
    </div>
  </st-modal>
</template>

<script>
import {
  Cardcolumns,
  TeamCoursecolumns,
  PersonalCoursecolumns,
  SmallCoursecolumns,
  Packagecolumns,
  GroupBuycolumns,
  Couponcolumns,
  Wheelcolumns,
  SignUpcolumns,
  Coachcolumns
} from './product-table-select.config'
import { ProductTableSelectService } from './product-table-select.service'
import { MessageService } from '@/services/message.service'
import { MODULE_TYPES } from '@/constants/setting/mina'
export default {
  bem: {
    b: 'custom-decorate-product-table-select'
  },
  props: {
    module_type: {
      type: Number,
      default: 1
    },
    title: {
      type: String
    },
    defaultSelectedRowKeys: {
      type: Array,
      default: () => []
    },
    defaultSelectedRows: {
      type: Array,
      default: () => []
    },
    idKeyName: {
      type: String,
      default: 'id'
    },
    /**
     * 最大选择数量
     */
    max: {
      type: Number,
      default: 10
    },
    shopId: {
      type: Number,
      default: 0
    }
  },

  serviceInject() {
    return {
      messageService: MessageService,
      productTableSelectService: ProductTableSelectService
    }
  },
  rxState() {
    return {
      loading: this.productTableSelectService.loading$,
      list: this.productTableSelectService.list$,
      page: this.productTableSelectService.page$,
      cocach_type: this.productTableSelectService.cocach_type$,
      card_type: this.productTableSelectService.card_type$,
      package_type: this.productTableSelectService.package_type$,
      coupon_type: this.productTableSelectService.coupon_type$
    }
  },

  data() {
    return {
      show: false,
      MODULE_TYPES,
      keywords: '',
      selectedRowKeys: [],
      selectedRow: [],
      filterOption: -1,
      courseType: 1,
      /**
       * 用于缓存选择过的 rows
       */
      rowMap: {}
    }
  },
  computed: {
    computedRowKey() {
      const { module_type } = this
      return (
        {
          [MODULE_TYPES.COUPON]: 'activity_id',
          [MODULE_TYPES.LUCKY_WHEEL]: 'activity_id',
          [MODULE_TYPES.ACTIVITY]: 'activity_id',
          [MODULE_TYPES.GROUP]: 'activity_id'
        }[module_type] || 'id'
      )
    },
    columns() {
      let module_type = this.module_type
      let course_type = this.courseType
      let ModuleTypeMapFn = {
        [MODULE_TYPES.COACH]: Coachcolumns,
        [MODULE_TYPES.RECOMMEND_CARD]: Cardcolumns,
        [MODULE_TYPES.RECOMMEND_PACKAGE]: Packagecolumns,
        [MODULE_TYPES.COUPON]: Couponcolumns,
        [MODULE_TYPES.LUCKY_WHEEL]: Wheelcolumns,
        [MODULE_TYPES.ACTIVITY]: SignUpcolumns,
        [MODULE_TYPES.GROUP]: GroupBuycolumns
      }
      let cl
      if (module_type === MODULE_TYPES.RECOMMEND_COURSE) {
        let fns = {
          1: TeamCoursecolumns,
          2: PersonalCoursecolumns,
          3: SmallCoursecolumns
        }
        cl = fns[course_type]
      } else {
        cl = ModuleTypeMapFn[module_type]
      }
      return cl()
    },
    fnLoading() {
      let module_type = this.module_type
      let course_type = this.courseType
      let ModuleTypeMapFn = {
        3: this.loading.getCoachList,
        4: this.loading.getCardList,
        6: this.loading.getPackageList,
        12: this.loading.getCouponList,
        14: this.loading.getWheelList,
        15: this.loading.getSignUpList,
        16: this.loading.getGroupBuyList
      }
      let fn
      if (module_type === MODULE_TYPES.RECOMMEND_COURSE) {
        let fns = {
          1: this.loading.getPersonalCourseList,
          2: this.loading.getSmallCourseList,
          3: this.loading.getTeamCourseList
        }
        fn = fns[courseType]
      } else {
        fn = ModuleTypeMapFn[module_type]
      }
      return fn
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 推荐卡项
      if (this.module_type === MODULE_TYPES.RECOMMEND_CARD) {
        this.filterOption = 1
      }
      const { defaultSelectedRows } = this
      this.selectedRowKeys = this.defaultSelectedRowKeys
      this.selectedRows = defaultSelectedRows
      console.log('init', this.defaultSelectedRowKeys, this.defaultSelectedRows)
      this.updateRowMap(defaultSelectedRows)
      this.getList()
    },
    handleOnChangeCourseType() {
      this.getList()
    },
    handleOnSearch() {
      this.getList({
        keywords: this.keywords
      })
    },
    handleOnChangeOption(option) {
      let moduleTypeMap = {
        3: 'coach_identity',
        4: 'type',
        6: 'type',
        12: 'coupon_status'
      }
      let key = moduleTypeMap[this.module_type]
      this.getList({
        [key]: option
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('changed', selectedRowKeys, selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.updateRowMap(selectedRows)
      this.selectedRows = this.calcSelectedRows(selectedRowKeys)
    },
    updateRowMap(selectedRows) {
      const rowMap = this.rowMap
      if (selectedRows instanceof Array) {
        selectedRows.forEach(row => {
          rowMap[row[this.idKeyName] || row['id']] = row
        })
        this.rowMap = rowMap
      }
      console.log('rowMap', this.rowMap)
    },
    calcSelectedRows(selectedRowKeys) {
      const _selectedRows = []
      const { rowMap } = this
      selectedRowKeys.forEach(key => {
        if (rowMap[key]) {
          _selectedRows.push(rowMap[key])
        }
      })
      return _selectedRows
    },
    onSubmit() {
      if (this.selectedRowKeys.length > this.max) {
        return this.messageService.error({
          content: '当前数量已达上限，请在删除后重新添加'
        })
      }
      console.log('complete', {
        selected: this.selectedRowKeys,
        selectedRows: this.selectedRows || []
      })
      this.show = false
      this.$emit('complete', {
        selected: this.selectedRowKeys,
        selectedRows: this.selectedRows || []
      })
    },
    onCancel() {
      this.show = false
    },
    onPageChange(data) {
      this.getList({
        current_page: data.current
      })
    },
    getList(query) {
      const defaultQuery = {
        shop_id: this.shopId,
        module_type: this.module_type,
        current_page: 1,
        size: 10
      }
      const extraQueryMap = {
        /**
         * 卡项去掉全部卡项
         */
        4: {
          type: this.filterOption
        },
        5: {
          course_type: this.courseType
        }
      }

      this.productTableSelectService
        .getList(
          Object.assign(
            defaultQuery,
            extraQueryMap[this.module_type] || {},
            query
          )
        )
        .subscribe()
    }
  }
}
</script>
