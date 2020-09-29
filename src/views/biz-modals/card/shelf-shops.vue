<template>
  <st-modal
    :title="title"
    v-model="show"
    :footer="null"
    wrapClassName="scroll-modal"
  >
    <a-select
      v-model="shelf_status"
      :options="shelfStatusOptions"
      @change="onShelfStatusChange"
      style="width: 200px"
    ></a-select>
    <st-table
      rowKey="id"
      :dataSource="list"
      :columns="columns"
      :scroll="{ y: 230 }"
      :pagination="pagination"
      @change="onPageChange"
      class="mg-t24"
    >
      <template slot="shelf_status" slot-scope="text">{{ text.name }}</template>
    </st-table>
  </st-modal>
</template>
<script>
import { ShelfShopsService } from './shelf-shops.service'
import { columns } from './shelf-shops.config'
export default {
  serviceInject() {
    return {
      shelfShopsService: ShelfShopsService
    }
  },
  rxState() {
    const { shelfShopsService } = this
    return {
      list: shelfShopsService.list$,
      page: shelfShopsService.page$,
      loading: shelfShopsService.loading$,
      shelfStatusOptions: shelfShopsService.shelfStatusOptions$
    }
  },
  computed: {
    columns,
    pagination() {
      const { page } = this
      return {
        current: page.current_page,
        total: page.total_counts,
        pageSize: page.size
      }
    }
  },
  props: {
    title: {
      type: String,
      default: '上下架门店'
    },
    /**
     * 卡模板ID
     */
    id: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.getList()
  },
  data() {
    return {
      show: false,
      shelf_status: -1
    }
  },
  methods: {
    getList(page = {}) {
      const query = {
        ...page,
        shelf_status: this.shelf_status
      }
      this.shelfShopsService.getList(this.id, query).subscribe()
    },
    onPageChange(data) {
      this.getList({
        size: data.pageSize,
        current_page: data.current
      })
    },
    onShelfStatusChange() {
      this.getList()
    }
  }
}
</script>
