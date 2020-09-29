<template>
  <div :class="data()">
    <div :class="data('search')">
      <div :class="data('action')">
        <st-input-search
          placeholder="请输入姓名或手机号查找"
          v-model="$searchQuery.search"
          @search="onKeywordsSearch('search', $event)"
        />
      </div>
    </div>

    <st-table
      :page="page"
      @change="onTableChange"
      :loading="loading.getList"
      :columns="columns"
      :dataSource="list"
      :stripe="false"
      rowKey="id"
    >
      <div slot="action" slot-scope="text, record">
        <st-table-actions>
          <a @click="punishCancel(record.id)">
            解绑
          </a>
        </st-table-actions>
      </div>
    </st-table>
  </div>
</template>

<script>
import { MissPunishService } from './miss-punish.service'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './miss-punish.config'
export default {
  name: 'PageShopAppVenueMissPunish',
  bem: {
    data: 'shop-app-venue-miss-punish'
  },
  mixins: [tableMixin],
  serviceInject() {
    return {
      missPunishService: MissPunishService
    }
  },
  rxState() {
    return {
      list: this.missPunishService.list$,
      page: this.missPunishService.page$,
      loading: this.missPunishService.loading$
    }
  },
  data() {
    return {
      columns
    }
  },
  methods: {
    punishCancel(id) {
      let params = { id }
      this.missPunishService.punishCancel(params).subscribe(() => {
        this.getList()
      })
    },
    getList() {
      this.missPunishService.getList(this.$searchQuery).subscribe()
    }
  }
}
</script>
