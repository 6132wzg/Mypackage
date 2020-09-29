<template>
  <st-panel-layout :class="bPage()">
    <PluginTitle pathName="brand-app-plugin-send-coupon-index" />
    <st-panel app>
      <div :class="bPage('action')" class="mg-b16">
        <a
          v-if="auth.add"
          v-modal-link="{
            name: 'brand-app-plugin-send-coupon-batch-send',
            props: { title: '定向发券' },
            on: { success: refresh }
          }"
        >
          <st-button type="primary" class="mg-r16">定向发券</st-button>
        </a>
      </div>

      <st-table
        v-if="auth.list"
        :page="page"
        @change="onTableChange"
        :loading="loading.getList"
        :columns="columns"
        :dataSource="list"
        rowKey="id"
      >
        <div slot="action" slot-scope="text, record">
          <st-table-actions>
            <a
              v-modal-link="{
                name: 'brand-app-plugin-record-table',
                props: { id: record.id, title: '发券记录' }
              }"
            >
              发券记录
            </a>
          </st-table-actions>
        </div>
      </st-table>
    </st-panel>
  </st-panel-layout>
</template>
<script>
import { IndexService } from './index.service'
import PluginTitle from '@/views/biz-components/plugin/plugin-title/index'
import { columns } from './index.config.ts'
import tableMixin from '@/mixins/table.mixin'
import BrandAppPluginRecordTable from '@/views/biz-modals/brand/app/plugin/send-coupon/record-table'
import BrandAppPluginSendCouponBatchSend from '@/views/biz-modals/brand/app/plugin/send-coupon/batch-send'
export default {
  name: 'BrandAppPluginSendCoupon',
  mixins: [tableMixin],
  modals: {
    BrandAppPluginRecordTable,
    BrandAppPluginSendCouponBatchSend
  },
  data() {
    return {}
  },
  bem: {
    bPage: 'page-brand-app-plugin-send-coupon-index'
  },
  serviceInject() {
    return {
      indexService: IndexService
    }
  },
  rxState() {
    return {
      list: this.indexService.list$,
      page: this.indexService.page$,
      loading: this.indexService.loading$,
      info: this.indexService.info$,
      status: this.indexService.status$,
      auth: this.indexService.auth$
    }
  },
  components: {
    PluginTitle
  },
  computed: {
    columns
  },
  methods: {
    refresh() {
      this.$router.push({ query: this.$searchQuery })
    }
  }
}
</script>
