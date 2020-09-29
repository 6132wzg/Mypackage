<template>
  <div :class="basic()">
    <portal to="SHOP_SOLD_COURSE_LIST_SEARCH">
      <st-input-search
        v-model="$searchQuery.search"
        @search="onKeywordsSearch('search', $event)"
        placeholder="请输入课程包名、合同编号、会员姓名或手机号查找"
        style="width:400px"
      />
    </portal>

    <st-search-panel @search="onSearchNative" @reset="onSearchResetNative">
      <st-search-panel-item label="课程包状态：">
        <st-search-radio
          v-model="$searchQuery.course_status"
          :options="courseStatus"
        />
      </st-search-panel-item>
      <st-search-panel-item label="课程包类型：">
        <st-search-radio
          v-model="$searchQuery.is_limit"
          :options="packageIsLimitOptions$"
        />
      </st-search-panel-item>
      <st-search-panel-item label="课程包属性：">
        <st-search-radio
          v-model="$searchQuery.package_type"
          :options="packageTypes"
        />
      </st-search-panel-item>
      <st-search-panel-item label="是否生效：">
        <st-search-radio
          v-model="$searchQuery.effective_state"
          :options="effectiveWayOptions"
        />
      </st-search-panel-item>
      <st-search-panel-item label="购买时间：">
        <st-range-picker :disabledDays="180" v-model="date" />
      </st-search-panel-item>
      <st-search-panel-item label="生效时间">
        <st-range-picker :disabledDays="180" v-model="effectiveDate" />
      </st-search-panel-item>
      <st-search-panel-item label="到期时间：">
        <st-range-picker :disabledDays="180" v-model="expireDate" />
      </st-search-panel-item>
    </st-search-panel>
    <div :class="basic('content')">
      <div :class="basic('content-batch')" class="mg-b16">
        <!-- NOTE: 导出 -->
        <st-button
          v-if="auth.export"
          type="primary"
          class="mg-r8"
          v-export-excel="{
            type: 'sold/course/package',
            query: { conditions: $searchQuery }
          }"
        >
          全部导出
        </st-button>
        <st-help-tooltip
          :isCustom="true"
          title="仅支持范围内课程变更"
          :defaultVisible="true"
          v-if="auth.course_range"
          v-model="action.courseRange.isShowTip"
        >
          <st-button
            type="primary"
            class="mg-r8"
            :disabled="!action.courseRange.isAvaliable"
            @click="onChangeCourse"
          >
            更换上课范围
          </st-button>
        </st-help-tooltip>
        <st-help-tooltip
          :isCustom="true"
          title="仅支持失效且未退款的课程包"
          :defaultVisible="true"
          v-if="auth.reactive"
          v-model="action.reactive.isShowTip"
        >
          <st-button
            type="primary"
            class="mg-r8"
            :disabled="!action.reactive.isAvaliable"
            @click="onChangeRenew"
          >
            重新激活
          </st-button>
        </st-help-tooltip>
        <st-help-tooltip
          :isCustom="true"
          title="仅支持有效且已生效的课程包进行延期"
          :defaultVisible="true"
          v-if="auth.extendDay"
          v-model="action.extendDay.isShowTip"
        >
          <st-button
            type="primary"
            class="mg-r8"
            :disabled="!action.extendDay.isAvaliable"
            @click="onChangeExtends"
          >
            延长有效期
          </st-button>
        </st-help-tooltip>
        <st-help-tooltip
          :isCustom="true"
          title="仅支持有效或冻结状态同一类型的课程包进行操作"
          :defaultVisible="true"
          v-if="auth.gift"
          v-model="action.give.isShowTip"
        >
          <st-button
            type="primary"
            class="mg-r8"
            :disabled="!action.give.isAvaliable"
            @click="onChangeGive"
          >
            赠送额度
          </st-button>
        </st-help-tooltip>
      </div>
      <st-total
        :indexs="totalColumns"
        :dataSource="total"
        hasTitle
        class="mg-b16"
      ></st-total>
      <div>
        <st-table
          :page="page"
          rowKey="id"
          :loading="loading.getList"
          :alertSelection="{ onReset: onClear }"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            fixed: true,
            onChange: onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: disabledSelect(record)
              }
            })
          }"
          @change="onTableChange"
          :scroll="{ x: 2100 }"
          :columns="columns"
          :dataSource="list"
        >
          <template slot="course_name" slot-scope="text, record">
            <st-link
              :value="text"
              :disabled="!record.auth['shop:sold:sold_package_course|get']"
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
              {{ record.parent_mobile }}({{ record.parent_user_role }})
            </template>
            <template v-else>
              {{ record.mobile }}
            </template>
          </template>
          <template slot="effective_state" slot-scope="text">
            <span>{{ text ? '是' : '否' }}</span>
          </template>
          <template slot="is_limit" slot-scope="text">
            <span>{{ text | enumFilter('package_course.is_limit') }}</span>
          </template>
          <template slot="sex" slot-scope="text">
            {{ text | enumFilter('staff.sex') }}
          </template>
          <template slot="is_refund" slot-scope="text">
            {{ text.name }}
          </template>
          <template slot="package_type" slot-scope="text">
            {{ text | enumFilter('package_course.package_type') }}
          </template>
          <template slot="sell_time" slot-scope="text, record">
            <span class="word-break">
              {{ record.valid_start_time }} ~ {{ record.course_end_time }}
            </span>
          </template>
          <st-table-actions slot="action" slot-scope="text, record">
            {{ record.auth }}
            <a
              v-if="record.auth['shop:sold:sold_package_course|get']"
              @click="onDetail(record)"
            >
              详情
            </a>
            <a
              v-if="record.auth['shop:sold:sold_package_course|course_num']"
              @click="onSurplus(record)"
            >
              修改剩余课时
            </a>
            <a
              v-if="record.auth['shop:sold:sold_package_course|reactivate']"
              @click="onReactive(record.id)"
            >
              重新激活
            </a>
            <a
              v-if="record.auth['shop:sold:sold_package_course|extension']"
              @click="onExtend(record.id)"
            >
              延长有效期
            </a>
            <a
              v-if="record.auth['shop:sold:sold_package_course|edit_date']"
              @click="onUpdateExpirationDate(record.id)"
            >
              有效期修改
            </a>
            <a
              v-if="record.auth['shop:sold:sold_package_course|member_change']"
              @click="onMemberChange(record.id)"
            >
              成员变更
            </a>
            <a
              v-if="record.auth['shop:sold:sold_package_course|reduce_times']"
              @click="onDeduction(record.id)"
            >
              扣次
            </a>
            <a
              v-if="record.auth['shop:sold:sold_package_course|frozen']"
              @click="onFreeze(record)"
            >
              冻结
            </a>
            <a
              v-if="record.auth['shop:sold:sold_package_course|unfrozen']"
              @click="onUnfreeze(record)"
            >
              取消冻结
            </a>
            <a
              v-if="record.auth['shop:sold:sold_package_course|transfer']"
              @click="onTransfer(record)"
            >
              转让
            </a>
            <a
              v-if="record.auth['shop:sold:sold_package_course|valid']"
              @click="onValid(record)"
            >
              立即生效
            </a>
            <a
              v-if="record.auth['shop:sold:sold_package_course|upgrade']"
              @click="onUpgrade(record)"
            >
              升级
            </a>
            <a
              v-if="record.auth['brand_shop:order:order|refund']"
              @click="onRefund(record)"
            >
              退款
            </a>
            <a
              v-if="
                record.auth['shop:sold:sold_package_course|export_contract']
              "
              @click="toContract(record)"
            >
              查看合同
            </a>
            <a
              v-if="
                record.auth[
                  'shop:sold:sold_package_course|internal_description'
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
            <a
              v-if="record.auth['shop:sold:sold_package_course|rights_edit']"
              v-modal-link="{
                name: 'sold-course-package-update-rights',
                props: {
                  id: record.id
                }
              }"
            >
              修改售出权益
            </a>
          </st-table-actions>
        </st-table>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { cloneDeep, filter } from 'lodash-es'
