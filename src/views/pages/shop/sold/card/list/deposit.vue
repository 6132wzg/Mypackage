<template>
  <div :class="basic()">
    <portal to="SHOP_SOLD_CARD_LIST_ACTIONS">
      <st-input-search
        v-model="$searchQuery.search"
        @search="onKeywordsSearch('search', $event)"
        placeholder="请输入卡名、合同编号、会员姓名或手机号查找"
        style="width: 380px;"
      />
    </portal>

    <st-search-panel @search="onSearchNative" @reset="onSearchResetNative">
      <st-search-panel-item label="储值卡状态：">
        <st-search-radio v-model="$searchQuery.is_valid" :options="isValids" />
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
            type: 'sold/card/deposit',
            query: { conditions: $searchQuery }
          }"
        >
          全部导出
        </st-button>
        <!-- <st-help-tooltip
          :isCustom="true"
          title="只支持有效的储值卡"
          :defaultVisible="true"
          v-if="true"
          trigger="contextmenu"
          v-model="action.giving.isShowTip"
          @click="onGiving"
        >
          <st-button
            type="primary"
            class="mg-r8"
            :disabled="!action.giving.isAvaliable"
          >
            赠送额度
          </st-button>
        </st-help-tooltip> -->
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
          @change="onTableChange"
          :loading="loading.getList"
          :columns="columns"
          :dataSource="list"
          :scroll="{ x: 2100 }"
          :alertSelection="{ onReset: onClear }"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            fixed: true,
            onChange: onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: disabledSelect(record) // Column configuration not to be checked
              }
            })
          }"
        >
          <template slot="card_name" slot-scope="text, record">
            <st-link
              :value="text"
              :disabled="!record.auth['shop:sold:sold_deposit_card|get']"
              @click="onDetail(record)"
            ></st-link>
          </template>
          <template slot="sex" slot-scope="text">
            {{ text | enumFilter('staff.sex') }}
          </template>
          <template slot="is_valid" slot-scope="text">
            <st-text
              :status="{
                success: text === 1,
                error: text === 2
              }"
            >
              {{ text | enumFilter('sold_common.is_valid') }}
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
          <template slot="sell_time" slot-scope="text, record">
            <span class="word-break">
              {{ record.buy_time }} ~ {{ record.end_time }}
            </span>
          </template>
          <div slot="action" slot-scope="text, record">
            <st-table-actions>
              <a
                v-if="record.auth['shop:sold:sold_deposit_card|get']"
                @click="onDetail(record)"
              >
                详情
              </a>
              <a
                v-if="
                  record.auth['shop:sold:sold_deposit_card|export_contract']
                "
                @click="toContract(record)"
              >
                查看合同
              </a>
              <a
                v-if="record.auth['shop:sold:sold_deposit_card|transfer']"
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
                  record.auth[
                    'shop:sold:sold_deposit_card|internal_description'
                  ]
                "
                @click="internalNoteActions.onOpenModal(record)"
              >
                对内备注
              </a>
              <a
                v-if="record.auth['shop:sold:sold_deposit_card|rights_edit']"
                @click="soldDepositCardActions.onUpdateRights(record.id)"
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
import { DepositService } from './deposit.service'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './deposit.config'
import StTotal from '@/views/components/total#/total.vue'
import SoldCardRefund from '@/views/biz-modals/sold/card/refund'
import SoldCardTransfer from '@/views/biz-modals/sold/card/transfer'
import SoldCardGiving from '@/views/biz-modals/sold/card/giving'
import CommonTaskSuccessTip from '@/views/biz-modals/common/task/success-tip'
import { CARD_STATUS } from '@/constants/card/deposit'
import useInternalNoteActions from '@/hooks/shop/sold-internal-note-actions.hook'
import soldDepositCardActions from '@/hooks/sold/deposit-card-actions.hook'
import { PrintService } from '@/services/print.service'

export default {
  name: 'PageShopSoldCardDepositList',
  mixins: [tableMixin],
  bem: {
    basic: 'page-shop-sold'
  },
  components: {
    StTotal
  },
  modals: {
    SoldCardRefund,
    SoldCardTransfer,
    SoldCardGiving,
    CommonTaskSuccessTip
  },
  serviceInject() {
    return {
      depositService: DepositService,
      printService: PrintService
    }
  },
  rxState() {
    return {
      list: this.depositService.list$,
      loading: this.depositService.loading$,
      page: this.depositService.page$,
      isValids: this.depositService.isValids$,
      auth: this.depositService.auth$,
      total: this.depositService.total$
    }
  },
  computed: {
    columns,
    totalColumns
  },
  data() {
    return {
      action: {
        /**
         * 赠送额度
         */
        giving: {
          isAvaliable: false,
          isShowTip: false
        }
      },
      is_valid: 1,
      // 结束时间面板是否显示
      endOpen: false,
      selectedRowKeys: [],
      selectedRows: [],
      date: [],
      expireDate: []
    }
  },
  hooks() {
    return {
      internalNoteActions: useInternalNoteActions(),
      soldDepositCardActions: soldDepositCardActions(this)
    }
  },
  mounted() {
    this.setSearchData()
  },
  watch: {
    query(newVal) {
      this.setSearchData()
    }
  },
  methods: {
    disabledSelect(record) {
      return false
    },
    // 跳转合同
    toContract(record) {
      let url = `${window.location.origin}/common/contract-preview?id=${record.order_id}`
      window.open(url)
    },
    // 转让
    onTransfer(record) {
      this.$modalRouter.push({
        name: 'sold-card-transfer',
        props: {
          id: record.id,
          type: 'deposit'
        },
        on: {
          success: () => {
            this.$router.reload()
          }
        }
      })
    },
    // 退款
    onRefund(record) {
      this.$modalRouter.push({
        name: 'sold-card-refund',
        props: {
          type: 'deposit',
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
        name: `shop-sold-card-info-deposit-info-operation-record`,
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
      this.$searchQuery.expire_start_time = this.expireDate[0]
        ? `${this.expireDate[0].format('YYYY-MM-DD')} 00:00:00`
        : ''
      this.$searchQuery.expire_end_time = this.expireDate[1]
        ? `${this.expireDate[1].format('YYYY-MM-DD')} 23:59:59`
        : ''
      this.onSearch()
    },
    // 设置searchData
    setSearchData() {
      this.is_valid = this.$searchQuery.is_valid
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
    onSearchResetNative() {
      this.date = [null, null]
      this.expireDate = [null, null]
      this.onSearchReset()
    },
    // moment
    moment,
    onSelectChange(selectedRowKeys, selectedRows) {
      this.checkSelectedRows(selectedRows, 'is_valid', 'giving', () => {
        return !selectedRows.filter(item => item.is_valid !== CARD_STATUS.VALID)
          .length
      })
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
    },
    // 额度赠送
    onGiving() {
      this.$modalRouter.push({
        name: 'sold-card-giving',
        props: {
          ids: this.selectedRowKeys,
          type: this.selectedRows[0].card_type,
          unit: this.selectedRows[0].unit,
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
    onClear() {
      this.selectedRowKeys = []
      this.selectedRows = []
    }
  }
}
</script>
