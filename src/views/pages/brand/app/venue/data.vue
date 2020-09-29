<template>
  <div :class="data()">
    <div :class="data('search')">
      <div :class="data('action')">
        <shop-select
          v-model="$searchQuery.shop_id"
          @change="onSingleSearch('shop_id', $event)"
          class="mg-r12"
        />
        <st-recent-radio-group
          @change="onChangeChartDays"
        ></st-recent-radio-group>
      </div>
    </div>
    <st-table
      :page="page"
      @change="onTableChange"
      :loading="loading.getList"
      :columns="columns"
      :dataSource="list"
      rowKey="index"
    ></st-table>
  </div>
</template>

<script>
import shopSelect from '@/views/biz-components/shop/shop-select'
import { DataService } from './data.service'
import { columns } from './data.config'
import tableMixin from '@/mixins/table.mixin'
export default {
  name: 'PageBrandAppVenueData',
  bem: {
    data: 'brand-app-venue-data'
  },
  mixins: [tableMixin],
  serviceInject() {
    return {
      dataService: DataService
    }
  },
  rxState() {
    return {
      list: this.dataService.list$,
      page: this.dataService.page$,
      loading: this.dataService.loading$
    }
  },
  components: {
    shopSelect
  },
  data() {
    return {}
  },
  computed: {
    columns
  },
  methods: {
    onChangeChartDays(event) {
      console.log(event)
      this.onMultiSearch({
        day: event.recently_day || '',
        start_date: event.start_date || '',
        end_date: event.end_date || ''
      })
    }
  }
}
</script>
