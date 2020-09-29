<template>
  <st-panel-layout>
    <MarkteingPluginTitle
      pathName="brand-marketing-plugin-activity-qrcode-list"
    />
    <st-panel app initial :class="basic()">
      <template v-if="auth.page">
        <div slot="title" :class="basic('search')">
          <shop-select
            :class="basic('select')"
            v-model="$searchQuery.shop_id"
            @change="onSingleSearch('shop_id', $event)"
          ></shop-select>
          <st-input-search
            v-model="$searchQuery.keyword"
            @search="onSingleSearch('keyword', $event)"
            placeholder="搜索员工名称或手机号"
          />
        </div>
        <div :class="basic('content')">
          <st-table
            :page="page"
            rowKey="id"
            :columns="columns"
            @change="onTableChange"
            :dataSource="list"
          >
            <template slot="identity" slot-scope="text">
              <span>{{ text.join(' ') }}</span>
            </template>
            <template slot="scan_code_num" slot-scope="text, record">
              <a
                v-if="text"
                v-modal-link="{
                  name: 'brand-marketing-scan-table',
                  props: { id: record.id, title: '扫码记录' }
                }"
              >
                <span>{{ text }}</span>
              </a>
              <span v-else>--</span>
            </template>
            <template slot="follow_num" slot-scope="text, record">
              <a
                v-if="text"
                v-modal-link="{
                  name: 'brand-marketing-follow-table',
                  props: { id: record.id, title: '新增会员' }
                }"
              >
                <span>{{ text }}</span>
              </a>
              <span v-else>--</span>
            </template>
            <template slot="action" slot-scope="text, record">
              <st-table-actions>
                <a @click="onGeneralize(record)">
                  查看推广码
                </a>
              </st-table-actions>
            </template>
          </st-table>
        </div>
      </template>
    </st-panel>
  </st-panel-layout>
</template>

<script>
import { ListService } from './list.service'
import { UserService } from '@/services/user.service'
import MarkteingPluginTitle from '../../components#/marketing-title'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './list.config'
import ShopSelect from '@/views/biz-components/shop/shop-select'
import BrandMarketingScanTable from '@/views/biz-modals/brand/marketing/scan-table'
import BrandMarketingFollowTable from '@/views/biz-modals/brand/marketing/follow-table'
import BrandMarketingDownloadQrcode from '@/views/biz-modals/brand/marketing/download-qrcode'
export default {
  name: 'PageBrandMarketingPluginActivityQrcode',
  mixins: [tableMixin],
  bem: {
    basic: 'page-brand-plugin-activity-qrcode'
  },
  modals: {
    BrandMarketingScanTable,
    BrandMarketingFollowTable,
    BrandMarketingDownloadQrcode
  },
  serviceInject() {
    return {
      listService: ListService,
      userService: UserService
    }
  },
  rxState() {
    return {
      list: this.listService.list$,
      page: this.listService.page$,
      loading: this.listService.loading$,
      auth: this.listService.auth$
    }
  },
  data(vm) {
    return {
      columns: columns(vm)
    }
  },
  methods: {
    onGeneralize(record) {
      const { id, staff_name, shop_name } = record
      if (this.loading.getInfo) {
        return
      }
      this.listService.getInfo(id).subscribe(res => {
        const { qrcode, product_name } = res.info
        const splitArr = product_name.split('-')
        this.$modalRouter.push({
          name: 'brand-marketing-download-qrcode',
          props: {
            url: qrcode,
            title: splitArr[0],
            subTitle: splitArr[1] || '',
            name: `${staff_name} | ${shop_name}`
          }
        })
      })
    }
  },
  components: {
    MarkteingPluginTitle,
    ShopSelect
  }
}
</script>
