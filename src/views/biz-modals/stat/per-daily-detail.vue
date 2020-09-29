<!-- 数据统计--收银退款模块--客单价日明细 -->
<template>
  <st-modal
    wrapClassName="modal-stat-sell-amount"
    :title="title"
    v-model="show"
    size="default"
    :loading="loading.getRevenueList"
    :footer="false"
  >
    <st-table
      :scroll="{ y: 345 }"
      :columns="columns"
      :loading="loading.getRevenueList"
      :rowKey="(record, idx) => idx"
      :dataSource="list"
      :pagination="{ simple: true, hideOnSinglePage: true }"
      :page="page"
      @change="onModalTableChange"
    >
      <span slot="stat_date" slot-scope="text">
        {{ moment(text).format('YYYY-MM-DD') }}
      </span>
    </st-table>
  </st-modal>
</template>
<script>
import { columns } from './per-daily-detail.config'
import tableMixin from '@/mixins/table.mixin'
import { PerDailyService } from './per-daily-detail.service'
import moment from 'moment'

export default {
  name: 'DailyDetail',
  mixins: [tableMixin],
  serviceInject() {
    return {
      perDailyService: PerDailyService
    }
  },
  rxState() {
    let { list$, page$, auth$, loading$ } = this.perDailyService
    return {
      list: list$,
      page: page$,
      auth: auth$,
      loading: loading$
    }
  },
  props: {
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: String,
    type: String
  },
  data() {
    return {
      show: false,
      modalQuery: {
        current_page: 1,
        size: 10
      }
    }
  },
  computed: {
    columns,
    searchQuery() {
      return {
        ...this.query,
        ...this.modalQuery
      }
    }
  },
  methods: {
    moment,
    getList() {
      this.perDailyService
        .getRevenueList(this.searchQuery, this.type)
        .subscribe()
    },
    onModalTableChange(pagination, ...ret) {
      this.modalQuery = {
        ...this.modalQuery,
        ...this.getTableQuery(pagination, ...ret)
      }
      this.getList()
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
