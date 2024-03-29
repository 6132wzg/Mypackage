<template>
  <st-panel :class="bPage()">
    <div slot="prepend">
      <st-search-panel :class="bSearch()">
        <st-search-panel-item label="支付方式：">
          <a-checkbox @change="onCheckAllChange" :checked="checkAll">
            全部
          </a-checkbox>
          <a-checkbox-group
            @change="onChangePayType"
            v-model="checkedList"
            :options="payType$"
          />
        </st-search-panel-item>
        <st-search-panel-item label="流水金额：">
          <st-input-number
            class="amount__input mg-r8"
            :min="1"
            :max="99999"
            :step="1"
            :precision="0"
            float
            v-model="$searchQuery.start_amount"
          ></st-input-number>
          至
          <st-input-number
            :min="1"
            :max="99999"
            :precision="0"
            float
            class="amount__input mg-l8"
            v-model="$searchQuery.end_amount"
          ></st-input-number>
        </st-search-panel-item>
        <st-search-panel-item label="创建时间：">
          <st-range-picker :disabledDays="180" v-model="date" class="value" />
        </st-search-panel-item>

        <div slot="button">
          <st-button
            type="primary"
            @click="onSearchNative"
            :loading="loading$.getList"
          >
            查询
          </st-button>
          <st-button class="mg-l8" @click="onReset">重置</st-button>
        </div>
      </st-search-panel>
    </div>
    <div :class="bPage('button-wapper')" class="pd-x24 mg-t24">
      <st-button
        type="primary"
        v-export-excel="{
          type: 'finance/flow/shop/expenditure/detail',
          query: $searchQuery
        }"
      >
        全部导出
      </st-button>
    </div>
    <st-total
      :class="bPage('total')"
      :indexs="totalColumns"
      :dataSource="total$"
      class="pd-x24"
      hasTitle
    ></st-total>
    <st-table
      :columns="columns"
      :rowKey="record => record.flow_id"
      :page="page$"
      @change="onTableChange"
      :dataSource="list$"
    >
      <span
        slot="price"
        :class="{ 'color-danger': +text < 0 }"
        slot-scope="text"
      >
        {{ text }}
      </span>
      <span slot="flow_type" slot-scope="text">{{ text.name }}</span>
      <st-overflow-text
        title="备注"
        maxWidth="200px"
        slot="remark"
        slot-scope="text"
        :vlaue="text"
      />
    </st-table>
  </st-panel>
</template>
<script>
import StTotal from '@/views/components/total#/total.vue'
import tableMixin from '@/mixins/table.mixin'
import { ExpenditureService } from './expenditure.service'
import { columns, totalColumns } from './expenditure.config.ts'
export default {
  name: 'FinanceFlowExpenditure',
  mixins: [tableMixin],
  components: {
    StTotal
  },
  bem: {
    bPage: 'page-shop-flow-expenditure',
    bSearch: 'search'
  },
  serviceInject() {
    return {
      service: ExpenditureService
    }
  },
  rxState() {
    const { loading$, page$, list$, payType$, total$ } = this.service
    return {
      loading$,
      page$,
      list$,
      total$,
      payType$
    }
  },
  data() {
    return {
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      date: []
    }
  },
  computed: {
    columns,
    totalColumns
  },
  mounted() {
    this.setSearchDate()
  },
  methods: {
    setSearchDate() {
      if (!this.$searchQuery.start_date) return
      const start = moment(this.$searchQuery.start_date)
      const end = moment(this.$searchQuery.end_date)
      this.date = [start, end]
    },
    onChangePayType(checkedList) {
      this.indeterminate =
        checkedList.length && checkedList.length < this.payType$.length
      this.checkAll = checkedList.length === this.payType$.length
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked
          ? this.payType$.map(item => item.value)
          : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    onSearchNative() {
      const start_date = this.date[0]
        ? `${this.date[0].format('YYYY-MM-DD')}`
        : ''
      const end_date = this.date[1]
        ? `${this.date[1].format('YYYY-MM-DD')}`
        : ''
      this.$searchQuery.pay_channel = this.checkedList
      this.$searchQuery.current_page = 1
      this.$router.push({
        query: { ...this.$searchQuery, start_date, end_date }
      })
    },
    onReset() {
      this.checkedList = []
      this.date = [null, null]
      this.onSearchReset()
    }
  }
}
</script>