import { PackageService } from './package.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './package.config'
import StTotal from '@/views/components/total#/total.vue'
import SoldCourseFreeze from '@/views/biz-modals/sold/course/freeze'
import SoldCourseRefund from '@/views/biz-modals/sold/course/refund'
import SoldCourseSurplus from '@/views/biz-modals/sold/course/surplus'
import SoldCourseTransfer from '@/views/biz-modals/sold/course/transfer'
import SoldCourseScope from '@/views/biz-modals/sold/course/scope'
import SoldCourseValid from '@/views/biz-modals/sold/course/valid'
import SoldCoursePackageReactive from '@/views/biz-modals/sold/course/package/reactive'
import SoldCoursePackageUpgrade from '@/views/biz-modals/sold/course/package/upgrade'
import SoldCoursePackageUpdateExpirationDate from '@/views/biz-modals/sold/course/package/update-expiration-date'
import SoldCoursePackageReactiveBatch from '@/views/biz-modals/sold/course/package/reactive-batch'
import SoldCourseGiftBatch from '@/views/biz-modals/sold/course/package/gift-batch'
import SoldCoursePackageExtendDay from '@/views/biz-modals/sold/course/package/extend-day'
import SoldCoursePackageDeduction from '@/views/biz-modals/sold/course/package/deduction'
import SoldCoursePackageMembeChange from '@/views/biz-modals/sold/course/package/member-change'
import SoldCoursePackageExtendDayBatch from '@/views/biz-modals/sold/course/package/extend-day-batch'
import SoldCoursePackageUpdateRights from '@/views/biz-modals/sold/course/package/update-rights'
import CommonTaskSuccessTip from '@/views/biz-modals/common/task/success-tip'
import DealGathering from '@/views/biz-modals/sold/deal/gathering'
import { PACKAGE_TYPE, IS_LIMIT } from '@/constants/sold/package'
import useInternalNoteActions from '@/hooks/shop/sold-internal-note-actions.hook'
import { PRODUCT_TYPE } from '@/constants/sold/transaction'
import { PrintService } from '@/services/print.service'
export default {
  name: 'PageShopSoldCoursePackageList',
  mixins: [tableMixin],
  bem: {
    basic: 'page-shop-sold'
  },
  components: {
    StTotal
  },
  modals: {
    SoldCourseFreeze,
    SoldCourseRefund,
    SoldCourseSurplus,
    SoldCourseTransfer,
    SoldCourseValid,
    DealGathering,
    SoldCoursePackageReactive,
    SoldCoursePackageExtendDay,
    SoldCoursePackageExtendDayBatch,
    SoldCoursePackageDeduction,
    SoldCourseGiftBatch,
    SoldCoursePackageUpgrade,
    SoldCoursePackageUpdateExpirationDate,
    SoldCoursePackageMembeChange,
    SoldCoursePackageReactiveBatch,
    SoldCourseScope,
    CommonTaskSuccessTip,
    SoldCoursePackageUpdateRights
  },
  serviceInject() {
    return {
      packageService: PackageService,
      printService: PrintService
    }
  },
  rxState() {
    return {
      list: this.packageService.list$,
      loading: this.packageService.loading$,
      page: this.packageService.page$,
      packageIsLimitOptions$: this.packageService.packageIsLimitOptions$,
      courseStatus: this.packageService.courseStatus$,
      packageTypes: this.packageService.packageTypes$,
      effectiveWay: this.packageService.effectiveWay$,
      auth: this.packageService.auth$,
      total: this.packageService.total$
    }
  },
  data() {
    return {
      PACKAGE_TYPE,
      IS_LIMIT,
      visible: false,
      // 结束时间面板是否显示
      endOpen: false,
      selectedRowKeys: [],
      selectedRows: [],
      diffSelectedRows: [],
      date: [],
      giftType: 'null',
      effectiveDate: [],
      expireDate: [],
      action: {
        /**
         * 更换上课范围
         */
        courseRange: {
          isAvaliable: false,
          isShowTip: false
        },
        /**
         * 延长卡有效期
         */
        extendDay: {
          isAvaliable: false,
          isShowTip: false
        },
        /**
         * 重新激活
         */
        reactive: {
          isAvaliable: false,
          isShowTip: false
        },
        /**
         * 重新激活
         */
        give: {
          isAvaliable: false,
          isShowTip: false
        }
      }
    }
  },
  hooks() {
    return {
      internalNoteActions: useInternalNoteActions()
    }
  },
  mounted() {
    this.setSearchData()
  },
  computed: {
    columns,
    totalColumns,
    isLimit() {
      return false
    },
    effectiveWayOptions() {
      return [
        {
          label: '全部',
          value: -1
        },
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ]
    }
  },
  methods: {
    disabledSelect(record) {
      return false
    },
    onUpdateExpirationDate(id) {
      this.$modalRouter.push({
        name: 'sold-course-package-update-expiration-date',
        props: {
          id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    onMemberChange(id) {
      this.$modalRouter.push({
        name: 'sold-course-package-membe-change',
        props: {
          id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    onDeduction(id) {
      this.$modalRouter.push({
        name: 'sold-course-package-deduction',
        props: {
          id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    onChangeRenew() {
      this.$modalRouter.push({
        name: 'sold-course-package-reactive-batch',
        props: {
          ids: this.selectedRowKeys,
          searchQuery: cloneDeep(this.$searchQuery)
        },
        on: {
          success: () => {
            this.successTip()
          }
        }
      })
    },
    onChangeExtends() {
      this.$modalRouter.push({
        name: 'sold-course-package-extend-day-batch',
        props: {
          ids: this.selectedRowKeys,
          searchQuery: cloneDeep(this.$searchQuery)
        },
        on: {
          success: () => {
            this.successTip()
          }
        }
      })
    },
    onChangeGive() {
      let { selectedRowKeys, isLimit, giftType } = this
      this.$modalRouter.push({
        name: 'sold-course-gift-batch',
        props: {
          ids: selectedRowKeys,
          searchQuery: cloneDeep(this.$searchQuery),
          isLimit,
          giftType
        },
        on: {
          success: () => {
            this.$router.reload()
            this.onClear()
          }
        }
      })
    },
    onValid(record) {
      this.$modalRouter.push({
        name: 'sold-course-valid',
        props: {
          info: record
        },
        on: {
          success: () => {
            this.$router.reload()
            this.onClear()
          }
        }
      })
    },
    onExtend(id) {
      this.$modalRouter.push({
        name: 'sold-course-package-extend-day',
        props: {
          id
        },
        on: {
          success: () => {
            this.$router.reload()
            this.onClear()
          }
        }
      })
    },
    // 激活
    onReactive(id) {
      this.$modalRouter.push({
        name: 'sold-course-package-reactive',
        props: {
          id
        },
        on: {
          success: () => {
            this.$router.reload()
            this.onClear()
          }
        }
      })
    },
    // 升级
    onUpgrade(record) {
      this.$modalRouter.push({
        name: 'sold-course-package-upgrade',
        props: {
          id: record.id
        },
        on: {
          success: res => {
            if (res.type === 'create') {
              // 创建订单成功
              this.$router.reload()
              this.onClear()
            } else if (res.type === 'createPay') {
              // 创建订单成功 并且到支付页面
              this.$modalRouter.push({
                name: 'deal-gathering',
                props: {
                  order_id: res.orderId,
                  type: 'package'
                },
                on: {
                  success: () => {
                    this.$router.reload()
                    this.onClear()
                  }
                }
              })
            }
          }
        }
      })
    },
    // 清空列表选择
    onClear() {
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    // 变更上课范围
    onChangeCourse() {
      this.$modalRouter.push({
        name: 'sold-course-scope',
        props: {
          ids: this.selectedRowKeys,
          searchQuery: this.$searchQuery
        },
        on: {
          success: () => {
            this.successTip()
          }
        }
      })
    },
    successTip() {
      this.$modalRouter.push({
        name: 'common-task-success-tip',
        on: {
          success: () => {
            this.$router.reload()
            this.onClear()
          }
        }
      })
    },
    onPageChange(data) {
      this.$router.push({
        query: { ...this.$searchQuery, page: data.current, size: data.pageSize }
      })
    },
    // 修改剩余课时
    onSurplus(record) {
      const time = record.effective_state
        ? `${moment(record.course_buy_time).format(
            'YYYY-MM-DD HH:mm'
          )} 至 ${moment(record.course_end_time).format('YYYY-MM-DD HH:mm')}`
        : '--'
      let data = {
        id: record.id,
        courseName: record.course_name,
        effective_state: record.effective_state,
        time
      }
      this.$modalRouter.push({
        name: 'sold-course-surplus',
        props: {
          courseType: 'coursePackage',
          courseData: data
        },
        on: {
          success() {
            this.$router.reload()
          }
        }
      })
    },
    // 冻结
    onFreeze(record) {
      this.$modalRouter.push({
        name: 'sold-course-freeze',
        props: {
          type: 'package',
          id: record.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 取消冻结
    onUnfreeze(record) {
      this.$confirm({
        title: '提示',
        content: '是否取消冻结？',
        maskClosable: true,
        onOk: () => {
          this.packageService
            .unFreeze(record.id)
            .toPromise()
            .then(() => {
              this.$router.reload()
            })
        }
      })
    },
    // 转让
    onTransfer(record) {
      this.$modalRouter.push({
        name: 'sold-course-transfer',
        props: {
          type: 'package',
          id: record.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 跳转合同
    toContract(record) {
      let url = `${window.location.origin}/common/contract-preview?id=${record.order_id}`
      window.open(url)
    },
    // 退款
    onRefund(record) {
      this.$modalRouter.push({
        name: 'sold-course-refund',
        props: {
          type: 'package',
          id: record.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 详情
    onDetail(record) {
      this.$router.push({
        path: `/shop/sold/course/info/package/info/operation-record`,
        query: { id: record.id }
      })
    },
    // 查询
    onSearchNative() {
      this.$searchQuery.start_time = this.date[0]
        ? `${this.date[0].format('YYYY-MM-DD')} 00:00:00`
        : ''
      this.$searchQuery.end_time = this.date[1]
        ? `${this.date[1].format('YYYY-MM-DD')} 23:59:59`
        : ''
      this.$searchQuery.valid_time_start = this.effectiveDate[0]
        ? `${this.effectiveDate[0].format('YYYY-MM-DD')} 00:00:00`
        : ''
      this.$searchQuery.valid_time_end = this.effectiveDate[1]
        ? `${this.effectiveDate[1].format('YYYY-MM-DD')} 23:59:59`
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
      this.effectiveDate = [null, null]
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
      const validStart = this.$searchQuery.valid_time_start
        ? cloneDeep(moment(this.$searchQuery.valid_time_start))
        : null
      const validEnd = this.$searchQuery.valid_time_end
        ? cloneDeep(moment(this.$searchQuery.valid_time_end))
        : null
      const expireStart = this.$searchQuery.expire_start_time
        ? cloneDeep(moment(this.$searchQuery.expire_start_time))
        : null
      const expireEnd = this.$searchQuery.expire_end_time
        ? cloneDeep(moment(this.$searchQuery.expire_end_time))
        : null
      this.date = [start, end]
      this.effectiveDate = [validStart, validEnd]
      this.expireDate = [expireStart, expireEnd]
    },
    moment,
    onSelectChange(selectedRowKeys, selectedRows) {
      this.checkSelectedRows(
        selectedRows,
        'course_status',
        'courseRange',
        () => {
          this.selectedRowKeys = selectedRowKeys
          this.diffSelectedRows = selectedRows.filter(
            item => item.package_type === 2 && item.course_status !== 3
          )
          return this.diffSelectedRows.length
        }
      )
      this.checkSelectedRows(selectedRows, 'course_status', 'extendDay', () => {
        return (
          selectedRows.filter(item => item.course_status === 1).length ===
          selectedRows.length
        )
      })
      this.checkSelectedRows(selectedRows, 'course_status', 'reactive', () => {
        return (
          selectedRows.filter(
            item => item.course_status === 3 && item.is_refund.id === 0
          ).length === selectedRows.length
        )
      })
      // 批量赠送额度除了固定课程包，只要是有效和冻结的都可以赠送额度。但是都应该是同一类型
      // 都是任意课程包，都是范围不限次，都是范围限次按钮才会亮。因为只有范围不限次弹窗是赠送天数，任意课程包和范围限次是赠送次数
      this.checkSelectedRows(selectedRows, 'course_status', 'give', () => {
        this.selectedRowKeys = selectedRowKeys
        this.diffSelectedRowsPackageType1 = selectedRows.filter(
          item => item.package_type === 1 && [1, 2].includes(item.course_status)
        )
        this.diffSelectedRowsPackageType2 = selectedRows.filter(
          item =>
            item.package_type === 2 &&
            [1, 2].includes(item.course_status) &&
            item.is_limit === 0
        )
        this.diffSelectedRowsPackageType3 = selectedRows.filter(
          item =>
            item.package_type === 2 &&
            [1, 2].includes(item.course_status) &&
            item.is_limit === 1
        )
        this.giftType =
          this.diffSelectedRowsPackageType3.length === selectedRows.length ||
          this.diffSelectedRowsPackageType1.length === selectedRows.length
            ? 'times'
            : this.diffSelectedRowsPackageType2.length === selectedRows.length
            ? 'day'
            : 'null'
        return (
          this.diffSelectedRowsPackageType1.length === selectedRows.length ||
          this.diffSelectedRowsPackageType2.length === selectedRows.length ||
          this.diffSelectedRowsPackageType3.length === selectedRows.length
        )
      })
    },
    checkSelectedRows(selectedRows, key, targetDataKey, checkFn) {
      this.action[targetDataKey].isShowTip = false
      const isAvaliable = checkFn()
      this.action[targetDataKey].isAvaliable =
        selectedRows.length && isAvaliable
      if (!isAvaliable) {
        this.action[targetDataKey].isShowTip = true
        const timerKey = `timer_${targetDataKey}`
        clearTimeout(this[timerKey])
        this[timerKey] = setTimeout(() => {
          this.action[targetDataKey].isShowTip = false
        }, 2000)
      }
    }
  }
}
</script>
