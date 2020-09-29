<template>
  <div class="container-basis">
    <div :class="b('total')">
      <div :class="b('total-item')">
        <span class="label">积分总额</span>
        <i-count-up class="value" :endVal="+total.total_points"></i-count-up>
      </div>
      <div :class="b('total-item')">
        <span class="label">已用积分</span>
        <i-count-up class="value" :endVal="+total.used_points"></i-count-up>
      </div>
      <div :class="b('total-item')">
        <span class="label">过期积分</span>
        <i-count-up class="value" :endVal="+total.expired_points"></i-count-up>
      </div>
      <div :class="b('total-item')">
        <span class="label">剩余积分</span>
        <i-count-up class="value" :endVal="+total.remain_points"></i-count-up>
      </div>
    </div>
    <st-table
      :loading="loading.getMemberIntegralInfo"
      :columns="columns"
      class="mg-t16"
      :scroll="{ x: 840 }"
      rowKey="id"
      :page="page"
      @change="onTableChange"
      :dataSource="list"
    >
      <span slot="source_type" slot-scope="text">
        {{ text.name }}
      </span>
    </st-table>
  </div>
</template>
<script>
import { IntegralService } from './integral.service'
import { columns } from './integral.config'
import tableMixin from '@/mixins/table.mixin'

export default {
  mixins: [tableMixin],
  bem: {
    b: 'shop-member-info-integral'
  },
  components: {},
  computed: {
    columns
  },
  serviceInject() {
    return {
      service: IntegralService
    }
  },
  rxState() {
    return {
      list: this.service.list$,
      total: this.service.total$,
      page: this.service.page$,
      loading: this.service.loading$
    }
  }
}
</script>
