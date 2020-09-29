<template>
  <st-panel-layout :class="b()">
    <MarkteingPluginTitle pathName="brand-app-plugin-discount-list" />
    <div :class="b('intro')" v-if="!info.is_open">
      <img
        :src="image"
        alt=""
        v-for="(image, index) in info.not_open_images"
        :key="index"
      />
      <!-- <img
        :class="b('intro-item')"
        src="https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/saas-pro/plugin_discount_banner_1%402x.png"
        alt=""
      />
      <img
        :class="b('intro-item')"
        src="https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/saas-pro/plugin_discount_banner_2%402x.png"
        alt=""
      />
      <img
        :class="b('intro-item')"
        src="https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/saas-pro/plugin_discount_banner_3%402x.png"
        alt=""
      />
      <img
        :class="b('intro-item')"
        src="https://styd-frontend.oss-cn-shanghai.aliyuncs.com/images/saas-pro/plugin_discount_banner_4%402x.png"
        alt=""
      /> -->
    </div>
    <st-panel v-else app>
      <st-header-actions>
        <template slot="left">
          <st-button type="primary" icon="add" v-if="auth.add" @click="onAdd">
            新增活动
          </st-button>
          <st-button @click="onConfigHandle">配置到小程序</st-button>
        </template>
        <template slot="right">
          <st-select
            v-model="$searchQuery.product_type"
            :options="productType"
            @change="onSingleSearch('product_type', $event)"
          ></st-select>
          <st-select
            v-model="$searchQuery.activity_status"
            :options="activityStatus"
            @change="onSingleSearch('activity_status', $event)"
          ></st-select>
          <st-input-search
            v-model="$searchQuery.keywords"
            placeholder="搜索活动名称"
            style="width: 300px"
            @search="onSingleSearch('keywords', $event)"
          ></st-input-search>
        </template>
      </st-header-actions>
      <div :class="b('main')">
        <st-table
          :scroll="{ x: 980 }"
          :rowKey="(record, idx) => idx"
          :columns="columns"
          :page="page"
          :dataSource="list"
          :loading="loading.getList"
          @change="onTableChange"
        >
          <span slot="product_type" slot-scope="text">
            {{ text | enumFilter('limited_time_discount.product_type') }}
          </span>
          <span slot="temp" slot-scope="text, record">
            {{ record.start_time + ' ~ ' + record.end_time }}
          </span>
          <span slot="activity_status" slot-scope="text">
            {{ text | enumFilter('limited_time_discount.activity_status') }}
          </span>
          <a
            slot="order_num"
            slot-scope="text, record"
            v-modal-link="{
              name: 'order-list-modal',
              props: {
                query: {
                  ...$searchQuery,
                  id: record.activity_id
                },
                title: '订单明细',
                type: 'brand-plugin-discount'
              }
            }"
          >
            {{ text }}
          </a>
          <template slot="description" slot-scope="text">
            <a-popover placement="top">
              <template slot="content">
                <div style="max-width: 250px">
                  {{ text }}
                </div>
              </template>
              <span :class="b('table-mark')">{{ text }}</span>
            </a-popover>
          </template>
          <span slot="operator" slot-scope="text, record">
            <st-table-actions sytle="width: 120px">
              <a
                @click="onEdit(record)"
                v-if="record.auth['brand:activity:limit_time_discount|edit']"
              >
                编辑
              </a>
              <a
                @click="onStop(record)"
                v-if="record.auth['brand:activity:limit_time_discount|stop']"
              >
                结束
              </a>
              <a
                @click="onDelete(record)"
                v-if="record.auth['brand:activity:limit_time_discount|delete']"
              >
                删除
              </a>
            </st-table-actions>
          </span>
        </st-table>
      </div>
    </st-panel>
  </st-panel-layout>
</template>
<script>
import OrderListModal from '@/views/biz-modals/stat/order-detail'
import MarkteingPluginTitle from '@/views/pages/brand/marketing/components#/marketing-title'
import tableMixin from '@/mixins/table.mixin'
import { columns } from './list.config'
import { ListService } from './list.service'

export default {
  name: 'PluginLotteryIndex',
  mixins: [tableMixin],
  modals: {
    OrderListModal
  },
  components: {
    MarkteingPluginTitle
  },
  data() {
    return {}
  },
  bem: {
    b: 'page-brand-app-plugin-discount',
    bHeader: 'page-header'
  },
  serviceInject() {
    return {
      service: ListService
    }
  },
  rxState() {
    return {
      auth: this.service.auth$,
      productType: this.service.productType$,
      activityStatus: this.service.activityStatus$,
      loading: this.service.loading$,
      page: this.service.page$,
      list: this.service.list$,
      info: this.service.info$
    }
  },
  computed: {
    columns
  },
  created() {},
  methods: {
    onChangeDataDays() {},
    onAdd() {
      this.$router.push({
        path: './add'
      })
    },
    onEdit(record) {
      this.$router.push({
        path: './edit',
        query: { id: record.activity_id }
      })
    },
    onStop(record) {
      let that = this
      this.$confirm({
        title: '提示',
        content: '确定停止该活动吗？',
        onOk() {
          that.service.stopDiscount(record.activity_id).subscribe(res => {
            that.$router.reload()
          })
        },
        onCancel() {}
      })
    },
    onDelete(record) {
      let that = this
      this.$confirm({
        title: '提示',
        content: '确定删除该活动吗？',
        onOk() {
          that.service.deleteDiscount(record.activity_id).subscribe(res => {
            that.$router.reload()
          })
        },
        onCancel() {}
      })
    },
    onConfigHandle() {
      this.$router.push({
        path: '/brand/setting/mina/index'
      })
    }
  }
}
</script>
