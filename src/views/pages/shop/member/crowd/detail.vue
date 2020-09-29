<template>
  <st-panel app :class="detail()">
    <st-input-search
      class="mg-b24"
      placeholder="输入用户姓名、手机号"
      v-model="$searchQuery.keyword"
      @search="onSingleSearch('keyword', $event)"
    />
    <st-table
      rowKey="member_id"
      :loading="loading.getList"
      :columns="columns"
      :dataSource="crowdDetailList"
      :page="page"
      @change="onTableChange"
    ></st-table>
  </st-panel>
</template>
<script>
import { DetailService } from './detail.service'
import { columns } from './detail.config'
import tableMixin from '@/mixins/table.mixin'

export default {
  bem: {
    detail: 'crowd-detail'
  },
  mixins: [tableMixin],
  serviceInject() {
    return {
      detailService: DetailService
    }
  },
  rxState() {
    return {
      loading: this.detailService.loading$,
      crowdDetailList: this.detailService.list$,
      page: this.detailService.page$
    }
  },
  data() {
    return {}
  },
  computed: {
    columns
  }
}
</script>
