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
    >
      <st-overflow-text
        slot="shop_names"
        slot-scope="text"
        :value="text"
        max-width="400px"
      ></st-overflow-text>
      <template slot="sex" slot-scope="text, record">
        {{ sexArr[record.sex].label }}
      </template>
    </st-table>
  </st-panel>
</template>
<script>
import { DetailService } from './detail.service'
import { columns } from './detail.config'
import tableMixin from '@/mixins/table.mixin'
import { UserService } from '@/services/user.service'

export default {
  bem: {
    detail: 'crowd-detail'
  },
  mixins: [tableMixin],
  serviceInject() {
    return {
      detailService: DetailService,
      userService: UserService
    }
  },
  rxState() {
    return {
      loading: this.detailService.loading$,
      crowdDetailList: this.detailService.crowdDetail$,
      page: this.detailService.page$,
      sexArr: this.userService.getOptions$('member.sex')
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
