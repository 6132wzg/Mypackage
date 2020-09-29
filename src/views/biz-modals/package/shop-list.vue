<template>
  <st-modal
    title="上架课程包"
    @ok="show = false"
    :footer="null"
    width="800px"
    v-model="show"
  >
    <div :class="bModal()">
      <st-table
        :scroll="{ x: 568 }"
        pageMode="client"
        :columns="columns"
        rowKey="id"
        :dataSource="list$"
        :loading="loading$.getShelfStatusList"
      >
        <template slot="down_shelf_reason" slot-scope="text">
          <st-overflow-text max-width="140px" :value="text"></st-overflow-text>
        </template>
      </st-table>
    </div>
  </st-modal>
</template>
<script>
import tableMixin from '@/mixins/table.mixin'
import { columns } from './shop-list.config'
import { ShopListService } from './shop-list.service'
import { ruleOptions } from './off-sales.config'
export default {
  name: 'PackageShopList',
  mixins: [tableMixin],
  bem: {
    bModal: 'modal-package-off-sales'
  },
  serviceInject() {
    return {
      service: ShopListService
    }
  },
  serviceProviders() {
    return [ShopListService]
  },
  rxState() {
    const { list$, loading$ } = this.service
    return {
      list$,
      loading$
    }
  },
  props: {
    id: [String, Number]
  },
  computed: {
    columns
  },
  data() {
    return {
      show: false
    }
  },
  mounted() {
    this.service.getShelfStatusList(this.id).subscribe()
  }
}
</script>
