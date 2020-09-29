<template>
  <st-modal
    wrapClassName="modal-stat-sell-amount"
    :title="title"
    v-model="show"
    :loading="loading.getSalesRank"
    :footer="false"
  >
    <st-table
      :scroll="{ y: 345 }"
      :columns="columns"
      :loading="loading.getSalesRank"
      rowKey="top"
      :dataSource="list"
      :pagination="{ simple: true, hideOnSinglePage: true }"
      :page="page"
      @change="onModalTableChange"
      page-mode="client"
    ></st-table>
  </st-modal>
</template>
<script>
import { columns } from './sales-rank.config'
import tableMixin from '@/mixins/table.mixin'
import { SalesService } from './sales-rank.service'
export default {
  name: 'SalesRank',
  mixins: [tableMixin],
  serviceInject() {
    return {
      salesService: SalesService
    }
  },
  rxState() {
    let { list$, page$, auth$, loading$ } = this.salesService
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
      columns
    }
  },
  computed: {},
  methods: {
    getList(query) {
      this.salesService.getSalesRank(query, this.type).subscribe()
    },
    onModalTableChange(pagination, ...ret) {
      this.getList({
        ...this.query,
        ...this.getTableQuery(pagination, ...ret)
      })
    }
  },
  mounted() {
    this.getList(this.query)
  }
}
</script>
