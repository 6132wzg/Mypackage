<template>
  <div :class="basic()">
    <portal to="SHOP_SOLD_COURSE_LIST_SEARCH">
      <st-input-search
        v-model="$searchQuery.search"
        @search="onKeywordsSearch('search', $event)"
        :placeholder="
          `请输入${$c('small_course')}名、合同编号、会员姓名或手机号查找`
        "
        style="width:400px"
      />
    </portal>
    <st-search-panel @search="onSearchNative" @reset="onSearchResetNative">
      <st-search-panel-item label="课程状态：">
        <st-search-radio
          v-model="$searchQuery.course_status"
          :options="courseStatus"
        />
      </st-search-panel-item>
      <st-search-panel-item label="购买时间：">
        <st-range-picker :disabledDays="180" v-model="date" />
      </st-search-panel-item>
      <st-search-panel-item label="到期时间：">
        <st-range-picker :disabledDays="180" v-model="expireDate" />
      </st-search-panel-item>
    </st-search-panel>
    <div :class="basic('content')">
      <div>
        <!-- NOTE:批量操作暂时不做 -->
        <!-- :alertSelection="{ onReset: onClear }"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            fixed: true,
            onChange: onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: disabledSelect(record)
              }
            })
          }" -->
        <st-table
          :page="page"
          :loading="loading.getList"
          rowKey="id"
          :columns="columns"
          @change="onTableChange"
          :dataSource="list"
        >
          <template slot="course_name" slot-scope="text, record">
            <st-link
              :value="text"
              :disabled="!record.auth['shop:sold:sold_small_class_course|get']"
              @click="onDetail(record)"
            ></st-link>
          </template>
          <template slot="course_status" slot-scope="text">
            <st-text
              :status="{
                success: text === 1,
                warning: text === 2,
                error: text === 3
              }"
            >
              {{ text | enumFilter('sold_common.course_status') }}
            </st-text>
          </template>
          <template slot="member_name" slot-scope="text, record">
            <template v-if="record.is_minors">
              <span class="word-break">{{ record.member_name }}(未成年)</span>
            </template>
            <template v-else>
              <span class="word-break">{{ record.member_name }}</span>
            </template>
          </template>
          <template slot="mobile" slot-scope="text, record">
            <template v-if="record.is_minors">
              {{ record.parent_mobile }} ({{ record.parent_user_role }})
            </template>
            <template v-else>
              {{ record.mobile }}
            </template>
          </template>
          <template slot="sell_time" slot-scope="text, record">
            <span class="word-break">
              {{ record.course_begin_time }} ~ {{ record.course_end_time }}
            </span>
          </template>
          <div slot="action" slot-scope="text, record">
            <st-table-actions>
              <a
                v-if="record.auth['shop:sold:sold_small_class_course|get']"
                @click="onDetail(record)"
              >
                详情
              </a>
              <a
                v-if="record.auth['shop:sold:sold_small_class_course|transfer']"
                @click="
                  smallCourseActions.onTrasnfer({
                    id: record.id
                  })
                "
              >
                转让
              </a>

              <a
                v-if="record.auth['brand_shop:order:order|refund']"
                @click="
                  smallCourseActions.onRefund({
                    id: record.id
                  })
                "
              >
                退款
              </a>
              <a
                v-if="record.auth['shop:sold:sold_small_class_course|exchange']"
                @click="
                  smallCourseActions.onChangeSmallCourse({
                    id: record.id
                  })
                "
              >
                换班
              </a>
              <a
                v-if="
                  record.auth[
                    'shop:sold:sold_small_class_course|export_contract'
                  ]
                "
                @click="toContract(record)"
              >
                查看合同
              </a>
              <a
                v-if="
                  record.auth[
                    'shop:sold:sold_small_class_course|internal_description'
                  ]
                "
                @click="internalNoteActions.onOpenModal(record)"
              >
                对内备注
              </a>
              <a
                v-if="record.auth['shop:order:order|print']"
                @click="printService.printSmallTicket(record.order_id)"
              >
                打印小票
              </a>
            </st-table-actions>
          </div>
        </st-table>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { cloneDeep, filter } from 'lodash-es'
import { SmallCourseService } from './small-course.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './small-course.config'
import useSmallCourseActions from '@/hooks/shop/sold-small-course-actions.hook'
import useInternalNoteActions from '@/hooks/shop/sold-internal-note-actions.hook'
import { PrintService } from '@/services/print.service'

export default {
  name: 'PageShopSoldCoursePersonalList',
  mixins: [tableMixin],
  bem: {
    basic: 'page-shop-sold'
  },
  serviceInject() {
    return {
      smallCourseService: SmallCourseService,
      printService: PrintService
    }
  },
  rxState() {
    return {
      loading: this.smallCourseService.loading$,
      list: this.smallCourseService.list$,
      page: this.smallCourseService.page$,
      courseStatus: this.smallCourseService.courseStatus$,
      auth: this.smallCourseService.auth$
    }
  },
  beforeCreate() {
    this.smallCourseActions.$on('refresh', val => {
      this.$router.reload()
    })
  },
  hooks() {
    return {
      smallCourseActions: useSmallCourseActions(),
      internalNoteActions: useInternalNoteActions()
    }
  },
  data() {
    return {
      start_time: null,
      end_time: null,
      // 结束时间面板是否显示
      endOpen: false,
      selectedRowKeys: [],
      date: [],
      expireDate: []
    }
  },

  computed: {
    columns
  },
  mounted() {
    this.setSearchData()
  },
  methods: {
    // 查询
    onSearchNative() {
      this.$searchQuery.start_time = this.date[0]
        ? `${this.date[0].format('YYYY-MM-DD')} 00:00:00`
        : ''
      this.$searchQuery.end_time = this.date[1]
        ? `${this.date[1].format('YYYY-MM-DD')} 23:59:59`
        : ''
      this.$searchQuery.expire_start_time = this.expireDate[0]
        ? `${this.expireDate[0].format('YYYY-MM-DD')} 00:00:00`
        : ''
      this.$searchQuery.expire_end_time = this.expireDate[1]
        ? `${this.expireDate[1].format('YYYY-MM-DD')} 23:59:59`
        : ''
      this.onSearch()
    },
    onSearchResetNative() {
      this.date = [null, null]
      this.expireDate = [null, null]
      this.onSearchReset()
    },
    // 设置searchData
    setSearchData() {
      const start = this.$searchQuery.start_time
        ? cloneDeep(moment(this.$searchQuery.start_time))
        : null
      const end = this.$searchQuery.end_time
        ? cloneDeep(moment(this.$searchQuery.end_time))
        : null
      const expireStart = this.$searchQuery.expire_start_time
        ? cloneDeep(moment(this.$searchQuery.expire_start_time))
        : null
      const expireEnd = this.$searchQuery.expire_end_time
        ? cloneDeep(moment(this.$searchQuery.expire_end_time))
        : null
      this.date = [start, end]
      this.expireDate = [expireStart, expireEnd]
    },
    // moment
    moment,
    // 跳转合同
    toContract(record) {
      let url = `${window.location.origin}/common/contract-preview?id=${record.order_id}`
      window.open(url)
    },
    // 详情
    onDetail(record) {
      this.$router.push({
        path: `/shop/sold/course/info/small-course/info/operation-record`,
        query: { id: record.id }
      })
    }
  }
}
</script>
