<template>
  <section class="st-sold-log-table">
    <st-table
      :page="page"
      :loading="loading.getList"
      rowKey="id"
      @change="onTableChange"
      :dataSource="list"
      :columns="columns"
    >
      <template slot="usage_detail" slot-scope="text, record">
        <span v-for="(item, index) in record.usage_detail" :key="index">
          {{ item }}
          <br />
        </span>
      </template>
      <template slot="amount_change" slot-scope="text, record">
        <span
          :class="record.amount_change < 0 ? 'color-error' : 'color-success'"
        >
          {{ record.amount_change }}
        </span>
      </template>
    </st-table>
  </section>
</template>
<script>
import { UsageLogService } from './usage-log.service'
import { columns } from './usage-log.config'

import tableMixin from '@/mixins/table.mixin'
export default {
  name: 'PageShopSoldCardMemberInfoOperation',
  mixins: [tableMixin],
  serviceInject() {
    return {
      usageLogService: UsageLogService
    }
  },
  rxState() {
    return {
      page: this.usageLogService.page$,
      list: this.usageLogService.list$,
      loading: this.usageLogService.loading$
    }
  },
  data() {
    return {}
  },
  created() {},
  computed: {
    columns
  }
}
</script>
