<template>
  <st-modal
    wrapClassName="modal-stat-sell-amount"
    :title="title"
    v-model="show"
    :loading="loading.getFreeCoachList"
    :footer="false"
  >
    <st-table
      :scroll="{ y: 345 }"
      :columns="columns"
      :loading="loading.getFreeCoachList"
      :rowKey="(record, idx) => idx"
      :dataSource="list"
      :pagination="{ simple: true, hideOnSinglePage: true }"
      :page="page"
      @change="onModalTableChange"
      page-mode="client"
    ></st-table>
  </st-modal>
</template>
<script>
import { columns } from './free-coach.config'
import tableMixin from '@/mixins/table.mixin'
import { FreeCoachService } from './free-coach.service'
export default {
  name: 'FreeCoach',
  mixins: [tableMixin],
  serviceInject() {
    return {
      service: FreeCoachService
    }
  },
  rxState() {
    let { auth$, list$, page$, loading$ } = this.service
    return {
      auth: auth$,
      list: list$,
      page: page$,
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
    onModalTableChange(pagination, ...ret) {
      const params = {
        ...this.query,
        ...this.getTableQuery(pagination, ...ret)
      }
      this.service.getFreeCoachList(params, this.type).subscribe()
    }
  },
  mounted() {
    this.service.getFreeCoachList(this.query, this.type).subscribe()
  }
}
</script>
