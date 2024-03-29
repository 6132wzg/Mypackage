<template>
  <div :class="basic()">
    <portal to="SHOP_SOLD_COURSE_LIST_SEARCH">
      <st-input-search
        v-model="$searchQuery.search"
        @search="onKeywordsSearch('search', $event)"
        placeholder="请输入私教课名、合同编号、会员姓名或手机号查找"
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
      <div :class="basic('content-batch')" class="mg-b16">
        <!-- NOTE: 导出 -->
        <st-button
          v-if="auth.export"
          type="primary"
          class="mg-r8"
          v-export-excel="{
            type: 'sold/course/personal',
            query: { conditions: $searchQuery }
          }"
        >
          全部导出
        </st-button>
        <st-button
          type="primary"
          class="mg-r8"
          @click="onGiving"
          :disabled="selectedRowKeys.length < 1"
          v-if="auth.batch_gift_number"
        >
          赠送额度
        </st-button>
        <st-button
          type="primary"
          class="mg-r8"
          @click="onExtendDays"
          :disabled="selectedRowKeys.length < 1"
          v-if="auth.batch_extension"
        >
          延长有效期
        </st-button>
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
          rowKey="id"
          :scroll="{ x: 2100 }"
          :columns="columns"
          @change="onTableChange"
          :dataSource="list"
        >
          <template slot="course_name" slot-scope="text, record">
            <st-link
              :value="text"
              :disabled="!record.auth['shop:sold:sold_personal_course|get']"
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
            <template v-else>{{ record.mobile }}</template>
          </template>
          <template slot="sex" slot-scope="text">
            {{ text | enumFilter('staff.sex') }}
          </template>
          <template slot="sell_time" slot-scope="text, record">
            <span class="word-break">
              {{ record.buy_time }} ~ {{ record.end_time }}
            </span>
          </template>
          <!-- 上课教练 -->
          <template slot="coach_name" slot-scope="text">
            <coaches :list="text"></coaches>
          </template>
          <div slot="action" slot-scope="text, record">
            <st-table-actions>
              <a
                v-if="record.auth['shop:sold:sold_personal_course|get']"
                @click="onDetail(record)"
              >
                详情
              </a>
              <a
                v-if="
                  record.auth['shop:sold:sold_personal_course|reduce_times']
                "
                @click="soldPersonalCourseActions.onDeduct(record.id)"
              >
                扣次
              </a>
              <a
                v-if="record.auth['shop:sold:sold_personal_course|course_num']"
                @click="onSurplus(record)"
              >
                修改剩余课时
              </a>
              <a
                v-if="record.auth['shop:sold:sold_personal_course|edit_date']"
                @click="onSetTime(record)"
              >
                修改有效时间
              </a>
              <a
                v-if="record.auth['shop:sold:sold_personal_course|reactive']"
                @click="onActivated(record)"
              >
                重新激活
              </a>
              <a
                v-if="record.auth['shop:sold:sold_personal_course|expire']"
                @click="onLease(record)"
              >
                延长有效期
              </a>
              <a
                v-if="record.auth['shop:sold:sold_personal_course|frozen']"
                @click="onFreeze(record)"
              >
                冻结
              </a>
              <a
                v-if="record.auth['shop:sold:sold_personal_course|unfrozen']"
                @click="onUnfreeze(record)"
              >
                取消冻结
              </a>
              <a
                v-if="
                  record.auth['shop:sold:sold_personal_course|change_coach']
                "
                @click="onEditCoach(record)"
              >
                修改{{ $c('coach') }}
              </a>
              <a
                v-if="record.auth['shop:sold:sold_personal_course|transfer']"
                @click="onTransfer(record)"
              >
                转让
              </a>
              <a
                v-if="record.auth['brand_shop:order:order|refund']"
                @click="onRefund(record)"
              >
                退款
              </a>
              <a
                v-if="
                  record.auth['shop:sold:sold_personal_course|export_contract']
                "
                @click="toContract(record)"
              >
                查看合同
              </a>
              <a
                v-if="
                  record.auth[
                    'shop:sold:sold_personal_course|internal_description'
                  ]
                "
                @click="internalNoteActions.onOpenModal(record)"
              >
                对内备注
              </a>
              <a
                v-if="record.auth['shop:sold:sold_personal_course|rights_edit']"
                @click="soldPersonalCourseActions.onUpdateRights(record.id)"
              >
                修改权益
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
import { PersonalService } from './personal.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './personal.config'
import SoldCourseCoach from '@/views/biz-modals/sold/course/coach'
import SoldCourseFreeze from '@/views/biz-modals/sold/course/freeze'
import SoldCourseRefund from '@/views/biz-modals/sold/course/refund'
import SoldCourseSurplusPersonal from '@/views/biz-modals/sold/course/surplus-personal'
import SoldCourseSetTimePersonal from '@/views/biz-modals/sold/course/set-time-personal'
import SoldCourseTransfer from '@/views/biz-modals/sold/course/transfer'
import SoldCourseLease from '@/views/biz-modals/sold/course/lease'
import SoldCourseActivated from '@/views/biz-modals/sold/course/activated'
import SoldCourseGiving from '@/views/biz-modals/sold/course/giving'
import SoldCourseExtendDay from '@/views/biz-modals/sold/course/extend-day'
import CommonTaskSuccessTip from '@/views/biz-modals/common/task/success-tip'
import Coaches from '@/views/biz-components/course/coaches'
import StTotal from '@/views/components/total#/total.vue'
import useInternalNoteActions from '@/hooks/shop/sold-internal-note-actions.hook'
import soldPersonalCourseActions from '@/hooks/sold/personal-course-actions.hook'
import { PrintService } from '@/services/print.service'

