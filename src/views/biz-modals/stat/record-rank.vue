<template>
  <st-modal
    wrapClassName="modal-stat-sell-amount"
    :title="title"
    v-model="show"
    :loading="loading.getFeatsRank"
    :footer="false"
  >
    <st-table
      :scroll="{ y: 345 }"
      :columns="columns"
      :loading="loading.getFeatsRank"
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
import { columns } from './record-rank.config'
import tableMixin from '@/mixins/table.mixin'
import { RecordService } from './record-rank.service'
export default {
  name: 'RecordRank',
  mixins: [tableMixin],
  serviceInject() {
    return {
      recordService: RecordService
    }
  },
  rxState() {
    let { list$, page$, auth$, loading$ } = this.recordService
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
      this.recordService.getFeatsRank(query, this.type).subscribe()
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
