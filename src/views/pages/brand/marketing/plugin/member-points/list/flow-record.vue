<template>
  <div>
    <portal to="BRAND_PLUGIN_POINTS_MALL_SEARCH">
      <st-input-search
        v-model="$searchQuery.keyword"
        @search="onKeywordsSearch('keyword', $event)"
        placeholder="搜索会员姓名或手机号"
        style="width:400px"
      />
    </portal>
    <div :class="b('search')">
      <div :class="b('search-left')">
        <a-select
          style="width: 120px;"
          v-model="$searchQuery.source_type"
          :options="sourceTypeOptions$"
          @change="onSingleSearch('source_type', $event)"
          placeholder="请选择积分来源"
          class="mg-r16"
        ></a-select>
        <shop-select
          v-model="$searchQuery.shop_id"
          @change="onSingleSearch('shop_id', $event)"
        />
      </div>
      <div :class="b('search-right')">
        <st-recent-radio-group
          @change="onChangeDataDays"
          :value="$searchQuery"
        ></st-recent-radio-group>
      </div>
    </div>
    <div :class="b('content')" class="mg-t16">
      <st-total
        :class="b('total')"
        :indexs="totalColumns"
        :dataSource="total$"
        hasTitle
      ></st-total>
      <st-table
        class="mg-t16"
        :page="page$"
        rowKey="id"
        :columns="columns"
        @change="onTableChange"
        :scroll="{ x: 1000 }"
        :dataSource="list$"
      >
        <span slot="source_type" slot-scope="text">
          {{ text.name }}
        </span>
      </st-table>
    </div>
  </div>
</template>

<script>
import shopSelect from '@/views/biz-components/shop/shop-select'
import StTotal from '@/views/components/total#/total.vue'
import tableMixin from '@/mixins/table.mixin'
import { columns, totalColumns } from './flow-record.config'
import { FlowRecordService } from './flow-record.service'
import moment from 'moment'

export default {
  name: 'BrandPlaginMemberPointsFlowRecord',
  mixins: [tableMixin],
  serviceInject() {
    return {
      service: FlowRecordService
    }
  },
  rxState() {
    let { sourceTypeOptions$, total$, list$, page$ } = this.service
    return { sourceTypeOptions$, total$, list$, page$ }
  },
  bem: {
    b: 'brand-plagin-member-points-flow-record'
  },
  computed: {
    columns,
    totalColumns
  },
  components: {
    shopSelect,
    StTotal
  },
  methods: {
    moment,
    onChangeDataDays(event) {
      this.$searchQuery.day = event.recently_day || undefined
      this.$searchQuery.start_date = event.start_date || undefined
      this.$searchQuery.end_date = event.end_date || undefined
      this.onSearch()
    }
  }
}
</script>