export default {
  name: 'PageShopSoldCoursePersonalList',
  mixins: [tableMixin],
  bem: {
    basic: 'page-shop-sold'
  },
  components: {
    StTotal,
    Coaches
  },
  modals: {
    SoldCourseCoach,
    SoldCourseFreeze,
    SoldCourseRefund,
    SoldCourseSurplusPersonal,
    SoldCourseSetTimePersonal,
    SoldCourseTransfer,
    SoldCourseLease,
    SoldCourseActivated,
    SoldCourseGiving,
    CommonTaskSuccessTip,
    SoldCourseExtendDay
  },
  serviceInject() {
    return {
      personalService: PersonalService,
      printService: PrintService
    }
  },
  rxState() {
    return {
      loading: this.personalService.loading$,
      list: this.personalService.list$,
      page: this.personalService.page$,
      courseStatus: this.personalService.courseStatus$,
      auth: this.personalService.auth$,
      total: this.personalService.total$
    }
  },
  hooks() {
    return {
      internalNoteActions: useInternalNoteActions(),
      soldPersonalCourseActions: soldPersonalCourseActions(this)
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
    columns,
    totalColumns
  },
  mounted() {
    this.setSearchData()
  },
  methods: {
    // 额度赠送
    onGiving() {
      this.$modalRouter.push({
        name: 'sold-course-giving',
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
    // 延长有效期
    onExtendDays() {
      this.$modalRouter.push({
        name: 'sold-course-extend-day',
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
    disabledSelect(record) {
      if (record.course_status !== 1 && record.course_status !== 4) {
        return true
      }
    },
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
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 冻结
    onFreeze(record) {
      this.$modalRouter.push({
        name: 'sold-course-freeze',
        props: {
          type: 'personal',
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
          return this.personalService
            .unFreeze(record.id)
            .toPromise()
            .then(() => {
              this.$router.reload()
            })
        }
      })
    },
    // 修改教练
    onEditCoach(record) {
      this.$modalRouter.push({
        name: 'sold-course-coach',
        props: {
          record
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 修改剩余课时
    onSurplus(record) {
      this.$modalRouter.push({
        name: 'sold-course-surplus-personal',
        props: {
          courseData: record
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 修改剩余时间
    onSetTime(record) {
      this.$modalRouter.push({
        name: 'sold-course-set-time-personal',
        props: {
          courseData: record
        },
        on: {
          success: () => {
            console.log(123333)
            this.$router.reload()
          }
        }
      })
    },
    // 重新激活
    onActivated(record) {
      this.$modalRouter.push({
        name: 'sold-course-activated',
        props: {
          type: 'personal',
          id: record.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 延长有效期
    onLease(record) {
      this.$modalRouter.push({
        name: 'sold-course-lease',
        props: {
          type: 'personal',
          id: record.id
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 转让
    onTransfer(record) {
      this.$modalRouter.push({
        name: 'sold-course-transfer',
        props: {
          type: 'personal',
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
          type: 'personal',
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
        path: `/shop/sold/course/info/personal/info/operation-record`,
        query: { id: record.id }
      })
    },
    onClear() {
      this.selectedRowKeys = []
      this.selectedRows = []
    }
  }
}
</script>
